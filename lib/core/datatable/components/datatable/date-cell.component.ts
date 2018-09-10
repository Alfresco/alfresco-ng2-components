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

import { Component, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from './datatable-cell.component';
import {
    UserPreferencesService,
    UserPreferenceValues
} from '../../../services/user-preferences.service';

@Component({
    selector: 'adf-date-cell',

    template: `
        <ng-container>
            <span title="{{ tooltip | date:'medium' }}" *ngIf="format === 'timeAgo' else standard_date">
                {{ value | adfTimeAgo: currentLocale }}
            </span>
        </ng-container>
        <ng-template #standard_date>
            <span title="{{ tooltip | date:format }}">
                {{ value | date:format }}
            </span>
        </ng-template>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-date-cell' }
})
export class DateCellComponent extends DataTableCellComponent {
    currentLocale;

    get format(): string {
        if (this.column) {
            return this.column.format || 'medium';
        }
        return 'medium';
    }

    constructor(userPreferenceService: UserPreferencesService) {
        super();

        if (userPreferenceService) {
            userPreferenceService
                .select(UserPreferenceValues.Locale)
                .subscribe(locale => {
                    this.currentLocale = locale;
                });
        }
    }
}
