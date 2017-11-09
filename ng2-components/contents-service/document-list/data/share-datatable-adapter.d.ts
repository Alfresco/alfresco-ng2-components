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
import { DataTableAdapter, DataRow, DataColumn, DataSorting } from 'ng2-alfresco-datatable';
import { NodePaging, NodeMinimalEntry } from './../models/document-library.model';
import { DocumentListService } from './../services/document-list.service';
export declare class ShareDataTableAdapter implements DataTableAdapter {
    private documentListService;
    private basePath;
    ERR_ROW_NOT_FOUND: string;
    ERR_COL_NOT_FOUND: string;
    DEFAULT_DATE_FORMAT: string;
    private sorting;
    private rows;
    private columns;
    private page;
    private filter;
    private imageResolver;
    thumbnails: boolean;
    selectedRow: DataRow;
    constructor(documentListService: DocumentListService, basePath: string, schema?: DataColumn[]);
    getRows(): Array<DataRow>;
    setRows(rows: Array<DataRow>): void;
    getColumns(): Array<DataColumn>;
    setColumns(columns: Array<DataColumn>): void;
    getValue(row: DataRow, col: DataColumn): any;
    getSorting(): DataSorting;
    setSorting(sorting: DataSorting): void;
    sort(key?: string, direction?: string): void;
    setFilter(filter: RowFilter): void;
    setImageResolver(resolver: ImageResolver): void;
    private sortRows(rows, sorting);
    loadPage(page: NodePaging): void;
    getImagePath(id: string): any;
}
export declare class ShareDataRow implements DataRow {
    private obj;
    static ERR_OBJECT_NOT_FOUND: string;
    cache: {
        [key: string]: any;
    };
    isSelected: boolean;
    readonly node: NodeMinimalEntry;
    constructor(obj: NodeMinimalEntry);
    cacheValue(key: string, value: any): any;
    getValue(key: string): any;
    hasValue(key: string): boolean;
}
export interface RowFilter {
    (value: ShareDataRow, index: number, array: ShareDataRow[]): any;
}
export interface ImageResolver {
    (row: DataRow, column: DataColumn): string;
}
