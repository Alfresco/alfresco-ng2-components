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
import { NodePaging } from 'alfresco-js-api';
import { TimeAgoPipe } from 'ng2-alfresco-core';
import { DataColumn, DataRow, DataSorting, DataTableAdapter } from 'ng2-alfresco-datatable';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { DocumentListService } from './../services/document-list.service';
import { ImageResolver } from './image-resolver.model';
import { RowFilter } from './row-filter.model';
import { ShareDataRow } from './share-data-row.model';

export class ShareDataTableAdapter implements DataTableAdapter {

    ERR_ROW_NOT_FOUND: string = 'Row not found';
    ERR_COL_NOT_FOUND: string = 'Column not found';

    private sorting: DataSorting;
    private rows: DataRow[];
    private columns: DataColumn[];
    private page: NodePaging;

    private filter: RowFilter;
    private imageResolver: ImageResolver;

    thumbnails: boolean = false;
    permissionsStyle: PermissionStyleModel[];
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
            try {
                const result = this.formatDate(col, value);
                return dataRow.cacheValue(col.key, result);
            } catch (err) {
                console.error(`Error parsing date ${value} to format ${col.format}`);
                return 'Error';
            }
        }

        if (col.key === '$thumbnail') {
            const node = (<ShareDataRow> row).node;

            if (node.entry.isFolder) {
                return this.documentListService.getMimeTypeIcon('folder');
            }

            if (node.entry.isFile) {
                if (this.thumbnails) {
                    return this.documentListService.getDocumentThumbnailUrl(node);
                }
            }

            if (node.entry.content) {
                const mimeType = node.entry.content.mimeType;
                if (mimeType) {
                    return this.documentListService.getMimeTypeIcon(mimeType);
                }
            }

            return this.documentListService.getDefaultMimeTypeIcon();
        }

        if (col.type === 'image') {

            if (this.imageResolver) {
                let resolved = this.imageResolver(row, col);
                if (resolved) {
                    return resolved;
                }
            }
        }

        return dataRow.cacheValue(col.key, value);
    }

    formatDate(col: DataColumn, value: any): string {
        if (col.type === 'date') {
            const format = col.format || 'medium';
            if (format === 'timeAgo') {
                const timeAgoPipe = new TimeAgoPipe();
                return timeAgoPipe.transform(value);
            } else {
                const datePipe = new DatePipe('en-US');
                return datePipe.transform(value, format);
            }
        }

        return value;
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
        const options: Intl.CollatorOptions = {};

        if (sorting && sorting.key && rows && rows.length > 0) {

            if (sorting.key.includes('sizeInBytes') || sorting.key === 'name') {
                options.numeric = true;
            }

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
                    ? left.localeCompare(right, undefined, options)
                    : right.localeCompare(left, undefined, options);
            });
        }
    }

    public loadPage(page: NodePaging, merge: boolean = false) {
        this.page = page;

        let rows = [];

        if (page && page.list) {
            let data = page.list.entries;
            if (data && data.length > 0) {
                rows = data.map(item => new ShareDataRow(item, this.documentListService, this.permissionsStyle));

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

        if (merge) {
            this.rows = this.rows.concat(rows);
        } else {
            this.rows = rows;
        }
    }
}
