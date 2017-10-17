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

import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MOMENT_DATE_FORMATS, MomentDateAdapter, UserPreferencesService } from 'ng2-alfresco-core';
import { DynamicTableColumn, DynamicTableModel, DynamicTableRow } from './../../dynamic-table.widget.model';

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

    constructor(
        private dateAdapter: DateAdapter<Moment>,
        private preferences: UserPreferencesService) {
    }

    ngOnInit() {
        this.preferences.locale$.subscribe( (locale) => {
            this.dateAdapter.setLocale(locale);
        });
        let momentDateAdapter = <MomentDateAdapter> this.dateAdapter;
        momentDateAdapter.overrideDisplyaFormat = this.DATE_FORMAT;

        this.value =  moment(this.table.getCellValue(this.row, this.column), this.DATE_FORMAT);
    }

    onDateChanged(newDateValue) {
        if (newDateValue) {
            let momentDate = moment(newDateValue, this.DATE_FORMAT, true);

            if (!momentDate.isValid()) {
                this.row.value[this.column.id]   = '';
            }else {
                this.row.value[this.column.id] = `${momentDate.format('YYYY-MM-DD')}T00:00:00.000Z`;
                this.table.flushValue();
            }
        }
    }

}
