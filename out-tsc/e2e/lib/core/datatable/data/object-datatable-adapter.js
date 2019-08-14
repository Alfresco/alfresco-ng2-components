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
Object.defineProperty(exports, "__esModule", { value: true });
var object_datarow_model_1 = require("./object-datarow.model");
var object_datacolumn_model_1 = require("./object-datacolumn.model");
var data_sorting_model_1 = require("./data-sorting.model");
var rxjs_1 = require("rxjs");
// Simple implementation of the DataTableAdapter interface.
var ObjectDataTableAdapter = /** @class */ (function () {
    function ObjectDataTableAdapter(data, schema) {
        if (data === void 0) { data = []; }
        if (schema === void 0) { schema = []; }
        this._rows = [];
        this._columns = [];
        if (data && data.length > 0) {
            this._rows = data.map(function (item) {
                return new object_datarow_model_1.ObjectDataRow(item);
            });
        }
        if (schema && schema.length > 0) {
            this._columns = schema.map(function (item) {
                return new object_datacolumn_model_1.ObjectDataColumn(item);
            });
            // Sort by first sortable or just first column
            var sortable = this._columns.filter(function (column) { return column.sortable; });
            if (sortable.length > 0) {
                this.sort(sortable[0].key, 'asc');
            }
        }
        this.rowsChanged = new rxjs_1.Subject();
    }
    ObjectDataTableAdapter.generateSchema = function (data) {
        var schema = [];
        if (data && data.length) {
            var rowToExaminate = data[0];
            if (typeof rowToExaminate === 'object') {
                for (var key in rowToExaminate) {
                    if (rowToExaminate.hasOwnProperty(key)) {
                        schema.push({
                            type: 'text',
                            key: key,
                            title: key,
                            sortable: false
                        });
                    }
                }
            }
        }
        return schema;
    };
    ObjectDataTableAdapter.prototype.getRows = function () {
        return this._rows;
    };
    ObjectDataTableAdapter.prototype.setRows = function (rows) {
        this._rows = rows || [];
        this.sort();
        this.rowsChanged.next(this._rows);
    };
    ObjectDataTableAdapter.prototype.getColumns = function () {
        return this._columns;
    };
    ObjectDataTableAdapter.prototype.setColumns = function (columns) {
        this._columns = columns || [];
    };
    ObjectDataTableAdapter.prototype.getValue = function (row, col) {
        if (!row) {
            throw new Error('Row not found');
        }
        if (!col) {
            throw new Error('Column not found');
        }
        var value = row.getValue(col.key);
        if (col.type === 'icon') {
            var icon = row.getValue(col.key);
            return icon;
        }
        return value;
    };
    ObjectDataTableAdapter.prototype.getSorting = function () {
        return this._sorting;
    };
    ObjectDataTableAdapter.prototype.setSorting = function (sorting) {
        this._sorting = sorting;
        if (sorting && sorting.key) {
            this._rows.sort(function (a, b) {
                var left = a.getValue(sorting.key);
                if (left) {
                    left = (left instanceof Date) ? left.valueOf().toString() : left.toString();
                }
                else {
                    left = '';
                }
                var right = b.getValue(sorting.key);
                if (right) {
                    right = (right instanceof Date) ? right.valueOf().toString() : right.toString();
                }
                else {
                    right = '';
                }
                return sorting.direction === 'asc'
                    ? left.localeCompare(right)
                    : right.localeCompare(left);
            });
        }
    };
    ObjectDataTableAdapter.prototype.sort = function (key, direction) {
        var sorting = this._sorting || new data_sorting_model_1.DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
        }
        this.setSorting(sorting);
    };
    return ObjectDataTableAdapter;
}());
exports.ObjectDataTableAdapter = ObjectDataTableAdapter;
//# sourceMappingURL=object-datatable-adapter.js.map