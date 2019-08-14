"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:component-selector  */
var moment_es6_1 = require("moment-es6");
var validate_dynamic_table_row_event_1 = require("../../../events/validate-dynamic-table-row.event");
var form_widget_model_1 = require("./../core/form-widget.model");
var date_cell_validator_model_1 = require("./date-cell-validator-model");
var dynamic_row_validation_summary_model_1 = require("./dynamic-row-validation-summary.model");
var number_cell_validator_model_1 = require("./number-cell-validator.model");
var required_cell_validator_model_1 = require("./required-cell-validator.model");
var DynamicTableModel = /** @class */ (function (_super) {
    __extends(DynamicTableModel, _super);
    function DynamicTableModel(field, formService) {
        var _this = _super.call(this, field.form, field.json) || this;
        _this.formService = formService;
        _this.columns = [];
        _this.visibleColumns = [];
        _this.rows = [];
        _this._validators = [];
        _this.field = field;
        if (field.json) {
            var columns = _this.getColumns(field);
            if (columns) {
                _this.columns = columns;
                _this.visibleColumns = _this.columns.filter(function (col) { return col.visible; });
            }
            if (field.json.value) {
                _this.rows = field.json.value.map(function (obj) { return ({ selected: false, value: obj }); });
            }
        }
        _this._validators = [
            new required_cell_validator_model_1.RequiredCellValidator(),
            new date_cell_validator_model_1.DateCellValidator(),
            new number_cell_validator_model_1.NumberCellValidator()
        ];
        return _this;
    }
    Object.defineProperty(DynamicTableModel.prototype, "selectedRow", {
        get: function () {
            return this._selectedRow;
        },
        set: function (value) {
            if (this._selectedRow && this._selectedRow === value) {
                this._selectedRow.selected = false;
                this._selectedRow = null;
                return;
            }
            this.rows.forEach(function (row) { return row.selected = false; });
            this._selectedRow = value;
            if (value) {
                this._selectedRow.selected = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    DynamicTableModel.prototype.getColumns = function (field) {
        if (field && field.json) {
            var definitions = field.json.columnDefinitions;
            if (!definitions && field.json.params && field.json.params.field) {
                definitions = field.json.params.field.columnDefinitions;
            }
            if (definitions) {
                return definitions.map(function (obj) { return obj; });
            }
        }
        return null;
    };
    DynamicTableModel.prototype.flushValue = function () {
        if (this.field) {
            this.field.value = this.rows.map(function (r) { return r.value; });
            this.field.updateForm();
        }
    };
    DynamicTableModel.prototype.moveRow = function (row, offset) {
        var oldIndex = this.rows.indexOf(row);
        if (oldIndex > -1) {
            var newIndex = (oldIndex + offset);
            if (newIndex < 0) {
                newIndex = 0;
            }
            else if (newIndex >= this.rows.length) {
                newIndex = this.rows.length;
            }
            var arr = this.rows.slice();
            arr.splice(oldIndex, 1);
            arr.splice(newIndex, 0, row);
            this.rows = arr;
            this.flushValue();
        }
    };
    DynamicTableModel.prototype.deleteRow = function (row) {
        if (row) {
            if (this.selectedRow === row) {
                this.selectedRow = null;
            }
            var idx = this.rows.indexOf(row);
            if (idx > -1) {
                this.rows.splice(idx, 1);
                this.flushValue();
            }
        }
    };
    DynamicTableModel.prototype.addRow = function (row) {
        if (row) {
            this.rows.push(row);
            // this.selectedRow = row;
        }
    };
    DynamicTableModel.prototype.validateRow = function (row) {
        var summary = new dynamic_row_validation_summary_model_1.DynamicRowValidationSummary({
            isValid: true,
            message: null
        });
        var event = new validate_dynamic_table_row_event_1.ValidateDynamicTableRowEvent(this.form, this.field, row, summary);
        this.formService.validateDynamicTableRow.next(event);
        if (event.defaultPrevented || !summary.isValid) {
            return summary;
        }
        if (row) {
            for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, _c = this._validators; _b < _c.length; _b++) {
                    var validator = _c[_b];
                    if (!validator.validate(row, col, summary)) {
                        return summary;
                    }
                }
            }
        }
        return summary;
    };
    DynamicTableModel.prototype.getCellValue = function (row, column) {
        var rowValue = row.value[column.id];
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
                return moment_es6_1.default(rowValue.split('T')[0], 'YYYY-MM-DD').format('DD-MM-YYYY');
            }
        }
        return rowValue || '';
    };
    DynamicTableModel.prototype.getDisplayText = function (column) {
        var columnName = column.name;
        if (column.type === 'Amount') {
            var currency = column.amountCurrency || '$';
            columnName = column.name + " (" + currency + ")";
        }
        return columnName;
    };
    return DynamicTableModel;
}(form_widget_model_1.FormWidgetModel));
exports.DynamicTableModel = DynamicTableModel;
//# sourceMappingURL=dynamic-table.widget.model.js.map