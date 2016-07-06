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
import {
    DataTableAdapter,
    DataRow, DataColumn, DataSorting,
    ObjectDataColumn
} from 'ng2-alfresco-datatable';

import { NodePaging, MinimalNodeEntity } from './../models/document-library.model';
import { DocumentListService } from './../services/document-list.service';

export class ShareDataTableAdapter implements DataTableAdapter {

    private sorting: DataSorting;
    private rows: DataRow[];
    private columns: DataColumn[];

    thumbnails: boolean = false;

    constructor(private documentListService: DocumentListService,
                private basePath: string,
                schema: DataColumn[]) {
        this.rows = [];
        this.columns = [];

        if (schema && schema.length > 0) {
            this.columns = schema.map(item => {
                return new ObjectDataColumn(item);
            });
        }
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
            throw new Error('Row not found');
        }
        if (!col) {
            throw new Error('Column not found');
        }
        let value = row.getValue(col.key);

        if (col.type === 'date') {
            let datePipe = new DatePipe();
            let format = col.format || 'medium';
            try {
                return datePipe.transform(value, format);
            } catch (err) {
                console.error(`DocumentList: error parsing date ${value} to format ${format}`);
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

                    if (node.entry.content && node.entry.content.mimeType) {
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

        if (sorting && sorting.key) {
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
                            let sortable = this.columns.filter(c => c.sortable);
                            if (sortable.length > 0) {
                                this.sort(sortable[0].key, 'asc');
                            } else {
                                this.sort(this.columns[0].key, 'asc');
                            }
                        }
                    }

                    this.rows = [];
                },
                error => console.log(error));
        }
    }

}

export class ShareDataRow implements DataRow {
    isSelected: boolean = false;

    get node(): MinimalNodeEntity {
        return this.obj;
    }

    constructor(private obj: MinimalNodeEntity) {
        if (!obj) {
            throw new Error('Object source not found');
        }
    }

    /**
     * Gets a value from an object by composed key
     * documentList.getObjectValue({ item: { nodeType: 'cm:folder' }}, 'item.nodeType') ==> 'cm:folder'
     * @param target
     * @param key
     * @returns {string}
     */
    getObjectValue(target: any, key: string): any {

        if (!target) {
            return undefined;
        }

        let keys = key.split('.');
        key = '';

        do {
            key += keys.shift();
            let value = target[key];
            if (value !== undefined && (typeof value === 'object' || !keys.length)) {
                target = value;
                key = '';
            } else if (!keys.length) {
                target = undefined;
            } else {
                key += '.';
            }
        } while (keys.length);

        return target;
    }

    getValue(key: string): any {
        return this.getObjectValue(this.obj.entry, key);
    }

    hasValue(key: string): boolean {
        return this.getValue(key) ? true : false;
    }
}
