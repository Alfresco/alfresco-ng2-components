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

import { ADF_DATE_FORMATS, AdfDateFnsAdapter, DateFnsUtils } from '@alfresco/adf-core';
import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { isValid } from 'date-fns';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'adf-date-editor',
    imports: [CommonModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, FormsModule],
    templateUrl: './date.editor.html',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    styleUrls: ['./date.editor.scss']
})
export class DateEditorComponent implements OnInit {
    DATE_FORMAT: string = 'DD-MM-YYYY';

    @Input()
    value: Date;

    @Input()
    table: DynamicTableModel;

    @Input()
    row: DynamicTableRow;

    @Input()
    column: DynamicTableColumn;

    minDate: Date;
    maxDate: Date;

    constructor(private dateAdapter: DateAdapter<Date>) {}

    ngOnInit() {
        const dateAdapter = this.dateAdapter as AdfDateFnsAdapter;
        dateAdapter.displayFormat = this.DATE_FORMAT;

        this.value = this.table.getCellValue(this.row, this.column) as Date;
    }

    onDateChanged(newDateValue: MatDatepickerInputEvent<Date> | string) {
        if (typeof newDateValue === 'string') {
            const newValue = DateFnsUtils.parseDate(newDateValue, this.DATE_FORMAT);

            if (isValid(newValue)) {
                this.row.value[this.column.id] = `${DateFnsUtils.formatDate(newValue, 'yyyy-MM-dd')}T00:00:00.000Z`;
                this.table.flushValue();
            } else {
                this.row.value[this.column.id] = newDateValue;
            }
        } else if (newDateValue?.value) {
            this.row.value[this.column.id] = `${DateFnsUtils.formatDate(newDateValue?.value, 'yyyy-MM-dd')}T00:00:00.000Z`;
            this.table.flushValue();
        } else {
            this.row.value[this.column.id] = '';
        }
    }
}
