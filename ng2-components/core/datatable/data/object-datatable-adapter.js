"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@adf/core");
var data_sorting_model_1 = require("./data-sorting.model");
// Simple implementation of the DataTableAdapter interface.
var ObjectDataTableAdapter = (function () {
    function ObjectDataTableAdapter(data, schema) {
        if (data === void 0) { data = []; }
        if (schema === void 0) { schema = []; }
        this._rows = [];
        this._columns = [];
        if (data && data.length > 0) {
            this._rows = data.map(function (item) {
                return new ObjectDataRow(item);
            });
        }
        if (schema && schema.length > 0) {
            this._columns = schema.map(function (item) {
                return new ObjectDataColumn(item);
            });
            // Sort by first sortable or just first column
            var sortable = this._columns.filter(function (c) { return c.sortable; });
            if (sortable.length > 0) {
                this.sort(sortable[0].key, 'asc');
            }
        }
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
        if (col.type === 'date') {
            try {
                return this.formatDate(col, value);
            }
            catch (err) {
                console.error("Error parsing date " + value + " to format " + col.format);
            }
        }
        if (col.type === 'icon') {
            var icon = row.getValue(col.key);
            return icon;
        }
        return value;
    };
    ObjectDataTableAdapter.prototype.formatDate = function (col, value) {
        if (col.type === 'date') {
            var format = col.format || 'medium';
            if (format === 'timeAgo') {
                var timeAgoPipe = new core_1.TimeAgoPipe();
                return timeAgoPipe.transform(value);
            }
            else {
                var datePipe = new common_1.DatePipe('en-US');
                return datePipe.transform(value, format);
            }
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
// Simple implementation of the DataRow interface.
var ObjectDataRow = (function () {
    function ObjectDataRow(obj, isSelected) {
        if (isSelected === void 0) { isSelected = false; }
        this.obj = obj;
        this.isSelected = isSelected;
        if (!obj) {
            throw new Error('Object source not found');
        }
    }
    ObjectDataRow.prototype.getValue = function (key) {
        return core_1.ObjectUtils.getValue(this.obj, key);
    };
    ObjectDataRow.prototype.hasValue = function (key) {
        return this.getValue(key) !== undefined;
    };
    return ObjectDataRow;
}());
exports.ObjectDataRow = ObjectDataRow;
// Simple implementation of the DataColumn interface.
var ObjectDataColumn = (function () {
    function ObjectDataColumn(obj) {
        this.key = obj.key;
        this.type = obj.type || 'text';
        this.format = obj.format;
        this.sortable = obj.sortable;
        this.title = obj.title;
        this.srTitle = obj.srTitle;
        this.cssClass = obj.cssClass;
        this.template = obj.template;
    }
    return ObjectDataColumn;
}());
exports.ObjectDataColumn = ObjectDataColumn;
