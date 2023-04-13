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

import { Component, Input, OnInit } from '@angular/core';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';

@Component({
    selector: 'adf-amount-editor',
    templateUrl: './amount.editor.html',
    styleUrls: ['./amount.editor.scss']
})
export class AmountEditorComponent implements OnInit {

    @Input()
    table: DynamicTableModel;

    @Input()
    row: DynamicTableRow;

    @Input()
    column: DynamicTableColumn;

    displayName: string;

    ngOnInit() {
        this.displayName = this.table.getDisplayText(this.column);
    }

    onValueChanged(row: DynamicTableRow, column: DynamicTableColumn, event: any) {
        const value: number = Number(event.target.value);
        row.value[column.id] = value;
    }

}
