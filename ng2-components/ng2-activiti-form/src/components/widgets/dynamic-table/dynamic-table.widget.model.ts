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

import { FormWidgetModel } from './../core/form-widget.model';
import { FormModel } from './../core/form.model';
import { FormFieldModel } from './../core/form-field.model';

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

        this._validators = [
            new RequiredCellValidator(),
            new DateCellValidator(),
            new NumberCellValidator()
        ];
    }

    flushValue() {
        if (this.field) {
            this.field.value = this.rows.map(r => r.value);
            this.field.updateForm();
        }
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

    addRow(row: DynamicTableRow) {
        if (row) {
            this.rows.push(row);
            // this.selectedRow = row;
        }
    }

    validateRow(row: DynamicTableRow): DynamicRowValidationSummary {
        let summary = <DynamicRowValidationSummary> {
            isValid: true,
            text: null
        };

        if (row) {
            for (let col of this.columns) {
                for (let validator of this._validators) {
                    if (!validator.validate(row, col, summary)) {
                        return summary;
                    }
                }
            }
        }

        return summary;
    }

    getCellValue(row: DynamicTableRow, column: DynamicTableColumn): any {
        let result = row.value[column.id];

        if (column.type === 'Dropdown') {
            if (result) {
                return result.name;
            }
        }

        if (column.type === 'Boolean') {
            return result ? true : false;
        }

        if (column.type === 'Date') {
            if (result) {
                return moment(result.split('T')[0], 'YYYY-MM-DD').format('DD-MM-YYYY');
            }
        }

        return result || '';
    }

    getDisplayText(column: DynamicTableColumn): string {
        let result = column.name;
        if (column.type === 'Amount') {
            let currency = column.amountCurrency || '$';
            result = `${column.name} (${currency})`;
        }
        return result;
    }
}

export interface DynamicRowValidationSummary {

    isValid: boolean;
    text: string;

}

export interface CellValidator {

    isSupported(column: DynamicTableColumn): boolean;
    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean;

}

export class RequiredCellValidator implements CellValidator {

    private supportedTypes: string[] = [
        'String',
        'Number',
        'Amount',
        'Date',
        'Dropdown'
    ];

    isSupported(column: DynamicTableColumn): boolean {
        return column && column.required && this.supportedTypes.indexOf(column.type) > -1;
    }

    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean {
        if (this.isSupported(column)) {
            let value = row.value[column.id];
            if (column.required) {
                if (value === null || value === undefined || value === '') {
                    if (summary) {
                        summary.isValid = false;
                        summary.text = `Field '${column.name}' is required.`;
                    }
                    return false;
                }
            }
        }

        return true;
    }
}

export class DateCellValidator implements CellValidator {

    private supportedTypes: string[] = [
        'Date'
    ];

    isSupported(column: DynamicTableColumn): boolean {
        return column && column.editable && this.supportedTypes.indexOf(column.type) > -1;
    }

    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean {

        if (this.isSupported(column)) {
            let value = row.value[column.id];
            let dateValue = moment(value, 'D-M-YYYY');
            if (!dateValue.isValid()) {
                if (summary) {
                    summary.isValid = false;
                    summary.text = `Invalid '${column.name}' format.`;
                }
                return false;
            }
        }

        return true;
    }
}

export class NumberCellValidator implements CellValidator {

    private supportedTypes: string[] = [
        'Number',
        'Amount'
    ];

    isSupported(column: DynamicTableColumn): boolean {
        return column && column.required && this.supportedTypes.indexOf(column.type) > -1;
    }

    isNumber(value: any): boolean {
        if (value === null || value === undefined || value === '') {
            return false;
        }

        return !isNaN(+value);
    }

    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean {

        if (this.isSupported(column)) {
            let value = row.value[column.id];
            if (value === null ||
                value === undefined ||
                value === '' ||
                this.isNumber(value)) {
                return true;
            }

            if (summary) {
                summary.isValid = false;
                summary.text = `Field '${column.name}' must be a number.`;
            }
            return false;
        }
        return true;
    }
}

// maps to: com.activiti.model.editor.form.ColumnDefinitionRepresentation
export interface DynamicTableColumn {

    id: string;
    name: string;
    type: string;
    value: any;
    optionType: string;
    options: DynamicTableColumnOption[];
    restResponsePath: string;
    restUrl: string;
    restIdProperty: string;
    restLabelProperty: string;
    amountCurrency: string;
    amountEnableFractions: boolean;
    required: boolean;
    editable: boolean;
    sortable: boolean;
    visible: boolean;

    // TODO: com.activiti.domain.idm.EndpointConfiguration.EndpointConfigurationRepresentation
    endpoint: any;
    // TODO: com.activiti.model.editor.form.RequestHeaderRepresentation
    requestHeaders: any;
}

// maps to: com.activiti.model.editor.form.OptionRepresentation
export interface DynamicTableColumnOption {
    id: string;
    name: string;
}

export interface DynamicTableRow {
    isNew: boolean;
    selected: boolean;
    value: any;
}
