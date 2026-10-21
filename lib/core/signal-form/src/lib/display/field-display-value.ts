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
import type {
    ChoiceSelection,
    ChoiceValue,
    FieldDefinition,
    FieldValue,
    GroupFieldValue,
    PeopleFieldValue
} from '../definition/form-definition.interface';
import type { DisplayValueFormatter, FieldTypeResolver } from '../field-types/field-type-definition.interface';
import { resolveFieldType } from '../field-types/field-type-resolution';

const fullNamePipe = new FullNamePipe();

/**
 * Turns any value into text: strings as they are, numbers, checkbox states and dates as text, other objects as JSON.
 * Anything else, such as a function, shows nothing.
 *
 * @param value the value
 * @returns the text
 */
export const stringifyValue = (value: unknown): string => {
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
        return `${value}`;
    }
    if (value instanceof Date) {
        return value.toString();
    }
    return typeof value === 'object' && value !== null ? JSON.stringify(value) : '';
};

/**
 * Returns the text shown for a field value, using the field type's own formatter when it has one.
 *
 * @param fieldTypes the field type definitions
 * @param definition the field
 * @param value the field value
 * @returns the text
 */
export const displayFieldValue = (fieldTypes: FieldTypeResolver, definition: FieldDefinition, value: FieldValue): string => {
    if (value === null || value === undefined) {
        return '';
    }
    const formatter = resolveFieldType(fieldTypes, definition)?.definition.displayValue;
    return formatter ? formatter({ definition, value }) : stringifyValue(value);
};

const joinNames = (names: string[]): string => names.filter((name) => !!name).join(', ');

const optionName = (definition: FieldDefinition, option: ChoiceValue): string =>
    typeof option === 'string' ? (definition.options.find(({ id }) => id === option)?.name ?? option) : option.name;

export const optionDisplayValue: DisplayValueFormatter<ChoiceSelection> = ({ definition, value }) =>
    Array.isArray(value) ? joinNames(value.map((option) => optionName(definition, option))) : optionName(definition, value);

export const peopleDisplayValue: DisplayValueFormatter<PeopleFieldValue> = ({ value }) =>
    joinNames(asList(value).map((person) => fullNamePipe.transform(person)));

export const groupDisplayValue: DisplayValueFormatter<GroupFieldValue> = ({ value }) =>
    joinNames(asList(value).map((group) => group.name ?? ''));

const asList = <TItem>(value: TItem | TItem[]): TItem[] => (Array.isArray(value) ? value : [value]);
