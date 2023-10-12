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

/* eslint-disable @angular-eslint/component-selector */

import {  MomentDateAdapter, MOMENT_DATE_FORMATS } from '@alfresco/adf-core';
import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';

@Component({
    selector: 'adf-date-editor',
    templateUrl: './date.editor.html',
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }
    ],
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

    constructor(private dateAdapter: DateAdapter<Moment>) {}

    ngOnInit() {
        const momentDateAdapter = this.dateAdapter as MomentDateAdapter;
        momentDateAdapter.overrideDisplayFormat = this.DATE_FORMAT;

        this.value = moment(this.table.getCellValue(this.row, this.column), this.DATE_FORMAT);
    }

    onDateChanged(newDateValue: MatDatepickerInputEvent<any> | HTMLInputElement) {
        if (newDateValue?.value) {
            /* validates the user inputs */
            const momentDate = moment(newDateValue.value, this.DATE_FORMAT, true);

            if (!momentDate.isValid()) {
                this.row.value[this.column.id] = newDateValue.value;
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
