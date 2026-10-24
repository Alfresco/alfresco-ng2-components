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

import type { FieldJson } from '../definition/form-definition-json.interface';
import type { FieldDefinition } from '../definition/form-definition.interface';
import type { FieldTypeDefinition, FieldTypeResolver } from './field-type-definition.interface';
import { fieldTypeAlias, resolveFieldComponent, resolveFieldType } from './field-type-resolution';

describe('field type resolution', () => {
    const textComponent = jasmine.createSpy('textComponent');
    const jsonComponent = jasmine.createSpy('jsonComponent');
    const displayComponent = jasmine.createSpy('displayComponent');
    const text: FieldTypeDefinition = {
        type: 'text',
        component: textComponent,
        initialValue: (jsonField, definition) => [jsonField.type, definition.type],
        submittedValue: ({ definition }) => definition.type,
        validators: [(definition) => definition.type],
        displayValue: ({ definition }) => definition.type
    };
    const json: FieldTypeDefinition = { type: 'json', component: jsonComponent };
    const display: FieldTypeDefinition = { type: 'readonly', component: displayComponent };
    const fieldTypes: FieldTypeResolver = { definitionFor: (type) => [text, json, display].find((definition) => definition.type === type) };
    const rating = { id: 'rating', type: 'rating' } as FieldDefinition;

    describe('resolveFieldType', () => {
        it('should resolve a field by the definition of its own type', () => {
            expect(resolveFieldType(fieldTypes, { type: 'text' })).toEqual({ definition: text });
        });

        it('should handle a Studio custom widget nobody implements by the built-in type of its value type', () => {
            const resolved = resolveFieldType(fieldTypes, { type: 'rating', isCustomType: true, valueType: 'string' });

            expect(resolved.derivedFromValueType).toBe('string');
            expect(resolved.definition.type).toBe('rating');
            expect(resolved.definition.component).toBe(textComponent);
        });

        it('should resolve nothing for an unknown type, a custom type of an unknown value type, or a type that is not custom', () => {
            expect(resolveFieldType(fieldTypes, { type: 'mystery' })).toBeUndefined();
            expect(resolveFieldType(fieldTypes, { type: 'rating', isCustomType: true, valueType: 'blob' })).toBeUndefined();
            expect(resolveFieldType(fieldTypes, { type: 'rating', isCustomType: true })).toBeUndefined();
            expect(resolveFieldType(fieldTypes, { type: 'rating', valueType: 'string' })).toBeUndefined();
        });
    });

    describe('fieldTypeAlias', () => {
        it('should let the readers, writers, validators and formatters of the original type see the field as that type', () => {
            const alias = fieldTypeAlias(text, 'rating');
            const fieldJson: FieldJson = { id: 'rating', type: 'rating' };

            expect(alias.type).toBe('rating');
            expect(alias.initialValue(fieldJson, rating)).toEqual(['rating', 'text']);
            expect(alias.submittedValue({ definition: rating, value: null })).toBe('text');
            expect(alias.validators.map((validator) => validator(rating, null))).toEqual(['text']);
            expect(alias.displayValue({ definition: rating, value: null })).toBe('text');
        });

        it('should give the alias nothing the original type does not have', () => {
            const alias = fieldTypeAlias(json, 'custom-json');

            expect(alias.component).toBe(jsonComponent);
            expect(alias.initialValue).toBeUndefined();
            expect(alias.submittedValue).toBeUndefined();
            expect(alias.validators).toBeUndefined();
            expect(alias.displayValue).toBeUndefined();
        });
    });

    describe('resolveFieldComponent', () => {
        it('should show a display value of a JSON field with the JSON component', () => {
            expect(resolveFieldComponent(fieldTypes, { type: 'readonly', sourceField: { type: 'json' } })).toBe(jsonComponent);
        });

        it('should show any other field with its own type component', () => {
            expect(resolveFieldComponent(fieldTypes, { type: 'readonly', sourceField: { type: 'text' } })).toBe(displayComponent);
            expect(resolveFieldComponent(fieldTypes, { type: 'readonly' })).toBe(displayComponent);
            expect(resolveFieldComponent(fieldTypes, { type: 'text' })).toBe(textComponent);
            expect(resolveFieldComponent(fieldTypes, { type: 'rating', isCustomType: true, valueType: 'string' })).toBe(textComponent);
        });

        it('should give no component for an unknown type', () => {
            expect(resolveFieldComponent(fieldTypes, { type: 'mystery' })).toBeUndefined();
        });
    });
});
