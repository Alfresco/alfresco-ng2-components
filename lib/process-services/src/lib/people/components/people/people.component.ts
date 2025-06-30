/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { UserEventModel } from '../../../task-list/models/user-event.model';
import { PeopleSearchComponent } from '../people-search/people-search.component';
import { share } from 'rxjs/operators';
import { PeopleProcessService } from '../../../services/people-process.service';
import { LightUserRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { PeopleListComponent } from '../people-list/people-list.component';
import { DataColumnComponent, DataColumnListComponent } from '@alfresco/adf-core';

@Component({
    selector: 'adf-people',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        TranslatePipe,
        MatIconModule,
        PeopleSearchComponent,
        PeopleListComponent,
        DataColumnListComponent,
        DataColumnComponent
    ],
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PeopleComponent {
    /** The array of User objects to display. */
    @Input()
    people: LightUserRepresentation[] = [];

    /** The numeric ID of the task. */
    @Input()
    taskId: string = '';

    /** Should the data be read-only? */
    @Input()
    readOnly: boolean = false;

    @ViewChild('peopleSearch')
    peopleSearch: PeopleSearchComponent;

    @Output()
    error = new EventEmitter<any>();

    showAssignment: boolean = false;
    peopleSearch$: Observable<LightUserRepresentation[]>;

    private peopleSearchObserver: Observer<LightUserRepresentation[]>;

    constructor(public peopleProcessService: PeopleProcessService) {
        this.peopleSearch$ = new Observable<LightUserRepresentation[]>((observer) => (this.peopleSearchObserver = observer)).pipe(share());
    }

    searchUser(searchedWord: string) {
        this.peopleProcessService.getWorkflowUsers(this.taskId, searchedWord).subscribe({
            next: (users) => {
                this.peopleSearchObserver.next(users);
            },
            error: (error) => this.error.emit(error)
        });
    }

    involveUser(user: LightUserRepresentation) {
        if (user?.id !== undefined) {
            this.peopleProcessService.involveUserWithTask(this.taskId, user.id.toString()).subscribe({
                next: () => (this.people = [...this.people, user]),
                error: () => this.error.emit('Impossible to involve user with task')
            });
        }
    }

    removeInvolvedUser(user: LightUserRepresentation) {
        this.peopleProcessService.removeInvolvedUser(this.taskId, user.id.toString()).subscribe({
            next: () => {
                this.people = this.people.filter((involvedUser) => involvedUser.id !== user.id);
            },
            error: () => this.error.emit('Impossible to remove involved user from task')
        });
    }

    getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        firstName = firstName !== null ? firstName : '';
        lastName = lastName !== null ? lastName : '';
        return firstName + delimiter + lastName;
    }

    getInitialUserName(firstName: string, lastName: string) {
        firstName = firstName !== null && firstName !== '' ? firstName[0] : '';
        lastName = lastName !== null && lastName !== '' ? lastName[0] : '';
        return this.getDisplayUser(firstName, lastName, '');
    }

    onAddAssignment() {
        this.showAssignment = true;
    }

    onClickAction(event: UserEventModel) {
        if (event?.value && event.type === 'remove') {
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
