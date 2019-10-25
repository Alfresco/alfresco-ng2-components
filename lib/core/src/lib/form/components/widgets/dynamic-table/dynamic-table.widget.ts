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

import { LogService } from '../../../../services/log.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { FormService } from './../../../services/form.service';
import { baseHost, WidgetComponent } from './../widget.component';
import { DynamicTableColumn } from './dynamic-table-column.model';
import { DynamicTableRow } from './dynamic-table-row.model';
import { DynamicTableModel } from './dynamic-table.widget.model';

@Component({
    selector: 'dynamic-table-widget',
    templateUrl: './dynamic-table.widget.html',
    styleUrls: ['./dynamic-table.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class DynamicTableWidgetComponent extends WidgetComponent implements OnInit {

    ERROR_MODEL_NOT_FOUND = 'Table model not found';

    content: DynamicTableModel;

    editMode: boolean = false;
    editRow: DynamicTableRow = null;

    private selectArrayCode = [32, 0, 13];

    constructor(public formService: FormService,
                public elementRef: ElementRef,
                private visibilityService: WidgetVisibilityService,
                private logService: LogService,
                private cd: ChangeDetectorRef) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            this.content = new DynamicTableModel(this.field, this.formService);
            this.visibilityService.refreshVisibility(this.field.form);
        }
    }

    forceFocusOnAddButton() {
        if (this.content) {
            this.cd.detectChanges();
            const buttonAddRow = <HTMLButtonElement> this.elementRef.nativeElement.querySelector('#' + this.content.id + '-add-row');
            if (this.isDynamicTableReady(buttonAddRow)) {
                buttonAddRow.focus();
            }
        }
    }

    private isDynamicTableReady(buttonAddRow) {
        return this.field && !this.editMode && buttonAddRow;
    }

    isValid() {
        let valid = true;

        if (this.content && this.content.field) {
            valid = this.content.field.isValid;
        }

        return valid;
    }

    onRowClicked(row: DynamicTableRow) {
        if (this.content) {
            this.content.selectedRow = row;
        }
    }

    onKeyPressed($event: KeyboardEvent, row: DynamicTableRow) {
        if (this.content && this.isEnterOrSpacePressed($event.keyCode)) {
            this.content.selectedRow = row;
        }
    }

    private isEnterOrSpacePressed(keyCode) {
        return this.selectArrayCode.indexOf(keyCode) !== -1;
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
            const cellValue = this.content.getCellValue(row, column);
            if (column.type === 'Amount') {
                return (column.amountCurrency || '$') + ' ' + (cellValue || 0);
            }
            return cellValue;
        }
        return null;
    }

    onSaveChanges() {
        if (this.content) {
            if (this.editRow.isNew) {
                const row = this.copyRow(this.editRow);
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
        this.forceFocusOnAddButton();
    }

    onCancelChanges() {
        this.editMode = false;
        this.editRow = null;
        this.forceFocusOnAddButton();
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
            Object.keys(obj).forEach((key) => {
                if (typeof obj[key] === 'object') {
                    result[key] = this.copyObject(obj[key]);
                }
            });
        }

        return result;
    }
}
