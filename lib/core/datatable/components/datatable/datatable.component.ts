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

import {
    AfterContentInit, Component, ContentChild, DoCheck, ElementRef, EventEmitter, Input,
    IterableDiffers, OnChanges, Output, SimpleChange, SimpleChanges, TemplateRef, ViewEncapsulation, OnDestroy
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Subscription, Observable, Observer } from 'rxjs';
import { DataColumnListComponent } from '../../../data-column/data-column-list.component';
import { DataColumn } from '../../data/data-column.model';
import { DataRowEvent } from '../../data/data-row-event.model';
import { DataRow } from '../../data/data-row.model';
import { DataSorting } from '../../data/data-sorting.model';
import { DataTableAdapter } from '../../data/datatable-adapter';

import { ObjectDataRow } from '../../data/object-datarow.model';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataCellEvent } from './data-cell.event';
import { DataRowActionEvent } from './data-row-action.event';
import { share, buffer, map, filter, debounceTime } from 'rxjs/operators';

export enum DisplayMode {
    List = 'list',
    Gallery = 'gallery'
}

@Component({
    selector: 'adf-datatable',
    styleUrls: ['./datatable.component.scss'],
    templateUrl: './datatable.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements AfterContentInit, OnChanges, DoCheck, OnDestroy {

    @ContentChild(DataColumnListComponent)
    columnList: DataColumnListComponent;

    /** Data source for the table */
    @Input()
    data: DataTableAdapter;

    /** Selects the display mode of the table. Can be "list" or "gallery". */
    @Input()
    display: string = DisplayMode.List;

    /** The rows that the datatable will show. */
    @Input()
    rows: any[] = [];

    /** Define the sort order of the datatable. Possible values are :
     * [`created`, `desc`], [`created`, `asc`], [`due`, `desc`], [`due`, `asc`]
     */
    @Input()
    sorting: any[] = [];

    /** The columns that the datatable will show. */
    @Input()
    columns: any[] = [];

    /** Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles multiple row selection, which renders checkboxes at the beginning of each row. */
    @Input()
    multiselect: boolean = false;

    /** Toggles the data actions column. */
    @Input()
    actions: boolean = false;

    /** Position of the actions dropdown menu. Can be "left" or "right". */
    @Input()
    actionsPosition: string = 'right'; // left|right

    /** Fallback image for rows where the thumbnail is missing. */
    @Input()
    fallbackThumbnail: string;

    /** Toggles custom context menu for the component. */
    @Input()
    contextMenu: boolean = false;

    /** Toggles file drop support for rows (see
     * [Upload directive](upload.directive.md) for further details).
     */
    @Input()
    allowDropFiles: boolean = false;

    /** The inline style to apply to every row. See
     * [NgStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html)
     * docs for more details and usage examples.
     */
    @Input()
    rowStyle: string;

    /** The CSS class to apply to every row. */
    @Input()
    rowStyleClass: string = '';

    /** Toggles the header. */
    @Input()
    showHeader: boolean = true;

    /** Toggles the sticky header mode. */
    @Input()
    stickyHeader: boolean = false;

    /** Emitted when the user clicks a row. */
    @Output()
    rowClick = new EventEmitter<DataRowEvent>();

    /** Emitted when the user double-clicks a row. */
    @Output()
    rowDblClick = new EventEmitter<DataRowEvent>();

    /** Emitted before the context menu is displayed for a row. */
    @Output()
    showRowContextMenu = new EventEmitter<DataCellEvent>();

    /** Emitted before the actions menu is displayed for a row. */
    @Output()
    showRowActionsMenu = new EventEmitter<DataCellEvent>();

    /** Emitted when the user executes a row action. */
    @Output()
    executeRowAction = new EventEmitter<DataRowActionEvent>();

    /** Flag that indicates if the datatable is in loading state and needs to show the
     * loading template (see the docs to learn how to configure a loading template).
     */
    @Input()
    loading: boolean = false;

    /** Flag that indicates if the datatable should show the "no permission" template. */
    @Input()
    noPermission: boolean = false;

    /**
     * Should the items for the row actions menu be cached for reuse after they are loaded
     * the first time?
     */
    @Input()
    rowMenuCacheEnabled = true;

    noContentTemplate: TemplateRef<any>;
    noPermissionTemplate: TemplateRef<any>;
    loadingTemplate: TemplateRef<any>;

    isSelectAllChecked: boolean = false;
    selection = new Array<DataRow>();

    /** This array of fake rows fix the flex layout for the gallery view */
    fakeRows = [];

    private clickObserver: Observer<DataRowEvent>;
    private click$: Observable<DataRowEvent>;

    private differ: any;
    private rowMenuCache: object = {};

    private subscriptions: Subscription[] = [];
    private singleClickStreamSub: Subscription;
    private multiClickStreamSub: Subscription;
    private dataRowsChanged: Subscription;

    constructor(private elementRef: ElementRef,
                differs: IterableDiffers) {
        if (differs) {
            this.differ = differs.find([]).create(null);
        }
        this.click$ = new Observable<DataRowEvent>((observer) => this.clickObserver = observer)
            .pipe(share());
    }

    ngAfterContentInit() {
        if (this.columnList) {
            this.subscriptions.push(
                this.columnList.columns.changes.subscribe(() => {
                    this.setTableSchema();
                })
            );
        }
        this.datatableLayoutFix();
        this.setTableSchema();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initAndSubscribeClickStream();
        if (this.isPropertyChanged(changes['data'])) {
            if (this.isTableEmpty()) {
                this.initTable();
            } else {
                this.data = changes['data'].currentValue;
                this.resetSelection();
            }
            return;
        }

        if (this.isPropertyChanged(changes['rows'])) {
            if (this.isTableEmpty()) {
                this.initTable();
            } else {
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
    }

    ngDoCheck() {
        let changes = this.differ.diff(this.rows);
        if (changes) {
            this.setTableRows(this.rows);
        }
    }

    isPropertyChanged(property: SimpleChange): boolean {
        return property && property.currentValue ? true : false;
    }

    convertToRowsData(rows: any []): ObjectDataRow[] {
        return rows.map((row) => new ObjectDataRow(row, row.isSelected));
    }

    convertToDataSorting(sorting: any[]): DataSorting {
        if (sorting && sorting.length > 0) {
            return new DataSorting(sorting[0], sorting[1]);
        }
    }

    private initAndSubscribeClickStream() {
        this.unsubscribeClickStream();
        let singleClickStream = this.click$
            .pipe(
                buffer(
                    this.click$.pipe(
                        debounceTime(250)
                    )
                ),
                map((list) => list),
                filter((x) => x.length === 1)
            );

        this.singleClickStreamSub = singleClickStream.subscribe((dataRowEvents: DataRowEvent[]) => {
            let event: DataRowEvent = dataRowEvents[0];
            this.handleRowSelection(event.value, <MouseEvent | KeyboardEvent> event.event);
            this.rowClick.emit(event);
            if (!event.defaultPrevented) {
                this.elementRef.nativeElement.dispatchEvent(
                    new CustomEvent('row-click', {
                        detail: event,
                        bubbles: true
                    })
                );
            }
        });

        let multiClickStream = this.click$
            .pipe(
                buffer(
                    this.click$.pipe(
                        debounceTime(250)
                    )
                ),
                map((list) => list),
                filter((x) => x.length >= 2)
            );

        this.multiClickStreamSub = multiClickStream.subscribe((dataRowEvents: DataRowEvent[]) => {
            let event: DataRowEvent = dataRowEvents[0];
            this.rowDblClick.emit(event);
            if (!event.defaultPrevented) {
                this.elementRef.nativeElement.dispatchEvent(
                    new CustomEvent('row-dblclick', {
                        detail: event,
                        bubbles: true
                    })
                );
            }
        });
    }

    private unsubscribeClickStream() {
        if (this.singleClickStreamSub) {
            this.singleClickStreamSub.unsubscribe();
            this.singleClickStreamSub = null;
        }
        if (this.multiClickStreamSub) {
            this.multiClickStreamSub.unsubscribe();
            this.multiClickStreamSub = null;
        }
    }

    private initTable() {
        this.data = new ObjectDataTableAdapter(this.rows, this.columns);
        this.setTableSorting(this.sorting);
        this.resetSelection();
        this.rowMenuCache = {};
    }

    isTableEmpty() {
        return this.data === undefined || this.data === null;
    }

    private setTableRows(rows: any[]) {
        if (this.data) {
            this.resetSelection();
            this.data.setRows(this.convertToRowsData(rows));
        }
    }

    private setTableSchema() {
        let schema = [];
        if (!this.columns || this.columns.length === 0) {
            schema = this.getSchemaFromHtml();
        } else {
            schema = this.columns.concat(this.getSchemaFromHtml());
        }

        this.columns = schema;

        if (this.data && this.columns && this.columns.length > 0) {
            this.data.setColumns(this.columns);
        }
    }

    private setTableSorting(sorting) {
        if (this.data) {
            this.data.setSorting(this.convertToDataSorting(sorting));
        }
    }

    public getSchemaFromHtml(): any {
        let schema = [];
        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map((c) => <DataColumn> c);
        }
        return schema;
    }

    onRowClick(row: DataRow, mouseEvent: MouseEvent) {
        if (mouseEvent) {
            mouseEvent.preventDefault();
        }

        if (row) {
            const dataRowEvent = new DataRowEvent(row, mouseEvent, this);
            this.clickObserver.next(dataRowEvent);
        }
    }

    onEnterKeyPressed(row: DataRow, e: KeyboardEvent) {
        if (row) {
            this.handleRowSelection(row, e);
        }
    }

    private handleRowSelection(row: DataRow, e: KeyboardEvent | MouseEvent) {
        if (this.data) {
            if (this.isSingleSelectionMode()) {
                this.resetSelection();
                this.selectRow(row, true);
                this.emitRowSelectionEvent('row-select', row);
            }

            if (this.isMultiSelectionMode()) {
                const modifier = e && (e.metaKey || e.ctrlKey);
                let newValue: boolean;
                if (this.selection.length === 1) {
                    newValue = !row.isSelected;
                } else {
                    newValue = modifier ? !row.isSelected : true;
                }
                const domEventName = newValue ? 'row-select' : 'row-unselect';

                if (!modifier) {
                    this.resetSelection();
                }
                this.selectRow(row, newValue);
                this.emitRowSelectionEvent(domEventName, row);
            }
        }
    }

    resetSelection(): void {
        if (this.data) {
            const rows = this.data.getRows();
            if (rows && rows.length > 0) {
                rows.forEach((r) => r.isSelected = false);
            }
            this.selection = [];
        }
        this.isSelectAllChecked = false;
    }

    onRowDblClick(row: DataRow, event?: Event) {
        if (event) {
            event.preventDefault();
        }
        let dataRowEvent = new DataRowEvent(row, event, this);
        this.clickObserver.next(dataRowEvent);
    }

    onRowKeyUp(row: DataRow, e: KeyboardEvent) {
        const event = new CustomEvent('row-keyup', {
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
        } else {
            if (e.key === 'Enter') {
                this.onKeyboardNavigate(row, e);
            }
        }
    }

    private onKeyboardNavigate(row: DataRow, keyboardEvent: KeyboardEvent) {
        if (keyboardEvent) {
            keyboardEvent.preventDefault();
        }

        const event = new DataRowEvent(row, keyboardEvent, this);

        this.rowDblClick.emit(event);
        this.elementRef.nativeElement.dispatchEvent(
            new CustomEvent('row-dblclick', {
                detail: event,
                bubbles: true
            })
        );
    }

    onColumnHeaderClick(column: DataColumn) {
        if (column && column.sortable) {
            let current = this.data.getSorting();
            let newDirection = 'asc';
            if (current && column.key === current.key) {
                newDirection = current.direction === 'asc' ? 'desc' : 'asc';
            }
            this.data.setSorting(new DataSorting(column.key, newDirection));
            this.emitSortingChangedEvent(column.key, newDirection);
        }
    }

    onSelectAllClick(matCheckboxChange: MatCheckboxChange) {
        this.isSelectAllChecked = matCheckboxChange.checked;

        if (this.multiselect) {
            let rows = this.data.getRows();
            if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    this.selectRow(rows[i], matCheckboxChange.checked);
                }
            }

            const domEventName = matCheckboxChange.checked ? 'row-select' : 'row-unselect';
            const row = this.selection.length > 0 ? this.selection[0] : null;

            this.emitRowSelectionEvent(domEventName, row);
        }
    }

    onCheckboxChange(row: DataRow, event: MatCheckboxChange) {
        const newValue = event.checked;

        this.selectRow(row, newValue);

        const domEventName = newValue ? 'row-select' : 'row-unselect';
        this.emitRowSelectionEvent(domEventName, row);
    }

    onImageLoadingError(event: Event, row: DataRow) {
        if (event) {
            let element = <any> event.target;

            if (this.fallbackThumbnail) {
                element.src = this.fallbackThumbnail;
            } else {
                element.src = row.imageErrorResolver(event);
            }
        }
    }

    isIconValue(row: DataRow, col: DataColumn): boolean {
        if (row && col) {
            let value = row.getValue(col.key);
            return value && value.startsWith('material-icons://');
        }
        return false;
    }

    asIconValue(row: DataRow, col: DataColumn): string {
        if (this.isIconValue(row, col)) {
            let value = row.getValue(col.key) || '';
            return value.replace('material-icons://', '');
        }
        return null;
    }

    iconAltTextKey(value: string): string {
        return value ? 'ICONS.' + value.substring(value.lastIndexOf('/') + 1).replace(/\.[a-z]+/, '') : '';
    }

    isColumnSorted(col: DataColumn, direction: string): boolean {
        if (col && direction) {
            let sorting = this.data.getSorting();
            return sorting && sorting.key === col.key && sorting.direction === direction;
        }
        return false;
    }

    getContextMenuActions(row: DataRow, col: DataColumn): any[] {
        let event = new DataCellEvent(row, col, []);
        this.showRowContextMenu.emit(event);
        return event.value.actions;
    }

    getRowActions(row: DataRow, col?: DataColumn): any[] {
        const id = row.getValue('id');

        if (!this.rowMenuCache[id]) {
            let event = new DataCellEvent(row, col, []);
            this.showRowActionsMenu.emit(event);
            if (!this.rowMenuCacheEnabled) {
                return event.value.actions;
            }
            this.rowMenuCache[id] = event.value.actions;
        }

        return this.rowMenuCache[id];
    }

    onExecuteRowAction(row: DataRow, action: any) {
        if (action.disabled || action.disabled) {
            event.stopPropagation();
        } else {
            this.executeRowAction.emit(new DataRowActionEvent(row, action));
        }
    }

    rowAllowsDrop(row: DataRow): boolean {
        return row.isDropTarget === true;
    }

    hasSelectionMode(): boolean {
        return this.isSingleSelectionMode() || this.isMultiSelectionMode();
    }

    isSingleSelectionMode(): boolean {
        return this.selectionMode && this.selectionMode.toLowerCase() === 'single';
    }

    isMultiSelectionMode(): boolean {
        return this.selectionMode && this.selectionMode.toLowerCase() === 'multiple';
    }

    getRowStyle(row: DataRow): string {
        row.cssClass = row.cssClass ? row.cssClass : '';
        this.rowStyleClass = this.rowStyleClass ? this.rowStyleClass : '';
        return `${row.cssClass} ${this.rowStyleClass}`;
    }

    getFilename(row: DataRow): string {
        return row.getValue('name');
    }

    getSortingKey(): string {
        if (this.data.getSorting()) {
            return this.data.getSorting().key;
        }
    }

    selectRow(row: DataRow, value: boolean) {
        if (row) {
            row.isSelected = value;
            const idx = this.selection.indexOf(row);
            if (value) {
                if (idx < 0) {
                    this.selection.push(row);
                }
            } else {
                if (idx > -1) {
                    this.selection.splice(idx, 1);
                }
            }
        }
    }

    getCellTooltip(row: DataRow, col: DataColumn): string {
        if (row && col && col.formatTooltip) {
            const result: string = col.formatTooltip(row, col);
            if (result) {
                return result;
            }
        }
        return null;
    }

    getSortableColumns() {
        return this.data.getColumns().filter((column) => {
            return column.sortable === true;
        });
    }

    isEmpty() {
        return this.data.getRows().length === 0;
    }

    isHeaderVisible() {
        return !this.loading && !this.isEmpty() && !this.noPermission;
    }

    private emitRowSelectionEvent(name: string, row: DataRow) {
        const domEvent = new CustomEvent(name, {
            detail: {
                row: row,
                selection: this.selection
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    private emitSortingChangedEvent(key: string, direction: string) {
        const domEvent = new CustomEvent('sorting-changed', {
            detail: {
                key,
                direction
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    ngOnDestroy() {
        this.unsubscribeClickStream();

        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];

        if (this.dataRowsChanged) {
            this.dataRowsChanged.unsubscribe();
            this.dataRowsChanged = null;
        }
    }

    datatableLayoutFix() {
        const maxGalleryRows = 25;

        if (this.display === 'gallery') {
            for (let i = 0; i < maxGalleryRows; i++) {
               this.fakeRows.push('');
            }
        } else {
            this.fakeRows = [];
        }
    }
}
