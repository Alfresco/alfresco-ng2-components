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

import { LogService } from '../../../../../../services/log.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormService } from './../../../../../services/form.service';
import { DynamicTableColumnOption } from './../../dynamic-table-column-option.model';
import { DynamicTableColumn } from './../../dynamic-table-column.model';
import { DynamicTableRow } from './../../dynamic-table-row.model';
import { DynamicTableModel } from './../../dynamic-table.widget.model';

@Component({
    selector: 'adf-dropdown-editor',
    templateUrl: './dropdown.editor.html',
    styleUrls: ['./dropdown.editor.scss']
})
export class DropdownEditorComponent implements OnInit {

    value: any = null;
    options: DynamicTableColumnOption[] = [];

    @Input()
    table: DynamicTableModel;

    @Input()
    row: DynamicTableRow;

    @Input()
    column: DynamicTableColumn;

    constructor(public formService: FormService,
                private logService: LogService) {
    }

    ngOnInit() {
        const field = this.table.field;
        if (field) {
            if (this.column.optionType === 'rest') {
                if (this.table.form && this.table.form.taskId) {
                    this.getValuesByTaskId(field);
                } else {
                    this.getValuesByProcessDefinitionId(field);
                }
            } else {
                this.options = this.column.options || [];
                this.value = this.table.getCellValue(this.row, this.column);
            }
        }
    }

    getValuesByTaskId(field) {
        this.formService
            .getRestFieldValuesColumn(
                field.form.taskId,
                field.id,
                this.column.id
            )
            .subscribe(
                (dynamicTableColumnOption: DynamicTableColumnOption[]) => {
                    this.column.options = dynamicTableColumnOption || [];
                    this.options = this.column.options;
                    this.value = this.table.getCellValue(this.row, this.column);
                },
                (err) => this.handleError(err)
            );
    }

    getValuesByProcessDefinitionId(field) {
        this.formService
            .getRestFieldValuesColumnByProcessId(
                field.form.processDefinitionId,
                field.id,
                this.column.id
            )
            .subscribe(
                (dynamicTableColumnOption: DynamicTableColumnOption[]) => {
                    this.column.options = dynamicTableColumnOption || [];
                    this.options = this.column.options;
                    this.value = this.table.getCellValue(this.row, this.column);
                },
                (err) => this.handleError(err)
            );
    }

    onValueChanged(row: DynamicTableRow, column: DynamicTableColumn, event: any) {
        let value: any = (<HTMLInputElement> event).value;
        value = column.options.find((opt) => opt.name === value);
        row.value[column.id] = value;
    }

    handleError(error: any) {
        this.logService.error(error);
    }
}
