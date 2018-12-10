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
    static ROLE_ACTIVITI_MODELER = 'ACTIVITI_MODELER';

    static MODE_SINGLE = 'single';
    static MODE_MULTIPLE = 'multiple';

    /** Show current user in the list or not. */
    @Input()
    showCurrentUser: boolean = true;

    @Input()
    mode: string = PeopleCloudComponent.MODE_SINGLE;

    @Input()
    roles: string[];

    @Input()
    defaultUsers: IdentityUserModel[];

    /** Emitted when a user is selected. */
    @Output()
    selectUser: EventEmitter<IdentityUserModel> = new EventEmitter<IdentityUserModel>();

    /** Emitted when a user is removed. */
    @Output()
    removeUser: EventEmitter<IdentityUserModel> = new EventEmitter<IdentityUserModel>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('userInput')
    private userInput: ElementRef<HTMLInputElement>;

    private _users: IdentityUserModel[] = [];
    users$: Observable<IdentityUserModel[]>;

    private _selectedUsers: IdentityUserModel[];
    private selectedUsers: BehaviorSubject<IdentityUserModel[]>;
    selectedUsers$: Observable<IdentityUserModel[]>;

    searchUser: FormControl = new FormControl();

    _subscriptAnimationState: string = 'enter';

    dataError = false;

    constructor(private identityUserService: IdentityUserService) {
        this._selectedUsers = <IdentityUserModel[]> [];
        this.selectedUsers = new BehaviorSubject<IdentityUserModel[]>(this._selectedUsers);
        this.selectedUsers$ = this.selectedUsers.asObservable();
        this.selectedUsers.next(this._selectedUsers);
    }

    ngOnInit() {
        this.loadUsers();
        this.initSearch();
    }

    initSearch() {
        this.searchUser.valueChanges.subscribe((keyword) => {
            this.users$ = this.searchUsers(keyword);
        });
    }

    private async loadUsers() {
        const roles = this.getApplicableRoles();
        if (this.showCurrentUser) {
            this._users = await this.identityUserService.getUsersByRolesWithCurrentUser(roles);
        } else {
            this._users = await this.identityUserService.getUsersByRolesWithoutCurrentUser(roles);
        }

        this.loadDefaultUsers();
    }

    private getApplicableRoles(): string[] {
        let roles = this.roles;
        if (!roles || roles.length === 0) {
            roles = [PeopleCloudComponent.ROLE_ACTIVITI_ADMIN, PeopleCloudComponent.ROLE_ACTIVITI_MODELER, PeopleCloudComponent.ROLE_ACTIVITI_USER];
        }

        return roles;
    }

    private searchUsers(keyword: string): Observable<IdentityUserModel[]> {
        const filteredUsers = this._users.filter((user) => {
            return user.username.toLowerCase().indexOf(keyword.toString().toLowerCase()) !== -1;
        });
        this.dataError = filteredUsers.length === 0;
        return of(filteredUsers);
    }

    private loadDefaultUsers() {
        if (this.defaultUsers && this.defaultUsers.length > 0) {
            for (const defaultUser of this.defaultUsers) {
                const newUser = this._users.find((user) => {
                    return user.id === defaultUser.id ||
                        (user.username && defaultUser.username && user.username.toLocaleLowerCase() === defaultUser.username.toLocaleLowerCase());
                });
                if (newUser) {
                    if (this.isMultipleMode()) {
                        this.onSelect(newUser);
                    } else {
                        this.searchUser.setValue(newUser);
                        this.onSelect(newUser);
                        break;
                    }
                }
            }
        }
    }

    onSelect(user: IdentityUserModel) {
        this.selectUser.emit(user);
        this.dataError = false;

        if (this.isMultipleMode()) {
            const isExistingUser = this._selectedUsers.find((selectedUser) => { return selectedUser.id === user.id; });

            if (!isExistingUser) {
                this._selectedUsers.push(user);
                this.selectedUsers.next(this._selectedUsers);
            }

            this.userInput.nativeElement.value = '';
            this.searchUser.setValue('');
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

}
