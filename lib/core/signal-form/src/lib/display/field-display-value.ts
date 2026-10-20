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

import { FullNamePipe } from '@alfresco/adf-core';
import type { FieldDefinition, FieldOption } from '../definition/form-definition.interface';
import type { DisplayValueFormatter, FieldTypeResolver } from '../field-types/field-type-definition.interface';
import { resolveFieldType } from '../field-types/field-type-resolution';

const fullNamePipe = new FullNamePipe();

type User = Parameters<FullNamePipe['transform']>[0];

/**
 * Turns any value into text: strings as they are, objects as JSON.
 *
 * @param value the value
 * @returns the text
 */
export const stringifyValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'object' && !(value instanceof Date)) {
        return JSON.stringify(value);
    }
    return String(value);
};

/**
 * Returns the text shown for a field value, using the field type's own formatter when it has one.
 *
 * @param fieldTypes the field type definitions
 * @param definition the field
 * @param value the field value
 * @returns the text
 */
export const displayFieldValue = (fieldTypes: FieldTypeResolver, definition: FieldDefinition, value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }
    const formatter = resolveFieldType(fieldTypes, definition)?.definition.displayValue;
    return formatter ? formatter({ definition, value }) : stringifyValue(value);
};

const joinNames = (names: string[]): string => names.filter((name) => !!name).join(', ');

const optionName = (definition: FieldDefinition, option: unknown): string => {
    if (typeof option === 'string') {
        return definition.options.find(({ id }) => id === option)?.name ?? option;
    }
    return nameOf(option) ?? '';
};

export const optionDisplayValue: DisplayValueFormatter = ({ definition, value }) => {
    if (Array.isArray(value)) {
        return joinNames(value.map((option) => optionName(definition, option)));
    }
    if (typeof value === 'string') {
        return optionName(definition, value);
    }
    return nameOf(value) ?? JSON.stringify(value);
};

export const peopleDisplayValue: DisplayValueFormatter = ({ value }) => joinNames(asList(value).map((user) => fullNamePipe.transform(user as User)));

export const groupDisplayValue: DisplayValueFormatter = ({ value }) => joinNames(asList(value).map((group) => nameOf(group) ?? ''));

const asList = (value: unknown): unknown[] => (Array.isArray(value) ? value : [value]);

const nameOf = (value: unknown): string | undefined => {
    const name = typeof value === 'object' && value !== null ? (value as Partial<FieldOption>).name : undefined;
    return typeof name === 'string' ? name : undefined;
};
