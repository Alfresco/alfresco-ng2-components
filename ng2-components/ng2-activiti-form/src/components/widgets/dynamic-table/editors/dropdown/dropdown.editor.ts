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

import { Component, Input, OnInit } from '@angular/core';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn, DynamicTableColumnOption } from './../../dynamic-table.widget.model';
import { FormService } from './../../../../../services/form.service';

@Component({
    moduleId: module.id,
    selector: 'alf-dropdown-editor',
    templateUrl: './dropdown.editor.html',
    styleUrls: ['./dropdown.editor.css']
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

    constructor(private formService: FormService) {}

    ngOnInit() {
        let field = this.table.field;
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
                (result: DynamicTableColumnOption[]) => {
                    this.column.options = result || [];
                    this.options = this.column.options;
                    this.value = this.table.getCellValue(this.row, this.column);
                },
                err => this.handleError(err)
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
                (result: DynamicTableColumnOption[]) => {
                    this.column.options = result || [];
                    this.options = this.column.options;
                    this.value = this.table.getCellValue(this.row, this.column);
                },
                err => this.handleError(err)
            );
    }

    onValueChanged(row: DynamicTableRow, column: DynamicTableColumn, event: any) {
        let value: any = (<HTMLInputElement>event.target).value;
        value = column.options.find(opt => opt.name === value);
        row.value[column.id] = value;
    }

    handleError(error: any) {
        console.error(error);
    }
}
