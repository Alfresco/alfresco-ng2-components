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

import { DataColumn } from './data-column.model';
import { DataRow } from './data-row.model';
import { ObjectDataRow } from './object-datarow.model';
import { ObjectDataColumn } from './object-datacolumn.model';
import { DataSorting } from './data-sorting.model';
import { DataTableAdapter } from './datatable-adapter';
import { Subject } from 'rxjs';

// Simple implementation of the DataTableAdapter interface.
export class ObjectDataTableAdapter implements DataTableAdapter {

    private _sorting: DataSorting;
    private _rows: DataRow[];
    private _columns: DataColumn[];

    selectedRow: DataRow;
    rowsChanged: Subject<Array<DataRow>>;

    static generateSchema(data: any[]) {
        const schema = [];

        if (data && data.length) {
            const rowToExaminate = data[0];

            if (typeof rowToExaminate === 'object') {
                for (const key in rowToExaminate) {
                    if (rowToExaminate.hasOwnProperty(key)) {
                        schema.push({
                            type: 'text',
                            key: key,
                            title: key,
                            sortable: false
                        });
                    }
                }
            }

        }
        return schema;
    }

    constructor(data: any[] = [], schema: DataColumn[] = []) {
        this._rows = [];
        this._columns = [];

        if (data && data.length > 0) {
            this._rows = data.map((item) => {
                return new ObjectDataRow(item);
            });
        }

        if (schema && schema.length > 0) {
            this._columns = schema.map((item) => {
                return new ObjectDataColumn(item);
            });

            // Sort by first sortable or just first column
            const sortable = this._columns.filter((column) => column.sortable);
            if (sortable.length > 0) {
                this.sort(sortable[0].key, 'asc');
            }
        }

        this.rowsChanged = new Subject<Array<DataRow>>();
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

    getValue(row: DataRow, col: DataColumn, resolver?: (row: DataRow, col: DataColumn) => any ): any {
        if (!row) {
            throw new Error('Row not found');
        }
        if (!col) {
            throw new Error('Column not found');
        }

        if (resolver) {
            return resolver(row, col);
        }

        const value = row.getValue(col.key);

        if (col.type === 'icon') {
            const icon = row.getValue(col.key);
            return icon;
        }

        return value;
    }

    getSorting(): DataSorting {
        return this._sorting;
    }

    setSorting(sorting: DataSorting): void {
        this._sorting = sorting;

        if (sorting && sorting.key) {
            this._rows.sort((a: DataRow, b: DataRow) => {
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
        const sorting = this._sorting || new DataSorting();
        if (key) {
            sorting.key = key;
            sorting.direction = direction || 'asc';
        }
        this.setSorting(sorting);
    }
}
