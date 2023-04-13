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

import { DataColumn, DataRow, getDataColumnMock } from '@alfresco/adf-core';
import { getProcessInstanceVariableMock } from '../../../mock/process-instance-variable.mock';
import { ProcessListDataColumnCustomData, PROCESS_LIST_CUSTOM_VARIABLE_COLUMN } from '../../../models/data-column-custom-data';
import { ProcessInstanceCloudListViewModel } from '../models/perocess-instance-cloud-view.model';
import { ProcessListDatatableAdapter } from './process-list-datatable-adapter';

describe('ProcessListDatatableAdapter', () => {
    it('should get proepr type for column', () => {
        const viewModel: ProcessInstanceCloudListViewModel = {
            id: '1',
            variablesMap: {
                columnDisplayName1: getProcessInstanceVariableMock({ type: 'number' })
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
                assignedVariableDefinitionIds: ['1'],
                variableDefinitionsPayload: ['processKey/variableName'],
                columnType: PROCESS_LIST_CUSTOM_VARIABLE_COLUMN
            }
        });

        const adapter = new ProcessListDatatableAdapter([], []);

        expect(adapter.getColumnType(row, column)).toBe('number');
    });
});
