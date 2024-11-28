/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed } from '@angular/core/testing';
import { FormUtilsService } from './form-utils.service';
import { FormModel, FormVariableModel } from '@alfresco/adf-core';

describe('FormUtilsService', () => {
    let service: FormUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormUtilsService);
    });

    it('should return an empty map if there are no variables', () => {
        const formModel = new FormModel({ variables: [] });
        const restUrl = 'https://example.com/api';
        const inputBody = {};

        const result = service.getRestUrlVariablesMap(formModel, restUrl, inputBody);

        expect(result).toEqual({});
    });

    it('should map variable values to the input body if they are present in the restUrl', () => {
        const variables: FormVariableModel[] = [
            { id: '1', name: 'var1', type: 'string', value: 'value1' },
            { id: '2', name: 'var2', type: 'string', value: 'value2' }
        ];
        const formModel = new FormModel({ variables });
        spyOn(formModel, 'getProcessVariableValue').and.callFake((name) => {
            return variables.find((variable) => variable.name === name)?.value;
        });
        const restUrl = 'https://example.com/api?var1=${var1}&var2=${var2}';
        const inputBody = {};

        const result = service.getRestUrlVariablesMap(formModel, restUrl, inputBody);

        expect(result).toEqual({ var1: 'value1', var2: 'value2' });
    });

    it('should not map variable values if they are not present in the restUrl', () => {
        const variables: FormVariableModel[] = [
            { id: '1', name: 'var1', type: 'string', value: 'value1' },
            { id: '2', name: 'var2', type: 'string', value: 'value2' }
        ];
        const formModel = new FormModel({ variables });
        spyOn(formModel, 'getProcessVariableValue').and.callFake((name) => {
            return variables.find((variable) => variable.name === name)?.value;
        });
        const restUrl = 'https://example.com/api';
        const inputBody = {};

        const result = service.getRestUrlVariablesMap(formModel, restUrl, inputBody);

        expect(result).toEqual({});
    });

    it('should merge the mapped variables with the input body', () => {
        const variables: FormVariableModel[] = [
            { id: '1', name: 'var1', type: 'string', value: 'value1' },
            { id: '2', name: 'var2', type: 'string', value: 'value2' }
        ];
        const formModel = new FormModel({ variables });
        spyOn(formModel, 'getProcessVariableValue').and.callFake((name) => variables.find((variable) => variable.name === name)?.value);
        const restUrl = 'https://example.com/api?var1=${var1}';
        const inputBody = { existingKey: 'existingValue' };

        const result = service.getRestUrlVariablesMap(formModel, restUrl, inputBody);

        expect(result).toEqual({ existingKey: 'existingValue', var1: 'value1' });
    });
});
