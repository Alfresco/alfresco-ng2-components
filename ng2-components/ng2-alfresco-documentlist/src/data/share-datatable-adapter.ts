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

import { DatePipe } from '@angular/common';
import { ObjectUtils } from 'ng2-alfresco-core';
import { DataTableAdapter, DataRow, DataColumn, DataSorting } from 'ng2-alfresco-datatable';

import { NodePaging, NodeMinimalEntry } from './../models/document-library.model';
import { DocumentListService } from './../services/document-list.service';

declare var require: any;

export class ShareDataTableAdapter implements DataTableAdapter {

    ERR_ROW_NOT_FOUND: string = 'Row not found';
    ERR_COL_NOT_FOUND: string = 'Column not found';

    DEFAULT_DATE_FORMAT: string = 'medium';

    private sorting: DataSorting;
    private rows: DataRow[];
    private columns: DataColumn[];
    private page: NodePaging;

    private filter: RowFilter;
    private imageResolver: ImageResolver;

    thumbnails: boolean = false;
    selectedRow: DataRow;

    constructor(private documentListService: DocumentListService,
                schema: DataColumn[] = [],
                sorting?: DataSorting) {
        this.rows = [];
        this.columns = schema || [];
        this.sorting = sorting;
    }

    getRows(): Array<DataRow> {
        return this.rows;
    }

    // TODO: disable this api
    setRows(rows: Array<DataRow>) {
        this.rows = rows || [];
        this.sort();
    }

    getColumns(): Array<DataColumn> {
        return this.columns;
    }

    setColumns(columns: Array<DataColumn>) {
        this.columns = columns || [];
    }

    getValue(row: DataRow, col: DataColumn): any {
        if (!row) {
            throw new Error(this.ERR_ROW_NOT_FOUND);
        }
        if (!col) {
            throw new Error(this.ERR_COL_NOT_FOUND);
        }
        let dataRow: ShareDataRow = <ShareDataRow> row;
        let value: any = row.getValue(col.key);
        if (dataRow.cache[col.key] !== undefined) {
            return dataRow.cache[col.key];
        }

        if (col.type === 'date') {
            let datePipe = new DatePipe('en-US');
            let format = col.format || this.DEFAULT_DATE_FORMAT;
            try {
                let result = datePipe.transform(value, format);
                return dataRow.cacheValue(col.key, result);
            } catch (err) {
                console.error(`Error parsing date ${value} to format ${format}`);
                return 'Error';
            }
        }

        if (col.type === 'image') {

            if (this.imageResolver) {
                let resolved = this.imageResolver(row, col);
                if (resolved) {
                    return resolved;
                }
            }

            if (col.key === '$thumbnail') {
                let node = (<ShareDataRow> row).node;

                if (node.entry.isFolder) {
                    return this.getImagePath('ft_ic_folder.svg');
                }

                if (node.entry.isFile) {

                    if (this.thumbnails) {
                        if (this.documentListService) {
                            return this.documentListService.getDocumentThumbnailUrl(node);
                        }
                        return null;
                    }

                    if (node.entry.content) {
                        let mimeType = node.entry.content.mimeType;
                        if (mimeType) {
                            let icon = this.documentListService.getMimeTypeIcon(mimeType);
                            if (icon) {
                                return this.getImagePath(icon);
                            }
                        }
                    }
                }

                return this.getImagePath('ft_ic_miscellaneous.svg');
            }

        }

        return dataRow.cacheValue(col.key, value);
    }

    getSorting(): DataSorting {
        return this.sorting;
    }

    setSorting(sorting: DataSorting): void {
        this.sorting = sorting;
        this.sortRows(this.rows, this.sorting);
    }

    sort(key?: string, direction?: string): void {
        let sorting = this.sorting || new DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
        }
        this.setSorting(sorting);
    }

    setFilter(filter: RowFilter) {
        this.filter = filter;
    }

    setImageResolver(resolver: ImageResolver) {
        this.imageResolver = resolver;
    }

    private sortRows(rows: DataRow[], sorting: DataSorting) {
        if (sorting && sorting.key && rows && rows.length > 0) {
            rows.sort((a: ShareDataRow, b: ShareDataRow) => {
                if (a.node.entry.isFolder !== b.node.entry.isFolder) {
                    return a.node.entry.isFolder ? -1 : 1;
                }

                let left = a.getValue(sorting.key);
                if (left) {
                    left = (left instanceof Date) ? left.valueOf().toString() : left.toString();
                } else {
                    left = '';
                }

                let right = b.getValue(sorting.key);
                if (right) {
                    right = (right instanceof Date) ? right.valueOf().toString() : right.toString();
                } else {
                    right = '';
                }

                return sorting.direction === 'asc'
                    ? left.localeCompare(right)
                    : right.localeCompare(left);
            });
        }
    }

    public loadPage(page: NodePaging) {
        this.page = page;

        let rows = [];

        if (page && page.list) {
            let data = page.list.entries;
            if (data && data.length > 0) {
                rows = data.map(item => new ShareDataRow(item));

                if (this.filter) {
                    rows = rows.filter(this.filter);
                }

                // Sort by first sortable or just first column
                if (this.columns && this.columns.length > 0) {
                    let sorting = this.getSorting();
                    if (sorting) {
                        this.sortRows(rows, sorting);
                    } else {
                        let sortable = this.columns.filter(c => c.sortable);
                        if (sortable.length > 0) {
                            this.sort(sortable[0].key, 'asc');
                        } else {
                            this.sort(this.columns[0].key, 'asc');
                        }
                    }
                }
            }
        }

        this.rows = rows;
    }

    getImagePath(id: string): any {
        return require('../assets/images/' + id);
    }
}

export class ShareDataRow implements DataRow {

    static ERR_OBJECT_NOT_FOUND: string = 'Object source not found';

    cache: { [key: string]: any } = {};
    isSelected: boolean = false;
    readonly isDropTarget;

    get node(): NodeMinimalEntry {
        return this.obj;
    }

    constructor(private obj: NodeMinimalEntry) {
        if (!obj) {
            throw new Error(ShareDataRow.ERR_OBJECT_NOT_FOUND);
        }

        this.isDropTarget = obj.entry && obj.entry.isFolder;
    }

    cacheValue(key: string, value: any): any {
        this.cache[key] = value;
        return value;
    }

    getValue(key: string): any {
        if (this.cache[key] !== undefined) {
            return this.cache[key];
        }
        return ObjectUtils.getValue(this.obj.entry, key);
    }

    hasValue(key: string): boolean {
        return this.getValue(key) !== undefined;
    }
}

export interface RowFilter {
    (value: ShareDataRow, index: number, array: ShareDataRow[]): any;
}

export interface ImageResolver {
    (row: DataRow, column: DataColumn): string;
}
