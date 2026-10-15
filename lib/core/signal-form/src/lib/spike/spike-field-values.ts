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

import { format, isValid } from 'date-fns';
import { DateFnsUtils } from '../../../../src/lib/common/utils/date-fns-utils';
import type { FieldJson, SpikeFieldDefinition, SpikeOption } from './spike-definition';

const DROPDOWN = 'dropdown';
const RADIO_BUTTONS = 'radio-buttons';
const DATE = 'date';
const DATETIME = 'datetime';
const BOOLEAN = 'boolean';
const INTEGER = 'integer';
const AMOUNT = 'amount';
const DECIMAL = 'bigdecimal';
const UPLOAD = 'upload';
const PEOPLE = 'people';
const FUNCTIONAL_GROUP = 'functional-group';
const NO_PAYLOAD_TYPES: ReadonlySet<string> = new Set(['hyperlink', 'readonly', 'readonly-text', 'group', 'container', 'section']);
const EMPTY_OPTION: SpikeOption = { id: 'empty', name: 'Choose one...' };
const LABEL_SUFFIX = '_LABEL';

export const readOptions = (field: FieldJson): SpikeOption[] => (field.optionType === 'rest' ? [] : validOptions(field.options));

export const readInitialValue = (field: FieldJson, definition: SpikeFieldDefinition): unknown => {
    const value = Object.prototype.hasOwnProperty.call(field, 'value') && field.value !== undefined ? field.value : null;

    switch (field.type) {
        case DROPDOWN:
            return initialDropdownValue(field, definition, value);
        case RADIO_BUTTONS:
            return initialRadioValue(field, definition, value);
        case DATE:
            return value === 'today' ? new Date() : initialDateValue(value, false);
        case DATETIME:
            return initialDateValue(value, true);
        case BOOLEAN:
            return field.value === 'true' || field.value === true;
        default:
            return value;
    }
};

export const submittedValue = (definition: SpikeFieldDefinition, value: any): unknown => {
    switch (definition.type) {
        case DROPDOWN:
            return submittedDropdownValue(definition, value);
        case RADIO_BUTTONS: {
            const option = definition.options.find((candidate) => candidate.id === value);
            if (definition.optionType === 'rest') {
                return option ? { ...option, options: definition.options } : { id: null, name: null, options: definition.options };
            }
            return option ? { ...option } : null;
        }
        case UPLOAD:
            return value?.length > 0 ? (Array.isArray(value) ? value.map((file) => file.id).join(',') : [value]) : null;
        case DATE:
            return submittedDateValue(definition, value);
        case DATETIME: {
            const date = value !== null ? DateFnsUtils.getDate(value) : null;
            return isValid(date) ? date.toISOString() : null;
        }
        case INTEGER:
        case AMOUNT:
            return definition.enableFractions ? parseFloat(value) : parseInt(value, 10);
        case DECIMAL:
            return parseFloat(value);
        case BOOLEAN:
            return value !== null && value !== undefined ? value : false;
        case PEOPLE:
        case FUNCTIONAL_GROUP:
            return value ? value : null;
        default:
            return NO_PAYLOAD_TYPES.has(definition.type) ? undefined : value;
    }
};

export const conditionValueOf = (definition: SpikeFieldDefinition, reference: string, payloadValue: any, value: any): unknown => {
    const label = reference.indexOf(LABEL_SUFFIX) > 0;
    let found: any;

    if (label) {
        if (payloadValue) {
            found = Array.isArray(payloadValue) ? payloadValue.map(({ name }) => name) : payloadValue.name;
        }
    } else if (payloadValue?.id) {
        found = payloadValue.id;
    } else if (payloadValue && Array.isArray(payloadValue)) {
        found = payloadValue.map(({ id }) => id);
    } else {
        found = payloadValue;
    }

    return found === undefined || found === null ? searchValue(definition, label, value) : found;
};

const searchValue = (definition: SpikeFieldDefinition, label: boolean, value: any): unknown => {
    let found: any = '';

    if (value?.name) {
        found = value.name;
    } else if (definition.options.length) {
        const option = definition.options.find((candidate) => candidate.id === value);
        if (option) {
            found = label ? option.name : option.id;
        }
    }

    if (!found) {
        if (value?.id) {
            found = value.id;
        } else if (value !== null && value !== undefined) {
            found = value;
        }
    }

    return found;
};

const initialDropdownValue = (field: FieldJson, definition: SpikeFieldDefinition, value: any): unknown => {
    if (definition.hasEmptyValue) {
        if (!definition.emptyOption) {
            definition.emptyOption = { ...EMPTY_OPTION };
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

const initialRadioValue = (field: FieldJson, definition: SpikeFieldDefinition, value: any): unknown => {
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
    if (value) {
        const date = isNumeric(value)
            ? new Date(value)
            : withTime
              ? DateFnsUtils.parseDate(value, 'YYYY-MM-DD hh:mm A')
              : DateFnsUtils.parseDate(value.split('T')[0], 'YYYY-M-D');
        if (isValid(date)) {
            return date;
        }
    }
    return value;
};

const submittedDropdownValue = (definition: SpikeFieldDefinition, value: any): unknown => {
    if (!value) {
        return null;
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        return value === 'empty' || value === '' ? null : (definition.options.find((option) => option.id === value) ?? null);
    }
    if (typeof value === 'object') {
        return value.id === 'empty' || value.id === '' ? null : (definition.options.find((option) => option.id === value.id) ?? null);
    }
    return null;
};

const submittedDateValue = (definition: SpikeFieldDefinition, value: any): unknown => {
    let date: Date;

    try {
        const formatted = typeof value === 'string' ? DateFnsUtils.formatDate(value, definition.dateDisplayFormat) : value;
        date = DateFnsUtils.parseDate(formatted, definition.dateDisplayFormat);
    } catch {
        date = new Date('error');
    }

    return isValid(date) ? `${format(date, 'yyyy-MM-dd')}T00:00:00.000Z` : null;
};

const validOptions = (options: unknown): SpikeOption[] => (Array.isArray(options) ? options.filter(isValidOption) : []);

const isValidOption = (option: any): option is SpikeOption => typeof option === 'object' && !Array.isArray(option) && !!option?.id && !!option?.name;

const addOption = (definition: SpikeFieldDefinition, option: SpikeOption): void => {
    if (!definition.options.find((existing) => existing?.id === option?.id)) {
        definition.options.push(option);
    }
};

const isNumeric = (value: unknown): boolean => value !== null && value !== undefined && value !== '' && !isNaN(+value);
