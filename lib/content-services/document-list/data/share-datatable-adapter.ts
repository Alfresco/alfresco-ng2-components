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

import { DataColumn, DataRow, DataSorting, DataTableAdapter, ThumbnailService } from '@alfresco/adf-core';
import { NodePaging } from 'alfresco-js-api';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { DocumentListService } from './../services/document-list.service';
import { ShareDataRow } from './share-data-row.model';

export class ShareDataTableAdapter implements DataTableAdapter {

    ERR_ROW_NOT_FOUND: string = 'Row not found';
    ERR_COL_NOT_FOUND: string = 'Column not found';

    private _sortingMode: string;
    private sorting: DataSorting;
    private rows: DataRow[];
    private columns: DataColumn[];

    private filter: any;
    private imageResolver: any;

    thumbnails: boolean = false;
    permissionsStyle: PermissionStyleModel[];
    selectedRow: DataRow;

    set sortingMode(value: string) {
        let newValue = (value || 'client').toLowerCase();
        if (newValue !== 'client' && newValue !== 'server') {
            newValue = 'client';
        }
        this._sortingMode = newValue;
    }

    get sortingMode(): string {
        return this._sortingMode;
    }

    constructor(private documentListService: DocumentListService,
                private thumbnailService: ThumbnailService,
                schema: DataColumn[] = [],
                sorting?: DataSorting,
                sortingMode: string = 'client') {
        this.rows = [];
        this.columns = schema || [];
        this.sorting = sorting;
        this.sortingMode = sortingMode;
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

        if (col.key === '$thumbnail') {

            if (this.imageResolver) {
                let resolved = this.imageResolver(row, col);
                if (resolved) {
                    return resolved;
                }
            }

            const node = (<ShareDataRow> row).node;

            if (node.entry.isFolder) {
                if (this.isSmartFolder(node)) {
                    return this.documentListService.getMimeTypeIcon('smartFolder');
                } else {
                    return this.documentListService.getMimeTypeIcon('folder');
                }
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

    setFilter(filter: any) {
        this.filter = filter;
    }

    setImageResolver(resolver: any) {
        this.imageResolver = resolver;
    }

    isSmartFolder(node: any) {
        let nodeAspects = this.getNodeAspectNames(node);
        return nodeAspects.indexOf('smf:customConfigSmartFolder') > -1 ||
            (nodeAspects.indexOf('smf:systemConfigSmartFolder') > -1);
    }

    private getNodeAspectNames(node: any): any[] {
        return node.entry && node.entry.aspectNames ? node.entry.aspectNames : node.aspectNames ? node.aspectNames : [];
    }

    private sortRows(rows: DataRow[], sorting: DataSorting) {
        if (this.sortingMode === 'server') {
            return;
        }

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
        let rows = [];

        if (page && page.list) {
            let data = page.list.entries;
            if (data && data.length > 0) {
                rows = data.map(item => new ShareDataRow(item, this.documentListService, this.permissionsStyle, this.thumbnailService));

                if (this.filter) {
                    rows = rows.filter(this.filter);
                }

                if (this.sortingMode !== 'server') {
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
        }

        if (merge) {
            let listPrunedDuplicate = rows.filter((elementToFilter) => {
                let isPresent = this.rows.find((currentRow: any) => {
                    return currentRow.obj.entry.id === elementToFilter.obj.entry.id;
                });

                return !isPresent;
            });

            this.rows = this.rows.concat(listPrunedDuplicate);
        } else {
            this.rows = rows;
        }
    }
}
