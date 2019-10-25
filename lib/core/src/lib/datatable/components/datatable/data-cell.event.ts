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

import { BaseEvent } from '../../../events';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';

export class DataCellEventModel {

    readonly row: DataRow;
    readonly col: DataColumn;
    actions: any[];

    constructor(row: DataRow, col: DataColumn, actions: any[]) {
        this.row = row;
        this.col = col;
        this.actions = actions || [];
    }

}

export class DataCellEvent extends BaseEvent<DataCellEventModel> {

    constructor(row: DataRow, col: DataColumn, actions: any[]) {
        super();
        this.value = new DataCellEventModel(row, col, actions);
    }

}
