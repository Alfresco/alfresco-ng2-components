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

import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { LogService } from 'ng2-alfresco-core';
import { WidgetComponent } from './../widget.component';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn } from './dynamic-table.widget.model';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { FormFieldModel } from '../core/form-field.model';

@Component({
    moduleId: module.id,
    selector: 'dynamic-table-widget',
    templateUrl: './dynamic-table.widget.html',
    styleUrls: ['./dynamic-table.widget.css']
})
export class DynamicTableWidget extends WidgetComponent implements OnInit {

    ERROR_MODEL_NOT_FOUND = 'Table model not found';

    @Input()
    field: FormFieldModel;

    @Input()
    readOnly: boolean = false;

    content: DynamicTableModel;

    editMode: boolean = false;
    editRow: DynamicTableRow = null;

    constructor(private elementRef: ElementRef,
                private visibilityService: WidgetVisibilityService,
                private logService: LogService) {
        super();
    }

    ngOnInit() {
        if (this.field) {
            this.content = new DynamicTableModel(this.field);
            this.visibilityService.refreshVisibility(this.field.form);
        }
    }

    isValid() {
        let result = true;

        if (this.content && this.content.field) {
            result = this.content.field.isValid;
        }

        return result;
    }

    onRowClicked(row: DynamicTableRow) {
        if (this.content) {
            this.content.selectedRow = row;
        }
    }

    hasSelection(): boolean {
        return !!(this.content && this.content.selectedRow);
    }

    moveSelectionUp(): boolean {
        if (this.content && !this.readOnly) {
            this.content.moveRow(this.content.selectedRow, -1);
            return true;
        }
        return false;
    }

    moveSelectionDown(): boolean {
        if (this.content && !this.readOnly) {
            this.content.moveRow(this.content.selectedRow, 1);
            return true;
        }
        return false;
    }

    deleteSelection(): boolean {
        if (this.content && !this.readOnly) {
            this.content.deleteRow(this.content.selectedRow);
            return true;
        }
        return false;
    }

    addNewRow(): boolean {
        if (this.content && !this.readOnly) {
            this.editRow = <DynamicTableRow> {
                isNew: true,
                selected: false,
                value: {}
            };
            this.editMode = true;
            return true;
        }
        return false;
    }

    editSelection(): boolean {
        if (this.content && !this.readOnly) {
            this.editRow = this.copyRow(this.content.selectedRow);
            this.editMode = true;
            return true;
        }
        return false;
    }

    getCellValue(row: DynamicTableRow, column: DynamicTableColumn): any {
        if (this.content) {
            let result = this.content.getCellValue(row, column);
            if (column.type === 'Amount') {
                return (column.amountCurrency || '$') + ' ' + (result || 0);
            }
            return result;
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
        } else {
            this.logService.error(this.ERROR_MODEL_NOT_FOUND);
        }
        this.editMode = false;
    }

    onCancelChanges() {
        this.editMode = false;
        this.editRow = null;
    }

    copyRow(row: DynamicTableRow): DynamicTableRow {
        return <DynamicTableRow> {
            value: this.copyObject(row.value)
        };
    }

    private copyObject(obj: any): any {
        let result = obj;

        if (typeof obj === 'object' && obj !== null && obj !== undefined) {
            result = Object.assign({}, obj);
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object') {
                    result[key] = this.copyObject(obj[key]);
                }
            });
        }

        return result;
    }
}
