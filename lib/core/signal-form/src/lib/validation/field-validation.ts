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

import { addDays, isDate, isValid, parseISO } from 'date-fns';
import { DateFnsUtils, isNumberValue } from '@alfresco/adf-core';
import { FieldDefinition, FormFieldType } from '../definition/form-definition.model';
import type { FieldValidator } from '../widgets/form-widget-definition';

const TEXT = FormFieldType.Text;
const MULTILINE_TEXT = FormFieldType.MultilineText;
const INTEGER = FormFieldType.Integer;
const AMOUNT = FormFieldType.Amount;
const DECIMAL = FormFieldType.Decimal;
const BOOLEAN = FormFieldType.Boolean;
const RADIO_BUTTONS = FormFieldType.RadioButtons;
const UPLOAD = FormFieldType.Upload;
const DATE = FormFieldType.Date;
const DATETIME = FormFieldType.DateTime;
const DROPDOWN = FormFieldType.Dropdown;
const DEFAULT_TEXT_MAX_LENGTH = 1024;
const DEFAULT_INTEGER_MAX_LENGTH = 10;
const REQUIRED_TYPES: ReadonlySet<string> = new Set([
    TEXT,
    MULTILINE_TEXT,
    INTEGER,
    BOOLEAN,
    FormFieldType.People,
    FormFieldType.FunctionalGroup,
    RADIO_BUTTONS,
    UPLOAD,
    AMOUNT,
    DECIMAL,
    FormFieldType.DisplayExternalProperty,
    FormFieldType.FileViewer,
    FormFieldType.PropertiesViewer
]);
const PEOPLE_TYPES: ReadonlySet<string> = new Set([FormFieldType.People, FormFieldType.FunctionalGroup]);
const NUMBER_TYPES: ReadonlySet<string> = new Set([INTEGER, AMOUNT]);
const RANGE_TYPES: ReadonlySet<string> = new Set([INTEGER, DECIMAL, AMOUNT]);
const LENGTH_TYPES: ReadonlySet<string> = new Set([TEXT, MULTILINE_TEXT]);

export type FieldErrorKind =
    'required' | 'number' | 'minLength' | 'maxLength' | 'minValue' | 'maxValue' | 'pattern' | 'decimal' | 'precision' | 'date' | 'dropdown';

export const requiredValidator: FieldValidator = (field, value) => {
    if (!field.required || !REQUIRED_TYPES.has(field.type)) {
        return null;
    }
    if (field.type === RADIO_BUTTONS) {
        return field.options.some((option) => option.id === value) ? null : 'required';
    }
    if (field.type === UPLOAD) {
        return !!value && value.length > 0 ? null : 'required';
    }
    if (field.type === BOOLEAN) {
        return value ? null : 'required';
    }
    if (PEOPLE_TYPES.has(field.type) && Array.isArray(value)) {
        return value.length > 0 ? null : 'required';
    }
    return isBlank(value) || (typeof value === 'string' && value.trim().length === 0) ? 'required' : null;
};

export const numberValidator: FieldValidator = (field, value) => {
    if (!NUMBER_TYPES.has(field.type) || isBlank(value)) {
        return null;
    }
    const allowed = field.enableFractions ? /^-?[0-9]+(\.[0-9]{1,2})?$/ : /^-?\d+$/;
    return allowed.test(`${value}`) ? null : 'number';
};

export const minLengthValidator: FieldValidator = (field, value) =>
    value && LENGTH_TYPES.has(field.type) && field.minLength > 0 && value.length < field.minLength ? 'minLength' : null;

export const maxLengthValidator: FieldValidator = (field, value) => {
    const limit = maxLengthOf(field);
    return value && limit > 0 && value.toString().length > limit ? 'maxLength' : null;
};

export const minValueValidator: FieldValidator = (field, value) =>
    value && RANGE_TYPES.has(field.type) && isNumberValue(field.minValue) && !(+value >= +field.minValue) ? 'minValue' : null;

export const maxValueValidator: FieldValidator = (field, value) =>
    value && RANGE_TYPES.has(field.type) && isNumberValue(field.maxValue) && !(+value <= +field.maxValue) ? 'maxValue' : null;

export const patternValidator: FieldValidator = (field, value) =>
    value && LENGTH_TYPES.has(field.type) && field.regexPattern && !(value.length > 0 && new RegExp(`^${field.regexPattern}$`).test(value))
        ? 'pattern'
        : null;

export const decimalValidator: FieldValidator = (field, value) => {
    if (field.type !== DECIMAL || !value) {
        return null;
    }
    if (!isNumberValue(value)) {
        return 'decimal';
    }
    const decimalPart = `${value}`.split('.')[1];
    return decimalPart !== undefined && decimalPart.length > field.precision ? 'precision' : null;
};

export const dateValidator: FieldValidator = (field, value) => {
    if (field.type !== DATE && field.type !== DATETIME) {
        return null;
    }
    const parsed = toPickerDate(value);
    const valid = validDateOrNull(parsed);
    const { min, max } = dateFieldRange(field);
    const compare = field.type === DATE ? compareDates : compareDateTimes;

    const failed =
        (parsed && !isValid(parsed)) ||
        (field.required && isEmptyFieldValue(value)) ||
        (min && valid && compare(min, valid) > 0) ||
        (max && valid && compare(max, valid) < 0);
    return failed ? 'date' : null;
};

export const dropdownValidator: FieldValidator = (field, value) =>
    field.type === DROPDOWN && field.required && isDropdownValueEmpty(field, value) ? 'dropdown' : null;

export const firstValidationError = (field: FieldDefinition, value: unknown, validators: readonly FieldValidator[]): string | null => {
    for (const validator of validators) {
        const error = validator(field, value);
        if (error) {
            return error;
        }
    }
    return null;
};

const maxLengthOf = (field: FieldDefinition): number => {
    if (field.type === INTEGER) {
        return DEFAULT_INTEGER_MAX_LENGTH;
    }
    if (field.type === TEXT) {
        return field.maxLength > 0 ? field.maxLength : DEFAULT_TEXT_MAX_LENGTH;
    }
    return field.type === MULTILINE_TEXT ? field.maxLength : 0;
};

const dateRange = (field: FieldDefinition): { min: Date | null; max: Date | null } => {
    if (field.dynamicDateRangeSelection) {
        const today = new Date();
        return {
            min: field.minDateRangeValue === null ? null : validDateOrNull(addDays(today, field.minDateRangeValue)),
            max: field.maxDateRangeValue === null ? null : validDateOrNull(addDays(today, field.maxDateRangeValue))
        };
    }
    return {
        min: validDateOrNull(field.minValue ? parseISO(`${field.minValue}`) : null),
        max: validDateOrNull(field.maxValue ? parseISO(`${field.maxValue}`) : null)
    };
};

const dateTimeRange = (field: FieldDefinition): { min: Date | null; max: Date | null } => ({
    min: validDateOrNull(field.minValue ? DateFnsUtils.getDate(`${field.minValue}`) : null),
    max: validDateOrNull(field.maxValue ? DateFnsUtils.getDate(`${field.maxValue}`) : null)
});

/**
 * Returns the earliest and latest value a date or datetime field accepts, from its fixed or dynamic range.
 *
 * @param field the date or datetime field
 * @returns the range, each end `null` when open
 */
export const dateFieldRange = (field: FieldDefinition): { min: Date | null; max: Date | null } =>
    field.type === DATE ? dateRange(field) : dateTimeRange(field);

const toPickerDate = (value: unknown): Date | null => {
    if (typeof value === 'string') {
        if (!value) {
            return null;
        }
        const parsed = parseISO(value);
        if (isValid(parsed)) {
            return parsed;
        }
    }
    if (value === null || value === undefined || (isDate(value) && isValid(value))) {
        return (value as Date) ?? null;
    }
    return new Date(NaN);
};

const validDateOrNull = (value: unknown): Date | null => (isDate(value) && isValid(value) ? (value as Date) : null);

const compareDates = (first: Date, second: Date): number =>
    first.getFullYear() - second.getFullYear() || first.getMonth() - second.getMonth() || first.getDate() - second.getDate();

const compareDateTimes = (first: Date, second: Date): number =>
    compareDates(first, second) || first.getHours() - second.getHours() || first.getMinutes() - second.getMinutes();

const isDropdownValueEmpty = (field: FieldDefinition, value: any): boolean => {
    if (field.multiple) {
        return !Array.isArray(value) || value.length === 0;
    }
    if (isEmptyFieldValue(value)) {
        return true;
    }
    const emptyOption = field.hasEmptyValue ? field.emptyOption : undefined;
    if (!emptyOption) {
        return false;
    }
    if (typeof value === 'string') {
        return value === emptyOption.id || value === emptyOption.name;
    }
    return !Array.isArray(value) && value?.id === emptyOption.id && value?.name === emptyOption.name;
};

const isEmptyFieldValue = (value: unknown): boolean =>
    value === null || value === undefined || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);

const isBlank = (value: unknown): boolean => value === null || value === undefined || value === '';
