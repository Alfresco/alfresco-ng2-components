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

import { TranslationService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PerformSearchCallback } from '../../interfaces/perform-search-callback.interface';
import { getDisplayUser } from '../../helpers/get-display-user';
import { PeopleProcessService } from '../../../common/services/people-process.service';
import { UserProcessModel } from '../../../common/models/user-process.model';

@Component({
    selector: 'adf-people-search-field',
    templateUrl: './people-search-field.component.html',
    styleUrls: ['./people-search-field.component.scss'],
    host: { class: 'adf-people-search-field' },
    encapsulation: ViewEncapsulation.None
})

export class PeopleSearchFieldComponent {

    @Input()
    performSearch: PerformSearchCallback;

    @Input()
    placeholder: string;

    @Output()
    rowClick = new EventEmitter<UserProcessModel>();

    users$: Observable<UserProcessModel[]>;
    searchUser: UntypedFormControl = new UntypedFormControl();

    defaultPlaceholder = 'ADF_TASK_LIST.PEOPLE.SEARCH_USER';

    constructor(public peopleProcessService: PeopleProcessService,
                private translationService: TranslationService) {
        this.users$ = this.searchUser.valueChanges
            .pipe(
                debounceTime(200),
                switchMap((searchWord: string) => {
                    if (searchWord && searchWord.trim()) {
                        return this.performSearch(searchWord);
                    } else {
                        return of([]);
                    }
                })
            );

        this.defaultPlaceholder = this.translationService.instant(this.defaultPlaceholder);
    }

    reset() {
        this.searchUser.reset();
    }

    get searchPlaceholder(): string {
        return this.placeholder || this.defaultPlaceholder;
    }

    onRowClick(model: UserProcessModel) {
        this.rowClick.emit(model);
    }

    getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        return getDisplayUser(firstName, lastName, delimiter);
    }

    getInitialUserName(firstName: string, lastName: string): string {
        firstName = (firstName !== null && firstName !== '' ? firstName[0] : '');
        lastName = (lastName !== null && lastName !== '' ? lastName[0] : '');
        return this.getDisplayUser(firstName, lastName, '');
    }
}
