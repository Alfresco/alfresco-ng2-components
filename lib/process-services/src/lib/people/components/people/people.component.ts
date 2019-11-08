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

import { LogService, UserProcessModel } from '@alfresco/adf-core';
import { PeopleProcessService } from '@alfresco/adf-core';
import { Component, Input, ViewChild } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { UserEventModel } from '../../../task-list/models/user-event.model';
import { PeopleSearchComponent } from '../people-search/people-search.component';
import { share } from 'rxjs/operators';

@Component({
    selector: 'adf-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent {

    /** The array of User objects to display. */
    @Input()
    people: UserProcessModel[] = [];

    /** The numeric ID of the task. */
    @Input()
    taskId: string = '';

    /** Should the data be read-only? */
    @Input()
    readOnly: boolean = false;

    @ViewChild('peopleSearch')
    peopleSearch: PeopleSearchComponent;

    showAssignment: boolean = false;

    private peopleSearchObserver: Observer<UserProcessModel[]>;
    peopleSearch$: Observable<UserProcessModel[]>;

    constructor(private logService: LogService, public peopleProcessService: PeopleProcessService) {
        this.peopleSearch$ = new Observable<UserProcessModel[]>((observer) => this.peopleSearchObserver = observer)
            .pipe(
                share()
            );
    }

    involveUserAndCloseSearch() {
        if (this.peopleSearch) {
            this.peopleSearch.involveUserAndClose();
        }
    }

    involveUserWithoutCloseSearch() {
        if (this.peopleSearch) {
            this.peopleSearch.involveUser();
        }
    }

    searchUser(searchedWord: string) {
        this.peopleProcessService.getWorkflowUsers(this.taskId, searchedWord)
            .subscribe((users) => {
                this.peopleSearchObserver.next(users);
            }, (error) => this.logService.error(error));
    }

    involveUser(user: UserProcessModel) {
        if (user && user.id) {
            this.peopleProcessService
                .involveUserWithTask(this.taskId, user.id.toString())
                .subscribe(
                    () => this.people = [...this.people, user],
                    () => this.logService.error('Impossible to involve user with task')
                );
        }
    }

    removeInvolvedUser(user: UserProcessModel) {
        this.peopleProcessService
            .removeInvolvedUser(this.taskId, user.id.toString())
            .subscribe(
                () => {
                    this.people = this.people.filter(involvedUser => involvedUser.id !== user.id);
                },
                () => this.logService.error('Impossible to remove involved user from task'));
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

    onAddAssignment() {
        this.showAssignment = true;
    }

    onClickAction(event: UserEventModel) {
        if (event && event.value && event.type === 'remove') {
            this.removeInvolvedUser(event.value);
        }
    }

    hasPeople(): boolean {
        return this.people && this.people.length > 0;
    }

    isEditMode(): boolean {
        return !this.readOnly;
    }

    onCloseSearch() {
        this.showAssignment = false;
    }
}
