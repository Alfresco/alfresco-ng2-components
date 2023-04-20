/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewChild, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';
import { PerformSearchCallback } from '../../interfaces/perform-search-callback.interface';
import { LogService, TranslationService } from '@alfresco/adf-core';
import { PeopleSearchFieldComponent } from '../people-search-field/people-search-field.component';
import { getDisplayUser } from '../../helpers/get-display-user';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PeopleProcessService } from '../../../common/services/people-process.service';
import { UserProcessModel } from '../../../common/models/user-process.model';

const DEFAULT_ASSIGNEE_PLACEHOLDER = 'ADF_TASK_LIST.PEOPLE.ASSIGNEE';

@Component({
    selector: 'adf-people-selector',
    templateUrl: './people-selector.component.html',
    styleUrls: ['./people-selector.component.scss'],
    host: { class: 'adf-people-selector' },
    encapsulation: ViewEncapsulation.None
})

export class PeopleSelectorComponent {

    @Input()
    peopleId: UserProcessModel;

    // Poorly documented Angular magic for [(peopleId)]
    @Output()
    peopleIdChange: EventEmitter<number>;

    @ViewChild('peopleSearchField', { static: true })
    searchFieldComponent: PeopleSearchFieldComponent;

    performSearch: PerformSearchCallback;
    selectedUser: UserProcessModel;
    defaultPlaceholder: string;

    constructor(
        private peopleProcessService: PeopleProcessService,
        private logService: LogService,
        private translationService: TranslationService) {

        this.peopleIdChange = new EventEmitter();
        this.performSearch = this.searchUser.bind(this);
        this.defaultPlaceholder = this.translationService.instant(DEFAULT_ASSIGNEE_PLACEHOLDER);
    }

    searchUser(searchWord: string): Observable<any | UserProcessModel[]> {
        return this.peopleProcessService.getWorkflowUsers(undefined, searchWord)
            .pipe(
                catchError(this.onSearchUserError.bind(this))
            );
    }

    userSelected(user: UserProcessModel): void {
        this.updateUserSelection(user);
    }

    userDeselected(): void {
        this.updateUserSelection(undefined);
    }

    private onSearchUserError(): Observable<UserProcessModel[]> {
        this.logService.error('getWorkflowUsers threw error');
        return of([]);
    }

    private updateUserSelection(user: UserProcessModel): void {
        this.selectedUser = user;
        this.peopleIdChange.emit(user && user.id || undefined);
        this.searchFieldComponent.reset();
    }

    get placeholder() {
        if (!this.selectedUser) {
            return this.defaultPlaceholder;
        }

        return getDisplayUser(this.selectedUser.firstName, this.selectedUser.lastName, ' ');
    }
}
