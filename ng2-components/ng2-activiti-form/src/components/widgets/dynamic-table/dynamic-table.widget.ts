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

import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { WidgetComponent } from './../widget.component';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn } from './../core/index';

@Component({
    moduleId: module.id,
    selector: 'dynamic-table-widget',
    templateUrl: './dynamic-table.widget.html',
    styleUrls: ['./dynamic-table.widget.css']
})
export class DynamicTableWidget extends WidgetComponent implements OnInit {

    @Input()
    content: DynamicTableModel;

    editMode: boolean;
    editRow: DynamicTableRow;

    constructor(private elementRef: ElementRef) {
        super();
    }

    ngOnInit() {
    }

    onRowClicked(row: DynamicTableRow) {
        if (this.content) {
            this.content.selectedRow = row;
        }
    }

    hasSelection(): boolean {
        return !!(this.content && this.content.selectedRow);
    }

    moveSelectionUp() {
        if (this.content) {
            this.content.moveRow(this.content.selectedRow, -1);
        }
    }

    moveSelectionDown() {
        if (this.content) {
            this.content.moveRow(this.content.selectedRow, 1);
        }
    }

    deleteSelection() {
        if (this.content) {
            this.content.deleteRow(this.content.selectedRow);
        }
    }

    addNewRow() {
        if (this.content) {
            this.editRow = <DynamicTableRow> {
                isNew: true,
                selected: false,
                value: {}
            };
            this.editMode = true;
        }
    }

    editSelection() {
        if (this.content) {
            this.editRow = this.copyRow(this.content.selectedRow);
            this.editMode = true;
        }
    }

    getCellValue(row: DynamicTableRow, column: DynamicTableColumn): any {
        if (this.content) {
            return this.content.getCellValue(row, column);
        }
        return null;
    }

    onSaveChanges() {
        if (this.content) {
            if (this.editRow.isNew) {
                let row = this.copyRow(this.editRow);
                this.content.selectedRow = null;
                this.content.addRow(row);
                this.editRow.isNew = false;
            } else {
                this.content.selectedRow.value = this.copyObject(this.editRow.value);
            }
            this.content.flushValue();
        }
        this.editMode = false;
    }

    onCancelChanges() {
        this.editMode = false;
        this.editRow = null;
    }

    private copyRow(row: DynamicTableRow): DynamicTableRow {
        return <DynamicTableRow> {
            value: this.copyObject(row.value)
        };
    }

    private copyObject(obj: any): any {
        let result = Object.assign({}, obj);

        if (typeof obj === 'object' && obj !== null && obj !== undefined) {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object') {
                    result[key] = this.copyObject(obj[key]);
                }
            });
        }

        return result;
    }
}
