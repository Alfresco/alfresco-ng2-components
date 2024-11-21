/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DataColumn } from './data-column.model';
import { DataRow } from './data-row.model';
import { ObjectDataRow } from './object-datarow.model';
import { ObjectDataColumn } from './object-datacolumn.model';
import { DataSorting } from './data-sorting.model';
import { DataTableAdapter } from './datatable-adapter';
import { Subject } from 'rxjs';

export type SortingMode = 'client' | 'server';

// Simple implementation of the DataTableAdapter interface.
export class ObjectDataTableAdapter implements DataTableAdapter {
    private _sorting: DataSorting;
    private _rows: DataRow[];
    private _columns: DataColumn[];
    private readonly _sortingMode: SortingMode;

    selectedRow: DataRow;
    rowsChanged: Subject<Array<DataRow>>;

    static generateSchema(data: any[]) {
        const schema = [];

        if (data?.length) {
            const rowToExamine = data[0];

            if (typeof rowToExamine === 'object') {
                for (const key in rowToExamine) {
                    if (Object.prototype.hasOwnProperty.call(rowToExamine, key)) {
                        schema.push({
                            type: 'text',
                            key,
                            title: key,
                            sortable: false
                        });
                    }
                }
            }
        }
        return schema;
    }

    constructor(data: any[] = [], schema: DataColumn[] = [], sortingMode: SortingMode = 'client') {
        this._rows = [];
        this._columns = [];
        this._sortingMode = sortingMode?.toString().toLowerCase() === 'server' ? 'server' : 'client';

        if (data && data.length > 0) {
            this._rows = data.map((item) => new ObjectDataRow(item));
        }

        if (schema && schema.length > 0) {
            this._columns = schema.map((item) => new ObjectDataColumn(item));

            // Sort by first sortable or just first column
            const sortable = this._columns.filter((column) => column.sortable);
            if (sortable.length > 0) {
                this.sort(sortable[0].key, 'asc');
            }
        }

        this.rowsChanged = new Subject<Array<DataRow>>();
    }

    getColumnType(_row: DataRow, col: DataColumn): string {
        return col.type;
    }

    getRows(): Array<DataRow> {
        return this._rows;
    }

    setRows(rows: Array<DataRow>) {
        this._rows = rows || [];
        this.sort();
        this.rowsChanged.next(this._rows);
    }

    getColumns(): Array<DataColumn> {
        return this._columns;
    }

    setColumns(columns: Array<DataColumn>) {
        this._columns = columns || [];
    }

    getValue(row: DataRow, col: DataColumn, resolver?: (_row: DataRow, _col: DataColumn) => any): any {
        if (!row) {
            throw new Error('Row not found');
        }
        if (!col) {
            throw new Error('Column not found');
        }

        if (resolver) {
            return resolver(row, col);
        }

        return row.getValue(col.key);
    }

    getSorting(): DataSorting {
        return this._sorting;
    }

    setSorting(sorting: DataSorting): void {
        this._sorting = sorting;

        if (this._sortingMode === 'server') {
            return;
        }

        if (sorting?.key) {
            this._rows.sort((a: DataRow, b: DataRow) => {
                let left = a.getValue(sorting.key) ?? '';
                let right = b.getValue(sorting.key) ?? '';

                if (typeof left !== 'string') {
                    left = left.valueOf().toString();
                }

                if (typeof right !== 'string') {
                    right = right.valueOf().toString();
                }

                return sorting.direction === 'asc'
                    ? left.localeCompare(right, undefined, sorting.options)
                    : right.localeCompare(left, undefined, sorting.options);
            });
        }
    }

    sort(key?: string, direction?: string, options?: Intl.CollatorOptions): void {
        const sorting = this._sorting || new DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
            sorting.options = {
                numeric: true,
                ...options
            };
        }
        this.setSorting(sorting);
    }
}
