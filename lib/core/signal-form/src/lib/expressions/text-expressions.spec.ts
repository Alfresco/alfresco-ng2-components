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

import { FieldDefinition } from '../definition/form-definition.model';
import { resolveTextExpressions, TextExpressionSource } from './text-expressions';

describe('resolveTextExpressions', () => {
    const country = { id: 'country', type: 'dropdown' } as FieldDefinition;
    const values: Record<string, unknown> = { name: 'Vito', country: { id: 'it', name: 'Italy' }, empty: null };
    const source: TextExpressionSource = {
        field: (fieldId) =>
            fieldId in values
                ? { definition: fieldId === 'country' ? country : ({ id: fieldId, type: 'text' } as FieldDefinition), value: values[fieldId] }
                : undefined,
        variableValue: (identifier) => ({ region: 'EMEA', limits: { max: 3 } })[identifier]
    };

    it('should replace field and variable expressions, and leave text without expressions as it is', () => {
        expect(resolveTextExpressions('Hello ${field.name} from ${variable.region}', source)).toBe('Hello Vito from EMEA');
        expect(resolveTextExpressions('No expressions', source)).toBe('No expressions');
        expect(resolveTextExpressions(null, source)).toBe('');
    });

    it('should show unknown fields and empty values as nothing, and keep any other expression as written', () => {
        expect(resolveTextExpressions('[${field.missing}][${field.empty}]', source)).toBe('[][]');
        expect(resolveTextExpressions('${other.name} ${field.name.first}', source)).toBe('${other.name} ${field.name.first}');
    });

    it('should show non-text values as JSON unless typed values are formatted', () => {
        expect(resolveTextExpressions('${field.country} ${variable.limits}', source)).toBe('{"id":"it","name":"Italy"} {"max":3}');

        const formatted = resolveTextExpressions('${field.country} ${variable.limits}', source, {
            formatFieldValue: (definition, value) => `${definition.type}:${(value as { name: string }).name}`
        });

        expect(formatted).toBe('dropdown:Italy {"max":3}');
    });

    it('should escape the resolved values, not the text around them, when asked', () => {
        const markup: TextExpressionSource = {
            field: () => ({ definition: {} as FieldDefinition, value: '<b>"A&B"</b>' }),
            variableValue: () => undefined
        };

        expect(resolveTextExpressions('<p>${field.any}</p>', markup, { escapeHtml: true })).toBe('<p>&lt;b&gt;&quot;A&amp;B&quot;&lt;/b&gt;</p>');
    });

    it('should insert values literally, even when they look like replacement patterns', () => {
        const dollars: TextExpressionSource = {
            field: () => ({ definition: {} as FieldDefinition, value: "$& $' $$" }),
            variableValue: () => undefined
        };

        expect(resolveTextExpressions('Price: ${field.price}', dollars)).toBe("Price: $& $' $$");
    });
});
