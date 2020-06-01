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
import { Component, ViewEncapsulation, Input, ElementRef, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

import { DataTableAdapter } from '../../data/datatable-adapter';
import { DataColumn } from '../../data/data-column.model';
import { DataSorting } from '../../data/data-sorting.model';

@Component({
    selector: 'adf-datatable-header',
    // styleUrls: ['./datatable-header.component.scss'],
    templateUrl: './datatable-header.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-header' }
})
export class DataTableHeaderComponent {

    /** Toggles the header. */
    @Input()
    showHeader: boolean = true;

    /** Selects the display mode of the table. Can be "list" or "gallery". */
    @Input()
    display: string;

    /** Data source for the table */
    @Input()
    data: DataTableAdapter;

    /** Toggles the data actions column. */
    @Input()
    actions: boolean = false;

    /** Position of the actions dropdown menu. Can be "left" or "right". */
    @Input()
    actionsPosition: string = 'right'; // left|right

    /** Toggles multiple row selection, which renders checkboxes at the beginning of each row. */
    @Input()
    multiselect: boolean = false;

    /** Flag that indicates if the datatable is in loading state and needs to show the
     * loading template (see the docs to learn how to configure a loading template).
     */
    @Input()
    loading: boolean = false;

    /** Flag that indicates if the datatable should show the "no permission" template. */
    @Input()
    noPermission: boolean = false;

    @Input()
    isSelectAllIndeterminate: boolean = false;

    @Input()
    isSelectAllChecked: boolean = false;

    @Output()
    selectAll = new EventEmitter<MatCheckboxChange>();

    @ContentChild(TemplateRef)
    filterTemplateRef: TemplateRef<any>;

    constructor(private elementRef: ElementRef) { }

    isEmpty() {
        return this.data.getRows().length === 0;
    }

    isHeaderVisible() {
        return !this.loading && !this.isEmpty() && !this.noPermission && this.showHeader;
    }

    onSelectAllClick(matCheckboxChange: MatCheckboxChange) {
        this.selectAll.next(matCheckboxChange);
    }

    isColumnSorted(col: DataColumn, direction: string): boolean {
        if (col && direction) {
            const sorting = this.data.getSorting();
            return sorting && sorting.key === col.key && sorting.direction === direction;
        }
        return false;
    }

    onColumnHeaderClick(column: DataColumn) {
        if (column && column.sortable) {
            const current = this.data.getSorting();
            let newDirection = 'asc';
            if (current && column.key === current.key) {
                newDirection = current.direction === 'asc' ? 'desc' : 'asc';
            }
            this.data.setSorting(new DataSorting(column.key, newDirection));
            this.emitSortingChangedEvent(column.key, newDirection);
        }
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

    getAriaSort(column: DataColumn): string {
        if (!this.isColumnSortActive(column)) {
            return 'ADF-DATATABLE.ACCESSIBILITY.SORT_NONE';
        }

        return this.isColumnSorted(column, 'asc') ?
            'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING' :
            'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING';
    }

    isColumnSortActive(column: DataColumn): boolean {
        if (!column || !this.data.getSorting()) {
            return false;
        }
        return column.key === this.data.getSorting().key;
    }

    getSortLiveAnnouncement(column: DataColumn): string {
        if (!this.isColumnSortActive(column)) {
            return 'ADF-DATATABLE.ACCESSIBILITY.SORT_DEFAULT' ;
        }
        return this.isColumnSorted(column, 'asc') ?
            'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING_BY' :
            'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING_BY';
    }

    getSortingKey(): string | null {
        if (this.data.getSorting()) {
            return this.data.getSorting().key;
        }

        return null;
    }

    getSortableColumns() {
        return this.data.getColumns().filter((column) => {
            return column.sortable === true;
        });
    }
}
