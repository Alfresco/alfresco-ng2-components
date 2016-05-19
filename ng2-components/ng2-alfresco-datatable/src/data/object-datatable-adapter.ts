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

    rows: DataRow[];
    columns: DataColumn[];

    constructor(data: any[], schema: DataColumn[]) {
        this.rows = [];

        if (data && data.length > 0) {

            this.rows = data.map(item => {
                return new ObjectDataRow(item);
            });

            this.columns = schema.map(item => {
                return new ObjectDataColumn(item);
            });
        }
    }

    getValue(row: DataRow, col: DataColumn): any {
        return row.getValue(col.key);
    }

    getSorting(): DataSorting {
        return this._sorting;
    }

    getColumnByKey(key: string) {
        let columns = this.columns.filter(col => col.key === key);
        return columns.length > 0 ? columns[0] : null;
    }

    setSorting(sorting: DataSorting): void {
        this._sorting = sorting;

        this.rows.sort((a: DataRow, b: DataRow) => {
            let left = a.getValue(sorting.key).toString();
            let right = b.getValue(sorting.key).toString();

            return sorting.direction === 'asc'
                ? left.localeCompare(right)
                : right.localeCompare(left);
        });
    }
}

// Simple implementation of the DataRow interface.
class ObjectDataRow implements DataRow {
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
class ObjectDataColumn implements DataColumn {

    key: string;
    type: string; // text|image
    sortable: boolean;
    title: string;
    srTitle: string;
    cssClass: string;

    constructor(private obj: any) {
        this.key = obj.key;
        this.type = obj.type;
        this.sortable = obj.sortable;
        this.title = obj.title;
        this.srTitle = obj.srTitle;
        this.cssClass = obj.cssClass;
    }
}
