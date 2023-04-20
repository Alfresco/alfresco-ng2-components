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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicRowValidationSummary } from '../models/dynamic-row-validation-summary.model';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';

@Component({
    selector: 'row-editor',
    templateUrl: './row.editor.html',
    styleUrls: ['./row.editor.css']
})
export class RowEditorComponent {

    @Input()
    table: DynamicTableModel;

    @Input()
    row: DynamicTableRow;

    @Input()
    column: DynamicTableColumn;

    @Output()
    save: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    cancel: EventEmitter<any> = new EventEmitter<any>();

    validationSummary: DynamicRowValidationSummary;

    constructor() {
        this.validationSummary = new DynamicRowValidationSummary({ isValid: true, message: '' });
    }

    onCancelChanges() {
        this.cancel.emit({
            table: this.table,
            row: this.row,
            column: this.column
        });
    }

    onSaveChanges() {
        this.validate();
        if (this.isValid()) {
            this.save.emit({
                table: this.table,
                row: this.row,
                column: this.column
            });
        }
    }

    private isValid(): boolean {
        return this.validationSummary && this.validationSummary.isValid;
    }

    private validate() {
        this.validationSummary = this.table.validateRow(this.row);
    }

}
