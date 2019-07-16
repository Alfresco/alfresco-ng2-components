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

/* tslint:disable:component-selector  */

import { UserPreferencesService, UserPreferenceValues } from '../../../../../../services/user-preferences.service';
import { MomentDateAdapter } from '../../../../../../utils/momentDateAdapter';
import { MOMENT_DATE_FORMATS } from '../../../../../../utils/moment-date-formats.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { DynamicTableColumn } from './../../dynamic-table-column.model';
import { DynamicTableRow } from './../../dynamic-table-row.model';
import { DynamicTableModel } from './../../dynamic-table.widget.model';
import { DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter, MAT_MOMENT_DATETIME_FORMATS } from '@mat-datetimepicker/moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-datetime-editor',
    templateUrl: './datetime.editor.html',
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }
    ],
    styleUrls: ['./datetime.editor.scss']
})
export class DateTimeEditorComponent implements OnInit, OnDestroy {

    DATE_TIME_FORMAT: string = 'DD/MM/YYYY HH:mm';

    value: any;

    @Input()
    table: DynamicTableModel;

    @Input()
    row: DynamicTableRow;

    @Input()
    column: DynamicTableColumn;

    minDate: Moment;
    maxDate: Moment;

    private onDestroy$ = new Subject<boolean>();

    constructor(private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService) {
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));

        const momentDateAdapter = <MomentDateAdapter> this.dateAdapter;
        momentDateAdapter.overrideDisplayFormat = this.DATE_TIME_FORMAT;

        this.value = moment(this.table.getCellValue(this.row, this.column), this.DATE_TIME_FORMAT);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onDateChanged(newDateValue) {
        if (newDateValue && newDateValue.value) {
            const newValue = moment(newDateValue.value, this.DATE_TIME_FORMAT);
            this.row.value[this.column.id] = newDateValue.value.format(this.DATE_TIME_FORMAT);
            this.value = newValue;
            this.table.flushValue();
        } else if (newDateValue) {
            const newValue = moment(newDateValue, this.DATE_TIME_FORMAT);
            this.value = newValue;
            this.row.value[this.column.id] = newDateValue;
            this.table.flushValue();
        } else {
            this.row.value[this.column.id] = '';
        }
    }

}
