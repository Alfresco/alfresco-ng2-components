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
import type { FieldJson } from './form-definition.json';
import { fieldWidget } from '../widgets/field-widget';
import type { FormWidgetResolver, InitialValueReader } from '../widgets/form-widget-definition';
import { DEFAULT_EMPTY_OPTION, FieldDefinition, FieldOption } from './form-definition.model';

const TODAY = 'today';
const NOW = 'now';

export const readOptions = (field: FieldJson): FieldOption[] => (field.optionType === 'rest' ? [] : validOptions(field.options));

export const jsonValue = (field: FieldJson): unknown =>
    Object.prototype.hasOwnProperty.call(field, 'value') && field.value !== undefined ? field.value : null;

export const readInitialValue = (field: FieldJson, definition: FieldDefinition, widgets: FormWidgetResolver): unknown =>
    (fieldWidget(widgets, definition)?.definition.initialValue ?? jsonValue)(field, definition);

/**
 * Reads a value given later (a saved or refreshed value) as the field's own JSON value would be read, by its type.
 *
 * @param definition the field
 * @param value the value
 * @param widgets the field type definitions
 * @returns the field value
 */
export const readFieldValue = (definition: FieldDefinition, value: unknown, widgets: FormWidgetResolver): unknown =>
    readInitialValue(
        { id: definition.id, type: definition.type, options: definition.options, optionType: definition.optionType, value },
        definition,
        widgets
    );

/**
 * Reads a saved repeatable section row, each field value by its type; fields without a saved value are left out.
 *
 * @param fields the section's fields
 * @param row the saved row
 * @param widgets the field type definitions
 * @returns the row values
 */
export const readSavedRow = (
    fields: FieldDefinition[],
    row: Record<string, unknown> | null | undefined,
    widgets: FormWidgetResolver
): Record<string, unknown> =>
    Object.fromEntries(
        fields
            .filter((field) => row?.[field.id] !== undefined && row[field.id] !== null)
            .map((field) => [field.id, readFieldValue(field, row[field.id], widgets)])
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

export const dropdownInitialValue: InitialValueReader = (field, definition) => initialDropdownValue(field, definition, jsonValue(field));

export const radioInitialValue: InitialValueReader = (field, definition) => initialRadioValue(field, definition, jsonValue(field));

export const dateInitialValue: InitialValueReader = (field) => {
    const value = jsonValue(field);
    return value === TODAY ? new Date() : initialDateValue(value, false);
};

export const dateTimeInitialValue: InitialValueReader = (field) => {
    const value = jsonValue(field);
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
    const value = jsonValue(field);
    const fractionDigits = `${value}`.split('.')[1]?.length ?? 0;
    return definition.precision !== undefined && fractionDigits > definition.precision ? parseFloat(`${value}`).toFixed(definition.precision) : value;
};

export const booleanInitialValue: InitialValueReader = (field) => field.value === 'true' || field.value === true;

const initialDropdownValue = (field: FieldJson, definition: FieldDefinition, value: any): unknown => {
    if (definition.hasEmptyValue) {
        if (!definition.emptyOption) {
            definition.emptyOption = { ...DEFAULT_EMPTY_OPTION };
            definition.options.unshift(definition.emptyOption);
        }
        if (!value || [definition.emptyOption.id, definition.emptyOption.name].includes(value)) {
            return definition.emptyOption;
        }
    }

    if (isValidOption(value)) {
        addOption(definition, { id: value.id, name: value.name });
        return value;
    }

    if (definition.multiple) {
        const selected = validOptions(field.value);
        selected.forEach((option) => addOption(definition, option));
        return selected;
    }

    return value;
};

const initialRadioValue = (field: FieldJson, definition: FieldDefinition, value: any): unknown => {
    if (field.value?.options) {
        definition.options = validOptions(field.value.options);
    }

    const matching = definition.options.find(
        (option) => option.id === value || option.name === value || (value && (option.id === value.id || option.name === value.name))
    );
    if (matching) {
        return matching.id;
    }

    if (isValidOption(value)) {
        addOption(definition, { id: value.id, name: value.name });
        return value.id;
    }

    return value;
};

const initialDateValue = (value: any, withTime: boolean): unknown => {
    if (!value) {
        return value;
    }
    if (isNumberValue(value)) {
        return validDateOr(new Date(value), value);
    }
    if (!withTime) {
        return validDateOr(DateFnsUtils.parseDate(value.split('T')[0], 'YYYY-M-D'), value);
    }
    const typed = DateFnsUtils.parseDate(value, 'YYYY-MM-DD hh:mm A');
    return isValid(typed) ? typed : validDateOr(parseISO(`${value}`), value);
};

const validDateOr = (date: Date, fallback: unknown): unknown => (isValid(date) ? date : fallback);

const validOptions = (options: unknown): FieldOption[] => (Array.isArray(options) ? options.filter(isValidOption) : []);

const isValidOption = (option: any): option is FieldOption => typeof option === 'object' && !Array.isArray(option) && !!option?.id && !!option?.name;

const addOption = (definition: FieldDefinition, option: FieldOption): void => {
    if (!definition.options.some((existing) => existing?.id === option?.id)) {
        definition.options.push(option);
    }
};
