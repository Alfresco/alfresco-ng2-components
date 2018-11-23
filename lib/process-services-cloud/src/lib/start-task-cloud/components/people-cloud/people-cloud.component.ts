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
import { StartTaskCloudService } from './../../services/start-task-cloud.service';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleCloudModel } from '../../models/role-cloud.model';
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

    static ACTIVITI_ADMIN = 'ACTIVITI_ADMIN';
    static ACTIVITI_USER = 'ACTIVITI_USER';
    static ACTIVITI_MODELER = 'ACTIVITI_MODELER';

    /** Show current user in the list or not. */
    @Input()
    showCurrentUser: boolean = true;

    /** Emitted when a user is selected. */
    @Output()
    selectedUser: EventEmitter<IdentityUserModel> = new EventEmitter<IdentityUserModel>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    users$: Observable<any[]>;

    searchUser: FormControl = new FormControl();

    _subscriptAnimationState: string = 'enter';

    users: any[] = [];

    dataError = false;

    currentUser: any;

    constructor(private taskService: StartTaskCloudService,
                private identityService: IdentityUserService) { }

    ngOnInit() {
        this.loadUsers();
        this.initSearch();
    }

    initSearch() {
        this.searchUser.valueChanges.subscribe((searchedWord) => {
            this.users$ = this.searchUsers(this.users, searchedWord);
        });
    }

    private async loadUsers() {
        if (!this.showCurrentUser) {
            this.currentUser = await this.identityService.getCurrentUserInfo().toPromise();
        }
        const users = await this.taskService.getUsers().toPromise();
        this.users = await this.filterUsers(users);
    }

    private async filterUsers(users: IdentityUserModel[]) {
        let filteredUsers: any[] = [];

        for (let i = 0; i < users.length; i++) {
            const roles = await this.taskService.getRolesByUserId(users[i].id).toPromise();
            for (let j = 0; j < roles.length; j++) {
                if (this.isValidUser(users[i]) && this.hasRole(roles[j])) {
                    filteredUsers.push(users[i]);
                }
            }
        }
        return filteredUsers;
    }

    private hasRole(role: RoleCloudModel): boolean {
        return (role.name === PeopleCloudComponent.ACTIVITI_ADMIN) || (role.name === PeopleCloudComponent.ACTIVITI_MODELER) || (role.name === PeopleCloudComponent.ACTIVITI_USER);
    }

    private isValidUser(user): boolean {
        let valid = true;
        if (!this.showCurrentUser && this.currentUser.username === user.username) {
            valid = false;
        }
        return valid;
    }

    private searchUsers(users: IdentityUserModel[], searchedWord: string) {
        let filteredUsers: IdentityUserModel[];
        filteredUsers = this.removeDuplicates(users).filter((user) => {
            return this.findUserBySearchedWord(user.username, searchedWord);
        });
        this.dataError = filteredUsers.length <= 0 ? true : false;
        return of(filteredUsers);
    }

    findUserBySearchedWord(username: string, searchedWord: string): boolean {
        return username.toLowerCase().indexOf(searchedWord.toString().toLowerCase()) !== -1;
    }

    private removeDuplicates(users: IdentityUserModel[]): IdentityUserModel[] {
        const userMap = new Map();
        users.forEach((user) => {
            if (!userMap.has(user.id)) {
                userMap.set(user.id, user);
            }
        });
        return Array.from(userMap.values());
    }

    onSelect(selectedUser: IdentityUserModel) {
        this.selectedUser.emit(selectedUser);
        this.dataError = false;
    }

    getDisplayName(user): string {
        return FullNamePipe.prototype.transform(user);
    }

}
