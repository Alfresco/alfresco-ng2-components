/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, mergeMap, tap, filter } from 'rxjs/operators';
import { FullNamePipe, IdentityUserModel, IdentityUserService } from '@alfresco/adf-core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'adf-cloud-people',
    templateUrl: './people-cloud.component.html',
    styleUrls: ['./people-cloud.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
            transition('void => enter', [
                style({opacity: 0, transform: 'translateY(-100%)'}),
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
            ])
        ])
    ],
    providers: [FullNamePipe],
    encapsulation: ViewEncapsulation.None
})

export class PeopleCloudComponent implements OnInit {

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

    /**
     * Array of users to be pre-selected. All users in the
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

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('userInput')
    private userInput: ElementRef<HTMLInputElement>;

    private selectedUsers: IdentityUserModel[] = [];
    private searchUsers: IdentityUserModel[] = [];
    private selectedUsersSubject: BehaviorSubject<IdentityUserModel[]>;
    private searchUsersSubject: BehaviorSubject<IdentityUserModel[]>;
    selectedUsers$: Observable<IdentityUserModel[]>;
    searchUsers$: Observable<IdentityUserModel[]>;

    searchUserCtrl: FormControl = new FormControl();

    _subscriptAnimationState: string = 'enter';

    clientId: string;

    isFocused: boolean;

    constructor(private identityUserService: IdentityUserService) {
        this.searchUsersSubject = new BehaviorSubject<IdentityUserModel[]>(this.searchUsers);
        this.searchUsers$ = this.searchUsersSubject.asObservable();
    }

    ngOnInit() {
        this.selectedUsersSubject = new BehaviorSubject<IdentityUserModel[]>(this.selectedUsers);
        this.selectedUsers$ = this.selectedUsersSubject.asObservable();

        if (this.hasPreSelectUsers()) {
            this.loadPreSelectUsers();
        }

        this.initSearch();

        if (this.appName) {
            this.disableSearch();
            this.loadClientId();
        }
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

                if (this.isSingleMode() && this.hasSelectedUsers()) {
                    this.resetSingleModeSelection();
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
                } else {
                    return of(user);
                }
            })
        ).subscribe((user) => {
            this.searchUsers.push(user);
            this.searchUsersSubject.next(this.searchUsers);
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

    private isUserAlreadySelected(user: IdentityUserModel): boolean {
        if (this.selectedUsers && this.selectedUsers.length > 0) {
            const result = this.selectedUsers.find((selectedUser) => {
                return selectedUser.id === user.id || selectedUser.email  === user.email;
            });

            return !!result;
        }
        return false;
    }

    private loadPreSelectUsers() {
        if (!this.isMultipleMode()) {
            this.searchUserCtrl.setValue(this.preSelectUsers[0]);
            this.onSelect(this.preSelectUsers[0]);
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
            this.userInput.nativeElement.value = '';
            this.searchUserCtrl.setValue('');
        }
        
        this.selectedUsers.push(user);
        this.selectedUsersSubject.next(this.selectedUsers);
        this.selectUser.emit(user);

        this.clearError();
        this.resetSearchUsers();
    }

    onRemove(user: IdentityUserModel) {
        this.removeUser.emit(user);
        const indexToRemove = this.selectedUsers.findIndex((selectedUser) => { return selectedUser.id === user.id; });
        this.selectedUsers.splice(indexToRemove, 1);
        this.selectedUsersSubject.next(this.selectedUsers);
    }

    getDisplayName(user): string {
        return FullNamePipe.prototype.transform(user);
    }

    isMultipleMode(): boolean {
        return this.mode === PeopleCloudComponent.MODE_MULTIPLE;
    }

    isSingleMode(): boolean {
        return this.mode === PeopleCloudComponent.MODE_SINGLE;
    }

    private hasPreSelectUsers(): boolean {
        return this.preSelectUsers && this.preSelectUsers.length > 0;
    }

    private resetSearchUsers() {
        this.searchUsers = [];
        this.searchUsersSubject.next(this.searchUsers);
    }

    private setError() {
        this.searchUserCtrl.setErrors({invalid: true});
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

    private resetSingleModeSelection() {
        if (this.hasSelectedUsers()) {
            this.onRemove(this.selectedUsers[0]);
        }
    }

     private hasSelectedUsers(): boolean {
        return this.selectedUsers && this.selectedUsers.length > 0;
    }

}
