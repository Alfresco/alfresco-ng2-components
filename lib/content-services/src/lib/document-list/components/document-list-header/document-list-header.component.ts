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

import { Component, ElementRef, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { MatCheckboxChange } from '@angular/material';
import { DataColumn } from '../../../../../../core/datatable/data/data-column.model';
import { DataRow } from '../../../../../../core/datatable/data/data-row.model';
import { DataSorting } from '../../../../../../core/datatable/data/data-sorting.model';
import { DataTableAdapter } from '../../../../../../core/datatable/data/datatable-adapter';
import { DataTableRowComponent } from '@alfresco/adf-core';
import { ResultSetPaging, NodePaging } from '@alfresco/js-api';
import { SearchCategory, SearchQueryBuilderService } from '../../../search';
import { DocumentListComponent } from '../document-list.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum DisplayMode {
    List = 'list',
    Gallery = 'gallery'
}

@Component({
    selector: 'adf-document-list-header',
    templateUrl: './document-list-header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DocumentListHeaderComponent implements OnInit, OnDestroy {

    /** Selects the display mode of the table. Can be "list" or "gallery". */
    @Input()
    display: string = DisplayMode.List;

    /** Toggles the header. */
    @Input()
    showHeader: boolean = true;

    /** Toggles the data actions column. */
    @Input()
    actions: boolean = false;

    /** Position of the actions dropdown menu. Can be "left" or "right". */
    @Input()
    actionsPosition: string = 'right'; // left|right

    /** Toggles multiple row selection, which renders checkboxes at the beginning of each row. */
    @Input()
    multiselect: boolean = false;

    /** Data source for the table */
    @Input()
    data: DataTableAdapter;

    /** Flag that indicates if the datatable is in loading state and needs to show the
     * loading template (see the docs to learn how to configure a loading template).
     */
    @Input()
    loading: boolean = false;

    /** Flag that indicates if the datatable should show the "no permission" template. */
    @Input()
    noPermission: boolean = false;

    /** Toggles the sticky header mode. */
    @Input()
    stickyHeader: boolean = false;

    @Input()
    documentList: DocumentListComponent;

    isSelectAllIndeterminate: boolean = false;
    isSelectAllChecked: boolean = false;
    selection = new Array<DataRow>();
    searchCategories: SearchCategory[] = [];
    private onDestroy$ = new Subject<boolean>();

    mockCategory: SearchCategory = {
        id: 'queryName',
        name: 'queryName',
        enabled: true,
        expanded: false,
        component: {
            selector: 'text',
            settings: {
                field: 'cm:name',
                pattern: "cm:name:'(.*?)'",
                placeholder: 'Enter the name'
            }
        }
    };

    private keyManager: FocusKeyManager<DataTableRowComponent>;

    constructor(private elementRef: ElementRef,
                public queryBuilder: SearchQueryBuilderService ) { }

    ngOnInit() {
        this.data.getColumns().forEach(() => {
            this.searchCategories.push(this.mockCategory);
        });

        this.queryBuilder.updated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                const currentPath = this.getCurrentPath();
                this.queryBuilder.execute(currentPath);
            });

        this.queryBuilder.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((resultSetPaging: ResultSetPaging) => {
                this.documentList.node = <NodePaging> resultSetPaging;
                this.documentList.reload();
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    getCurrentPath(): string {
        let currentPath = '';
        if (this.documentList.folderNode) {
            currentPath = `workspace://SpacesStore/${this.documentList.folderNode.id}`;
        }
        // console.log(currentPath);
        return currentPath;
    }

    onSelectAllClick(matCheckboxChange: MatCheckboxChange) {
        this.isSelectAllChecked = matCheckboxChange.checked;
        this.isSelectAllIndeterminate = false;

        if (this.multiselect) {
            const rows = this.data.getRows();
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

        this.keyManager.updateActiveItemIndex(0);
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

    isColumnSorted(col: DataColumn, direction: string): boolean {
        if (col && direction) {
            const sorting = this.data.getSorting();
            return sorting && sorting.key === col.key && sorting.direction === direction;
        }
        return false;
    }

    getAriaSort(column: DataColumn): string {
        if (!this.isColumnSortActive(column)) {
            return 'ADF-DATATABLE.ACCESSIBILITY.SORT_NONE';
        }

        return this.isColumnSorted(column, 'asc') ?
            'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING' :
            'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING';
    }

    getSortLiveAnnouncement(column: DataColumn): string {
        if (!this.isColumnSortActive(column)) {
            return 'ADF-DATATABLE.ACCESSIBILITY.SORT_DEFAULT' ;
        }
        return this.isColumnSorted(column, 'asc') ?
            'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING_BY' :
            'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING_BY';
    }

    isColumnSortActive(column: DataColumn): boolean {
        if (!column || !this.data.getSorting()) {
            return false;
        }
        return column.key === this.data.getSorting().key;
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

    isHeaderVisible() {
        return !this.loading && !this.isEmpty() && !this.noPermission;
    }

    isStickyHeaderEnabled() {
        return this.stickyHeader && this.isHeaderVisible();
    }

    isEmpty() {
        return this.data.getRows().length === 0;
    }

    stopEventPropagation(event: Event) {
        event.stopPropagation();
    }
}
