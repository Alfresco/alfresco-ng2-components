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

import { TemplateRef } from '@angular/core';
import { BaseUIEvent } from 'ng2-alfresco-core';

export interface DataTableAdapter {
    selectedRow: DataRow;
    getRows(): Array<DataRow>;
    setRows(rows: Array<DataRow>): void;
    getColumns(): Array<DataColumn>;
    setColumns(columns: Array<DataColumn>): void;
    getValue(row: DataRow, col: DataColumn): any;
    getSorting(): DataSorting;
    setSorting(sorting: DataSorting): void;
    sort(key?: string, direction?: string): void;
}

export interface DataRow {
    isSelected: boolean;
    isDropTarget?: boolean;
    cssClass?: string;
    hasValue(key: string): boolean;
    getValue(key: string): any;
}

export interface DataColumn {
    key: string;
    type: string; // text|image|date
    format?: string;
    sortable?: boolean;
    title?: string;
    srTitle?: string;
    cssClass?: string;
    template?: TemplateRef<any>;
    formatTooltip?: Function;
}

export class DataSorting {
    constructor(
        public key?: string,
        public direction?: string) {
    }
}

export class DataRowEvent extends BaseUIEvent<DataRow> {

    sender: any;

    constructor(value: DataRow, domEvent: Event, sender?: any) {
        super();
        this.value = value;
        this.event = domEvent;
        this.sender = sender;
    }

}
