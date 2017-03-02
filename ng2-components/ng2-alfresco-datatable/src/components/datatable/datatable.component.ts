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

import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { DataTableAdapter, DataRow, DataColumn, DataSorting, DataRowEvent, ObjectDataTableAdapter } from '../../data/index';
import { DataCellEvent } from './data-cell.event';
import { DataRowActionEvent } from './data-row-action.event';

declare var componentHandler;

@Component({
    moduleId: module.id,
    selector: 'alfresco-datatable',
    styleUrls: ['./datatable.component.css'],
    templateUrl: './datatable.component.html'
})
export class DataTableComponent implements OnInit {

    @Input()
    data: DataTableAdapter;

    @Input()
    multiselect: boolean = false;

    @Input()
    actions: boolean = false;

    @Input()
    actionsPosition: string = 'right'; // left|right

    @Input()
    fallbackThumbnail: string;

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

    noContentTemplate: TemplateRef<any>;
    isSelectAllChecked: boolean = false;

    get selectedRow(): DataRow {
        return this.data.selectedRow;
    }

    ngOnInit() {
        if (!this.data) {
            this.data = new ObjectDataTableAdapter([], []);
        }

        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    onRowClick(row: DataRow, e?: Event) {
        if (e) {
            e.preventDefault();
        }

        if (this.data) {
            this.data.selectedRow = row;
        }

        this.rowClick.emit(new DataRowEvent(row, e));
    }

    onRowDblClick(row: DataRow, e?: Event) {
        if (e) {
            e.preventDefault();
        }

        this.rowDblClick.emit(new DataRowEvent(row, e));
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

    onSelectAllClick(e?: Event) {
        if (e) {
            e.preventDefault();
        }

        this.isSelectAllChecked = !this.isSelectAllChecked;

        if (this.multiselect) {
            let rows = this.data.getRows();
            if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    rows[i].isSelected = this.isSelectAllChecked;
                }
                // TODO: left for reference, will be removed during future revisions
                /*
                 this._ngZone.run(() => {
                 this.data.getRows()[1].isSelected = true;
                 });
                 */
            }
        }
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
        this.executeRowAction.emit(new DataRowActionEvent(row, action));
    }
}
