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
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
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

    /** Show current user in the list or not. */
    @Input()
    showCurrentUser: boolean = true;

    /** Emitted when a user is selected. */
    @Output()
    selectedUser: EventEmitter<IdentityUserModel> = new EventEmitter<IdentityUserModel>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    users$: Observable<IdentityUserModel[]>;

    searchUser: FormControl = new FormControl();

    _subscriptAnimationState: string = 'enter';

    users: IdentityUserModel[] = [];

    dataError = false;

    currentUser: IdentityUserModel;

    constructor(private identityUserService: IdentityUserService) { }

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
        const roles = [PeopleCloudComponent.ROLE_ACTIVITI_ADMIN, PeopleCloudComponent.ROLE_ACTIVITI_MODELER, PeopleCloudComponent.ROLE_ACTIVITI_USER];
        if (this.showCurrentUser) {
            this.users = await this.identityUserService.getUsersByRolesWithCurrentUser(roles);
        } else {
            this.users = await this.identityUserService.getUsersByRolesWithoutCurrentUser(roles);
        }
    }

    private searchUsers(keyword: string): Observable<IdentityUserModel[]> {
        const filteredUsers = this.users.filter((user) => {
            return user.username.toLowerCase().indexOf(keyword.toString().toLowerCase()) !== -1;
        });
        this.dataError = filteredUsers.length === 0;
        return of(filteredUsers);
    }

    onSelect(selectedUser: IdentityUserModel) {
        this.selectedUser.emit(selectedUser);
        this.dataError = false;
    }

    getDisplayName(user): string {
        return FullNamePipe.prototype.transform(user);
    }

}
