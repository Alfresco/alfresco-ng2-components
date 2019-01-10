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

    static ROLE_ACTIVITI_ADMIN = 'ACTIVITI_ADMIN';
    static ROLE_ACTIVITI_USER = 'ACTIVITI_USER';

    static MODE_SINGLE = 'single';
    static MODE_MULTIPLE = 'multiple';

    /** Name of the application. If specified, shows the users who have access to the app. */
    @Input()
    appName: string;

    /** Mode of the user selection (single/multiple) */
    @Input()
    mode: string = PeopleCloudComponent.MODE_SINGLE;

    /** Roles of users to be listed */
    @Input()
    roles: string[];

    /** Array of users to be pre-selected. Pre-select all users in multi selection mode and only the first user of the array in single selection mode */
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

    users$: Observable<IdentityUserModel[]>;

    private _selectedUsers: IdentityUserModel[] = [];
    private selectedUsers: BehaviorSubject<IdentityUserModel[]>;
    private searchUsers: BehaviorSubject<IdentityUserModel[]>;
    selectedUsers$: Observable<IdentityUserModel[]>;

    searchUser: FormControl = new FormControl();

    _subscriptAnimationState: string = 'enter';

    dataError = false;

    filtered = [];

    constructor(private identityUserService: IdentityUserService) {
        this.selectedUsers = new BehaviorSubject<IdentityUserModel[]>(this._selectedUsers);
        this.searchUsers = new BehaviorSubject<IdentityUserModel[]>(this._selectedUsers);
        this.selectedUsers$ = this.selectedUsers.asObservable();
        this.users$ = this.searchUsers.asObservable();
    }

    ngOnInit() {
        if (this.hasPreSelectUsers()) {
            this.loadPreSelectUsers();
        }
        this.initSearch();
    }

    initSearch() {
        this.searchUser.valueChanges.pipe(
            tap((value) => {
                this.dataError = !!value;
            }),
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => {
                this.filtered = [];
                this.searchUsers.next(this.filtered);
            }),
            switchMap((search) => this.identityUserService.findUsersByName(search)),
            mergeMap((user) => {
                return user;
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
            this.filtered.push(user);
            this.searchUsers.next(this.filtered);
        });
    }

    private checkUserHasAccess(userId: string): Observable<boolean> {
        const roles = this.hasRoles() ? this.roles : this.getDefaultRoles();
        return this.identityUserService.checkUserHasAnyApplicationRole(userId, this.appName, roles);
    }

    private hasRoles(): boolean {
        return this.roles && this.roles.length > 0;
    }

    private getDefaultRoles(): string[] {
        return [PeopleCloudComponent.ROLE_ACTIVITI_USER, PeopleCloudComponent.ROLE_ACTIVITI_ADMIN];
    }

    isUserAlreadySelected(user: IdentityUserModel): boolean {
        if (this._selectedUsers && this._selectedUsers.length > 0) {
            const result = this._selectedUsers.find((tmpUser) => {
                return tmpUser.id === user.id;
            });

            return !!result;
        }
        return false;
    }

    loadPreSelectUsers() {
        if (this.isMultipleMode()) {
            if (this.preSelectUsers && this.preSelectUsers.length > 0) {
                this.selectedUsers.next(this.preSelectUsers);
            }
        } else {
            this.selectedUsers.next(this.preSelectUsers);
            this.searchUser.setValue(this.preSelectUsers[0]);
        }
    }

    onSelect(user: IdentityUserModel) {

        this.dataError = false;

        if (this.isMultipleMode()) {

            if (!this.isUserAlreadySelected(user)) {
                this._selectedUsers.push(user);
                this.selectedUsers.next(this._selectedUsers);
                this.selectUser.emit(user);
                this.searchUsers.next([]);
            }

            this.userInput.nativeElement.value = '';
            this.searchUser.setValue('');
        } else {
            this.selectUser.emit(user);
        }
    }

    onRemove(user: IdentityUserModel) {
        this.removeUser.emit(user);
        const indexToRemove = this._selectedUsers.findIndex((selectedUser) => { return selectedUser.id === user.id; });
        this._selectedUsers.splice(indexToRemove, 1);
        this.selectedUsers.next(this._selectedUsers);
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

}
