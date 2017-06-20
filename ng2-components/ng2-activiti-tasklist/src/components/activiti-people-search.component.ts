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

import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';

declare let componentHandler: any;
declare var require: any;

@Component({
    selector: 'activiti-people-search',
    templateUrl: './activiti-people-search.component.html',
    styleUrls: ['./activiti-people-search.component.css']
})

export class ActivitiPeopleSearch implements OnInit, AfterViewInit {

    @Input()
    results: Observable<User[]>;

    @Output()
    searchPeople: EventEmitter<any> = new EventEmitter();

    @Output()
    success: EventEmitter<User> = new EventEmitter<User>();

    @Output()
    closeSearch = new EventEmitter();

    searchUser: FormControl = new FormControl();

    users: User[] = [];

    selectedUser: User;

    constructor(private translateService: AlfrescoTranslationService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }

        this.searchUser
            .valueChanges
            .debounceTime(200)
            .subscribe((event: string) => {
                if (event && event.trim()) {
                    this.searchPeople.emit(event);
                } else {
                    this.users = [];
                }
            });
    }

    ngOnInit() {
        this.results.subscribe((list) => {
            this.users = list;
        });
    }

    ngAfterViewInit() {
        this.setupMaterialComponents(componentHandler);
    }

    setupMaterialComponents(handler?: any): boolean {
        // workaround for MDL issues with dynamic components
        let isUpgraded: boolean = false;
        if (handler) {
            handler.upgradeAllRegistered();
            isUpgraded = true;
        }
        return isUpgraded;
    }

    onRowClick(user: User) {
        this.selectedUser = user;
    }

    closeSearchList() {
        this.closeSearch.emit();
    }

    addInvolvedUser() {
        if (this.selectedUser === undefined) {
            return;
        }
        this.success.emit(this.selectedUser);
        this.users = this.users.filter((user) => {
            this.searchUser.reset();
            return user.id !== this.selectedUser.id;
        });
    }

    getDisplayUser(user: User, delimiter: string = '-', shortFlag: boolean = false): string {
        let firstName = user.firstName && user.firstName !== 'null' ? user.firstName : '';
        let lastName = user.lastName && user.lastName !== 'null' ? user.lastName : '';
        if (shortFlag) {
            firstName = firstName !== '' ? firstName[0] : '';
            lastName = lastName !== '' ? lastName[0] : '';
            return firstName + lastName;
        } else {
            return firstName + delimiter + lastName;
        }
    }

    hasUsers() {
        return (this.users && this.users.length > 0);
    }
}
