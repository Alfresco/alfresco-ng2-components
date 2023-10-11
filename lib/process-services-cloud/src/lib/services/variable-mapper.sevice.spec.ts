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
import { DataColumn, getDataColumnMock } from '@alfresco/adf-core';

describe('VariableMapperService', () => {
    let service: VariableMapperService;
    let variable: ProcessInstanceVariable;
    let column: DataColumn<ProcessListDataColumnCustomData>;
    let objectWithVariables: { variables: ProcessInstanceVariable[] };

    beforeEach(() => {
        service = new VariableMapperService();

        variable = getProcessInstanceVariableMock({
            processDefinitionKey: 'processKey',
            name: 'variableName'
        });

        column = getDataColumnMock<ProcessListDataColumnCustomData>({
            title: 'Column Name',
            key: '',
            customData: {
                variableDefinitionsPayload: ['processKey/variableName'],
                assignedVariableDefinitionIds: [variable.variableDefinitionId],
                columnType: 'text'
            }
        });

        objectWithVariables = {
            variables: [variable]
        };
    });

    it('should map variables by column title', () => {
        const expectedObjectWithVariableMap = {
            ...objectWithVariables,
            variablesMap: {
                [column.title]: variable
            }
        };

        const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

        expect(viewModel).toEqual([expectedObjectWithVariableMap]);
    });

    describe('should map correct column type according to process variable type in case of', () => {
        it('date type', ()=> {
            variable.type = 'boolean';

            const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

            expect(viewModel[0].variablesMap[column.title].type).toEqual('boolean');
        });

        it('integer type', ()=> {
            variable.type = 'integer';

            const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

            expect(viewModel[0].variablesMap[column.title].type).toEqual('text');
        });

        it('string type', ()=> {
            variable.type = 'string';

            const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

            expect(viewModel[0].variablesMap[column.title].type).toEqual('text');
        });

        it('date type', ()=> {
            variable.type = 'date';

            const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

            expect(viewModel[0].variablesMap[column.title].type).toEqual('date');
        });

        it('datetime type', ()=> {
            variable.type = 'datetime';

            const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

            expect(viewModel[0].variablesMap[column.title].type).toEqual('date');
        });

        it('other types', ()=> {
            variable.type = 'custom';

            const viewModel = service.mapVariablesByColumnTitle([objectWithVariables], [column]);

            expect(viewModel[0].variablesMap[column.title].type).toEqual('text');
        });
    });
});
