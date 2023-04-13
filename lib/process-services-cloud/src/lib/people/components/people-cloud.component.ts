/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { UntypedFormControl } from '@angular/forms';
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
    ViewChild,
    ElementRef,
    Inject
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, mergeMap, tap, filter, takeUntil } from 'rxjs/operators';
import {
    FullNamePipe,
    LogService
} from '@alfresco/adf-core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ComponentSelectionMode } from '../../types';
import { IdentityUserModel } from '../models/identity-user.model';
import { IdentityUserServiceInterface } from '../services/identity-user.service.interface';
import { IDENTITY_USER_SERVICE_TOKEN } from '../services/identity-user-service.token';

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

    /** Mark this field as required
     */
    @Input()
    required = false;

    /** Array of users to be pre-selected. All users in the
     * array are pre-selected in multi selection mode, but only the first user
     * is pre-selected in single selection mode.
     * Mandatory properties are: id, email, username
     */
    @Input()
    preSelectUsers: IdentityUserModel[] = [];

    /** Array of users to be excluded.
     * Mandatory properties are: id, email, username
     */
    @Input()
    excludedUsers: IdentityUserModel[] = [];

    /** Array of groups to restrict user searches.
     * Mandatory property is group name
     */
    @Input()
    groupsRestriction: string[] = [];

    /** FormControl to list of users */
    @Input()
    userChipsCtrl: UntypedFormControl = new UntypedFormControl({ value: '', disabled: false });

    /** FormControl to search the user */
    @Input()
    searchUserCtrl = new UntypedFormControl({ value: '', disabled: false });

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

    @ViewChild('userInput')
    private userInput: ElementRef<HTMLInputElement>;

    private searchUsers: IdentityUserModel[] = [];
    private onDestroy$ = new Subject<boolean>();

    selectedUsers: IdentityUserModel[] = [];
    invalidUsers: IdentityUserModel[] = [];

    searchUsers$ = new BehaviorSubject<IdentityUserModel[]>(this.searchUsers);
    subscriptAnimationState: string = 'enter';
    isFocused: boolean;
    touched: boolean = false;

    validateUsersMessage: string;
    searchedValue = '';

    validationLoading = false;
    searchLoading = false;

    typingUniqueValueNotEmpty$: Observable<string>;

    constructor(
        @Inject(IDENTITY_USER_SERVICE_TOKEN)
        private identityUserService: IdentityUserServiceInterface,
        private logService: LogService) {}

    ngOnInit(): void {
        this.initSearch();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.hasPreselectedUsersChanged(changes) || this.hasModeChanged(changes) || this.isValidationChanged(changes)) {
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
    }

    private initSearch(): void {
        this.initializeStream();
        this.typingUniqueValueNotEmpty$.pipe(
            switchMap((name: string) =>
                this.identityUserService.search(name, { roles: this.roles, withinApplication: this.appName, groups: this.groupsRestriction })
            ),
            mergeMap((users: IdentityUserModel[]) => {
                this.resetSearchUsers();
                this.searchLoading = false;
                return users;
            }),
            filter(user => !this.isUserAlreadySelected(user) && !this.isExcludedUser(user)),
            takeUntil(this.onDestroy$)
        ).subscribe((user: IdentityUserModel) => {
            this.searchUsers.push(user);
            this.searchUsers$.next(this.searchUsers);
        });
    }

    private initializeStream() {
        const typingValueFromControl$ = this.searchUserCtrl.valueChanges;

        const typingValueTypeSting$ = typingValueFromControl$.pipe(
            filter(value => {
                this.searchLoading = true;
                return typeof value === 'string';
            })
        );

        const typingValueHandleErrorMessage$ = typingValueTypeSting$.pipe(
            tap((value: string) => {
                if (value) {
                    this.setTypingError();
                }
            })
        );

        const typingValueDebouncedUnique$ = typingValueHandleErrorMessage$.pipe(
            debounceTime(500),
            distinctUntilChanged()
        );

        this.typingUniqueValueNotEmpty$ = typingValueDebouncedUnique$.pipe(
            tap((value: string) => {
                if (value.trim()) {
                    this.searchedValue = value;
                } else {
                    this.searchUserCtrl.markAsPristine();
                    this.searchUserCtrl.markAsUntouched();
                }
            }),
            tap(() => this.resetSearchUsers())
        );
    }

    private isValidationEnabled(): boolean {
        return this.validate === true;
    }

    private isUserAlreadySelected(searchUser: IdentityUserModel): boolean {
        if (this.selectedUsers && this.selectedUsers.length > 0) {
            const result = this.selectedUsers.find((selectedUser) => this.equalsUsers(selectedUser, searchUser));

            return !!result;
        }
        return false;
    }

    private isExcludedUser(searchUser: IdentityUserModel): boolean {
        if (this.excludedUsers?.length > 0) {
            return !!this.excludedUsers.find(excludedUser => this.equalsUsers(excludedUser, searchUser));
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

    private async validatePreselectUsers(): Promise<any> {
        this.invalidUsers = [];

        for (const user of this.getPreselectedUsers()) {
            try {
                const validationResult = (await this.identityUserService.search(user.username, { roles: this.roles, withinApplication: this.appName, groups: this.groupsRestriction }).toPromise())[0];

                if (!this.equalsUsers(user, validationResult)) {
                    this.invalidUsers.push(user);
                }
            } catch (error) {
                this.invalidUsers.push(user);
                this.logService.error(error);
            }
        }

        this.checkPreselectValidationErrors();
    }

    equalsUsers(preselectedUser: IdentityUserModel, identityUser: IdentityUserModel): boolean {
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

    removeDuplicatedUsers(users: IdentityUserModel[]): IdentityUserModel[] {
        return users.filter((user, index, self) =>
            index === self.findIndex(auxUser =>
                user.id === auxUser.id && user.username === auxUser.username && user.email === auxUser.email
            ));
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
            this.userChipsControlValue(this.selectedUsers[0].username);

            this.changedUsers.emit(this.selectedUsers);
            this.resetSearchUsers();
        }
    }

    onRemove(userToRemove: IdentityUserModel): void {
        this.removeUser.emit(userToRemove);
        this.removeUserFromSelected(userToRemove);
        this.changedUsers.emit(this.selectedUsers);
        if (this.selectedUsers.length === 0) {
            this.userChipsControlValue('');

        } else {
            this.userChipsControlValue(this.selectedUsers[0].username);
        }
        this.searchUserCtrl.markAsDirty();
        this.searchUserCtrl.markAsTouched();

        if (this.isValidationEnabled()) {
            this.removeUserFromValidation(userToRemove);
            this.checkPreselectValidationErrors();
        }
    }

    private checkPreselectValidationErrors(): void {
        this.invalidUsers = this.removeDuplicatedUsers(this.invalidUsers);

        if (this.invalidUsers.length > 0) {
            this.generateInvalidUsersMessage();
        }

        this.warning.emit({
            message: 'INVALID_PRESELECTED_USERS',
            users: this.invalidUsers
        });
    }

    private removeUserFromSelected({ id, username, email }: IdentityUserModel): void {
        const indexToRemove = this.selectedUsers.findIndex(user => user.id === id
                && user.username === username
                && user.email === email);

        if (indexToRemove !== -1) {
            this.selectedUsers.splice(indexToRemove, 1);
        }
    }

    private removeUserFromValidation({ id, username, email }: IdentityUserModel): void {
        const indexToRemove = this.invalidUsers.findIndex(user => user.id === id
                && user.username === username
                && user.email === email);

        if (indexToRemove !== -1) {
            this.invalidUsers.splice(indexToRemove, 1);
        }
    }

    private generateInvalidUsersMessage(): void {
        this.validateUsersMessage = '';

        this.invalidUsers.forEach((invalidUser, index) => {
            if (index === this.invalidUsers.length - 1) {
                this.validateUsersMessage += `${invalidUser.username} `;
            } else {
                this.validateUsersMessage += `${invalidUser.username}, `;
            }
        });
    }

    hasPreselectError(): boolean {
        return this.invalidUsers
            && this.invalidUsers.length > 0;
    }

    getDisplayName(user): string {
        return FullNamePipe.prototype.transform(user);
    }

    private isMultipleMode(): boolean {
        return this.mode === 'multiple';
    }

    private isSingleMode(): boolean {
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

    private hasModeChanged(changes: SimpleChanges): boolean {
        return changes
            && changes.mode
            && changes.mode.currentValue !== changes.mode.previousValue;
    }

    private isValidationChanged(changes: SimpleChanges): boolean {
        return changes
            && changes.validate
            && changes.validate.currentValue !== changes.validate.previousValue;
    }

    private hasPreselectedUsersChanged(changes: SimpleChanges): boolean {
        return changes
            && changes.preSelectUsers
            && changes.preSelectUsers.currentValue !== changes.preSelectUsers.previousValue;
    }

    private hasPreselectedUsersCleared(changes: SimpleChanges): boolean {
        return changes
            && changes.preSelectUsers
            && changes.preSelectUsers.currentValue
            && changes.preSelectUsers.currentValue.length === 0;
    }

    private resetSearchUsers(): void {
        this.searchUsers = [];
        this.searchUsers$.next(this.searchUsers);
    }

    private setTypingError(): void {
        this.searchUserCtrl.setErrors({
            searchTypingError: true,
            ...this.searchUserCtrl.errors
        });
    }

    private userChipsControlValue(value: string) {
        this.userChipsCtrl.setValue(value);
        this.userChipsCtrl.markAsDirty();
        this.userChipsCtrl.markAsTouched();
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

    markAsTouched(): void {
        this.touched = true;
    }

    isTouched(): boolean {
        return this.touched;
    }

    isSelected(): boolean {
        return this.selectedUsers && !!this.selectedUsers.length;
    }

    isDirty(): boolean {
        return this.isTouched() && !this.isSelected();
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

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
