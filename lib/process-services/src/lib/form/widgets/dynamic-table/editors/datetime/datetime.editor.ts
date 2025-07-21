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

import { ADF_DATETIME_FORMATS, ADF_DATE_FORMATS, AdfDateFnsAdapter, AdfDateTimeFnsAdapter, DateFnsUtils } from '@alfresco/adf-core';
import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerInputEvent, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'adf-datetime-editor',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatInputModule, MatDatetimepickerModule, FormsModule],
    templateUrl: './datetime.editor.html',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ],
    styleUrls: ['./datetime.editor.scss']
})
export class DateTimeEditorComponent implements OnInit {
    DATE_TIME_FORMAT: string = 'DD/MM/YYYY HH:mm';

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
        const momentDateAdapter = this.dateAdapter as AdfDateFnsAdapter;
        momentDateAdapter.displayFormat = this.DATE_TIME_FORMAT;

        this.value = this.table.getCellValue(this.row, this.column) as Date;
    }

    onDateChanged(newDateValue: MatDatetimepickerInputEvent<Date> | string) {
        if (typeof newDateValue === 'string') {
            const newValue = DateFnsUtils.parseDate(newDateValue, this.DATE_TIME_FORMAT);
            this.value = newValue;
            this.row.value[this.column.id] = newValue.toISOString();
            this.table.flushValue();
        } else if (newDateValue.value) {
            const newValue = DateFnsUtils.formatDate(newDateValue.value, this.DATE_TIME_FORMAT);
            this.row.value[this.column.id] = newValue;
            this.value = newDateValue.value;
            this.table.flushValue();
        } else {
            this.row.value[this.column.id] = '';
        }
    }
}
