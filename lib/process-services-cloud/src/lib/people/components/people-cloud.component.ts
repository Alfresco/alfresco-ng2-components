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
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input, ViewChild, ElementRef, SimpleChanges, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, mergeMap, tap, filter, map, takeUntil } from 'rxjs/operators';
import { FullNamePipe, IdentityUserModel, IdentityUserService, LogService } from '@alfresco/adf-core';
import { trigger, state, style, transition, animate } from '@angular/animations';

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

    static MODE_SINGLE = 'single';
    static MODE_MULTIPLE = 'multiple';

    /** Name of the application. If specified, this shows the users who have access to the app. */
    @Input()
    appName: string;

    /** User selection mode (single/multiple). */
    @Input()
    mode: string = PeopleCloudComponent.MODE_SINGLE;

    /** Role names of the users to be listed. */
    @Input()
    roles: string[];

    /** This flag enables the validation on the preSelectUsers passed as input.
     * In case the flag is true the components call the identity service to verify the validity of the information passed as input.
     * Otherwise, no check will be done.
     */
    @Input()
    validate: Boolean = false;

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

    /** FormControl to search the user */
    @Input()
    searchUserCtrl: FormControl = new FormControl();

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

    private _searchUsers: IdentityUserModel[] = [];
    private selectedUsersSubject: BehaviorSubject<IdentityUserModel[]>;
    private searchUsersSubject: BehaviorSubject<IdentityUserModel[]>;
    private onDestroy$ = new Subject<boolean>();

    selectedUsers: IdentityUserModel[] = [];
    selectedUsers$: Observable<IdentityUserModel[]>;
    searchUsers$: Observable<IdentityUserModel[]>;
    _subscriptAnimationState: string = 'enter';
    clientId: string;
    isFocused: boolean;
    invalidUsers: IdentityUserModel[] = [];

    currentTimeout: any;

    constructor(private identityUserService: IdentityUserService, private logService: LogService) {
    }

    ngOnInit() {
        if (this.hasPreSelectUsers()) {
            this.selectedUsers = [...this.preSelectUsers];
        }
        this.initSubjects();
        this.initSearch();

        if (this.appName) {
            this.disableSearch();
            this.loadClientId();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initSubjects();

        if (this.isPreselectedUserChanged(changes)) {
            if (this.isValidationEnabled()) {
                this.loadPreSelectUsers();
            } else {
                this.loadNoValidationPreselectUsers();
            }
        }

        if (changes.appName && this.isAppNameChanged(changes.appName)) {
            this.disableSearch();
            this.loadClientId();
        } else {
            this.enableSearch();
        }
    }

    ngOnDestroy() {
        clearTimeout(this.currentTimeout);
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    initSubjects() {
        if (this.selectedUsersSubject === undefined) {
            this.selectedUsersSubject = new BehaviorSubject<IdentityUserModel[]>(this.preSelectUsers);
            this.selectedUsers$ = this.selectedUsersSubject.asObservable();
        }

        if (this.searchUsersSubject === undefined) {
            this.searchUsersSubject = new BehaviorSubject<IdentityUserModel[]>(this._searchUsers);
            this.searchUsers$ = this.searchUsersSubject.asObservable();
        }
    }

    private isAppNameChanged(change) {
        return change.previousValue !== change.currentValue && this.appName && this.appName.length > 0;
    }

    isPreselectedUserChanged(changes: SimpleChanges) {
        return changes.preSelectUsers
            && changes.preSelectUsers.previousValue !== changes.preSelectUsers.currentValue
            && this.hasPreSelectUsers();
    }

    isValidationEnabled() {
        return this.validate === true;
    }

    async validatePreselectUsers(): Promise<any> {
        let filteredPreselectUsers: IdentityUserModel[];
        let validUsers: IdentityUserModel[] = [];

        try {
            filteredPreselectUsers = await this.filterPreselectUsers();
        } catch (error) {
            validUsers = [];
            this.logService.error(error);
        }

        await this.preSelectUsers.map((user: IdentityUserModel) => {
            const validUser = this.isValidUser(filteredPreselectUsers, user);

            if (validUser) {
                validUsers.push(validUser);
            } else {
                this.invalidUsers.push(user);
            }
        });
        validUsers =  this.removeDuplicatedUsers(validUsers);
        return validUsers;
    }

    private removeDuplicatedUsers(users: IdentityUserModel[]): IdentityUserModel[] {
        return users.filter((user, index, self) =>
                    index === self.findIndex((auxUser) => {
                        return user.id === auxUser.id && user.username === auxUser.username;
                    }));
    }

    async filterPreselectUsers() {
        const promiseBatch = this.preSelectUsers.map(async (user: IdentityUserModel) => {
            let result: any;
            try {
                result = await this.searchUser(user);
            } catch (error) {
                result = [];
                this.logService.error(error);
            }
            const isUserValid: boolean = this.userExists(result);
            return isUserValid ? result : null;
        });
        return Promise.all(promiseBatch);
    }

    async searchUser(user: IdentityUserModel) {
        let key: string = '';

        if (user.id) {
            key = 'id';
        } else if (user.email) {
            key = 'email';
        } else if (user.username) {
            key = 'username';
        }

        switch (key) {
            case 'id': return this.identityUserService.findUserById(user[key]).toPromise();
            case 'username': return (await this.identityUserService.findUserByUsername(user[key]).toPromise())[0];
            case 'email': return (await this.identityUserService.findUserByEmail(user[key]).toPromise())[0];
            default: return of([]);
        }
    }

    private isValidUser(filteredUsers: IdentityUserModel[], user: IdentityUserModel) {
        return filteredUsers.find((filteredUser: IdentityUserModel) => {
            return  filteredUser &&
                    (filteredUser.id === user.id ||
                    filteredUser.username === user.username ||
                    filteredUser.email === user.email);
        });
    }

    public userExists(result: IdentityUserModel): boolean {
        return result
            && (result.id !== undefined
            || result.username !== undefined
            || result.email !== undefined);
    }

    private initSearch() {
        this.searchUserCtrl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            filter((value) => {
                return typeof value === 'string';
            }),
            tap((value) => {
                if (value) {
                    this.setError();
                } else {
                    if (!this.isMultipleMode()) {
                        this.removeUser.emit();
                    }
                }
            }),
            tap(() => {
                this.resetSearchUsers();
            }),
            switchMap((search) => this.identityUserService.findUsersByName(search)),
            mergeMap((users) => {
                return users;
            }),
            filter((user: any) => {
                return !this.isUserAlreadySelected(user);
            }),
            mergeMap((user: any) => {
                if (this.appName) {

                    return this.checkUserHasAccess(user.id).pipe(
                        mergeMap((hasRole) => {
                            return hasRole ? of(user) : of();
                        })
                    );
                } else if (this.hasRoles()) {
                    return this.filterUsersByRoles(user);
                } else {
                    return of(user);
                }
            }),
            takeUntil(this.onDestroy$)
        ).subscribe((user: any) => {
            this._searchUsers.push(user);
            this.searchUsersSubject.next(this._searchUsers);
        });
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

    private isUserAlreadySelected(user: IdentityUserModel): boolean {
        if (this.selectedUsers && this.selectedUsers.length > 0 && this.isMultipleMode()) {
            const result = this.selectedUsers.find((selectedUser) => {
                return selectedUser.id === user.id || selectedUser.email === user.email || selectedUser.username === user.username;
            });

            return !!result;
        }
        return false;
    }

    private loadPreSelectUsers() {
        if (!this.isMultipleMode()) {
            this.loadSinglePreselectUser();
        } else {
            this.loadMultiplePreselectUsers();
        }
    }

    async loadNoValidationPreselectUsers() {
        this.selectedUsers = [...this.removeDuplicatedUsers(this.preSelectUsers)];

        if (this.isMultipleMode()) {
            this.selectedUsersSubject.next(this.selectedUsers);
        } else {

            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
            }

            this.currentTimeout = setTimeout(() => {
                this.searchUserCtrl.setValue(this.selectedUsers[0]);
                this.onSelect(this.selectedUsers[0]);
            }, 0);
        }
    }

    public async loadSinglePreselectUser() {
        const users = await this.validatePreselectUsers();
        if (users && users.length > 0) {
            this.checkPreselectValidationErrors();
            this.searchUserCtrl.setValue(users[0]);
        } else {
            this.checkPreselectValidationErrors();
        }
    }

    public async loadMultiplePreselectUsers() {
        const users = await this.validatePreselectUsers();
        if (users && users.length > 0) {
            this.checkPreselectValidationErrors();
            this.selectedUsers = [...this.alignPreselectedReadonlyUsersAfterValidation(users)];
            this.selectedUsersSubject.next(this.selectedUsers);
        } else {
            this.checkPreselectValidationErrors();
        }
    }

    private alignPreselectedReadonlyUsersAfterValidation(users: IdentityUserModel[]) {
        this.preSelectUsers.forEach((preSelectedUser, index) => {
            if (users[index]) {
                if ((preSelectedUser.id === users[index].id) || (preSelectedUser.username === users[index].username)) {
                    users[index].readonly = preSelectedUser.readonly;
                }
            }
        });
        return users;
    }

    public checkPreselectValidationErrors() {
        if (this.invalidUsers.length > 0) {
            this.warning.emit({
                message: 'INVALID_PRESELECTED_USERS',
                users: this.invalidUsers
            });
        }
    }

    private async loadClientId() {
        this.clientId = await this.identityUserService.getClientIdByApplicationName(this.appName).toPromise();

        if (this.clientId) {
            this.enableSearch();
        }
    }

    onSelect(user: IdentityUserModel) {
        this.selectUser.emit(user);
        if (this.isMultipleMode()) {
            if (!this.isUserAlreadySelected(user)) {
                this.selectedUsers.push(user);
                this.selectedUsersSubject.next(this.selectedUsers);
            }

            this.userInput.nativeElement.value = '';
            this.searchUserCtrl.setValue('');
        } else {
            this.selectedUsers = [user];
        }

        this.changedUsers.emit(this.selectedUsers);
        this.clearError();
        this.resetSearchUsers();
    }

    onRemove(user: IdentityUserModel) {
        if (!this.readOnly) {
            this.removeUser.emit(user);
            const indexToRemove = this.selectedUsers.findIndex((selectedUser) => { return selectedUser.id === user.id; });
            this.selectedUsers.splice(indexToRemove, 1);
            this.selectedUsersSubject.next(this.selectedUsers);
            this.changedUsers.emit(this.selectedUsers);
        }
    }

    getDisplayName(user): string {
        return FullNamePipe.prototype.transform(user);
    }

    isMultipleMode(): boolean {
        return this.mode === PeopleCloudComponent.MODE_MULTIPLE;
    }

    private hasPreSelectUsers(): boolean {
        return this.preSelectUsers && this.preSelectUsers.length > 0;
    }

    private resetSearchUsers() {
        this._searchUsers = [];
        this.searchUsersSubject.next(this._searchUsers);
    }

    private setError() {
        this.searchUserCtrl.setErrors({ invalid: true });
    }

    private clearError() {
        this.searchUserCtrl.setErrors(null);
    }

    setFocus(isFocused: boolean) {
        this.isFocused = isFocused;
    }

    hasError(): boolean {
        return !!this.searchUserCtrl.errors;
    }

    hasErrorMessage(): boolean {
        return !this.isFocused && this.hasError();
    }

    private disableSearch() {
        this.searchUserCtrl.disable();
    }

    private enableSearch() {
        this.searchUserCtrl.enable();
    }

}
