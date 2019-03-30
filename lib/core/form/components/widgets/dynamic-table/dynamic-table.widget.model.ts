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

import moment from 'moment-es6';
import { ValidateDynamicTableRowEvent } from '../../../events/validate-dynamic-table-row.event';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { FormWidgetModel } from './../core/form-widget.model';
import { CellValidator } from './cell-validator.model';
import { DateCellValidator } from './date-cell-validator-model';
import { DynamicRowValidationSummary } from './dynamic-row-validation-summary.model';
import { DynamicTableColumn } from './dynamic-table-column.model';
import { DynamicTableRow } from './dynamic-table-row.model';
import { NumberCellValidator } from './number-cell-validator.model';
import { RequiredCellValidator } from './required-cell-validator.model';

export class DynamicTableModel extends FormWidgetModel {

    field: FormFieldModel;
    columns: DynamicTableColumn[] = [];
    visibleColumns: DynamicTableColumn[] = [];
    rows: DynamicTableRow[] = [];

    private _selectedRow: DynamicTableRow;
    private _validators: CellValidator[] = [];

    get selectedRow(): DynamicTableRow {
        return this._selectedRow;
    }

    set selectedRow(value: DynamicTableRow) {
        if (this._selectedRow && this._selectedRow === value) {
            this._selectedRow.selected = false;
            this._selectedRow = null;
            return;
        }

        this.rows.forEach((row) => row.selected = false);

        this._selectedRow = value;

        if (value) {
            this._selectedRow.selected = true;
        }
    }

    constructor(field: FormFieldModel, private formService: FormService) {
        super(field.form, field.json);
        this.field = field;

        if (field.json) {
            const columns = this.getColumns(field);
            if (columns) {
                this.columns = columns;
                this.visibleColumns = this.columns.filter((col) => col.visible);
            }

            if (field.json.value) {
                this.rows = field.json.value.map((obj) => <DynamicTableRow> {selected: false, value: obj});
            }
        }

        this._validators = [
            new RequiredCellValidator(),
            new DateCellValidator(),
            new NumberCellValidator()
        ];
    }

    private getColumns(field: FormFieldModel): DynamicTableColumn[] {
        if (field && field.json) {
            let definitions = field.json.columnDefinitions;
            if (!definitions && field.json.params && field.json.params.field) {
                definitions = field.json.params.field.columnDefinitions;
            }

            if (definitions) {
                return definitions.map((obj) => <DynamicTableColumn> obj);
            }
        }
        return null;
    }

    flushValue() {
        if (this.field) {
            this.field.value = this.rows.map((r) => r.value);
            this.field.updateForm();
        }
    }

    moveRow(row: DynamicTableRow, offset: number) {
        const oldIndex = this.rows.indexOf(row);
        if (oldIndex > -1) {
            let newIndex = (oldIndex + offset);

            if (newIndex < 0) {
                newIndex = 0;
            } else if (newIndex >= this.rows.length) {
                newIndex = this.rows.length;
            }

            const arr = this.rows.slice();
            arr.splice(oldIndex, 1);
            arr.splice(newIndex, 0, row);
            this.rows = arr;

            this.flushValue();
        }
    }

    deleteRow(row: DynamicTableRow) {
        if (row) {
            if (this.selectedRow === row) {
                this.selectedRow = null;
            }
            const idx = this.rows.indexOf(row);
            if (idx > -1) {
                this.rows.splice(idx, 1);
                this.flushValue();
            }
        }
    }

    addRow(row: DynamicTableRow) {
        if (row) {
            this.rows.push(row);
            // this.selectedRow = row;
        }
    }

    validateRow(row: DynamicTableRow): DynamicRowValidationSummary {
        const summary = new DynamicRowValidationSummary( {
            isValid: true,
            message: null
        });

        const event = new ValidateDynamicTableRowEvent(this.form, this.field, row, summary);
        this.formService.validateDynamicTableRow.next(event);

        if (event.defaultPrevented || !summary.isValid) {
            return summary;
        }

        if (row) {
            for (const col of this.columns) {
                for (const validator of this._validators) {
                    if (!validator.validate(row, col, summary)) {
                        return summary;
                    }
                }
            }
        }

        return summary;
    }

    getCellValue(row: DynamicTableRow, column: DynamicTableColumn): any {
        const rowValue = row.value[column.id];

        if (column.type === 'Dropdown') {
            if (rowValue) {
                return rowValue.name;
            }
        }

        if (column.type === 'Boolean') {
            return rowValue ? true : false;
        }

        if (column.type === 'Date') {
            if (rowValue) {
                return moment(rowValue.split('T')[0], 'YYYY-MM-DD').format('DD-MM-YYYY');
            }
        }

        return rowValue || '';
    }

    getDisplayText(column: DynamicTableColumn): string {
        let columnName = column.name;
        if (column.type === 'Amount') {
            const currency = column.amountCurrency || '$';
            columnName = `${column.name} (${currency})`;
        }
        return columnName;
    }
}
