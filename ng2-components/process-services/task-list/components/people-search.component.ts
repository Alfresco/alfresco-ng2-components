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

import { Component, Directive, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PeopleProcessService, UserProcessModel } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'adf-people-search',
    templateUrl: './people-search.component.html',
    styleUrls: ['./people-search.component.scss'],
    host: {
        'class': 'adf-people-search'
    },
    encapsulation: ViewEncapsulation.None
})

export class PeopleSearchComponent implements OnInit {

    @Input()
    results: Observable<UserProcessModel[]>;

    @Output()
    searchPeople: EventEmitter<any> = new EventEmitter();

    @Output()
    success: EventEmitter<UserProcessModel> = new EventEmitter<UserProcessModel>();

    @Output()
    closeSearch = new EventEmitter();

    searchUser: FormControl = new FormControl();

    users: UserProcessModel[] = [];

    selectedUser: UserProcessModel;

    constructor(public peopleProcessService: PeopleProcessService) {
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

    onRowClick(user: UserProcessModel) {
        this.selectedUser = user;
    }

    closeSearchList() {
        this.closeSearch.emit();
    }

    involveUserAndClose() {
        this.involveUser();
        this.closeSearchList();
    }

    involveUser() {
        if (this.selectedUser === undefined) {
            return;
        }
        this.success.emit(this.selectedUser);
        this.users = this.users.filter((user) => {
            this.searchUser.reset();
            return user.id !== this.selectedUser.id;
        });
    }

    getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        firstName = (firstName !== null ? firstName : '');
        lastName = (lastName !== null ? lastName : '');
        return firstName + delimiter + lastName;
    }

    getInitialUserName(firstName: string, lastName: string) {
        firstName = (firstName !== null && firstName !== '' ? firstName[0] : '');
        lastName = (lastName !== null && lastName !== '' ? lastName[0] : '');
        return this.getDisplayUser(firstName, lastName, '');
    }

    hasUsers() {
        return (this.users && this.users.length > 0);
    }
}

@Directive({ selector: 'people-search-title' }) export class PeopleSearchTitleDirective { }
@Directive({ selector: 'people-search-action-label' }) export class PeopleSearchActionLabelDirective { }
