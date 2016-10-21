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

import { FormWidgetModel } from './form-widget.model';
import { FormModel } from './form.model';
import { FormFieldModel } from './form-field.model';
import { DynamicTableColumn } from './dynamic-table-column';
import { DynamicTableRow } from './dynamic-table-row';

export class DynamicTableModel extends FormWidgetModel {

    field: FormFieldModel;
    columns: DynamicTableColumn[] = [];
    visibleColumns: DynamicTableColumn[] = [];
    rows: DynamicTableRow[] = [];

    private _selectedRow: DynamicTableRow;

    get selectedRow(): DynamicTableRow {
        return this._selectedRow;
    }

    set selectedRow(value: DynamicTableRow) {
        if (this._selectedRow && this._selectedRow === value) {
            this._selectedRow.selected = false;
            this._selectedRow = null;
            return;
        }

        this.rows.forEach(row => row.selected = false);

        this._selectedRow = value;

        if (value) {
            this._selectedRow.selected = true;
        }
    }

    constructor(form: FormModel, json?: any) {
        super(form, json);

        if (json) {
            this.field = new FormFieldModel(form, json);

            if (json.columnDefinitions) {
                this.columns = json.columnDefinitions.map(obj => <DynamicTableColumn> obj);
                this.visibleColumns = this.columns.filter(col => col.visible);
            }

            if (json.value) {
                this.rows = json.value.map(obj => <DynamicTableRow> { selected: false, value: obj });
            }
        }
    }

    flushValue() {
        this.field.value = this.rows.map(r => r.value);
        this.field.updateForm();
    }

    moveRow(row: DynamicTableRow, offset: number) {
        let oldIndex = this.rows.indexOf(row);
        if (oldIndex > -1) {
            let newIndex = (oldIndex + offset);

            if (newIndex < 0) {
                newIndex = 0;
            } else if (newIndex >= this.rows.length) {
                newIndex = this.rows.length;
            }

            let arr = this.rows.slice();
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
            let idx = this.rows.indexOf(row);
            if (idx > -1) {
                this.rows.splice(idx, 1);
                this.flushValue();
            }
        }
    }

    getCellValue(row: DynamicTableRow, column: DynamicTableColumn): any {
        let result = row.value[column.id];

        if (column.type === 'Dropdown') {
            return result.name;
        }

        if (column.type === 'Boolean') {
            return result ? true : false;
        }

        if (column.type === 'Date') {
            if (result) {
                return moment(result.split('T')[0], 'YYYY-M-D').format('DD-MM-YYYY');
            }
        }

        return result || '';
    }
}
