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
    DataTableAdapter, ObjectDataTableAdapter, ObjectDataColumn,
    DataRow, DataColumn, DataSorting
} from 'ng2-alfresco-datatable';

export class ProcessListDataTableAdapter extends ObjectDataTableAdapter implements DataTableAdapter {

    ERR_ROW_NOT_FOUND: string = 'Row not found';
    ERR_COL_NOT_FOUND: string = 'Column not found';

    DEFAULT_DATE_FORMAT: string = 'medium';

    private sorting: DataSorting;
    private rows: DataRow[];
    private columns: DataColumn[];

    constructor(rows: any, schema: DataColumn[]) {
        super(rows, schema);
        this.rows = rows;
        this.columns = schema || [];
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
        let value = row.getValue(col.key);

        if (col.type === 'date') {
            let datePipe = new DatePipe('en-US');
            let format = (<ActivitiDataColumn>(col)).format || this.DEFAULT_DATE_FORMAT;
            try {
                return datePipe.transform(value, format);
            } catch (err) {
                console.error(`Error parsing date ${value} to format ${format}`);
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
            this.rows.sort((a: DataRow, b: DataRow) => {
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
}

export class ActivitiDataColumn extends ObjectDataColumn {
    format: string;
}
