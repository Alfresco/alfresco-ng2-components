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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var data_column_list_component_1 = require("../../../data-column/data-column-list.component");
var data_row_event_model_1 = require("../../data/data-row-event.model");
var data_sorting_model_1 = require("../../data/data-sorting.model");
var object_datarow_model_1 = require("../../data/object-datarow.model");
var object_datatable_adapter_1 = require("../../data/object-datatable-adapter");
var data_cell_event_1 = require("./data-cell.event");
var data_row_action_event_1 = require("./data-row-action.event");
var operators_1 = require("rxjs/operators");
var DisplayMode;
(function (DisplayMode) {
    DisplayMode["List"] = "list";
    DisplayMode["Gallery"] = "gallery";
})(DisplayMode = exports.DisplayMode || (exports.DisplayMode = {}));
var DataTableComponent = /** @class */ (function () {
    function DataTableComponent(elementRef, differs) {
        var _this = this;
        this.elementRef = elementRef;
        /** Selects the display mode of the table. Can be "list" or "gallery". */
        this.display = DisplayMode.List;
        /** The rows that the datatable will show. */
        this.rows = [];
        /** Define the sort order of the datatable. Possible values are :
         * [`created`, `desc`], [`created`, `asc`], [`due`, `desc`], [`due`, `asc`]
         */
        this.sorting = [];
        /** The columns that the datatable will show. */
        this.columns = [];
        /** Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
         * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.
         */
        this.selectionMode = 'single'; // none|single|multiple
        /** Toggles multiple row selection, which renders checkboxes at the beginning of each row. */
        this.multiselect = false;
        /** Toggles the data actions column. */
        this.actions = false;
        /** Position of the actions dropdown menu. Can be "left" or "right". */
        this.actionsPosition = 'right'; // left|right
        /** Toggles custom context menu for the component. */
        this.contextMenu = false;
        /** Toggles file drop support for rows (see
         * [Upload directive](upload.directive.md) for further details).
         */
        this.allowDropFiles = false;
        /** The CSS class to apply to every row. */
        this.rowStyleClass = '';
        /** Toggles the header. */
        this.showHeader = true;
        /** Toggles the sticky header mode. */
        this.stickyHeader = false;
        /** Emitted when the user clicks a row. */
        this.rowClick = new core_1.EventEmitter();
        /** Emitted when the user double-clicks a row. */
        this.rowDblClick = new core_1.EventEmitter();
        /** Emitted before the context menu is displayed for a row. */
        this.showRowContextMenu = new core_1.EventEmitter();
        /** Emitted before the actions menu is displayed for a row. */
        this.showRowActionsMenu = new core_1.EventEmitter();
        /** Emitted when the user executes a row action. */
        this.executeRowAction = new core_1.EventEmitter();
        /** Flag that indicates if the datatable is in loading state and needs to show the
         * loading template (see the docs to learn how to configure a loading template).
         */
        this.loading = false;
        /** Flag that indicates if the datatable should show the "no permission" template. */
        this.noPermission = false;
        /**
         * Should the items for the row actions menu be cached for reuse after they are loaded
         * the first time?
         */
        this.rowMenuCacheEnabled = true;
        this.isSelectAllChecked = false;
        this.selection = new Array();
        /** This array of fake rows fix the flex layout for the gallery view */
        this.fakeRows = [];
        this.rowMenuCache = {};
        this.subscriptions = [];
        if (differs) {
            this.differ = differs.find([]).create(null);
        }
        this.click$ = new rxjs_1.Observable(function (observer) { return _this.clickObserver = observer; })
            .pipe(operators_1.share());
    }
    DataTableComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this.columnList) {
            this.subscriptions.push(this.columnList.columns.changes.subscribe(function () {
                _this.setTableSchema();
            }));
        }
        this.datatableLayoutFix();
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
                this.resetSelection();
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
        if (this.isPropertyChanged(changes['sorting'])) {
            this.setTableSorting(changes['sorting'].currentValue);
        }
        if (this.isPropertyChanged(changes['display'])) {
            this.datatableLayoutFix();
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
        return rows.map(function (row) { return new object_datarow_model_1.ObjectDataRow(row, row.isSelected); });
    };
    DataTableComponent.prototype.convertToDataSorting = function (sorting) {
        if (sorting && sorting.length > 0) {
            return new data_sorting_model_1.DataSorting(sorting[0], sorting[1]);
        }
    };
    DataTableComponent.prototype.initAndSubscribeClickStream = function () {
        var _this = this;
        this.unsubscribeClickStream();
        var singleClickStream = this.click$
            .pipe(operators_1.buffer(this.click$.pipe(operators_1.debounceTime(250))), operators_1.map(function (list) { return list; }), operators_1.filter(function (x) { return x.length === 1; }));
        this.singleClickStreamSub = singleClickStream.subscribe(function (dataRowEvents) {
            var event = dataRowEvents[0];
            _this.handleRowSelection(event.value, event.event);
            _this.rowClick.emit(event);
            if (!event.defaultPrevented) {
                _this.elementRef.nativeElement.dispatchEvent(new CustomEvent('row-click', {
                    detail: event,
                    bubbles: true
                }));
            }
        });
        var multiClickStream = this.click$
            .pipe(operators_1.buffer(this.click$.pipe(operators_1.debounceTime(250))), operators_1.map(function (list) { return list; }), operators_1.filter(function (x) { return x.length >= 2; }));
        this.multiClickStreamSub = multiClickStream.subscribe(function (dataRowEvents) {
            var event = dataRowEvents[0];
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
            this.singleClickStreamSub = null;
        }
        if (this.multiClickStreamSub) {
            this.multiClickStreamSub.unsubscribe();
            this.multiClickStreamSub = null;
        }
    };
    DataTableComponent.prototype.initTable = function () {
        this.data = new object_datatable_adapter_1.ObjectDataTableAdapter(this.rows, this.columns);
        this.setTableSorting(this.sorting);
        this.resetSelection();
        this.rowMenuCache = {};
    };
    DataTableComponent.prototype.isTableEmpty = function () {
        return this.data === undefined || this.data === null;
    };
    DataTableComponent.prototype.setTableRows = function (rows) {
        if (this.data) {
            this.resetSelection();
            this.data.setRows(this.convertToRowsData(rows));
        }
    };
    DataTableComponent.prototype.setTableSchema = function () {
        var schema = [];
        if (!this.columns || this.columns.length === 0) {
            schema = this.getSchemaFromHtml();
        }
        else {
            schema = this.columns.concat(this.getSchemaFromHtml());
        }
        this.columns = schema;
        if (this.data && this.columns && this.columns.length > 0) {
            this.data.setColumns(this.columns);
        }
    };
    DataTableComponent.prototype.setTableSorting = function (sorting) {
        if (this.data) {
            this.data.setSorting(this.convertToDataSorting(sorting));
        }
    };
    DataTableComponent.prototype.getSchemaFromHtml = function () {
        var schema = [];
        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(function (c) { return c; });
        }
        return schema;
    };
    DataTableComponent.prototype.onRowClick = function (row, mouseEvent) {
        if (mouseEvent) {
            mouseEvent.preventDefault();
        }
        if (row) {
            var dataRowEvent = new data_row_event_model_1.DataRowEvent(row, mouseEvent, this);
            this.clickObserver.next(dataRowEvent);
        }
    };
    DataTableComponent.prototype.onEnterKeyPressed = function (row, e) {
        if (row) {
            this.handleRowSelection(row, e);
        }
    };
    DataTableComponent.prototype.handleRowSelection = function (row, e) {
        if (this.data) {
            if (this.isSingleSelectionMode()) {
                this.resetSelection();
                this.selectRow(row, true);
                this.emitRowSelectionEvent('row-select', row);
            }
            if (this.isMultiSelectionMode()) {
                var modifier = e && (e.metaKey || e.ctrlKey);
                var newValue = void 0;
                if (this.selection.length === 1) {
                    newValue = !row.isSelected;
                }
                else {
                    newValue = modifier ? !row.isSelected : true;
                }
                var domEventName = newValue ? 'row-select' : 'row-unselect';
                if (!modifier) {
                    this.resetSelection();
                }
                this.selectRow(row, newValue);
                this.emitRowSelectionEvent(domEventName, row);
            }
        }
    };
    DataTableComponent.prototype.resetSelection = function () {
        if (this.data) {
            var rows = this.data.getRows();
            if (rows && rows.length > 0) {
                rows.forEach(function (r) { return r.isSelected = false; });
            }
            this.selection = [];
        }
        this.isSelectAllChecked = false;
    };
    DataTableComponent.prototype.onRowDblClick = function (row, event) {
        if (event) {
            event.preventDefault();
        }
        var dataRowEvent = new data_row_event_model_1.DataRowEvent(row, event, this);
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
    DataTableComponent.prototype.onKeyboardNavigate = function (row, keyboardEvent) {
        if (keyboardEvent) {
            keyboardEvent.preventDefault();
        }
        var event = new data_row_event_model_1.DataRowEvent(row, keyboardEvent, this);
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
            this.emitSortingChangedEvent(column.key, newDirection);
        }
    };
    DataTableComponent.prototype.onSelectAllClick = function (matCheckboxChange) {
        this.isSelectAllChecked = matCheckboxChange.checked;
        if (this.multiselect) {
            var rows = this.data.getRows();
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    this.selectRow(rows[i], matCheckboxChange.checked);
                }
            }
            var domEventName = matCheckboxChange.checked ? 'row-select' : 'row-unselect';
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
    DataTableComponent.prototype.onImageLoadingError = function (event, row) {
        if (event) {
            var element = event.target;
            if (this.fallbackThumbnail) {
                element.src = this.fallbackThumbnail;
            }
            else {
                element.src = row.imageErrorResolver(event);
            }
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
            if (!this.rowMenuCacheEnabled) {
                return event_1.value.actions;
            }
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
    DataTableComponent.prototype.getSortingKey = function () {
        if (this.data.getSorting()) {
            return this.data.getSorting().key;
        }
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
    DataTableComponent.prototype.getSortableColumns = function () {
        return this.data.getColumns().filter(function (column) {
            return column.sortable === true;
        });
    };
    DataTableComponent.prototype.isEmpty = function () {
        return this.data.getRows().length === 0;
    };
    DataTableComponent.prototype.isHeaderVisible = function () {
        return !this.loading && !this.isEmpty() && !this.noPermission;
    };
    DataTableComponent.prototype.isStickyHeaderEnabled = function () {
        return this.stickyHeader && this.isHeaderVisible();
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
    DataTableComponent.prototype.emitSortingChangedEvent = function (key, direction) {
        var domEvent = new CustomEvent('sorting-changed', {
            detail: {
                key: key,
                direction: direction
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    };
    DataTableComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeClickStream();
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
        this.subscriptions = [];
        if (this.dataRowsChanged) {
            this.dataRowsChanged.unsubscribe();
            this.dataRowsChanged = null;
        }
    };
    DataTableComponent.prototype.datatableLayoutFix = function () {
        var maxGalleryRows = 25;
        if (this.display === 'gallery') {
            for (var i = 0; i < maxGalleryRows; i++) {
                this.fakeRows.push('');
            }
        }
        else {
            this.fakeRows = [];
        }
    };
    DataTableComponent.prototype.getNameColumnValue = function () {
        return this.data.getColumns().find(function (el) {
            return el.key.includes('name');
        });
    };
    DataTableComponent.prototype.getAutomationValue = function (row, col) {
        var name = this.getNameColumnValue();
        return name ? row.getValue(name.key) : '';
    };
    __decorate([
        core_1.ContentChild(data_column_list_component_1.DataColumnListComponent),
        __metadata("design:type", data_column_list_component_1.DataColumnListComponent)
    ], DataTableComponent.prototype, "columnList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "data", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableComponent.prototype, "display", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], DataTableComponent.prototype, "rows", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], DataTableComponent.prototype, "sorting", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], DataTableComponent.prototype, "columns", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableComponent.prototype, "selectionMode", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "multiselect", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "actions", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableComponent.prototype, "actionsPosition", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableComponent.prototype, "fallbackThumbnail", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "contextMenu", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "allowDropFiles", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableComponent.prototype, "rowStyle", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableComponent.prototype, "rowStyleClass", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "showHeader", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "stickyHeader", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "rowClick", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "rowDblClick", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "showRowContextMenu", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "showRowActionsMenu", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "executeRowAction", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableComponent.prototype, "noPermission", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "rowMenuCacheEnabled", void 0);
    DataTableComponent = __decorate([
        core_1.Component({
            selector: 'adf-datatable',
            styleUrls: ['./datatable.component.scss'],
            templateUrl: './datatable.component.html',
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-datatable' }
        }),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.IterableDiffers])
    ], DataTableComponent);
    return DataTableComponent;
}());
exports.DataTableComponent = DataTableComponent;
//# sourceMappingURL=datatable.component.js.map