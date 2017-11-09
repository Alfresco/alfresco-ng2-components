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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var Rx_1 = require("rxjs/Rx");
var data_row_event_model_1 = require("../../data/data-row-event.model");
var data_sorting_model_1 = require("../../data/data-sorting.model");
var object_datatable_adapter_1 = require("../../data/object-datatable-adapter");
var data_cell_event_1 = require("./data-cell.event");
var data_row_action_event_1 = require("./data-row-action.event");
var DataTableComponent = (function () {
    function DataTableComponent(elementRef, differs) {
        var _this = this;
        this.elementRef = elementRef;
        this.rows = [];
        this.selectionMode = 'single'; // none|single|multiple
        this.multiselect = false;
        this.actions = false;
        this.actionsPosition = 'right'; // left|right
        this.contextMenu = false;
        this.allowDropFiles = false;
        this.rowStyleClass = '';
        this.showHeader = true;
        this.rowClick = new core_1.EventEmitter();
        this.rowDblClick = new core_1.EventEmitter();
        this.showRowContextMenu = new core_1.EventEmitter();
        this.showRowActionsMenu = new core_1.EventEmitter();
        this.executeRowAction = new core_1.EventEmitter();
        this.loading = false;
        this.noPermission = false;
        this.isSelectAllChecked = false;
        this.selection = new Array();
        this.schema = [];
        this.rowMenuCache = {};
        if (differs) {
            this.differ = differs.find([]).create(null);
        }
        this.click$ = new Rx_1.Observable(function (observer) { return _this.clickObserver = observer; }).share();
    }
    DataTableComponent.prototype.ngAfterContentInit = function () {
        this.setTableSchema();
    };
    DataTableComponent.prototype.ngOnChanges = function (changes) {
        this.initAndSubscribeClickStream();
        if (this.isPropertyChanged(changes['data'])) {
            if (this.isTableEmpty()) {
                this.initTable();
            }
            else {
                this.data = changes['data'].currentValue;
            }
            return;
        }
        if (this.isPropertyChanged(changes['rows'])) {
            if (this.isTableEmpty()) {
                this.initTable();
            }
            else {
                this.setTableRows(changes['rows'].currentValue);
            }
            return;
        }
        if (changes.selectionMode && !changes.selectionMode.isFirstChange()) {
            this.resetSelection();
            this.emitRowSelectionEvent('row-unselect', null);
        }
    };
    DataTableComponent.prototype.ngDoCheck = function () {
        var changes = this.differ.diff(this.rows);
        if (changes) {
            this.setTableRows(this.rows);
        }
    };
    DataTableComponent.prototype.isPropertyChanged = function (property) {
        return property && property.currentValue ? true : false;
    };
    DataTableComponent.prototype.convertToRowsData = function (rows) {
        return rows.map(function (row) { return new object_datatable_adapter_1.ObjectDataRow(row); });
    };
    DataTableComponent.prototype.initAndSubscribeClickStream = function () {
        var _this = this;
        this.unsubscribeClickStream();
        var singleClickStream = this.click$
            .buffer(this.click$.debounceTime(250))
            .map(function (list) { return list; })
            .filter(function (x) { return x.length === 1; });
        this.singleClickStreamSub = singleClickStream.subscribe(function (obj) {
            var event = obj[0];
            _this.rowClick.emit(event);
            if (!event.defaultPrevented) {
                _this.elementRef.nativeElement.dispatchEvent(new CustomEvent('row-click', {
                    detail: event,
                    bubbles: true
                }));
            }
        });
        var multiClickStream = this.click$
            .buffer(this.click$.debounceTime(250))
            .map(function (list) { return list; })
            .filter(function (x) { return x.length >= 2; });
        this.multiClickStreamSub = multiClickStream.subscribe(function (obj) {
            var event = obj[0];
            _this.rowDblClick.emit(event);
            if (!event.defaultPrevented) {
                _this.elementRef.nativeElement.dispatchEvent(new CustomEvent('row-dblclick', {
                    detail: event,
                    bubbles: true
                }));
            }
        });
    };
    DataTableComponent.prototype.unsubscribeClickStream = function () {
        if (this.singleClickStreamSub) {
            this.singleClickStreamSub.unsubscribe();
        }
        if (this.multiClickStreamSub) {
            this.multiClickStreamSub.unsubscribe();
        }
    };
    DataTableComponent.prototype.initTable = function () {
        this.data = new object_datatable_adapter_1.ObjectDataTableAdapter(this.rows, this.schema);
        this.rowMenuCache = {};
    };
    DataTableComponent.prototype.isTableEmpty = function () {
        return this.data === undefined || this.data === null;
    };
    DataTableComponent.prototype.setTableRows = function (rows) {
        if (this.data) {
            this.data.setRows(this.convertToRowsData(rows));
        }
    };
    DataTableComponent.prototype.setTableSchema = function () {
        if (this.columnList && this.columnList.columns) {
            this.schema = this.columnList.columns.map(function (c) { return c; });
        }
        if (this.data && this.schema && this.schema.length > 0) {
            this.data.setColumns(this.schema);
        }
    };
    DataTableComponent.prototype.onRowClick = function (row, e) {
        if (e) {
            e.preventDefault();
        }
        if (row) {
            if (this.data) {
                if (this.isSingleSelectionMode()) {
                    this.resetSelection();
                    this.selectRow(row, true);
                    this.emitRowSelectionEvent('row-select', row);
                }
                if (this.isMultiSelectionMode()) {
                    var modifier = e && (e.metaKey || e.ctrlKey);
                    var newValue = modifier ? !row.isSelected : true;
                    var domEventName = newValue ? 'row-select' : 'row-unselect';
                    if (!modifier) {
                        this.resetSelection();
                    }
                    this.selectRow(row, newValue);
                    this.emitRowSelectionEvent(domEventName, row);
                }
            }
            var dataRowEvent = new data_row_event_model_1.DataRowEvent(row, e, this);
            this.clickObserver.next(dataRowEvent);
        }
    };
    DataTableComponent.prototype.resetSelection = function () {
        if (this.data) {
            var rows = this.data.getRows();
            if (rows && rows.length > 0) {
                rows.forEach(function (r) { return r.isSelected = false; });
            }
            this.selection.splice(0);
        }
        this.isSelectAllChecked = false;
    };
    DataTableComponent.prototype.onRowDblClick = function (row, e) {
        if (e) {
            e.preventDefault();
        }
        var dataRowEvent = new data_row_event_model_1.DataRowEvent(row, e, this);
        this.clickObserver.next(dataRowEvent);
    };
    DataTableComponent.prototype.onRowKeyUp = function (row, e) {
        var event = new CustomEvent('row-keyup', {
            detail: {
                row: row,
                keyboardEvent: e,
                sender: this
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(event);
        if (event.defaultPrevented) {
            e.preventDefault();
        }
        else {
            if (e.key === 'Enter') {
                this.onKeyboardNavigate(row, e);
            }
        }
    };
    DataTableComponent.prototype.onKeyboardNavigate = function (row, e) {
        if (e) {
            e.preventDefault();
        }
        var event = new data_row_event_model_1.DataRowEvent(row, e, this);
        this.rowDblClick.emit(event);
        this.elementRef.nativeElement.dispatchEvent(new CustomEvent('row-dblclick', {
            detail: event,
            bubbles: true
        }));
    };
    DataTableComponent.prototype.onColumnHeaderClick = function (column) {
        if (column && column.sortable) {
            var current = this.data.getSorting();
            var newDirection = 'asc';
            if (current && column.key === current.key) {
                newDirection = current.direction === 'asc' ? 'desc' : 'asc';
            }
            this.data.setSorting(new data_sorting_model_1.DataSorting(column.key, newDirection));
        }
    };
    DataTableComponent.prototype.onSelectAllClick = function (e) {
        this.isSelectAllChecked = e.checked;
        if (this.multiselect) {
            var rows = this.data.getRows();
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    this.selectRow(rows[i], e.checked);
                }
            }
            var domEventName = e.checked ? 'row-select' : 'row-unselect';
            var row = this.selection.length > 0 ? this.selection[0] : null;
            this.emitRowSelectionEvent(domEventName, row);
        }
    };
    DataTableComponent.prototype.onCheckboxChange = function (row, event) {
        var newValue = event.checked;
        this.selectRow(row, newValue);
        var domEventName = newValue ? 'row-select' : 'row-unselect';
        this.emitRowSelectionEvent(domEventName, row);
    };
    DataTableComponent.prototype.onImageLoadingError = function (event) {
        if (event && this.fallbackThumbnail) {
            var element = event.target;
            element.src = this.fallbackThumbnail;
        }
    };
    DataTableComponent.prototype.isIconValue = function (row, col) {
        if (row && col) {
            var value = row.getValue(col.key);
            return value && value.startsWith('material-icons://');
        }
        return false;
    };
    DataTableComponent.prototype.asIconValue = function (row, col) {
        if (this.isIconValue(row, col)) {
            var value = row.getValue(col.key) || '';
            return value.replace('material-icons://', '');
        }
        return null;
    };
    DataTableComponent.prototype.iconAltTextKey = function (value) {
        return value ? 'ICONS.' + value.substring(value.lastIndexOf('/') + 1).replace(/\.[a-z]+/, '') : '';
    };
    DataTableComponent.prototype.isColumnSorted = function (col, direction) {
        if (col && direction) {
            var sorting = this.data.getSorting();
            return sorting && sorting.key === col.key && sorting.direction === direction;
        }
        return false;
    };
    DataTableComponent.prototype.getContextMenuActions = function (row, col) {
        var event = new data_cell_event_1.DataCellEvent(row, col, []);
        this.showRowContextMenu.emit(event);
        return event.value.actions;
    };
    DataTableComponent.prototype.getRowActions = function (row, col) {
        var id = row.getValue('id');
        if (!this.rowMenuCache[id]) {
            var event_1 = new data_cell_event_1.DataCellEvent(row, col, []);
            this.showRowActionsMenu.emit(event_1);
            this.rowMenuCache[id] = event_1.value.actions;
        }
        return this.rowMenuCache[id];
    };
    DataTableComponent.prototype.onExecuteRowAction = function (row, action) {
        if (action.disabled || action.disabled) {
            event.stopPropagation();
        }
        else {
            this.executeRowAction.emit(new data_row_action_event_1.DataRowActionEvent(row, action));
        }
    };
    DataTableComponent.prototype.rowAllowsDrop = function (row) {
        return row.isDropTarget === true;
    };
    DataTableComponent.prototype.hasSelectionMode = function () {
        return this.isSingleSelectionMode() || this.isMultiSelectionMode();
    };
    DataTableComponent.prototype.isSingleSelectionMode = function () {
        return this.selectionMode && this.selectionMode.toLowerCase() === 'single';
    };
    DataTableComponent.prototype.isMultiSelectionMode = function () {
        return this.selectionMode && this.selectionMode.toLowerCase() === 'multiple';
    };
    DataTableComponent.prototype.getRowStyle = function (row) {
        row.cssClass = row.cssClass ? row.cssClass : '';
        this.rowStyleClass = this.rowStyleClass ? this.rowStyleClass : '';
        return row.cssClass + " " + this.rowStyleClass;
    };
    DataTableComponent.prototype.selectRow = function (row, value) {
        if (row) {
            row.isSelected = value;
            var idx = this.selection.indexOf(row);
            if (value) {
                if (idx < 0) {
                    this.selection.push(row);
                }
            }
            else {
                if (idx > -1) {
                    this.selection.splice(idx, 1);
                }
            }
        }
    };
    DataTableComponent.prototype.getCellTooltip = function (row, col) {
        if (row && col && col.formatTooltip) {
            var result = col.formatTooltip(row, col);
            if (result) {
                return result;
            }
        }
        return null;
    };
    DataTableComponent.prototype.emitRowSelectionEvent = function (name, row) {
        var domEvent = new CustomEvent(name, {
            detail: {
                row: row,
                selection: this.selection
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    };
    __decorate([
        core_1.ContentChild(ng2_alfresco_core_1.DataColumnListComponent)
    ], DataTableComponent.prototype, "columnList", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "data", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "rows", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "selectionMode", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "multiselect", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "actions", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "actionsPosition", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "fallbackThumbnail", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "contextMenu", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "allowDropFiles", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "rowStyle", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "rowStyleClass", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "showHeader", void 0);
    __decorate([
        core_1.Output()
    ], DataTableComponent.prototype, "rowClick", void 0);
    __decorate([
        core_1.Output()
    ], DataTableComponent.prototype, "rowDblClick", void 0);
    __decorate([
        core_1.Output()
    ], DataTableComponent.prototype, "showRowContextMenu", void 0);
    __decorate([
        core_1.Output()
    ], DataTableComponent.prototype, "showRowActionsMenu", void 0);
    __decorate([
        core_1.Output()
    ], DataTableComponent.prototype, "executeRowAction", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input()
    ], DataTableComponent.prototype, "noPermission", void 0);
    DataTableComponent = __decorate([
        core_1.Component({
            selector: 'adf-datatable',
            styleUrls: ['./datatable.component.scss'],
            templateUrl: './datatable.component.html',
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DataTableComponent);
    return DataTableComponent;
}());
exports.DataTableComponent = DataTableComponent;
