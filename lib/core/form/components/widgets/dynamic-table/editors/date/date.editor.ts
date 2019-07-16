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
import { DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { DynamicTableColumn } from './../../dynamic-table-column.model';
import { DynamicTableRow } from './../../dynamic-table-row.model';
import { DynamicTableModel } from './../../dynamic-table.widget.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-date-editor',
    templateUrl: './date.editor.html',
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS}],
    styleUrls: ['./date.editor.scss']
})
export class DateEditorComponent implements OnInit, OnDestroy {

    DATE_FORMAT: string = 'DD-MM-YYYY';

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
        momentDateAdapter.overrideDisplayFormat = this.DATE_FORMAT;

        this.value = moment(this.table.getCellValue(this.row, this.column), this.DATE_FORMAT);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onDateChanged(newDateValue: MatDatepickerInputEvent<any> | HTMLInputElement) {
        if (newDateValue && newDateValue.value) {
            /* validates the user inputs */
            const momentDate = moment(newDateValue.value, this.DATE_FORMAT, true);

            if (!momentDate.isValid()) {
                this.row.value[this.column.id] =  newDateValue.value;
            } else {
                this.row.value[this.column.id] = `${momentDate.format('YYYY-MM-DD')}T00:00:00.000Z`;
                this.table.flushValue();
            }
        } else {
            /* removes the date  */
            this.row.value[this.column.id] = '';
        }
    }

}
