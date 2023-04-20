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

import { getProcessInstanceVariableMock } from '../mock/process-instance-variable.mock';

import { ProcessListDataColumnCustomData } from '../models/data-column-custom-data';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { VariableMapperService } from './variable-mapper.sevice';
import { getDataColumnMock } from '@alfresco/adf-core';

describe('VariableMapperService', () => {
    let service: VariableMapperService;

    beforeEach(() => {
        service = new VariableMapperService();
    });

    it('should map variables by column title', () => {
        const variable: ProcessInstanceVariable = getProcessInstanceVariableMock({
            processDefinitionKey: 'processKey',
            name: 'variableName'
        });

        const objectWithVariables = {
            variables: [variable]
        };

        const column = getDataColumnMock<ProcessListDataColumnCustomData>({
            title: 'column name',
            key: '',
            customData: {
                variableDefinitionsPayload: ['processKey/variableName'],
                assignedVariableDefinitionIds: [variable.variableDefinitionId],
                columnType: 'text'
            }
        });

        const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

        const expectedObjectWithVariableMap = {
            ...objectWithVariables,
            variablesMap: {
                [column.title]: variable
            }
        };

        expect(viewModel).toEqual([expectedObjectWithVariableMap]);
    });
});
