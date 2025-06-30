/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/no-conflicting-lifecycle */

import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChild,
    DestroyRef,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    IterableDiffers,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChange,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory, FocusKeyManager } from '@angular/cdk/a11y';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Observable, Observer, Subscription } from 'rxjs';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { DataColumn } from '../../data/data-column.model';
import { DataRowEvent } from '../../data/data-row-event.model';
import { DataRow } from '../../data/data-row.model';
import { DataSorting } from '../../data/data-sorting.model';
import { DataTableAdapter } from '../../data/datatable-adapter';
import { DataTableRowComponent } from '../datatable-row/datatable-row.component';
import { ObjectDataRow } from '../../data/object-datarow.model';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataCellEvent } from '../data-cell.event';
import { DataRowActionEvent } from '../data-row-action.event';
import { buffer, debounceTime, filter, map, share } from 'rxjs/operators';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ResizeEvent } from '../../directives/resizable/types';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FileTypePipe, LocalizedDatePipe } from '../../../pipes';
import { DropZoneDirective } from '../../directives/drop-zone.directive';
import { ResizableDirective } from '../../directives/resizable/resizable.directive';
import { IconComponent } from '../../../icon';
import { ResizeHandleDirective } from '../../directives/resizable/resize-handle.directive';
import { MatButtonModule } from '@angular/material/button';
import { UploadDirective } from '../../../directives';
import { ContextMenuDirective } from '../../../context-menu';
import { IconCellComponent } from '../icon-cell/icon-cell.component';
import { DateCellComponent } from '../date-cell/date-cell.component';
import { LocationCellComponent } from '../location-cell/location-cell.component';
import { FileSizeCellComponent } from '../filesize-cell/filesize-cell.component';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { BooleanCellComponent } from '../boolean-cell/boolean-cell.component';
import { JsonCellComponent } from '../json-cell/json-cell.component';
import { AmountCellComponent } from '../amount-cell/amount-cell.component';
import { NumberCellComponent } from '../number-cell/number-cell.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// eslint-disable-next-line no-shadow
export enum ShowHeaderMode {
    Never = 'never',
    Always = 'always',
    Data = 'data'
}

@Component({
    selector: 'adf-datatable',
    standalone: true,
    imports: [
        CommonModule,
        DataTableRowComponent,
        CdkDropList,
        TranslatePipe,
        MatCheckboxModule,
        CdkDrag,
        DropZoneDirective,
        ResizableDirective,
        CdkDragHandle,
        IconComponent,
        ResizeHandleDirective,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        UploadDirective,
        ContextMenuDirective,
        FileTypePipe,
        IconCellComponent,
        LocalizedDatePipe,
        DateCellComponent,
        LocationCellComponent,
        FileSizeCellComponent,
        DataTableCellComponent,
        BooleanCellComponent,
        JsonCellComponent,
        AmountCellComponent,
        NumberCellComponent
    ],
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable' }
})
export class DataTableComponent implements OnInit, AfterContentInit, OnChanges, DoCheck, OnDestroy, AfterViewInit {
    private static MINIMUM_COLUMN_SIZE = 100;

    @ViewChildren(DataTableRowComponent)
    rowsList: QueryList<DataTableRowComponent>;

    @ViewChild('mainMenuTemplate')
    mainMenuTemplate: ElementRef;

    @ContentChild(DataColumnListComponent)
    columnList: DataColumnListComponent;

    /** Data source for the table */
    @Input()
    data: DataTableAdapter;

    /** The rows that the datatable will show. */
    @Input()
    rows: any[] = [];

    /**
     * Define the sort order of the datatable. Possible values are :
     * [`created`, `desc`], [`created`, `asc`], [`due`, `desc`], [`due`, `asc`]
     */
    @Input()
    sorting: any[] = [];

    /** The columns that the datatable will show. */
    @Input()
    columns: any[] = [];

    /**
     * Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles multiple row selection, which renders checkboxes at the beginning of each row. */
    @Input()
    multiselect: boolean = false;

    /** Toggles main data table action column. */
    @Input()
    mainTableAction: boolean = true;

    /** Toggles the data actions column. */
    @Input()
    actions: boolean = false;

    /** Toggles the main datatable action. */
    @Input()
    showMainDatatableActions: boolean = false;

    /** Toggles the provided actions. */
    @Input()
    showProvidedActions: boolean = false;

    /** Position of the actions dropdown menu. Can be "left" or "right". */
    @Input()
    actionsPosition: string = 'right'; // left|right

    /** Toggles whether the actions dropdown should only be visible if the row is hovered over or the dropdown menu is open. */
    @Input()
    actionsVisibleOnHover: boolean = false;

    /** Fallback image for rows where the thumbnail is missing. */
    @Input()
    fallbackThumbnail: string;

    /** Toggles custom context menu for the component. */
    @Input()
    contextMenu: boolean = false;

    /**
     * The inline style to apply to every row. See
     * [NgStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html)
     * docs for more details and usage examples.
     */
    @Input()
    rowStyle: { [key: string]: any };

    /** The CSS class to apply to every row. */
    @Input()
    rowStyleClass: string = '';

    /** Toggles the header. */
    @Input()
    showHeader = ShowHeaderMode.Data;

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

    /** Emitted when the column order is changed. */
    @Output()
    columnOrderChanged = new EventEmitter<DataColumn[]>();

    /** Emitted when the column width is changed. */
    @Output()
    columnsWidthChanged = new EventEmitter<DataColumn[]>();

    /** Emitted when the selected row items count in the table changed. */
    @Output()
    selectedItemsCountChanged = new EventEmitter<number>();

    /**
     * Flag that indicates if the datatable is in loading state and needs to show the
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

    /**
     * Custom resolver function which is used to parse dynamic column objects
     * see the docs to learn how to configure a resolverFn.
     */
    @Input()
    resolverFn: (row: DataRow, col: DataColumn) => any = null;

    /**
     * Flag that indicate if the datatable allow the use facet widget search for filtering.
     */
    @Input()
    allowFiltering: boolean = false;

    /**
     * Flag that indicates if the datatable allows column resizing.
     */
    @Input()
    isResizingEnabled = false;

    /**
     * Flag that indicates if the datatable should be blurred when resizing.
     */
    @Input()
    blurOnResize = true;

    /**
     * Flag that indicates if selection checkboxes inside row should be displayed on hover only.
     */
    @Input()
    displayCheckboxesOnHover = false;

    /**
     * Flag that enables dragging rows
     */
    @Input()
    enableDragRows = false;

    /** Emitted when dragged row is dropped. */
    @Output()
    dragDropped = new EventEmitter<{ previousIndex: number; currentIndex: number }>();

    headerFilterTemplate: TemplateRef<any>;
    noContentTemplate: TemplateRef<any>;
    noPermissionTemplate: TemplateRef<any>;
    loadingTemplate: TemplateRef<any>;
    mainActionTemplate: TemplateRef<any>;

    isSelectAllIndeterminate: boolean = false;
    isSelectAllChecked: boolean = false;
    selection = new Array<DataRow>();
    selectedRowId: string = '';

    isDraggingHeaderColumn = false;
    hoveredHeaderColumnIndex = -1;
    resizingColumnIndex = -1;
    isDraggingRow = false;
    focusTrap: ConfigurableFocusTrap;

    private keyManager: FocusKeyManager<DataTableRowComponent>;
    private clickObserver: Observer<DataRowEvent>;
    private click$: Observable<DataRowEvent>;

    private differ: any;
    private rowMenuCache: any = {};

    private singleClickStreamSub: Subscription;
    private multiClickStreamSub: Subscription;

    private readonly destroyRef = inject(DestroyRef);

    @HostListener('keyup', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        this.keyManager.onKeydown(event);
    }

    constructor(
        private readonly elementRef: ElementRef,
        differs: IterableDiffers,
        private readonly matIconRegistry: MatIconRegistry,
        private readonly sanitizer: DomSanitizer,
        private readonly focusTrapFactory: ConfigurableFocusTrapFactory
    ) {
        if (differs) {
            this.differ = differs.find([]).create(null);
        }

        this.click$ = new Observable<DataRowEvent>((observer) => (this.clickObserver = observer)).pipe(share());
    }

    ngOnInit(): void {
        this.registerDragHandleIcon();
    }

    ngAfterContentInit() {
        if (this.columnList) {
            this.columnList.columns.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.setTableSchema();
            });
        }
        this.setTableSchema();
    }

    ngAfterViewInit() {
        this.keyManager = new FocusKeyManager(this.rowsList).withWrap().skipPredicate((item) => item.disabled);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initAndSubscribeClickStream();
        if (this.selectedRowId) {
            this.setRowAsContextSource();
        }

        const dataChanges = changes['data'];
        const rowChanges = changes['rows'];
        const columnChanges = changes['columns'];
        const multiselectChanges = changes['multiselect'];

        if (this.isPropertyChanged(dataChanges) || this.isPropertyChanged(rowChanges) || this.isPropertyChanged(columnChanges)) {
            if (this.isTableEmpty()) {
                this.initTable();
            } else {
                if (dataChanges) {
                    this.data = changes['data'].currentValue;
                    this.resetSelection();
                }

                if (rowChanges) {
                    this.setTableRows(changes['rows'].currentValue);
                    this.setTableSorting(this.sorting);
                }

                if (columnChanges) {
                    this.setTableColumns(changes['columns'].currentValue);
                }
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

        if (multiselectChanges?.currentValue === false) {
            this.resetSelection();
        }
    }

    isColumnSortActive(column: DataColumn): boolean {
        if (!column || !this.data.getSorting()) {
            return false;
        }
        return column.key === this.data.getSorting().key;
    }

    getVisibleColumns(): DataColumn[] {
        return this.data.getColumns().filter((column) => !column.isHidden);
    }

    onDropHeaderColumn(event: CdkDragDrop<unknown>): void {
        const allColumns = this.data.getColumns();
        const shownColumns = allColumns.filter((column) => !column.isHidden);
        const hiddenColumns = allColumns.filter((column) => column.isHidden);

        moveItemInArray(shownColumns, event.previousIndex, event.currentIndex);
        const allColumnsWithNewOrder = [...shownColumns, ...hiddenColumns];

        this.setTableColumns(allColumnsWithNewOrder);
        this.columnOrderChanged.emit(allColumnsWithNewOrder);

        this.isDraggingHeaderColumn = false;
    }

    ngDoCheck() {
        const changes = this.differ.diff(this.rows);
        if (changes) {
            this.setTableRows(this.rows);
        }
    }

    isPropertyChanged(property: SimpleChange): boolean {
        return !!property?.currentValue;
    }

    convertToRowsData(rows: any[]): ObjectDataRow[] {
        return rows.map((row) => new ObjectDataRow(row, row.isSelected, row?.isSelectable));
    }

    convertToColumnsData(columns: any[]): ObjectDataColumn[] {
        return columns.map((column) => new ObjectDataColumn(column));
    }

    convertToDataSorting(sorting: any[]): DataSorting | null {
        if (sorting && sorting.length > 0) {
            return new DataSorting(sorting[0], sorting[1], sorting[2]);
        }
        return null;
    }

    onMainMenuOpen() {
        if (this.mainMenuTemplate && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.mainMenuTemplate.nativeElement);
            this.focusTrap.focusInitialElement();
        }
    }

    onMainMenuClosed() {
        if (this.focusTrap) {
            this.focusTrap.destroy();
            this.focusTrap = null;
        }
    }

    private initAndSubscribeClickStream() {
        this.unsubscribeClickStream();
        const singleClickStream = this.click$.pipe(
            buffer(this.click$.pipe(debounceTime(250))),
            map((list) => list),
            filter((x) => x.length === 1)
        );

        this.singleClickStreamSub = singleClickStream.subscribe((dataRowEvents: DataRowEvent[]) => {
            const event: DataRowEvent = dataRowEvents[0];
            this.handleRowSelection(event.value, event.event as any);
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

        const multiClickStream = this.click$.pipe(
            buffer(this.click$.pipe(debounceTime(250))),
            map((list) => list),
            filter((x) => x.length >= 2)
        );

        this.multiClickStreamSub = multiClickStream.subscribe((dataRowEvents: DataRowEvent[]) => {
            const event: DataRowEvent = dataRowEvents[0];
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
        const runtimeColumns = this.getRuntimeColumns();
        this.data = new ObjectDataTableAdapter(this.rows, runtimeColumns);

        this.setTableSorting(this.sorting);
        this.resetSelection();
        this.rowMenuCache = {};
    }

    isTableEmpty(): boolean {
        return this.data === undefined || this.data === null;
    }

    private setTableRows(rows: any[]) {
        if (this.data) {
            this.resetSelection();
            const rowsData = this.convertToRowsData(rows);
            this.data.setRows(rowsData);
        }
    }

    private setTableColumns(columns: any[]) {
        if (this.data) {
            this.resetSelection();
            const columnsData = this.convertToColumnsData(columns);
            this.data.setColumns(columnsData);
        }
    }

    private getRuntimeColumns(): any[] {
        return [...(this.columns || []), ...this.getSchemaFromHtml()];
    }

    private setTableSchema() {
        const columns = this.getRuntimeColumns();

        if (this.data && columns.length > 0) {
            this.data.setColumns(columns);
        }
    }

    private setTableSorting(sorting: any[]) {
        if (this.data) {
            this.data.setSorting(this.convertToDataSorting(sorting));
        }
    }

    public getSchemaFromHtml(): any {
        let schema = [];
        if (this.columnList?.columns?.length > 0) {
            schema = this.columnList.columns.map((c) => c as DataColumn);
        }
        return schema;
    }

    onRowClick(row: DataRow, mouseEvent: MouseEvent) {
        if (mouseEvent) {
            mouseEvent.preventDefault();
        }

        if (row) {
            const rowIndex = this.data.getRows().indexOf(row) + (this.isHeaderVisible() ? 1 : 0);
            this.keyManager.setActiveItem(rowIndex);

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
        if (!this.data || !row?.isSelectable) {
            return;
        }

        if (this.isSingleSelectionMode()) {
            if (row.isSelected) {
                this.resetSelection();
                this.emitRowSelectionEvent('row-unselect', null);
            } else {
                this.resetSelection();
                this.selectRow(row, true);
                this.emitRowSelectionEvent('row-select', row);
            }
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
            this.checkSelectAllCheckboxState();
        }
    }

    resetSelection(): void {
        if (this.data) {
            const rows = this.data.getRows();
            if (rows && rows.length > 0) {
                rows.forEach((r) => (r.isSelected = false));
            }
            this.selection = [];
        }
        this.isSelectAllChecked = false;
        this.isSelectAllIndeterminate = false;
        this.selectedItemsCountChanged.emit(0);
    }

    onRowDblClick(row: DataRow, event?: Event) {
        if (event) {
            event.preventDefault();
        }
        const dataRowEvent = new DataRowEvent(row, event, this);
        this.clickObserver.next(dataRowEvent);
    }

    onRowEnterKeyDown(row: DataRow, keyboardEvent: KeyboardEvent) {
        if (keyboardEvent.key === 'Enter') {
            this.onKeyboardNavigate(row, keyboardEvent);
        }
    }

    onRowKeyUp(row: DataRow, keyboardEvent: KeyboardEvent) {
        const event = new CustomEvent('row-keyup', {
            detail: {
                row,
                keyboardEvent,
                sender: this
            },
            bubbles: true
        });

        this.elementRef.nativeElement.dispatchEvent(event);

        if (event.defaultPrevented) {
            keyboardEvent.preventDefault();
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

    private isValidClickEvent(event: Event): boolean {
        if (event instanceof MouseEvent) {
            return event.eventPhase === event.BUBBLING_PHASE;
        } else if (event instanceof KeyboardEvent) {
            return event.eventPhase === event.AT_TARGET;
        }

        return false;
    }

    onColumnHeaderClick(column: DataColumn, event: Event) {
        if (this.isValidClickEvent(event) && column && column.sortable) {
            const current = this.data.getSorting();
            let newDirection = 'asc';
            if (current && column.key === current.key) {
                newDirection = current.direction?.toLowerCase() === 'asc' ? 'desc' : 'asc';
            }
            this.sorting = [column.key, newDirection, { numeric: true }];
            this.data.setSorting(new DataSorting(column.key, newDirection, { numeric: true }));
            this.emitSortingChangedEvent(column.key, column.sortingKey, newDirection);
        }

        this.keyManager.updateActiveItem(0);
    }

    onSelectAllClick(matCheckboxChange: MatCheckboxChange) {
        this.isSelectAllChecked = matCheckboxChange.checked;
        this.isSelectAllIndeterminate = false;

        if (this.multiselect) {
            const selectableRows = this.data.getRows().filter((row) => row?.isSelectable);
            if (selectableRows && selectableRows.length > 0) {
                for (let i = 0; i < selectableRows.length; i++) {
                    this.selectRow(selectableRows[i], matCheckboxChange.checked);
                }
            }

            const domEventName = matCheckboxChange.checked ? 'row-select' : 'row-unselect';
            const row = this.selection.length > 0 ? this.selection[0] : null;

            this.emitRowSelectionEvent(domEventName, row);
        }
    }

    onCheckboxLabelClick(row: DataRow, event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!(target.hasAttribute('data-adf-datatable-row-checkbox') || target.closest('[data-adf-datatable-row-checkbox]'))) {
            this.onRowClick(row, event);
        }
    }

    onCheckboxChange(row: DataRow, event: MatCheckboxChange) {
        const newValue = event.checked;

        this.selectRow(row, newValue);

        const domEventName = newValue ? 'row-select' : 'row-unselect';
        this.emitRowSelectionEvent(domEventName, row);
        this.checkSelectAllCheckboxState();
    }

    checkSelectAllCheckboxState() {
        if (this.multiselect) {
            let numberOfSelectedRows: number = 0;
            const rows = this.data.getRows();
            rows.forEach((row) => {
                if (row.isSelected) {
                    numberOfSelectedRows++;
                }
            });
            if (numberOfSelectedRows === rows.length) {
                this.isSelectAllChecked = true;
                this.isSelectAllIndeterminate = false;
            } else if (numberOfSelectedRows > 0 && numberOfSelectedRows < rows.length) {
                this.isSelectAllChecked = false;
                this.isSelectAllIndeterminate = true;
            } else {
                this.isSelectAllChecked = false;
                this.isSelectAllIndeterminate = false;
            }
        }
    }

    onImageLoadingError(event: Event, row: DataRow) {
        if (event) {
            const element = event.target as any;

            if (this.fallbackThumbnail) {
                element.src = this.fallbackThumbnail;
            } else {
                element.src = row.imageErrorResolver(event);
            }
        }
    }

    isIconValue(row: DataRow, col: DataColumn): boolean {
        if (row && col) {
            const value = this.data.getValue(row, col);
            return value?.startsWith('material-icons://');
        }
        return false;
    }

    asIconValue(row: DataRow, col: DataColumn): string {
        if (this.isIconValue(row, col)) {
            const value = this.data.getValue(row, col) || '';
            return value.replace('material-icons://', '');
        }
        return null;
    }

    isColumnSorted(col: DataColumn, direction: string): boolean {
        if (col && direction) {
            const sorting = this.data.getSorting();
            return this.isSortingEqual(col, direction, sorting);
        }
        return false;
    }

    getContextMenuActions(row: DataRow, col: DataColumn): () => any[] {
        return () => {
            const event = new DataCellEvent(row, col, []);
            this.showRowContextMenu.emit(event);
            return event.value.actions;
        };
    }

    getRowActions(row: DataRow, col?: DataColumn): any[] {
        const id = row.getValue('id');

        if (!this.rowMenuCache[id]) {
            const event = new DataCellEvent(row, col, []);
            this.showRowActionsMenu.emit(event);
            if (!this.rowMenuCacheEnabled) {
                return this.getVisibleActions(event.value.actions);
            }
            this.rowMenuCache[id] = event.value.actions;
        }

        return this.getVisibleActions(this.rowMenuCache[id]);
    }

    getVisibleActions(actions: any[]): any[] {
        return actions.filter((action) => action.visible || action.visible === undefined);
    }

    onExecuteRowAction(row: DataRow, action: any) {
        if (action.disabled || action.disabled) {
            event.stopPropagation();
        } else {
            this.executeRowAction.emit(new DataRowActionEvent(row, action));
        }
    }

    getHideActionsWithoutHoverClass(actionsMenuTrigger: MatMenuTrigger) {
        return { 'adf-datatable-hide-actions-without-hover': this.actionsVisibleOnHover && !actionsMenuTrigger.menuOpen };
    }

    rowAllowsDrop(row: DataRow): boolean {
        return row.isDropTarget === true;
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
        const contextMenuSourceClass = row.isContextMenuSource ? 'adf-context-menu-source' : '';
        const isDragEnabled = this.enableDragRows ? 'adf-drag-row' : '';
        return `${row.cssClass} ${this.rowStyleClass} ${contextMenuSourceClass} ${isDragEnabled}`;
    }

    markRowAsContextMenuSource(selectedRow: DataRow): void {
        this.selectedRowId = selectedRow.id ? selectedRow.id : '';
        this.data.getRows().forEach((row) => (row.isContextMenuSource = false));
        selectedRow.isContextMenuSource = true;
    }

    private setRowAsContextSource(): void {
        const selectedRow = this.data.getRows().find((row) => this.selectedRowId === row.id);
        if (selectedRow) {
            selectedRow.isContextMenuSource = true;
        }
    }

    selectRow(row: DataRow, value: boolean) {
        if (row) {
            row.isSelected = value;
            const idx = row?.id ? this.findSelectionById(row.id) : this.selection.indexOf(row);
            if (value) {
                if (idx < 0) {
                    this.selection.push(row);
                }
            } else {
                if (idx > -1) {
                    this.selection.splice(idx, 1);
                }
            }

            this.selectedItemsCountChanged.emit(this.selection.length);
        }
    }

    findSelectionById(id: string): number {
        return this.selection.findIndex((selection) => selection?.id === id);
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
        return this.data.getColumns().filter((column) => column.sortable === true);
    }

    isEmpty() {
        return this.data.getRows().length === 0;
    }

    isHeaderVisible() {
        let headerVisibility: boolean;

        if (this.showHeader === ShowHeaderMode.Data) {
            headerVisibility = !this.loading && !this.noPermission && !this.isEmpty();
        } else if (this.showHeader === ShowHeaderMode.Always) {
            headerVisibility = !this.loading && !this.noPermission;
        } else if (this.showHeader === ShowHeaderMode.Never) {
            headerVisibility = false;
        }
        return headerVisibility;
    }

    isStickyHeaderEnabled() {
        return this.stickyHeader && this.isHeaderVisible();
    }

    private emitRowSelectionEvent(name: string, row: DataRow) {
        const domEvent = new CustomEvent(name, {
            detail: {
                row,
                selection: this.selection
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    private emitSortingChangedEvent(key: string, sortingKey: string, direction: string) {
        const domEvent = new CustomEvent('sorting-changed', {
            detail: {
                key,
                sortingKey,
                direction
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    ngOnDestroy() {
        this.unsubscribeClickStream();
    }

    getNameColumnValue() {
        return this.data.getColumns().find((el: any) => el.key.includes('name'));
    }

    getAutomationValue(row: DataRow): any {
        const name = this.getNameColumnValue();
        return name ? row.getValue(name.key) : '';
    }

    getAriaSort(column: DataColumn): string {
        if (!this.isColumnSortActive(column)) {
            return 'ADF-DATATABLE.ACCESSIBILITY.SORT_NONE';
        }

        return this.isColumnSorted(column, 'asc') ? 'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING' : 'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING';
    }

    getSortLiveAnnouncement(column: DataColumn): string {
        if (!this.isColumnSortActive(column)) {
            return 'ADF-DATATABLE.ACCESSIBILITY.SORT_DEFAULT';
        }
        return this.isColumnSorted(column, 'asc')
            ? 'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING_BY'
            : 'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING_BY';
    }

    private registerDragHandleIcon(): void {
        const iconUrl = this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/drag_indicator_24px.svg');

        this.matIconRegistry.addSvgIconInNamespace('adf', 'drag_indicator', iconUrl);
    }

    onResizing({ rectangle: { width } }: ResizeEvent, colIndex: number): void {
        const timeoutId = setTimeout(() => {
            const allColumns = this.getVisibleColumns();
            allColumns[colIndex].width = width;
            this.data.setColumns(allColumns);

            if (!this.isResizing) {
                clearTimeout(timeoutId);
            }
        });
    }

    onResizingEnd(): void {
        this.resizingColumnIndex = -1;

        this.updateColumnsWidths();
    }

    getFlexValue({ width = 0 }: DataColumn): string {
        return `0 1 ${width < DataTableComponent.MINIMUM_COLUMN_SIZE ? DataTableComponent.MINIMUM_COLUMN_SIZE : width}px`;
    }

    filterDisabledColumns(index: number, _drag: CdkDrag, drop: CdkDropList): boolean {
        return !drop.getSortedItems()[index].disabled;
    }

    onDragDrop(droppedEvent: CdkDragDrop<any>): void {
        if (this.enableDragRows) {
            this.dragDropped.emit({ previousIndex: droppedEvent.previousIndex, currentIndex: droppedEvent.currentIndex });
        }
    }

    onDragStart(): void {
        this.isDraggingRow = true;
    }

    onDragEnd(): void {
        this.isDraggingRow = false;
    }

    private updateColumnsWidths(): void {
        const allColumns = this.data.getColumns();

        const headerContainer: HTMLElement = document.querySelector('.adf-datatable-header');

        if (headerContainer) {
            const headerContainerColumns = headerContainer.querySelectorAll('.adf-datatable-cell-header:not(.adf-datatable-checkbox)');

            headerContainerColumns.forEach((column: HTMLElement, index: number): void => {
                if (allColumns[index]) {
                    if (index === 0) {
                        allColumns[index].width = column.clientWidth - parseInt(window.getComputedStyle(column).paddingLeft, 10);
                    } else if (index === headerContainerColumns.length - 1) {
                        allColumns[index].width = column.clientWidth - parseInt(window.getComputedStyle(column).paddingRight, 10);
                    } else {
                        allColumns[index].width = column.clientWidth;
                    }
                }
            });
        }
        this.data.setColumns(allColumns);

        this.columnsWidthChanged.emit(allColumns);
    }

    private isSortingEqual(col: DataColumn, direction: string, sorting: DataSorting): boolean {
        return sorting && (sorting.key === col.key || sorting.key === col.sortingKey) && sorting.direction?.toLocaleLowerCase() === direction;
    }

    get isResizing(): boolean {
        return this.resizingColumnIndex >= 0;
    }
}

export interface DataTableDropEvent {
    detail: {
        target: 'cell' | 'header';
        event: Event;
        column: DataColumn;
        row?: DataRow;
    };

    preventDefault(): void;
}
