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
import { PaginationProvider, DataLoadedEventEmitter, DataTableAdapter, DataRow, DataColumn, DataSorting } from 'ng2-alfresco-datatable';
import { NodeMinimalEntry } from './../models/document-library.model';
import { DocumentListService } from './../services/document-list.service';
export declare class ShareDataTableAdapter implements DataTableAdapter, PaginationProvider {
    private documentListService;
    private basePath;
    ERR_ROW_NOT_FOUND: string;
    ERR_COL_NOT_FOUND: string;
    DEFAULT_ROOT_ID: string;
    DEFAULT_DATE_FORMAT: string;
    DEFAULT_PAGE_SIZE: number;
    MIN_PAGE_SIZE: number;
    private sorting;
    private rows;
    private columns;
    private page;
    private currentPath;
    private filter;
    private imageResolver;
    private _count;
    private _hasMoreItems;
    private _totalItems;
    private _skipCount;
    private _maxItems;
    thumbnails: boolean;
    dataLoaded: DataLoadedEventEmitter;
    rootFolderId: string;
    constructor(documentListService: DocumentListService, basePath: string, schema: DataColumn[]);
    readonly count: number;
    readonly hasMoreItems: boolean;
    readonly totalItems: number;
    skipCount: number;
    maxItems: number;
    getRows(): Array<DataRow>;
    setRows(rows: Array<DataRow>): void;
    getColumns(): Array<DataColumn>;
    setColumns(columns: Array<DataColumn>): void;
    getValue(row: DataRow, col: DataColumn): any;
    getSorting(): DataSorting;
    setSorting(sorting: DataSorting): void;
    sort(key?: string, direction?: string): void;
    loadPath(path: string): Promise<any>;
    loadById(id: string): Promise<any>;
    setFilter(filter: RowFilter): void;
    setImageResolver(resolver: ImageResolver): void;
    private sortRows(rows, sorting);
    private loadPage(page);
    getImagePath(id: string): any;
    private resetPagination();
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
