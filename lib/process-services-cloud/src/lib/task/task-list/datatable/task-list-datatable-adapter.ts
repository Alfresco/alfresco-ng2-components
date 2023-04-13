/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DataColumn, DataRow, ObjectDataTableAdapter } from '@alfresco/adf-core';
import { ProcessListDataColumnCustomData, PROCESS_LIST_CUSTOM_VARIABLE_COLUMN } from '../../../models/data-column-custom-data';
import { TaskInstanceCloudListViewModel } from '../models/task-cloud-view.model';

export class TasksListDatatableAdapter extends ObjectDataTableAdapter {
    constructor(
        data: TaskInstanceCloudListViewModel[],
        schema: DataColumn<ProcessListDataColumnCustomData>[]
    ) {
        super(data, schema);
    }

    getColumnType(row: DataRow, col: DataColumn<ProcessListDataColumnCustomData>): string {
        if (col.customData?.columnType === PROCESS_LIST_CUSTOM_VARIABLE_COLUMN) {
            const variableDisplayName = col.title;
            const columnType = row.obj.variablesMap?.[variableDisplayName]?.type;
            return columnType ?? 'text';
        }

        return super.getColumnType(row, col);
    }
}
