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
    DataTableAdapter,
    DataRow,
    DataColumn,
    DataSorting
} from './datatable-adapter';

// Simple implementation of the DataTableAdapter interface.
export class ObjectDataTableAdapter implements DataTableAdapter {

    private _sorting;
    private _rows: DataRow[];
    private _columns: DataColumn[];

    constructor(data: any[], schema: DataColumn[]) {
        this._rows = [];
        this._columns = [];

        if (data && data.length > 0) {

            this._rows = data.map(item => {
                return new ObjectDataRow(item);
            });

            if (schema && schema.length > 0) {
                this._columns = schema.map(item => {
                    return new ObjectDataColumn(item);
                });

                this.sort(this._columns[0].key, 'asc');
            }

        }
    }

    getRows(): Array<DataRow> {
        return this._rows;
    }

    setRows(rows: Array<DataRow>) {
        this._rows = rows || [];
        this.sort();
    }

    getColumns(): Array<DataColumn> {
        return this._columns;
    }

    setColumns(columns: Array<DataColumn>) {
        this._columns = columns || [];
    }

    getValue(row: DataRow, col: DataColumn): any {
        return row.getValue(col.key);
    }

    getSorting(): DataSorting {
        return this._sorting;
    }

    setSorting(sorting: DataSorting): void {
        this._sorting = sorting;

        if (sorting && sorting.key) {
            this._rows.sort((a: DataRow, b: DataRow) => {
                let left = a.getValue(sorting.key);
                left = (left instanceof Date) ? left.valueOf().toString() : left.toString();

                let right = b.getValue(sorting.key);
                right = (right instanceof Date) ? right.valueOf().toString() : right.toString();

                return sorting.direction === 'asc'
                    ? left.localeCompare(right)
                    : right.localeCompare(left);
            });
        }
    }

    sort(key?: string, direction?: string): void {
        let sorting = this._sorting || new DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
        }
        this.setSorting(sorting);
    }
}

// Simple implementation of the DataRow interface.
export class ObjectDataRow implements DataRow {

    isSelected: boolean = false;

    constructor(
        private obj: any) {
    }

    /**
     * Gets a value from an object by composed key
     * documentList.getObjectValue({ item: { nodeType: 'cm:folder' }}, 'item.nodeType') ==> 'cm:folder'
     * @param target
     * @param key
     * @returns {string}
     */
    getObjectValue(target: any, key: string): any {
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
        return this.getObjectValue(this.obj, key);
    }

    hasValue(key: string): boolean {
        return this.getValue(key) ? true : false;
    }
}

// Simple implementation of the DataColumn interface.
export class ObjectDataColumn implements DataColumn {

    key: string;
    type: string; // text|image
    sortable: boolean;
    title: string;
    srTitle: string;
    cssClass: string;

    constructor(obj: any) {
        this.key = obj.key;
        this.type = obj.type || 'text';
        this.sortable = obj.sortable;
        this.title = obj.title;
        this.srTitle = obj.srTitle;
        this.cssClass = obj.cssClass;
    }
}
