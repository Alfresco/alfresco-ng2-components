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
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'adf-people-search-field',
    templateUrl: './people-search-field.component.html',
    styleUrls: ['./people-search-field.component.scss'],
    host: { 'class': 'adf-people-search-field' },
    encapsulation: ViewEncapsulation.None
})

export class PeopleSearchFieldComponent {

    @Input()
    users: UserProcessModel[] = [];

    @Output()
    searchPeople: EventEmitter<any> = new EventEmitter();

    @Output()
    rowClick: EventEmitter<UserProcessModel> = new EventEmitter<UserProcessModel>();

    searchUser: FormControl = new FormControl();
    selectedUser: UserProcessModel;

    constructor() {
        this.searchUser.valueChanges
            .pipe(
                debounceTime(200)
            )
            .subscribe((event: string) => {
                if (event && event.trim()) {
                    this.searchPeople.emit(event);
                } else {
                    this.users = [];
                }
            });
    }

    onRowClick(event) {
        this.rowClick.emit(event);
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
