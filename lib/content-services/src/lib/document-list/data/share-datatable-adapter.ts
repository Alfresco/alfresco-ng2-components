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
    DataColumn,
    DataRow,
    DataSorting,
    DataTableAdapter,
    ThumbnailService,
    ContentService
} from '@alfresco/adf-core';
import { NodePaging, NodeEntry } from '@alfresco/js-api';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { ShareDataRow } from './share-data-row.model';
import { RowFilter } from './row-filter.model';

export class ShareDataTableAdapter implements DataTableAdapter {

    ERR_ROW_NOT_FOUND: string = 'Row not found';
    ERR_COL_NOT_FOUND: string = 'Column not found';

    private _sortingMode: string;
    private sorting: DataSorting;
    private rows: DataRow[];
    private columns: DataColumn[];

    private filter: RowFilter;
    private imageResolver: any;

    thumbnails: boolean = false;
    permissionsStyle: PermissionStyleModel[];
    selectedRow: DataRow;
    allowDropFiles: boolean;
    preSelectedRows: DataRow[] = [];

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

    constructor(private thumbnailService: ThumbnailService,
                private contentService: ContentService,
                schema: DataColumn[] = [],
                sorting?: DataSorting,
                sortingMode: string = 'client',
                allowDropFiles: boolean = false) {
        this.rows = [];
        this.columns = schema || [];
        this.sorting = sorting;
        this.sortingMode = sortingMode;
        this.allowDropFiles = allowDropFiles;
    }

    getRows(): Array<DataRow> {
        return this.rows;
    }

    // TODO: disable this api
    setRows(rows: Array<DataRow>) {
        this.rows = rows || [];
        this.sort();
    }

    getPreSelectedRows(): Array<DataRow> {
        return this.preSelectedRows;
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
        const dataRow: ShareDataRow = <ShareDataRow> row;
        const value: any = row.getValue(col.key);
        if (dataRow.cache[col.key] !== undefined) {
            return dataRow.cache[col.key];
        }

        if (col.key === '$thumbnail') {

            if (this.imageResolver) {
                const resolved = this.imageResolver(row, col);
                if (resolved) {
                    return resolved;
                }
            }

            const node = (<ShareDataRow> row).node;

            if (node.entry.isFolder) {
                return this.getFolderIcon(node);
            }

            if (node.entry.isFile) {
                if (this.thumbnails) {
                    return this.thumbnailService.getDocumentThumbnailUrl(node);
                }
            }

            if (node.entry.content) {
                const mimeType = node.entry.content.mimeType;
                if (mimeType) {
                    return this.thumbnailService.getMimeTypeIcon(mimeType);
                }
            }

            return this.thumbnailService.getDefaultMimeTypeIcon();
        }

        if (col.type === 'image') {

            if (this.imageResolver) {
                const resolved = this.imageResolver(row, col);
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
        const sorting = this.sorting || new DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
        }
        this.setSorting(sorting);
    }

    setFilter(filter: RowFilter) {
        this.filter = filter;
    }

    setImageResolver(resolver: any) {
        this.imageResolver = resolver;
    }

    private getFolderIcon(node: any) {
        if (this.isSmartFolder(node)) {
            return this.thumbnailService.getMimeTypeIcon('smartFolder');
        } else if (this.isRuleFolder(node)) {
            return this.thumbnailService.getMimeTypeIcon('ruleFolder');
        } else if (this.isALinkFolder(node)) {
            return this.thumbnailService.getMimeTypeIcon('linkFolder');
        } else {
            return this.thumbnailService.getMimeTypeIcon('folder');
        }
    }

    isSmartFolder(node: any) {
        const nodeAspects = this.getNodeAspectNames(node);
        return nodeAspects.indexOf('smf:customConfigSmartFolder') > -1 ||
            (nodeAspects.indexOf('smf:systemConfigSmartFolder') > -1);
    }

    isRuleFolder(node: any) {
        const nodeAspects = this.getNodeAspectNames(node);
        return nodeAspects.indexOf('rule:rules') > -1 ||
            (nodeAspects.indexOf('rule:rules') > -1);
    }

    isALinkFolder(node: any) {
        const nodeType = node.entry ? node.entry.nodeType : node.nodeType;
        return nodeType === 'app:folderlink';
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

    public loadPage(nodePaging: NodePaging, merge: boolean = false, allowDropFiles?: boolean, preSelectedRows: NodeEntry[] = []) {
        let shareDataRows: ShareDataRow[] = [];
        if (allowDropFiles !== undefined) {
            this.allowDropFiles = allowDropFiles;
        }
        if (nodePaging && nodePaging.list) {
            const nodeEntries: NodeEntry[] = nodePaging.list.entries;
            if (nodeEntries && nodeEntries.length > 0) {
                shareDataRows = nodeEntries.map((item) => new ShareDataRow(item, this.contentService, this.permissionsStyle,
                    this.thumbnailService, this.allowDropFiles));

                if (this.filter) {
                    shareDataRows = shareDataRows.filter(this.filter);
                }

                if (this.sortingMode !== 'server') {
                    // Sort by first sortable or just first column
                    if (this.columns && this.columns.length > 0) {
                        const sorting = this.getSorting();
                        if (sorting) {
                            this.sortRows(shareDataRows, sorting);
                        } else {
                            const sortable = this.columns.filter((c) => c.sortable);
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
            const listPrunedDuplicate = shareDataRows.filter((elementToFilter: any) => {
                const isPresent = this.rows.find((currentRow: any) => {
                    return currentRow.obj.entry.id === elementToFilter.obj.entry.id;
                });

                return !isPresent;
            });

            this.rows = this.rows.concat(listPrunedDuplicate);
        } else {
            this.rows = shareDataRows;
        }
        this.setPreSelectedRows(preSelectedRows);
    }

    setPreSelectedRows(preSelectedRows: NodeEntry[]) {
        const selectedRows: DataRow[] = [];
        if (preSelectedRows) {
            this.rows = this.rows.map((row) => {
                preSelectedRows.map((res) => {
                    if (row.obj.entry.id === res.entry.id) {
                        row.isSelected = true;
                        selectedRows.push(row);
                    }
                });
                return row;
            });
        }

        this.preSelectedRows = [...selectedRows];
    }

}
