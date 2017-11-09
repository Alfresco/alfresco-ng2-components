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
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var share_data_row_model_1 = require("./share-data-row.model");
var ShareDataTableAdapter = (function () {
    function ShareDataTableAdapter(documentListService, schema, sorting) {
        if (schema === void 0) { schema = []; }
        this.documentListService = documentListService;
        this.ERR_ROW_NOT_FOUND = 'Row not found';
        this.ERR_COL_NOT_FOUND = 'Column not found';
        this.thumbnails = false;
        this.rows = [];
        this.columns = schema || [];
        this.sorting = sorting;
    }
    ShareDataTableAdapter.prototype.getRows = function () {
        return this.rows;
    };
    // TODO: disable this api
    ShareDataTableAdapter.prototype.setRows = function (rows) {
        this.rows = rows || [];
        this.sort();
    };
    ShareDataTableAdapter.prototype.getColumns = function () {
        return this.columns;
    };
    ShareDataTableAdapter.prototype.setColumns = function (columns) {
        this.columns = columns || [];
    };
    ShareDataTableAdapter.prototype.getValue = function (row, col) {
        if (!row) {
            throw new Error(this.ERR_ROW_NOT_FOUND);
        }
        if (!col) {
            throw new Error(this.ERR_COL_NOT_FOUND);
        }
        var dataRow = row;
        var value = row.getValue(col.key);
        if (dataRow.cache[col.key] !== undefined) {
            return dataRow.cache[col.key];
        }
        if (col.type === 'date') {
            try {
                var result = this.formatDate(col, value);
                return dataRow.cacheValue(col.key, result);
            }
            catch (err) {
                console.error("Error parsing date " + value + " to format " + col.format);
                return 'Error';
            }
        }
        if (col.key === '$thumbnail') {
            if (this.imageResolver) {
                var resolved = this.imageResolver(row, col);
                if (resolved) {
                    return resolved;
                }
            }
            var node = row.node;
            if (node.entry.isFolder) {
                return this.documentListService.getMimeTypeIcon('folder');
            }
            if (node.entry.isFile) {
                if (this.thumbnails) {
                    return this.documentListService.getDocumentThumbnailUrl(node);
                }
            }
            if (node.entry.content) {
                var mimeType = node.entry.content.mimeType;
                if (mimeType) {
                    return this.documentListService.getMimeTypeIcon(mimeType);
                }
            }
            return this.documentListService.getDefaultMimeTypeIcon();
        }
        if (col.type === 'image') {
            if (this.imageResolver) {
                var resolved = this.imageResolver(row, col);
                if (resolved) {
                    return resolved;
                }
            }
        }
        return dataRow.cacheValue(col.key, value);
    };
    ShareDataTableAdapter.prototype.formatDate = function (col, value) {
        if (col.type === 'date') {
            var format = col.format || 'medium';
            if (format === 'timeAgo') {
                var timeAgoPipe = new ng2_alfresco_core_1.TimeAgoPipe();
                return timeAgoPipe.transform(value);
            }
            else {
                var datePipe = new common_1.DatePipe('en-US');
                return datePipe.transform(value, format);
            }
        }
        return value;
    };
    ShareDataTableAdapter.prototype.getSorting = function () {
        return this.sorting;
    };
    ShareDataTableAdapter.prototype.setSorting = function (sorting) {
        this.sorting = sorting;
        this.sortRows(this.rows, this.sorting);
    };
    ShareDataTableAdapter.prototype.sort = function (key, direction) {
        var sorting = this.sorting || new ng2_alfresco_datatable_1.DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
        }
        this.setSorting(sorting);
    };
    ShareDataTableAdapter.prototype.setFilter = function (filter) {
        this.filter = filter;
    };
    ShareDataTableAdapter.prototype.setImageResolver = function (resolver) {
        this.imageResolver = resolver;
    };
    ShareDataTableAdapter.prototype.sortRows = function (rows, sorting) {
        var options = {};
        if (sorting && sorting.key && rows && rows.length > 0) {
            if (sorting.key.includes('sizeInBytes') || sorting.key === 'name') {
                options.numeric = true;
            }
            rows.sort(function (a, b) {
                if (a.node.entry.isFolder !== b.node.entry.isFolder) {
                    return a.node.entry.isFolder ? -1 : 1;
                }
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
                    ? left.localeCompare(right, undefined, options)
                    : right.localeCompare(left, undefined, options);
            });
        }
    };
    ShareDataTableAdapter.prototype.loadPage = function (page, merge) {
        var _this = this;
        if (merge === void 0) { merge = false; }
        this.page = page;
        var rows = [];
        if (page && page.list) {
            var data = page.list.entries;
            if (data && data.length > 0) {
                rows = data.map(function (item) { return new share_data_row_model_1.ShareDataRow(item, _this.documentListService, _this.permissionsStyle); });
                if (this.filter) {
                    rows = rows.filter(this.filter);
                }
                // Sort by first sortable or just first column
                if (this.columns && this.columns.length > 0) {
                    var sorting = this.getSorting();
                    if (sorting) {
                        this.sortRows(rows, sorting);
                    }
                    else {
                        var sortable = this.columns.filter(function (c) { return c.sortable; });
                        if (sortable.length > 0) {
                            this.sort(sortable[0].key, 'asc');
                        }
                        else {
                            this.sort(this.columns[0].key, 'asc');
                        }
                    }
                }
            }
        }
        if (merge) {
            this.rows = this.rows.concat(rows);
        }
        else {
            this.rows = rows;
        }
    };
    return ShareDataTableAdapter;
}());
exports.ShareDataTableAdapter = ShareDataTableAdapter;
