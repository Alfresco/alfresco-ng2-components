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
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, mergeMap, tap, filter } from 'rxjs/operators';
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
    encapsulation: ViewEncapsulation.None
})

export class PeopleCloudComponent implements OnInit, OnChanges {

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
    validate: Boolean;

    /** Array of users to be pre-selected. All users in the
     * array are pre-selected in multi selection mode, but only the first user
     * is pre-selected in single selection mode.
     */
    @Input()
    preSelectUsers: IdentityUserModel[];

    /** Emitted when a user is selected. */
    @Output()
    selectUser: EventEmitter<IdentityUserModel> = new EventEmitter<IdentityUserModel>();

    /** Emitted when a selected user is removed in multi selection mode. */
    @Output()
    removeUser: EventEmitter<IdentityUserModel> = new EventEmitter<IdentityUserModel>();

    /** Emitted when an warning occurs. */
    @Output()
    warning: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('userInput')
    private userInput: ElementRef<HTMLInputElement>;

    private _searchUsers: IdentityUserModel[] = [];
    private selectedUsersSubject: BehaviorSubject<IdentityUserModel[]>;
    private searchUsersSubject: BehaviorSubject<IdentityUserModel[]>;
    selectedUsers$: Observable<IdentityUserModel[]>;
    searchUsers$: Observable<IdentityUserModel[]>;

    searchUserCtrl: FormControl = new FormControl();

    _subscriptAnimationState: string = 'enter';

    clientId: string;

    isFocused: boolean;

    invalidUsers: IdentityUserModel[];

    constructor(private identityUserService: IdentityUserService, private logService: LogService) {
        this.searchUsersSubject = new BehaviorSubject<IdentityUserModel[]>(this._searchUsers);
        this.searchUsers$ = this.searchUsersSubject.asObservable();
    }

    ngOnInit() {
        this.selectedUsersSubject = new BehaviorSubject<IdentityUserModel[]>(this.preSelectUsers);
        this.selectedUsers$ = this.selectedUsersSubject.asObservable();
        this.initSearch();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPreselectedUserChanged(changes) && this.isValidationEnaled()) {
            this.loadPreSelectUsers();
        } else {
            this.loadNoValidationPreselctUsers();
        }
    }

    isPreselectedUserChanged(changes: SimpleChanges) {
        return changes.preSelectUsers
            && changes.preSelectUsers.previousValue !== changes.preSelectUsers.currentValue
            && this.hasPreSelectUsers();
    }

    isValidationEnaled() {
        return this.validate === true;
    }

    async validatePreselectUsers(): Promise<any> {
        this.invalidUsers = [];
        let filteredPreSelectUsers: any;

        try {
            filteredPreSelectUsers = await this.filterPreselectUsers();
        } catch (error) {
            filteredPreSelectUsers = [];
            this.logService.error(error);
        }

        return filteredPreSelectUsers.reduce((acc, user) => {
            if (user.valid) {
                acc.push(new IdentityUserModel(user.data));
            } else {
                this.invalidUsers.push(user.data);
            }
            return acc;
        }, []);
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

            const isUserValid: Boolean = this.userExists(result);

            return {
                valid: isUserValid,
                data: isUserValid ? result[0] : user
            };
        });
        return await Promise.all(promiseBatch);
    }

    async searchUser(user: IdentityUserModel) {
        const key: string = Object.keys(user)[0];
        switch (key) {
            case 'id': return this.identityUserService.findUserById(user[key]).toPromise();
            case 'username': return this.identityUserService.findUserByUsername(user[key]).toPromise();
            case 'email': return this.identityUserService.findUserByEmail(user[key]).toPromise();
            default: return of([]);
        }

        if (changes.appName && this.isAppNameChanged(changes.appName)) {
            this.disableSearch();
            this.loadClientId();
        } else {
            this.enableSearch();
        }
    }

    private isAppNameChanged(change) {
        return change.previousValue !== change.currentValue && this.appName && this.appName.length > 0;
    }

    private userExists(result: any) {
        return result.length > 0 || result.id !== undefined;
    }

    private initSearch() {
        this.searchUserCtrl.valueChanges.pipe(
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
                    this.clearError();
                }
            }),
            debounceTime(500),
            distinctUntilChanged(),
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
            })
        ).subscribe((user) => {
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
            mergeMap((hasRole) => {
                return hasRole ? of(user) : of();
            })
        );
    }

    private isUserAlreadySelected(user: IdentityUserModel): boolean {
        if (this.preSelectUsers && this.preSelectUsers.length > 0) {
            const result = this.preSelectUsers.find((selectedUser) => {
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

    loadNoValidationPreselctUsers() {
        if (this.isMultipleMode()) {
            this.selectedUsersSubject.next(this.preSelectUsers);
        } else {
            this.searchUserCtrl.setValue(this.preSelectUsers[0]);
        }
    }

    private async loadSinglePreselectUser() {
        const users = await this.validatePreselectUsers();
        this.checkPreselectValidationErrors();
        this.searchUserCtrl.setValue(users[0]);
    }

    private async loadMultiplePreselectUsers() {
        let users = await this.validatePreselectUsers();
        this.checkPreselectValidationErrors();
        this.preSelectUsers = [...users];
        this.selectedUsersSubject.next(users);
    }

    private checkPreselectValidationErrors() {
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
        if (this.isMultipleMode()) {

            if (!this.isUserAlreadySelected(user)) {
                this.preSelectUsers.push(user);
                this.selectedUsersSubject.next(this.preSelectUsers);
                this.selectUser.emit(user);
            }

            this.userInput.nativeElement.value = '';
            this.searchUserCtrl.setValue('');
        } else {
            this.selectUser.emit(user);
        }

        this.clearError();
        this.resetSearchUsers();
    }

    onRemove(user: IdentityUserModel) {
        this.removeUser.emit(user);
        const indexToRemove = this.preSelectUsers.findIndex((selectedUser) => { return selectedUser.id === user.id; });
        this.preSelectUsers.splice(indexToRemove, 1);
        this.selectedUsersSubject.next(this.preSelectUsers);
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
