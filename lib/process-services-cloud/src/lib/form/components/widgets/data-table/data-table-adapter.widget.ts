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

import { ObjectDataTableAdapter, DataColumn, DataRow, ObjectDataColumn, ObjectDataRow, DataTableAdapter, DataSorting } from '@alfresco/adf-core';
import { DataTablePathParserHelper } from './helpers/data-table-path-parser.helper';
import { Subject } from 'rxjs';

export class WidgetDataTableAdapter implements DataTableAdapter {
    private adapter: ObjectDataTableAdapter;
    private columnKeys: string[] = [];
    private helper = new DataTablePathParserHelper();

    get selectedRow(): DataRow {
        return this.adapter.selectedRow;
    }

    get rowsChanged(): Subject<Array<DataRow>> {
        return this.adapter.rowsChanged;
    }

    constructor(data: any[], schema: DataColumn[]) {
        this.adapter = new ObjectDataTableAdapter(data, schema);

        this.createColumns(schema);
        this.createRows(data);
    }

    private createColumns(schema: DataColumn[]): void {
        if (schema?.length) {
            this.adapter.setColumns(this.buildColumnsFromSchema(schema));
        }
    }

    private buildColumnsFromSchema(schema: DataColumn[]): ObjectDataColumn[] {
        return schema.map((dataColumn) => {
            this.columnKeys.push(dataColumn.key);

            return new ObjectDataColumn(dataColumn);
        });
    }

    private createRows(data: any[]): void {
        if (data?.length) {
            this.adapter.setRows(data.map((item) => this.buildDataRowFromItem(item)));
        }
    }

    private buildDataRowFromItem(item: any): ObjectDataRow {
        const rowData = { /* empty */ };
        this.columnKeys.forEach((path, i) => {
            const rowValue = this.extractPropertyValue(this.helper.splitPathIntoProperties(path), item);

            if (rowValue) {
                rowData[this.columnKeys[i]] = rowValue;
            }
        });

        return new ObjectDataRow(rowData);
    }

    private extractPropertyValue(properties: string[], item: any): string {
        return properties.reduce((acc, property) => {
            if (!acc) {
                return undefined;
            }

            const propertyIndexReferences = this.helper.getIndexReferencesFromProperty(property);
            const isPropertyWithSingleIndexReference = propertyIndexReferences.length === 1;

            const purePropertyName = this.helper.extractPurePropertyName(property);

            return isPropertyWithSingleIndexReference ? acc[purePropertyName]?.[propertyIndexReferences[0]] : acc[purePropertyName];
        }, item);
    }

    getColumns(): Array<DataColumn> {
        return this.adapter.getColumns();
    }

    getRows(): DataRow[] {
        if (this.isDataSourceValid()) {
            return this.adapter.getRows();
        }

        return [];
    }

    setRows(rows: Array<DataRow>): void {
        this.adapter.setRows(rows);
    }

    setColumns(columns: Array<DataColumn>): void {
        this.adapter.setColumns(columns);
    }

    getValue(row: DataRow, col: DataColumn, resolverFn?: (_row: DataRow, _col: DataColumn) => any): any {
        return this.adapter.getValue(row, col, resolverFn);
    }

    getColumnType(row: DataRow, col: DataColumn): string {
        return this.adapter.getColumnType(row, col);
    }

    getSorting(): DataSorting {
        return this.adapter.getSorting();
    }

    setSorting(sorting: DataSorting): void {
        this.adapter.setSorting(sorting);
    }

    sort(key?: string, direction?: string): void {
        this.adapter.sort(key, direction);
    }

    isDataSourceValid(): boolean {
        return this.hasAllColumnsLinkedToData() && this.allMandatoryColumnPropertiesHaveValues();
    }

    private allMandatoryColumnPropertiesHaveValues(): boolean {
        return this.adapter.getColumns().every((column) => !!column.key);
    }

    private hasAllColumnsLinkedToData(): boolean {
        const availableColumnKeys: string[] = this.adapter.getColumns().map((column) => column.key);

        return availableColumnKeys.every((columnKey) => this.adapter.getRows().some((row) => Object.keys(row.obj).includes(columnKey)));
    }
}
