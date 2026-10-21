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

import type { FieldDefinition, FieldValue } from '../definition/form-definition.interface';
import { stringifyValue } from '../display/field-display-value';

const EXPRESSION = /\$\{[a-zA-Z0-9_.]+\}/g;
const FIELD_PREFIX = 'field.';
const VARIABLE_PREFIX = 'variable.';
const REFERENCE = /^\$\{((?:field|variable)\.[a-zA-Z_$][a-zA-Z0-9_$]*)\}$/;
const HTML_ENTITIES: Readonly<Record<string, string>> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };

export interface TextExpressionSource {
    field(fieldId: string): { definition: FieldDefinition; value: FieldValue } | undefined;
    variableValue(identifier: string): unknown;
}

export interface TextExpressionOptions {
    /** Formats typed values (options, people, groups…) as text; without it, non-text values are shown as JSON. */
    formatFieldValue?: (definition: FieldDefinition, value: FieldValue) => string;
    escapeHtml?: boolean;
}

interface ResolvedFieldReference {
    value: FieldValue;
    definition: FieldDefinition;
}

interface ResolvedTextReference {
    value: unknown;
}

type ResolvedReference = ResolvedFieldReference | ResolvedTextReference;

/**
 * Replaces the `${field.<id>}` and `${variable.<name>}` expressions in a text with the current values, as today's
 * form does. Any other expression resolves to its own text.
 *
 * @param text the text
 * @param source where field and variable values come from
 * @param options how values are formatted and escaped
 * @returns the text with its expressions resolved
 */
export const resolveTextExpressions = (text: string | null | undefined, source: TextExpressionSource, options: TextExpressionOptions = {}): string =>
    (text || '').replace(EXPRESSION, (expression) => {
        const resolved = resolveReference(expression, source);
        const shown = resolved.value === null || resolved.value === undefined ? '' : shownValue(resolved, options);
        return options.escapeHtml ? escapeHtml(shown) : shown;
    });

const resolveReference = (expression: string, source: TextExpressionSource): ResolvedReference => {
    const reference = REFERENCE.exec(expression)?.[1];
    if (!reference) {
        return { value: expression };
    }
    if (reference.startsWith(FIELD_PREFIX)) {
        const field = source.field(reference.slice(FIELD_PREFIX.length));
        return field ?? { value: undefined };
    }
    return { value: source.variableValue(reference.slice(VARIABLE_PREFIX.length)) };
};

const shownValue = (resolved: ResolvedReference, { formatFieldValue }: TextExpressionOptions): string => {
    if (!formatFieldValue) {
        return typeof resolved.value === 'string' ? resolved.value : JSON.stringify(resolved.value);
    }
    return 'definition' in resolved ? formatFieldValue(resolved.definition, resolved.value) : stringifyValue(resolved.value);
};

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
