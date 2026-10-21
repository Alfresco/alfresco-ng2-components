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

import { addDays, isValid, parseISO } from 'date-fns';
import { DateFnsUtils, isNumberValue } from '@alfresco/adf-core';
import type { DropdownFieldValue, FieldDefinition, FieldValue, NumberFieldValue } from '../definition/form-definition.interface';
import { FormFieldType } from '../definition/form-field-types';
import { hasLength, isBlank } from '../form-value-guards';
import type { FieldValidator } from '../field-types/field-type-definition.interface';

const DEFAULT_TEXT_MAX_LENGTH = 1024;
const DEFAULT_INTEGER_MAX_LENGTH = 10;
const REQUIRED_TYPES: ReadonlySet<string> = new Set([
    FormFieldType.Text,
    FormFieldType.MultilineText,
    FormFieldType.Integer,
    FormFieldType.Boolean,
    FormFieldType.People,
    FormFieldType.FunctionalGroup,
    FormFieldType.RadioButtons,
    FormFieldType.Upload,
    FormFieldType.Amount,
    FormFieldType.Decimal,
    FormFieldType.DisplayExternalProperty,
    FormFieldType.FileViewer,
    FormFieldType.PropertiesViewer
]);
const PEOPLE_TYPES: ReadonlySet<string> = new Set([FormFieldType.People, FormFieldType.FunctionalGroup]);
const NUMBER_TYPES: ReadonlySet<string> = new Set([FormFieldType.Integer, FormFieldType.Amount]);
const RANGE_TYPES: ReadonlySet<string> = new Set([FormFieldType.Integer, FormFieldType.Decimal, FormFieldType.Amount]);
const LENGTH_TYPES: ReadonlySet<string> = new Set([FormFieldType.Text, FormFieldType.MultilineText]);
const WHOLE_NUMBER = /^-?\d+$/;
const NUMBER_WITH_CENTS = /^-?\d+(\.\d{1,2})?$/;

export type FieldErrorKind =
    | 'required'
    | 'number'
    | 'minLength'
    | 'maxLength'
    | 'minValue'
    | 'maxValue'
    | 'pattern'
    | 'decimal'
    | 'precision'
    | 'dateFormat'
    | 'dateMin'
    | 'dateMax'
    | 'dropdown';

export const requiredValidator: FieldValidator = (field, value) =>
    field.required && REQUIRED_TYPES.has(field.type) && !hasRequiredValue(field, value) ? 'required' : null;

export const numberValidator: FieldValidator<NumberFieldValue> = (field, value) => {
    if (!NUMBER_TYPES.has(field.type) || isBlank(value)) {
        return null;
    }
    const allowed = field.enableFractions ? NUMBER_WITH_CENTS : WHOLE_NUMBER;
    return allowed.test(`${value}`) ? null : 'number';
};

export const minLengthValidator: FieldValidator = (field, value) =>
    typeof value === 'string' && value && LENGTH_TYPES.has(field.type) && field.minLength > 0 && value.length < field.minLength ? 'minLength' : null;

export const maxLengthValidator: FieldValidator = (field, value) => {
    const limit = maxLengthOf(field);
    return limit > 0 && typedLength(value) > limit ? 'maxLength' : null;
};

export const minValueValidator: FieldValidator<NumberFieldValue> = (field, value) =>
    value && RANGE_TYPES.has(field.type) && isNumberValue(field.minValue) && !isAtLeast(value, field.minValue) ? 'minValue' : null;

export const maxValueValidator: FieldValidator<NumberFieldValue> = (field, value) =>
    value && RANGE_TYPES.has(field.type) && isNumberValue(field.maxValue) && !isAtMost(value, field.maxValue) ? 'maxValue' : null;

export const patternValidator: FieldValidator = (field, value) =>
    typeof value === 'string' && value && LENGTH_TYPES.has(field.type) && field.regexPattern && !matchesPattern(value, field.regexPattern)
        ? 'pattern'
        : null;

export const decimalValidator: FieldValidator<NumberFieldValue> = (field, value) => {
    if (field.type !== FormFieldType.Decimal || !value) {
        return null;
    }
    if (!isNumberValue(value)) {
        return 'decimal';
    }
    const decimalPart = `${value}`.split('.')[1];
    return decimalPart !== undefined && decimalPart.length > field.precision ? 'precision' : null;
};

export const dateValidator: FieldValidator = (field, value) => {
    if (field.type !== FormFieldType.Date && field.type !== FormFieldType.DateTime) {
        return null;
    }
    const parsed = toPickerDate(value);
    if (parsed && !isValid(parsed)) {
        return 'dateFormat';
    }
    if (field.required && isEmptyFieldValue(value)) {
        return 'required';
    }
    return dateRangeError(field, validDateOrNull(parsed));
};

export const dropdownValidator: FieldValidator<DropdownFieldValue> = (field, value) =>
    field.type === FormFieldType.Dropdown && field.required && isDropdownValueEmpty(field, value) ? 'dropdown' : null;

export const firstValidationError = (field: FieldDefinition, value: FieldValue, validators: readonly FieldValidator[]): string | null => {
    for (const validator of validators) {
        const error = validator(field, value);
        if (error) {
            return error;
        }
    }
    return null;
};

/**
 * Whether a required field holds a value, as today's form checks it for the field's type: a radio holds one of its
 * options, a checkbox is checked, an upload or a people list has an item, and any other field a non-blank value.
 *
 * @param field the field
 * @param value the field value
 * @returns `true` when the required field holds a value
 */
const hasRequiredValue = (field: FieldDefinition, value: FieldValue): boolean => {
    if (field.type === FormFieldType.RadioButtons) {
        return field.options.some((option) => option.id === value);
    }
    if (field.type === FormFieldType.Upload) {
        return hasLength(value);
    }
    if (field.type === FormFieldType.Boolean) {
        return !!value;
    }
    if (PEOPLE_TYPES.has(field.type) && Array.isArray(value)) {
        return value.length > 0;
    }
    return !isBlank(value) && !(typeof value === 'string' && value.trim().length === 0);
};

const matchesPattern = (value: string, regexPattern: string): boolean => value.length > 0 && new RegExp(`^${regexPattern}$`).test(value);

const dateRangeError = (field: FieldDefinition, date: Date | null): string | null => {
    if (!date) {
        return null;
    }
    const { min, max } = dateFieldRange(field);
    const compare = field.type === FormFieldType.Date ? compareDates : compareDateTimes;
    if (min && compare(min, date) > 0) {
        return 'dateMin';
    }
    return max && compare(max, date) < 0 ? 'dateMax' : null;
};

/**
 * Returns the maximum length a text or integer field is checked against: its own, or the default limit.
 *
 * @param field the field
 * @returns the maximum length
 */
export const maxLengthOf = (field: FieldDefinition): number => {
    if (field.type === FormFieldType.Integer) {
        return DEFAULT_INTEGER_MAX_LENGTH;
    }
    if (field.type === FormFieldType.Text) {
        return field.maxLength > 0 ? field.maxLength : DEFAULT_TEXT_MAX_LENGTH;
    }
    return field.type === FormFieldType.MultilineText ? field.maxLength : 0;
};

const dateRange = (field: FieldDefinition): { min: Date | null; max: Date | null } => {
    if (field.dynamicDateRangeSelection) {
        const today = field.dateRangeReference ?? new Date();
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
    field.type === FormFieldType.Date ? dateRange(field) : dateTimeRange(field);

/**
 * Reads a date field's value as the picker holds it: a valid date, no date, or an invalid date for a value that is no
 * date, such as unreadable typed text.
 *
 * @param value the field value
 * @returns the date, `null` for no value
 */
const toPickerDate = (value: FieldValue): Date | null => {
    if (value === null || value === '') {
        return null;
    }
    if (value instanceof Date) {
        return isValid(value) ? value : new Date(NaN);
    }
    const parsed = typeof value === 'string' ? parseISO(value) : new Date(NaN);
    return isValid(parsed) ? parsed : new Date(NaN);
};

const validDateOrNull = (value: Date | null): Date | null => (value && isValid(value) ? value : null);

const compareDates = (first: Date, second: Date): number =>
    first.getFullYear() - second.getFullYear() || first.getMonth() - second.getMonth() || first.getDate() - second.getDate();

const compareDateTimes = (first: Date, second: Date): number =>
    compareDates(first, second) || first.getHours() - second.getHours() || first.getMinutes() - second.getMinutes();

const isDropdownValueEmpty = (field: FieldDefinition, value: DropdownFieldValue): boolean => {
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
    return !Array.isArray(value) && value.id === emptyOption.id && value.name === emptyOption.name;
};

const isEmptyFieldValue = (value: FieldValue): boolean =>
    value === null || value === undefined || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);

/**
 * Returns how many characters a text or a number is typed with; any other value has none.
 *
 * @param value the field value
 * @returns the length
 */
const typedLength = (value: FieldValue): number => (typeof value === 'string' || typeof value === 'number' ? `${value}`.length : 0);

/**
 * Tells whether a value is at least a minimum. A value that is no number is not, so it fails the check, as today.
 *
 * @param value the field value
 * @param minimum the minimum, a number
 * @returns whether the value is a number at least the minimum
 */
const isAtLeast = (value: NumberFieldValue, minimum: NumberFieldValue): boolean => Number(value) >= Number(minimum);

/**
 * Tells whether a value is at most a maximum. A value that is no number is not, so it fails the check, as today.
 *
 * @param value the field value
 * @param maximum the maximum, a number
 * @returns whether the value is a number at most the maximum
 */
const isAtMost = (value: NumberFieldValue, maximum: NumberFieldValue): boolean => Number(value) <= Number(maximum);
