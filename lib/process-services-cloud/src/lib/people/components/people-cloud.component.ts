/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FormControl } from '@angular/forms';
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewEncapsulation,
    Input,
    SimpleChanges,
    OnChanges,
    OnDestroy,
    ChangeDetectionStrategy,
    ViewChild, ElementRef, SimpleChange
} from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, mergeMap, tap, filter, map, takeUntil } from 'rxjs/operators';
import {
    FullNamePipe,
    IdentityUserModel,
    IdentityUserService,
    LogService
} from '@alfresco/adf-core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ComponentSelectionMode } from '../../types';

@Component({
    selector: 'adf-cloud-people',
    templateUrl: './people-cloud.component.html',
    styleUrls: ['./people-cloud.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
            transition('void => enter', [
                style({ opacity: 0, transform: 'translateY(-100%)' }),
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
            ])
        ])
    ],
    providers: [FullNamePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class PeopleCloudComponent implements OnInit, OnChanges, OnDestroy {

    /** Name of the application. If specified, this shows the users who have access to the app. */
    @Input()
    appName: string;

    /** User selection mode (single/multiple). */
    @Input()
    mode: ComponentSelectionMode = 'single';

    /** Role names of the users to be listed. */
    @Input()
    roles: string[];

    /** This flag enables the validation on the preSelectUsers passed as input.
     * In case the flag is true the components call the identity service to verify the validity of the information passed as input.
     * Otherwise, no check will be done.
     */
    @Input()
    validate: boolean = false;

    /** Show the info in readonly mode
     */
    @Input()
    readOnly: boolean = false;

    /** Array of users to be pre-selected. All users in the
     * array are pre-selected in multi selection mode, but only the first user
     * is pre-selected in single selection mode.
     * Mandatory properties are: id, email, username
     */
    @Input()
    preSelectUsers: IdentityUserModel[] = [];

    /** FormControl to list of users */
    @Input()
    userChipsCtrl: FormControl = new FormControl({ value: '', disabled: false });

    /** FormControl to search the user */
    @Input()
    searchUserCtrl = new FormControl({ value: '', disabled: false });

    /** Placeholder translation key
     */
    @Input()
    title: string;

    /** Emitted when a user is selected. */
    @Output()
    selectUser = new EventEmitter<IdentityUserModel>();

    /** Emitted when a selected user is removed in multi selection mode. */
    @Output()
    removeUser = new EventEmitter<IdentityUserModel>();

    /** Emitted when a user selection change. */
    @Output()
    changedUsers = new EventEmitter<IdentityUserModel[]>();

    /** Emitted when an warning occurs. */
    @Output()
    warning = new EventEmitter<any>();

    @ViewChild('userInput', { static: false })
    private userInput: ElementRef<HTMLInputElement>;

    private _searchUsers: IdentityUserModel[] = [];
    private onDestroy$ = new Subject<boolean>();

    selectedUsers: IdentityUserModel[] = [];
    invalidUsers: IdentityUserModel[] = [];

    searchUsers$ = new BehaviorSubject<IdentityUserModel[]>(this._searchUsers);
    _subscriptAnimationState: string = 'enter';
    clientId: string;
    isFocused: boolean;

    validateUsersMessage: string;
    searchedValue = '';

    validationLoading = false;
    searchLoading = false;

    constructor(
        private identityUserService: IdentityUserService,
        private logService: LogService) {}

    ngOnInit(): void {
        this.loadClientId();
        this.initSearch();
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.valueChanged(changes.preSelectUsers)
            || this.valueChanged(changes.mode)
            || this.valueChanged(changes.validate)
        ) {
            if (this.hasPreSelectUsers()) {
                this.loadPreSelectUsers();
            } else if (this.hasPreselectedUsersCleared(changes)) {
                this.selectedUsers = [];
                this.invalidUsers = [];
            }

            if (!this.isValidationEnabled()) {
                this.invalidUsers = [];
            }
        }

        if (changes.appName && this.isAppNameChanged(changes.appName)) {
            this.loadClientId();
        }
    }

    private async loadClientId(): Promise<void> {
        this.clientId = await this.identityUserService.getClientIdByApplicationName(this.appName).toPromise();
        if (this.clientId) {
            this.searchUserCtrl.enable();
        }
    }

    private initSearch(): void {
        this.searchUserCtrl.valueChanges.pipe(
            filter((value) => {
                this.searchLoading = true;
                return typeof value === 'string';
            }),
            tap((value: string) => {
                if (value) {
                    this.setTypingError();
                }
            }),
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: string) => {
                if (value.trim()) {
                    this.searchedValue = value;
                } else {
                    this.searchUserCtrl.markAsPristine();
                    this.searchUserCtrl.markAsUntouched();
                }
            }),
            tap(() => {
                this.resetSearchUsers();
            }),
            switchMap((search) =>
                this.identityUserService.findUsersByName(search.trim())),
            mergeMap((users) => {
                this.resetSearchUsers();
                this.searchLoading = false;
                return users;
            }),
            filter(user => !this.isUserAlreadySelected(user)),
            mergeMap(user => {
                if (this.appName) {
                    return this.checkUserHasAccess(user.id).pipe(
                        mergeMap(
                            hasRole => hasRole ? of(user) : of()
                        )
                    );
                } else if (this.hasRoles()) {
                    return this.filterUsersByRoles(user);
                } else {
                    return of(user);
                }
            }),
            takeUntil(this.onDestroy$)
        ).subscribe(user => {
            this._searchUsers.push(user);
            this.searchUsers$.next(this._searchUsers);
        });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    private isAppNameChanged(change: SimpleChange): boolean {
        return change && change.previousValue !== change.currentValue && this.appName && this.appName.length > 0;
    }

    isValidationEnabled(): boolean {
        return this.validate === true;
    }

    private checkUserHasAccess(userId: string): Observable<boolean> {
        if (this.hasRoles()) {
            return this.identityUserService.checkUserHasAnyClientAppRole(userId, this.clientId, this.roles);
        } else {
            return this.identityUserService.checkUserHasClientApp(userId, this.clientId);
        }
    }

    private hasRoles(): boolean {
        return this.roles && this.roles.length > 0;
    }

    filterUsersByRoles(user: IdentityUserModel): Observable<IdentityUserModel> {
        return this.identityUserService.checkUserHasRole(user.id, this.roles).pipe(
            map((hasRole: boolean) => ({ hasRole: hasRole, user: user })),
            filter((filteredUser: { hasRole: boolean, user: IdentityUserModel }) => filteredUser.hasRole),
            map((filteredUser: { hasRole: boolean, user: IdentityUserModel }) => filteredUser.user));
    }

    private isUserAlreadySelected(searchUser: IdentityUserModel): boolean {
        if (this.selectedUsers && this.selectedUsers.length > 0) {
            const result = this.selectedUsers.find((selectedUser) => {
                return this.compare(selectedUser, searchUser);
            });

            return !!result;
        }
        return false;
    }

    private async loadPreSelectUsers(): Promise<void> {
        this.selectedUsers = [];

        if (this.isSingleMode()) {
            this.selectedUsers = [this.preSelectUsers[0]];
        } else {
            this.selectedUsers = this.removeDuplicatedUsers(this.preSelectUsers);
        }
        this.userChipsCtrl.setValue(this.selectedUsers[0].username);
        if (this.isValidationEnabled()) {
            this.validationLoading = true;
            await this.validatePreselectUsers();
            this.validationLoading = false;
        }
    }

    private getPreselectedUsers(): IdentityUserModel[] {
        if (this.isSingleMode()) {
            return [this.preSelectUsers[0]];
        } else {
            return this.removeDuplicatedUsers(this.preSelectUsers);
        }
    }

    async validatePreselectUsers(): Promise<any> {
        this.invalidUsers = [];
        const validUsers: IdentityUserModel[] = [];

        for (const user of this.getPreselectedUsers()) {
            try {
                const validationResult = await this.searchUser(user);

                if (this.compare(user, validationResult)) {
                    validationResult.readonly = user.readonly;
                    validUsers.push(validationResult);
                } else {
                    this.invalidUsers.push(user);
                }
            } catch (error) {
                this.invalidUsers.push(user);
                this.logService.error(error);
            }
        }

        this.checkPreselectValidationErrors();
        this.selectedUsers = validUsers.concat(this.invalidUsers);
    }

    compare(preselectedUser: IdentityUserModel, identityUser: IdentityUserModel): boolean {
        if (preselectedUser && identityUser) {
            const uniquePropertyIdentifiers = ['id', 'username', 'email'];
            for (const property of Object.keys(preselectedUser)) {
                if (preselectedUser[property] !== undefined && uniquePropertyIdentifiers.includes(property)) {
                    return preselectedUser[property] === identityUser[property];
                }
            }
        }
        return false;
    }

    private getSearchKey(user: IdentityUserModel): string {
        if (user.id) {
            return 'id';
        } else if (user.email) {
            return 'email';
        } else if (user.username) {
            return 'username';
        } else {
            return null;
        }
    }

    async searchUser(user: IdentityUserModel): Promise<IdentityUserModel> {
        const key = this.getSearchKey(user);

        switch (key) {
            case 'id':
                return this.identityUserService.findUserById(user[key]).toPromise();
            case 'username':
                return (await this.identityUserService.findUserByUsername(user[key]).toPromise())[0];
            case 'email':
                return (await this.identityUserService.findUserByEmail(user[key]).toPromise())[0];
            default:
                return null;
        }
    }

    removeDuplicatedUsers(users: IdentityUserModel[]): IdentityUserModel[] {
        return users.filter((user, index, self) =>
            index === self.findIndex(auxUser =>
                user.id === auxUser.id && user.username === auxUser.username && user.email === auxUser.email
            ));
    }

    checkPreselectValidationErrors(): void {
        this.invalidUsers = this.removeDuplicatedUsers(this.invalidUsers);

        if (this.invalidUsers.length > 0) {
            this.generateInvalidUsersMessage();
        }

        this.warning.emit({
            message: 'INVALID_PRESELECTED_USERS',
            users: this.invalidUsers
        });
    }

    onSelect(user: IdentityUserModel): void {
        if (user) {
            this.selectUser.emit(user);

            if (this.isMultipleMode()) {
                if (!this.isUserAlreadySelected(user)) {
                    this.selectedUsers.push(user);
                }
            } else {
                this.invalidUsers = [];
                this.selectedUsers = [user];
            }

            this.userInput.nativeElement.value = '';
            this.searchUserCtrl.setValue('');
            this.userChipsCtrlValue(this.selectedUsers[0].username);

            this.changedUsers.emit(this.selectedUsers);
            this.resetSearchUsers();
        }
    }

    onRemove(userToRemove: IdentityUserModel): void {
        this.removeUser.emit(userToRemove);
        this.removeUserFromSelected(userToRemove);
        this.changedUsers.emit(this.selectedUsers);
        if (this.selectedUsers.length === 0) {
            this.userChipsCtrlValue('');

        } else {
            this.userChipsCtrlValue(this.selectedUsers[0].username);
        }
        this.searchUserCtrl.markAsDirty();
        this.searchUserCtrl.markAsTouched();

        if (this.isValidationEnabled()) {
            this.removeUserFromValidation(userToRemove);
            this.checkPreselectValidationErrors();
        }
    }

    private userChipsCtrlValue(value: string) {
        this.userChipsCtrl.setValue(value);
        this.userChipsCtrl.markAsDirty();
        this.userChipsCtrl.markAsTouched();
    }

    private removeUserFromSelected({ id, username, email }: IdentityUserModel): void {
        const indexToRemove = this.selectedUsers.findIndex(user => {
            return user.id === id
                && user.username === username
                && user.email === email;
        });

        if (indexToRemove !== -1) {
            this.selectedUsers.splice(indexToRemove, 1);
        }
    }

    private removeUserFromValidation({ id, username, email }: IdentityUserModel): void {
        const indexToRemove = this.invalidUsers.findIndex(user => {
            return user.id === id
                && user.username === username
                && user.email === email;
        });

        if (indexToRemove !== -1) {
            this.invalidUsers.splice(indexToRemove, 1);
        }
    }

    generateInvalidUsersMessage(): void {
        this.validateUsersMessage = '';

        this.invalidUsers.forEach((invalidUser, index) => {
            if (index === this.invalidUsers.length - 1) {
                this.validateUsersMessage += `${invalidUser.username} `;
            } else {
                this.validateUsersMessage += `${invalidUser.username}, `;
            }
        });
    }

    setTypingError(): void {
        this.searchUserCtrl.setErrors({
            searchTypingError: true,
            ...this.searchUserCtrl.errors
        });
    }

    hasPreselectError(): boolean {
        return this.invalidUsers
            && this.invalidUsers.length > 0;
    }

    getDisplayName(user): string {
        return FullNamePipe.prototype.transform(user);
    }

    isMultipleMode(): boolean {
        return this.mode === 'multiple';
    }

    isSingleMode(): boolean {
        return this.mode === 'single';
    }

    private isSingleSelectionReadonly(): boolean {
        return this.isSingleMode()
            && this.selectedUsers.length === 1
            && this.selectedUsers[0].readonly === true;
    }

    private hasPreSelectUsers(): boolean {
        return this.preSelectUsers
            && this.preSelectUsers.length > 0;
    }

    private valueChanged(change: SimpleChange): boolean {
        return change
            && change.currentValue !== change.previousValue;
    }

    private hasPreselectedUsersCleared(changes: SimpleChanges): boolean {
        return changes
            && changes.preSelectUsers
            && changes.preSelectUsers.currentValue
            && changes.preSelectUsers.currentValue.length === 0;
    }

    private resetSearchUsers(): void {
        this._searchUsers = [];
        this.searchUsers$.next(this._searchUsers);
    }

    getSelectedUsers(): IdentityUserModel[] {
        return this.selectedUsers;
    }

    isReadonly(): boolean {
        return this.readOnly || this.isSingleSelectionReadonly();
    }

    isValidationLoading(): boolean {
        return this.isValidationEnabled() && this.validationLoading;
    }

    setFocus(isFocused: boolean) {
        this.isFocused = isFocused;
    }

    hasError(): boolean {
        return !!this.searchUserCtrl.errors;
    }

    getValidationPattern(): string {
        return this.searchUserCtrl.errors.pattern.requiredPattern;
    }

    getValidationMaxLength(): string {
        return this.searchUserCtrl.errors.maxlength.requiredLength;
    }

    getValidationMinLength(): string {
        return this.searchUserCtrl.errors.minlength.requiredLength;
    }
}
