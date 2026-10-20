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

import type { FieldDefinition } from '../definition/form-definition.interface';
import { BUILT_IN_FIELD_TYPE_RESOLVER } from '../field-types/built-in-field-types';
import { displayFieldValue, stringifyValue } from './field-display-value';

describe('displayFieldValue', () => {
    const field = (type: string, options: FieldDefinition['options'] = []) => ({ id: type, type, options }) as FieldDefinition;
    const shown = (definition: FieldDefinition, value: unknown) => displayFieldValue(BUILT_IN_FIELD_TYPE_RESOLVER, definition, value);
    const colours = field('dropdown', [
        { id: 'r', name: 'Red' },
        { id: 'g', name: 'Green' }
    ]);

    it('should show options by name, whether given by id or as options, single or multiple', () => {
        expect(shown(colours, 'r')).toBe('Red');
        expect(shown(colours, { id: 'g', name: 'Green' })).toBe('Green');
        expect(shown(colours, ['r', { id: 'g', name: 'Green' }, 'unknown'])).toBe('Red, Green, unknown');
        expect(shown(field('radio-buttons', colours.options), 'g')).toBe('Green');
    });

    it('should show people by full name and groups by name', () => {
        expect(shown(field('people'), [{ firstName: 'Ada', lastName: 'Lovelace' }, { username: 'alan' }])).toBe('Ada Lovelace, alan');
        expect(shown(field('functional-group'), { name: 'HR' })).toBe('HR');
    });

    it('should show nothing for no value, and other values as text', () => {
        expect(shown(colours, null)).toBe('');
        expect(shown(field('text'), 42)).toBe('42');
        expect(shown(field('json'), { a: 1 })).toBe('{"a":1}');
        expect(stringifyValue('as is')).toBe('as is');
    });
});
