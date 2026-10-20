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

import { isValid, parseISO } from 'date-fns';
import { DateFnsUtils, isNumberValue } from '@alfresco/adf-core';
import type { FieldJson } from './form-definition-json.interface';
import type { FieldDefinition, FieldOption } from './form-definition.interface';
import { DEFAULT_EMPTY_OPTION, EMPTY_OPTION_ID } from './form-field-types';
import { resolveFieldType } from '../field-types/field-type-resolution';
import type { FieldOptionsReader, FieldTypeResolver, InitialValueReader } from '../field-types/field-type-definition.interface';

const TODAY = 'today';
const NOW = 'now';
const REST_OPTIONS = 'rest';

/**
 * Returns the options a field's JSON lists, none for options loaded from a REST service.
 *
 * @param field the field JSON
 * @returns the valid options
 */
export const authoredOptions = (field: FieldJson): FieldOption[] => (field.optionType === REST_OPTIONS ? [] : validOptions(field.options));

/**
 * Returns a field's own value as authored, `null` when it has none.
 *
 * @param field the field JSON
 * @returns the value
 */
export const authoredValue = (field: FieldJson): unknown =>
    Object.prototype.hasOwnProperty.call(field, 'value') && field.value !== undefined ? field.value : null;

/**
 * Reads a field's options as its type completes them, from the options its JSON lists.
 *
 * @param field the field JSON
 * @param hasEmptyValue whether the field offers an empty option
 * @param fieldTypes the field type definitions
 * @returns the options
 */
export const readOptions = (field: FieldJson, hasEmptyValue: boolean, fieldTypes: FieldTypeResolver): FieldOption[] => {
    const options = authoredOptions(field);
    const completeOptions = resolveFieldType(fieldTypes, field)?.definition.options;
    return completeOptions ? completeOptions(field, options, hasEmptyValue) : options;
};

export const readInitialValue = (field: FieldJson, definition: FieldDefinition, fieldTypes: FieldTypeResolver): unknown =>
    (resolveFieldType(fieldTypes, definition)?.definition.initialValue ?? authoredValue)(field, definition);

/**
 * Reads a value given later, such as a saved or refreshed value, the way the field's type reads its own JSON value.
 *
 * @param definition the field
 * @param value the value
 * @param fieldTypes the field type definitions
 * @returns the field value
 */
export const readValueAsType = (definition: FieldDefinition, value: unknown, fieldTypes: FieldTypeResolver): unknown =>
    readInitialValue(
        { id: definition.id, type: definition.type, options: definition.options, optionType: definition.optionType, value },
        definition,
        fieldTypes
    );

/**
 * Reads a saved repeatable section row, each field value by its type; fields without a saved value are left out.
 *
 * @param fields the section's fields
 * @param row the saved row
 * @param fieldTypes the field type definitions
 * @returns the row values
 */
export const readSavedRow = (
    fields: FieldDefinition[],
    row: Record<string, unknown> | null | undefined,
    fieldTypes: FieldTypeResolver
): Record<string, unknown> =>
    Object.fromEntries(
        fields
            .filter((field) => row?.[field.id] !== undefined && row[field.id] !== null)
            .map((field) => [field.id, readValueAsType(field, row[field.id], fieldTypes)])
    );

/**
 * Returns the value saved for a field, keyed as today's form keys it: by `variables.<name>`, else by the field id. A
 * falsy saved value (`false`, `0`, an empty text) counts as saved; only a missing or `null` value doesn't.
 *
 * @param values the saved values
 * @param field the field id and name
 * @param field.id the field id
 * @param field.name the field name
 * @returns the saved value, `undefined` when there is none
 */
export const savedValueFor = (values: Record<string, unknown>, field: { id: string; name?: string }): unknown => {
    const saved = values[`variables.${field.name}`] ?? values[field.id];
    return saved === null ? undefined : saved;
};

/**
 * Completes a dropdown's options: its empty option when it offers one, and the options its value holds, so a saved
 * option missing from the list is still offered.
 */
export const dropdownOptions: FieldOptionsReader = (field, options, hasEmptyValue) => {
    const value = authoredValue(field);
    const held = Array.isArray(value) ? validOptions(value) : validOptions([value]);
    const withEmpty = hasEmptyValue && !options.some(({ id }) => id === EMPTY_OPTION_ID) ? [{ ...DEFAULT_EMPTY_OPTION }, ...options] : options;
    return withOptions(withEmpty, held);
};

/**
 * Completes a radio's options: the options its value lists replace the authored ones, as today, and an option its
 * value holds is added when missing.
 */
export const radioOptions: FieldOptionsReader = (field, options) => {
    const value = authoredValue(field);
    const listed = isRecord(value) && Array.isArray(value['options']) ? validOptions(value['options']) : options;
    return isValidOption(value) && !matchingOption(listed, value) ? withOptions(listed, [value]) : listed;
};

export const dropdownInitialValue: InitialValueReader = (field, definition) => {
    const value = authoredValue(field);
    if (definition.hasEmptyValue && definition.emptyOption && isEmptyChoice(value, definition.emptyOption)) {
        return definition.emptyOption;
    }
    if (isValidOption(value)) {
        return value;
    }
    return definition.multiple ? validOptions(field.value) : value;
};

export const radioInitialValue: InitialValueReader = (field, definition) => {
    const value = authoredValue(field);
    const matching = matchingOption(definition.options, value);
    if (matching) {
        return matching.id;
    }
    return isValidOption(value) ? value.id : value;
};

export const dateInitialValue: InitialValueReader = (field) => {
    const value = authoredValue(field);
    return value === TODAY ? new Date() : initialDateValue(value, false);
};

export const dateTimeInitialValue: InitialValueReader = (field) => {
    const value = authoredValue(field);
    return value === NOW ? new Date() : initialDateValue(value, true);
};

/**
 * Rounds a decimal with more fraction digits than the field's precision, as today's form does when it renders.
 *
 * @param field the field JSON
 * @param definition the field definition
 * @returns the value, rounded to the precision when it has more digits
 */
export const decimalInitialValue: InitialValueReader = (field, definition) => {
    const value = authoredValue(field);
    const fractionDigits = `${value}`.split('.')[1]?.length ?? 0;
    return definition.precision !== undefined && fractionDigits > definition.precision ? parseFloat(`${value}`).toFixed(definition.precision) : value;
};

export const booleanInitialValue: InitialValueReader = (field) => field.value === 'true' || field.value === true;

const isEmptyChoice = (value: unknown, emptyOption: FieldOption): boolean =>
    !value || value === emptyOption.id || value === emptyOption.name;

const matchingOption = (options: FieldOption[], value: unknown): FieldOption | undefined =>
    options.find(
        (option) => option.id === value || option.name === value || (isRecord(value) && (option.id === value['id'] || option.name === value['name']))
    );

const initialDateValue = (value: unknown, withTime: boolean): unknown => {
    if (!value || (typeof value !== 'string' && typeof value !== 'number')) {
        return value;
    }
    if (isNumberValue(value)) {
        return validDateOr(new Date(value), value);
    }
    const text = `${value}`;
    if (!withTime) {
        return validDateOr(DateFnsUtils.parseDate(text.split('T')[0], 'YYYY-M-D'), value);
    }
    const typed = DateFnsUtils.parseDate(text, 'YYYY-MM-DD hh:mm A');
    return isValid(typed) ? typed : validDateOr(parseISO(text), value);
};

const validDateOr = (date: Date, fallback: unknown): unknown => (isValid(date) ? date : fallback);

const validOptions = (options: unknown): FieldOption[] => (Array.isArray(options) ? options.filter(isValidOption) : []);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const isValidOption = (option: unknown): option is FieldOption => isRecord(option) && !!option['id'] && !!option['name'];

/**
 * Adds options missing from a list, by id, keeping only their id and name.
 *
 * @param options the list
 * @param added the options to add
 * @returns the list with the missing options added
 */
const withOptions = (options: FieldOption[], added: FieldOption[]): FieldOption[] =>
    added.reduce(
        (list, option) => (list.some(({ id }) => id === option.id) ? list : [...list, { id: option.id, name: option.name }]),
        options
    );
