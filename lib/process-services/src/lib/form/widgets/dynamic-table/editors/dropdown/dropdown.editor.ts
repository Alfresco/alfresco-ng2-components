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

/* eslint-disable @angular-eslint/component-selector */

import { FormService, FormFieldModel } from '@alfresco/adf-core';
import { Component, Input, OnInit } from '@angular/core';
import { DynamicTableColumnOption } from '../models/dynamic-table-column-option.model';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { ProcessDefinitionService } from '../../../../services/process-definition.service';
import { TaskFormService } from '../../../../services/task-form.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'adf-dropdown-editor',
    imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule],
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

    constructor(
        public formService: FormService,
        private taskFormService: TaskFormService,
        private processDefinitionService: ProcessDefinitionService
    ) {}

    ngOnInit() {
        const field = this.table.field;
        if (field) {
            if (this.column.optionType === 'rest') {
                if (this.table.form?.taskId) {
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

    getValuesByTaskId(field: FormFieldModel) {
        this.taskFormService.getRestFieldValuesColumn(field.form.taskId, field.id, this.column.id).subscribe((dynamicTableColumnOption) => {
            this.column.options = dynamicTableColumnOption || [];
            this.options = this.column.options;
            this.value = this.table.getCellValue(this.row, this.column);
        });
    }

    getValuesByProcessDefinitionId(field: FormFieldModel) {
        this.processDefinitionService
            .getRestFieldValuesColumnByProcessId(field.form.processDefinitionId, field.id, this.column.id)
            .subscribe((dynamicTableColumnOption) => {
                this.column.options = dynamicTableColumnOption || [];
                this.options = this.column.options;
                this.value = this.table.getCellValue(this.row, this.column);
            });
    }

    onValueChanged(row: DynamicTableRow, column: DynamicTableColumn, event: any) {
        let value: any = event.value;
        value = column.options.find((opt) => opt.name === value);
        row.value[column.id] = value;
    }
}
