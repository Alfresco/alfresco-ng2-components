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

import { DataColumn, DataRow, getDataColumnMock } from '@alfresco/adf-core';
import { ColumnDataType } from '../../../models/column-data-type.model';
import { ProcessListDataColumnCustomData } from '../../../models/data-column-custom-data';
import { TasksListDatatableAdapter } from './task-list-datatable-adapter';
import { TaskInstanceCloudListViewModel } from '../models/task-cloud-view.model';
import { getTaskCloudModelMock } from '../../../mock/task-cloud-model.mock';
import { getProcessInstanceVariableMock } from '../../../mock/process-instance-variable.mock';

describe('TasksListDatatableAdapter', () => {
    it('should get proepr type for column', () => {
        const processVariable = getProcessInstanceVariableMock({
            variableDefinitionId: 'variableDefinitionId',
            type: 'number'
        });

        const cloudModel = getTaskCloudModelMock({
            processVariables: [processVariable]
        });

        const viewModel: TaskInstanceCloudListViewModel = {
            ...cloudModel,
            variablesMap: {
                columnDisplayName1: processVariable
            }
        };

        const row: DataRow = {
            getValue: () => {},
            hasValue: () => true,
            isSelected: false,
            obj: viewModel
        };

        const column: DataColumn<ProcessListDataColumnCustomData> = getDataColumnMock({
            title: 'columnDisplayName1',
            customData: {
                assignedVariableDefinitionIds: ['variableDefinitionId'],
                columnType: ColumnDataType.processVariableColumn
            }
        });

        const adapter = new TasksListDatatableAdapter([], []);

        expect(adapter.getColumnType(row, column)).toBe('number');
    });
});
