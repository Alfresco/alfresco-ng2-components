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

/* tslint:disable:component-selector  */

import { UserPreferencesService } from '../../../../../../services/user-preferences.service';
import { MomentDateAdapter } from '../../../../../../utils/momentDateAdapter';
import { MOMENT_DATE_FORMATS } from '../../../../../../utils/moment-date-formats.model';
import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { DynamicTableColumn } from './../../dynamic-table-column.model';
import { DynamicTableRow } from './../../dynamic-table-row.model';
import { DynamicTableModel } from './../../dynamic-table.widget.model';

@Component({
    selector: 'adf-date-editor',
    templateUrl: './date.editor.html',
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS}],
    styleUrls: ['./date.editor.scss']
})
export class DateEditorComponent implements OnInit {

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

    constructor(private dateAdapter: DateAdapter<Moment>,
                private preferences: UserPreferencesService) {
    }

    ngOnInit() {
        this.preferences.locale$.subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });
        let momentDateAdapter = <MomentDateAdapter> this.dateAdapter;
        momentDateAdapter.overrideDisplayFormat = this.DATE_FORMAT;

        this.value = moment(this.table.getCellValue(this.row, this.column), 'YYYY-MM-DD');
    }

    onDateChanged(newDateValue) {
        if (newDateValue && newDateValue.value) {
            let momentDate = moment(newDateValue.value, this.DATE_FORMAT, true);

            if (!momentDate.isValid()) {
                this.row.value[this.column.id] = '';
            } else {
                this.row.value[this.column.id] = `${momentDate.format('YYYY-MM-DD')}T00:00:00.000Z`;
                this.table.flushValue();
            }
        }
    }

}
