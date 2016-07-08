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
import {
    DataTableAdapter,
    DataRow, DataColumn, DataSorting
} from 'ng2-alfresco-datatable';

import { NodePaging, MinimalNodeEntity } from './../models/document-library.model';
import { DocumentListService } from './../services/document-list.service';

export class ShareDataTableAdapter implements DataTableAdapter {

    static ERR_ROW_NOT_FOUND: string = 'Row not found';
    static ERR_COL_NOT_FOUND: string = 'Column not found';

    static DEFAULT_DATE_FORMAT: string = 'medium';

    private sorting: DataSorting;
    private rows: DataRow[];
    private columns: DataColumn[];

    thumbnails: boolean = false;

    constructor(private documentListService: DocumentListService,
                private basePath: string,
                schema: DataColumn[]) {
        this.rows = [];
        this.columns = schema || [];
    }

    getRows(): Array<DataRow> {
        return this.rows;
    }

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
            throw new Error(ShareDataTableAdapter.ERR_ROW_NOT_FOUND);
        }
        if (!col) {
            throw new Error(ShareDataTableAdapter.ERR_COL_NOT_FOUND);
        }
        let value = row.getValue(col.key);

        if (col.type === 'date') {
            let datePipe = new DatePipe();
            let format = col.format || ShareDataTableAdapter.DEFAULT_DATE_FORMAT;
            try {
                return datePipe.transform(value, format);
            } catch (err) {
                console.error(`Error parsing date ${value} to format ${format}`);
            }
        }

        if (col.type === 'image') {

            if (col.key === '$thumbnail') {
                let node = (<ShareDataRow> row).node;

                if (node.entry.isFolder) {
                    return `${this.basePath}/img/ft_ic_folder.svg`;
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
                                return `${this.basePath}/img/${icon}`;
                            }
                        }
                    }
                }

                return `${this.basePath}/img/ft_ic_miscellaneous.svg`;
            }

        }

        return value;
    }

    getSorting(): DataSorting {
        return this.sorting;
    }

    setSorting(sorting: DataSorting): void {
        this.sorting = sorting;

        if (sorting && sorting.key && this.rows && this.rows.length > 0) {
            this.rows.sort((a: ShareDataRow, b: ShareDataRow) => {
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

    sort(key?: string, direction?: string): void {
        let sorting = this.sorting || new DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
        }
        this.setSorting(sorting);
    }

    loadPath(path: string) {
        if (path && this.documentListService) {
            this.documentListService
                .getFolder(path)
                .subscribe(val => {
                    let page = <NodePaging>val;
                    let rows = [];

                    if (page && page.list) {
                        let data = page.list.entries;
                        if (data && data.length > 0) {
                            rows = data.map(item => new ShareDataRow(item));

                            // Sort by first sortable or just first column
                            if (this.columns && this.columns.length > 0) {
                                let sortable = this.columns.filter(c => c.sortable);
                                if (sortable.length > 0) {
                                    this.sort(sortable[0].key, 'asc');
                                } else {
                                    this.sort(this.columns[0].key, 'asc');
                                }
                            }
                        }
                    }

                    this.rows = rows;
                },
                error => console.error(error));
        }
    }

}

export class ShareDataRow implements DataRow {

    static ERR_OBJECT_NOT_FOUND: string = 'Object source not found';

    isSelected: boolean = false;

    get node(): MinimalNodeEntity {
        return this.obj;
    }

    constructor(private obj: MinimalNodeEntity) {
        if (!obj) {
            throw new Error(ShareDataRow.ERR_OBJECT_NOT_FOUND);
        }
    }

    getValue(key: string): any {
        return ObjectUtils.getValue(this.obj.entry, key);
    }

    hasValue(key: string): boolean {
        return this.getValue(key) ? true : false;
    }
}
