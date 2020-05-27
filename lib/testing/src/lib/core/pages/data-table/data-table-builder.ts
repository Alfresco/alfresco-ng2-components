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

import { TextColumn } from './text-column';
import { DateColumn } from './date-column';
import { DataTableItem } from './data-table-item';
import { ElementFinder } from 'protractor';

export class DataTableBuilder {

    createDataTable(columns: Array<any>, rootElement?: ElementFinder): DataTableItem {
        const datatable: DataTableItem = new DataTableItem(rootElement);
        for (const column of columns) {
            switch (column.columnType) {
                case 'date': {
                    datatable.addItem(new DateColumn(column.columnName));
                    break;
                }
                case 'custom': {
                    datatable.addItem(column);
                    break;
                }
                default: datatable.addItem(new TextColumn(column.columnName));
            }
        }
        return datatable;
    }
}
