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
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { uniqBy } from 'lodash';
import { RoleCloudModel } from '../../models/role-cloud.model';
import { UserCloudModel } from '../../models/user-cloud.model';
import { LogService } from '@alfresco/adf-core';
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
    encapsulation: ViewEncapsulation.None
})

export class PeopleCloudComponent implements OnInit {

    static ACTIVITI_ADMIN = 'ACTIVITI_ADMIN';
    static ACTIVITI_USER = 'ACTIVITI_USER';
    static ACTIVITI_MODELER = 'ACTIVITI_MODELER';

    @Output()
    selectedUser: EventEmitter<UserCloudModel> = new EventEmitter<UserCloudModel>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    users$: Observable<any[]>;

    searchUser: FormControl = new FormControl();

    _subscriptAnimationState: string = 'enter';

    users: any[] = [];

    dataError = false;

    constructor(private taskService: StartTaskCloudService,
                private logService: LogService) { }

    ngOnInit() {
        this.loadUsers();
        this.search();
    }

    search() {
        this.searchUser.valueChanges.subscribe((searchedWord) => {
            this.users$ = this.filterUsers(this.users, searchedWord);
        });
    }

    private loadUsers() {
        this.taskService.getUsers().subscribe((users: any) => {
            this.users = this.filterUsersByRole(users);
            },
            (error) => {
                this.error.emit(error);
                this.logService.error('An error occurred while fetching users');
            }
        );
    }

    private filterUsersByRole(users: UserCloudModel[]): UserCloudModel[] {
        let filteredUsers: any[] = [];
        users.forEach(user => {
            this.taskService.getRolesByUserId(user.id).subscribe((roles: RoleCloudModel[]) => {
                roles.forEach(role => {
                    if (this.hasRole(role)) {
                        filteredUsers.push(user);
                    }
                });
            },
            (error) => {
                this.error.emit(error);
                this.logService.error('An error occurred while fetching roles');
                }
            );
        });
        return filteredUsers;
    }

    private hasRole(role: RoleCloudModel): boolean {
        return (role.name === PeopleCloudComponent.ACTIVITI_ADMIN) || (role.name === PeopleCloudComponent.ACTIVITI_MODELER) || (role.name === PeopleCloudComponent.ACTIVITI_USER);
    }

    private filterUsers(users: UserCloudModel[], searchedWord: string) {
        let filteredUsers: UserCloudModel[];
        filteredUsers = this.removeDuplicates(users).filter((user) => this.findUserBySearchedWord(user.username, searchedWord));
        this.dataError = filteredUsers.length <= 0 ? true : false;
        return of(filteredUsers);
    }

    findUserBySearchedWord(username: string, searchedWord: string): boolean {
        return username.toLowerCase().indexOf(searchedWord.toString().toLowerCase()) !== -1;
    }

    removeDuplicates(users: any[]): UserCloudModel[] {
        return uniqBy(users, 'username');
    }

    onSelect(selectedUser: UserCloudModel) {
        this.selectedUser.emit(selectedUser);
        this.dataError = false;
    }

    getDisplayName(model: any) {
        if (model) {
            let displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }
        return '';
    }
}
