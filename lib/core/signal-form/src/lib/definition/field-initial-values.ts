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

import { isValid } from 'date-fns';
import { DateFnsUtils, isNumberValue } from '@alfresco/adf-core';
import type { FieldJson } from './form-definition.json';
import { fieldWidget } from '../widgets/field-widget';
import type { FormWidgetResolver, InitialValueReader } from '../widgets/form-widget-definition';
import { DEFAULT_EMPTY_OPTION, FieldDefinition, FieldOption } from './form-definition.model';

const TODAY = 'today';

export const readOptions = (field: FieldJson): FieldOption[] => (field.optionType === 'rest' ? [] : validOptions(field.options));

export const jsonValue = (field: FieldJson): unknown =>
    Object.prototype.hasOwnProperty.call(field, 'value') && field.value !== undefined ? field.value : null;

export const readInitialValue = (field: FieldJson, definition: FieldDefinition, widgets: FormWidgetResolver): unknown =>
    (fieldWidget(widgets, definition)?.definition.initialValue ?? jsonValue)(field, definition);

export const dropdownInitialValue: InitialValueReader = (field, definition) => initialDropdownValue(field, definition, jsonValue(field));

export const radioInitialValue: InitialValueReader = (field, definition) => initialRadioValue(field, definition, jsonValue(field));

export const dateInitialValue: InitialValueReader = (field) => {
    const value = jsonValue(field);
    return value === TODAY ? new Date() : initialDateValue(value, false);
};

export const dateTimeInitialValue: InitialValueReader = (field) => initialDateValue(jsonValue(field), true);

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
    const parsed = withTime ? DateFnsUtils.parseDate(value, 'YYYY-MM-DD hh:mm A') : DateFnsUtils.parseDate(value.split('T')[0], 'YYYY-M-D');
    return validDateOr(parsed, value);
};

const validDateOr = (date: Date, fallback: unknown): unknown => (isValid(date) ? date : fallback);

const validOptions = (options: unknown): FieldOption[] => (Array.isArray(options) ? options.filter(isValidOption) : []);

const isValidOption = (option: any): option is FieldOption => typeof option === 'object' && !Array.isArray(option) && !!option?.id && !!option?.name;

const addOption = (definition: FieldDefinition, option: FieldOption): void => {
    if (!definition.options.some((existing) => existing?.id === option?.id)) {
        definition.options.push(option);
    }
};
