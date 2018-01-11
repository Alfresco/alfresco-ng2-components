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

import { UserProcessModel } from '@alfresco/adf-core';
import { Component, Directive, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
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

    constructor() {}

    ngOnInit() {
        this.results.subscribe((list) => {
            this.users = list;
        });
    }

    onSearchPeople(event) {
        this.searchPeople.emit(event);
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
}

@Directive({ selector: 'people-search-title' }) export class PeopleSearchTitleDirective { }
@Directive({ selector: 'people-search-action-label' }) export class PeopleSearchActionLabelDirective { }
