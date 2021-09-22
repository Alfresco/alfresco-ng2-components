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

import { UserProcessModel } from '@alfresco/adf-core';
import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { PerformSearchCallback } from '../../interfaces/perform-search-callback.interface';
import { map } from 'rxjs/operators';

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

    /** Parameters for displaying the list. */
    @Input()
    results: Observable<UserProcessModel[]>;

    /** Emitted when a search is performed with a new keyword. */
    @Output()
    searchPeople = new EventEmitter<any>();

    /** Emitted when a user is selected and the action button is clicked. */
    @Output()
    success = new EventEmitter<UserProcessModel>();

    /** Emitted when the "close" button is clicked. */
    @Output()
    closeSearch = new EventEmitter();

    filteredResults$: Observable<UserProcessModel[]>;
    selectedUser: UserProcessModel = {};
    performSearch: PerformSearchCallback;

    constructor() {}

    ngOnInit() {
        this.filteredResults$ = this.results
            .pipe(
                map((users) => {
                    return users.filter((user) => user.id !== this.selectedUser.id);
                })
            );
        this.performSearch = this.performSearchCallback.bind(this);
    }

    private performSearchCallback(event: any): Observable<UserProcessModel[]> {
        this.searchPeople.emit(event);
        return this.filteredResults$;
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
    }
}
