/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import type { FormVariables } from '../definition/form-definition.interface';
import { resolveVariableValue } from './form-variables';

describe('resolveVariableValue', () => {
    const variables: FormVariables = {
        formVariables: [{ id: 'regionId', name: 'region', type: 'string', value: 'DEFAULT' }],
        processVariables: [{ name: 'region', type: 'string', value: 'FROM_PROCESS' }]
    };

    it("should take a refreshed process variable before the form's own, matched by id or by name with or without the prefix", () => {
        expect(resolveVariableValue('region', variables, {}, [{ id: 'region', value: 'BY_ID' }])).toBe('BY_ID');
        expect(resolveVariableValue('region', variables, {}, [{ name: 'variables.region', value: 'BY_PREFIX' }])).toBe('BY_PREFIX');
        expect(resolveVariableValue('region', variables, {}, [{ name: 'other', value: 'IGNORED' }])).toBe('FROM_PROCESS');
    });

    it('should still let a value set at runtime win over a refreshed process variable', () => {
        expect(resolveVariableValue('region', variables, { regionId: 'AT_RUNTIME' }, [{ id: 'region', value: 'BY_ID' }])).toBe('AT_RUNTIME');
    });

    it("should read a refreshed value by its type, as the form's own process variables are", () => {
        expect(resolveVariableValue('active', variables, {}, [{ name: 'active', type: 'boolean', value: 'true' }])).toBeTrue();
        expect(resolveVariableValue('due', variables, {}, [{ name: 'due', type: 'date', value: '2024-03-15' }])).toBe('2024-03-15T00:00:00.000Z');
    });
});
