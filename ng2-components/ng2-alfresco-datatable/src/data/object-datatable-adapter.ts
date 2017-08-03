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
import { TemplateRef } from '@angular/core';
import { ObjectUtils } from 'ng2-alfresco-core';
import { DataColumn, DataRow, DataSorting, DataTableAdapter } from './datatable-adapter';

// Simple implementation of the DataTableAdapter interface.
export class ObjectDataTableAdapter implements DataTableAdapter {

    private _sorting: DataSorting;
    private _rows: DataRow[];
    private _columns: DataColumn[];

    selectedRow: DataRow;

    static generateSchema(data: any[]) {
        let schema = [];

        if (data && data.length) {
            let rowToExaminate = data[0];

            if (typeof rowToExaminate === 'object') {
                for (let key in rowToExaminate) {
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
            this._rows = data.map(item => {
                return new ObjectDataRow(item);
            });
        }

        if (schema && schema.length > 0) {
            this._columns = schema.map(item => {
                return new ObjectDataColumn(item);
            });

            // Sort by first sortable or just first column
            let sortable = this._columns.filter(c => c.sortable);
            if (sortable.length > 0) {
                this.sort(sortable[0].key, 'asc');
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
        if (!row) {
            throw new Error('Row not found');
        }
        if (!col) {
            throw new Error('Column not found');
        }

        let value = row.getValue(col.key);

        if (col.type === 'date') {
            let datePipe = new DatePipe('en-US');
            let format = col.format || 'medium';
            try {
                return datePipe.transform(value, format);
            } catch (err) {
                console.error(`DocumentList: error parsing date ${value} to format ${format}`);
            }
        }

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

    constructor(private obj: any, public isSelected: boolean = false) {
        if (!obj) {
            throw new Error('Object source not found');
        }

    }

    getValue(key: string): any {
        return ObjectUtils.getValue(this.obj, key);
    }

    hasValue(key: string): boolean {
        return this.getValue(key) !== undefined;
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
    template?: TemplateRef<any>;

    constructor(obj: any) {
        this.key = obj.key;
        this.type = obj.type || 'text';
        this.sortable = obj.sortable;
        this.title = obj.title;
        this.srTitle = obj.srTitle;
        this.cssClass = obj.cssClass;
        this.template = obj.template;
    }
}
