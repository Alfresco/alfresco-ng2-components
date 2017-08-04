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

import {
    AfterContentInit, Component, ContentChild, DoCheck, ElementRef, EventEmitter, Input,
    IterableDiffers, OnChanges, Output, SimpleChange, SimpleChanges, TemplateRef
} from '@angular/core';
import { MdCheckboxChange } from '@angular/material';
import { AlfrescoTranslationService, DataColumnListComponent } from 'ng2-alfresco-core';
import { Observable, Observer, Subscription } from 'rxjs/Rx';
import { DataColumn, DataRow, DataRowEvent, DataSorting, DataTableAdapter } from '../../data/datatable-adapter';
import { ObjectDataRow, ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataCellEvent } from './data-cell.event';
import { DataRowActionEvent } from './data-row-action.event';

@Component({
    selector: 'adf-datatable, alfresco-datatable',
    styleUrls: ['./datatable.component.scss'],
    templateUrl: './datatable.component.html'
})
export class DataTableComponent implements AfterContentInit, OnChanges, DoCheck {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @Input()
    data: DataTableAdapter;

    @Input()
    rows: any[] = [];

    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    @Input()
    multiselect: boolean = false;

    @Input()
    actions: boolean = false;

    @Input()
    actionsPosition: string = 'right'; // left|right

    @Input()
    fallbackThumbnail: string;

    @Input()
    contextMenu: boolean = false;

    @Input()
    allowDropFiles: boolean = false;

    @Input()
    rowStyle: string;

    @Input()
    rowStyleClass: string = '';

    @Input()
    showHeader: boolean = true;

    @Output()
    rowClick: EventEmitter<DataRowEvent> = new EventEmitter<DataRowEvent>();

    @Output()
    rowDblClick: EventEmitter<DataRowEvent> = new EventEmitter<DataRowEvent>();

    @Output()
    showRowContextMenu: EventEmitter<DataCellEvent> = new EventEmitter<DataCellEvent>();

    @Output()
    showRowActionsMenu: EventEmitter<DataCellEvent> = new EventEmitter<DataCellEvent>();

    @Output()
    executeRowAction: EventEmitter<DataRowActionEvent> = new EventEmitter<DataRowActionEvent>();

    @Input()
    loading: boolean = false;

    noContentTemplate: TemplateRef<any>;
    loadingTemplate: TemplateRef<any>;

    isSelectAllChecked: boolean = false;
    selection = new Array<DataRow>();

    private clickObserver: Observer<DataRowEvent>;
    private click$: Observable<DataRowEvent>;

    private schema: DataColumn[] = [];

    private differ: any;

    private singleClickStreamSub: Subscription;
    private multiClickStreamSub: Subscription;

    constructor(translateService: AlfrescoTranslationService,
                private elementRef: ElementRef,
                differs: IterableDiffers) {
        if (differs) {
            this.differ = differs.find([]).create(null);
        }
        this.click$ = new Observable<DataRowEvent>(observer => this.clickObserver = observer).share();

        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-datatable', 'assets/ng2-alfresco-datatable');
        }
    }

    ngAfterContentInit() {
        this.setTableSchema();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initAndSubscribeClickStream();
        if (this.isPropertyChanged(changes['data'])) {
            if (this.isTableEmpty()) {
                this.initTable();
            } else {
                this.data = changes['data'].currentValue;
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
        return rows.map(row => new ObjectDataRow(row));
    }

    private initAndSubscribeClickStream() {
        this.unsubscribeClickStream();
        let singleClickStream = this.click$
            .buffer(this.click$.debounceTime(250))
            .map(list => list)
            .filter(x => x.length === 1);

        this.singleClickStreamSub = singleClickStream.subscribe((obj: DataRowEvent[]) => {
            let event: DataRowEvent = obj[0];
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
            .buffer(this.click$.debounceTime(250))
            .map(list => list)
            .filter(x => x.length >= 2);

        this.multiClickStreamSub = multiClickStream.subscribe((obj: DataRowEvent[]) => {
            let event: DataRowEvent = obj[0];
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
        }
        if (this.multiClickStreamSub) {
            this.multiClickStreamSub.unsubscribe();
        }
    }

    private initTable() {
        this.data = new ObjectDataTableAdapter(this.rows, this.schema);
    }

    isTableEmpty() {
        return this.data === undefined || this.data === null;
    }

    private setTableRows(rows) {
        if (this.data) {
            this.data.setRows(this.convertToRowsData(rows));
        }
    }

    private setTableSchema() {
        if (this.columnList && this.columnList.columns) {
            this.schema = this.columnList.columns.map(c => <DataColumn> c);
        }

        if (this.data && this.schema && this.schema.length > 0) {
            this.data.setColumns(this.schema);
        }
    }

    onRowClick(row: DataRow, e: MouseEvent) {
        if (e) {
            e.preventDefault();
        }

        if (row) {
            if (this.data) {
                const newValue = !row.isSelected;
                const domEventName = newValue ? 'row-select' : 'row-unselect';

                if (this.isSingleSelectionMode()) {
                    this.resetSelection();
                    this.selectRow(row, newValue);
                    this.emitRowSelectionEvent(domEventName, row);
                }

                if (this.isMultiSelectionMode()) {
                    const modifier = e.metaKey || e.ctrlKey;
                    if (!modifier) {
                        this.resetSelection();
                    }
                    this.selectRow(row, newValue);
                    this.emitRowSelectionEvent(domEventName, row);
                }
            }

            const dataRowEvent = new DataRowEvent(row, e, this);
            this.clickObserver.next(dataRowEvent);
        }
    }

    resetSelection(): void {
        if (this.data) {
            const rows = this.data.getRows();
            if (rows && rows.length > 0) {
                rows.forEach(r => r.isSelected = false);
            }
            this.selection.splice(0);
        }
        this.isSelectAllChecked = false;
    }

    onRowDblClick(row: DataRow, e?: Event) {
        if (e) {
            e.preventDefault();
        }
        let dataRowEvent = new DataRowEvent(row, e, this);
        this.clickObserver.next(dataRowEvent);
    }

    onColumnHeaderClick(column: DataColumn) {
        if (column && column.sortable) {
            let current = this.data.getSorting();
            let newDirection = 'asc';
            if (current && column.key === current.key) {
                newDirection = current.direction === 'asc' ? 'desc' : 'asc';
            }
            this.data.setSorting(new DataSorting(column.key, newDirection));
        }
    }

    onSelectAllClick(e: MdCheckboxChange) {
        this.isSelectAllChecked = e.checked;

        if (this.multiselect) {
            let rows = this.data.getRows();
            if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    this.selectRow(rows[i], e.checked);
                }
            }

            const domEventName = e.checked ? 'row-select' : 'row-unselect';
            const row = this.selection.length > 0 ? this.selection[0] : null;

            this.emitRowSelectionEvent(domEventName, row);
        }
    }

    onCheckboxChange(row: DataRow, event: MdCheckboxChange) {
        const newValue = event.checked;

        this.selectRow(row, newValue);

        const domEventName = newValue ? 'row-select' : 'row-unselect';
        this.emitRowSelectionEvent(domEventName, row);
    }

    onImageLoadingError(event: Event) {
        if (event && this.fallbackThumbnail) {
            let element = <any> event.target;
            element.src = this.fallbackThumbnail;
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
        return 'ICONS.' + value.substring(value.lastIndexOf('/') + 1).replace(/\.[a-z]+/, '');
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

    getRowActions(row: DataRow, col: DataColumn): any[] {
        let event = new DataCellEvent(row, col, []);
        this.showRowActionsMenu.emit(event);
        return event.value.actions;
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

    private selectRow(row: DataRow, value: boolean) {
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
}
