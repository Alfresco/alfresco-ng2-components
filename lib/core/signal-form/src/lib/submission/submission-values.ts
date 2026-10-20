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
import { DateFnsUtils } from '@alfresco/adf-core';
import type { FieldDefinition, SectionDefinition } from '../definition/form-definition.interface';
import { EMPTY_OPTION_ID } from '../definition/form-field-types';
import { resolveFieldType } from '../field-types/field-type-resolution';
import type { FieldTypeResolver, SubmittedValueWriter } from '../field-types/field-type-definition.interface';

export type FieldValues = Record<string, unknown>;

type FieldEntry = [definition: FieldDefinition, value: unknown];

export interface FormValuesModel {
    fields: FieldValues;
    sections: Record<string, FieldValues[]>;
}

/**
 * Builds the values the backend receives on save or complete, in today's shape: one entry per top-level field and
 * `values[sectionId][row][fieldId]` for repeatable sections.
 *
 * @param fields the top-level field definitions
 * @param sections the repeatable section definitions
 * @param model the current values
 * @param fieldTypes the field type definitions
 * @returns the submitted values
 */
export const toSubmissionValues = (
    fields: Map<string, FieldDefinition>,
    sections: Map<string, SectionDefinition>,
    model: FormValuesModel,
    fieldTypes: FieldTypeResolver
): FieldValues => {
    const submission = submittedRecord(Object.entries(model.fields).map(([id, value]): FieldEntry => [fields.get(id), value]), fieldTypes);

    for (const [sectionId, rows] of Object.entries(model.sections).filter(([, sectionRows]) => sectionRows.length > 0)) {
        const sectionFields = sections.get(sectionId).fields;
        submission[sectionId] = rows.map((row) => submittedRecord(sectionFields.map((field): FieldEntry => [field, row[field.id]]), fieldTypes));
    }

    return submission;
};

/**
 * Builds the submitted values of some fields, leaving out the fields that submit nothing (`undefined`), as today's form
 * does for read-only fields and hyperlinks.
 *
 * @param entries each field with its current value
 * @param fieldTypes the field type definitions
 * @returns the submitted values, keyed by field id
 */
const submittedRecord = (entries: FieldEntry[], fieldTypes: FieldTypeResolver): FieldValues => {
    const record: FieldValues = {};
    for (const [definition, value] of entries) {
        const submitted = submittedValue(definition, value, fieldTypes);
        if (submitted !== undefined) {
            record[definition.id] = withoutSymbolKeys(submitted);
        }
    }
    return record;
};

/**
 * Copies a submitted value without symbol keys. Signal Forms stamps object items in arrays with a symbol to track
 * their identity, and that bookkeeping must not reach the submission.
 *
 * @param value the submitted value
 * @returns the value without symbol keys
 */
const withoutSymbolKeys = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(withoutSymbolKeys);
    }
    if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, withoutSymbolKeys(entry)]));
    }
    return value;
};

/**
 * Converts one field value the way its type submits it, or returns `undefined` when the field submits nothing. A type
 * without its own writer submits its value as it is.
 *
 * @param definition the field definition
 * @param value the field value
 * @param fieldTypes the field type definitions
 * @returns the submitted value
 */
export const submittedValue = (definition: FieldDefinition, value: unknown, fieldTypes: FieldTypeResolver): unknown =>
    (resolveFieldType(fieldTypes, definition)?.definition.submittedValue ?? asIs)({ definition, value });

const asIs: SubmittedValueWriter = ({ value }) => value;

export const noSubmittedValue: SubmittedValueWriter = () => undefined;

export const numberSubmittedValue: SubmittedValueWriter = ({ definition, value }) =>
    definition.enableFractions ? parseFloat(`${value}`) : parseInt(`${value}`, 10);

export const decimalSubmittedValue: SubmittedValueWriter = ({ value }) => parseFloat(`${value}`);

export const booleanSubmittedValue: SubmittedValueWriter = ({ value }) => (value !== null && value !== undefined ? value : false);

export const peopleSubmittedValue: SubmittedValueWriter = ({ value }) => (value ? value : null);

export const dropdownSubmittedValue: SubmittedValueWriter = ({ definition, value }) => {
    if (!value) {
        return null;
    }
    if (Array.isArray(value)) {
        return value;
    }
    const id = isRecord(value) ? value['id'] : value;
    if (typeof id !== 'string' || id === EMPTY_OPTION_ID || id === '') {
        return null;
    }
    return definition.options.find((option) => option.id === id) ?? null;
};

export const radioSubmittedValue: SubmittedValueWriter = ({ definition, value }) => {
    const option = definition.options.find((candidate) => candidate.id === value);
    if (definition.optionType === 'rest') {
        return option ? { ...option, options: definition.options } : { id: null, name: null, options: definition.options };
    }
    return option ? { ...option } : null;
};

export const uploadSubmittedValue: SubmittedValueWriter = ({ value }) => {
    if (!hasLength(value)) {
        return null;
    }
    return Array.isArray(value) ? value.map((file) => (isRecord(file) ? file['id'] : undefined)).join(',') : [value];
};

export const dateSubmittedValue: SubmittedValueWriter = ({ definition, value }) => {
    const date = parseDateValue(value, definition.dateDisplayFormat);
    return isValid(date) ? `${format(date, 'yyyy-MM-dd')}T00:00:00.000Z` : null;
};

export const dateTimeSubmittedValue: SubmittedValueWriter = ({ value }) => {
    const date = value !== null ? DateFnsUtils.getDate(value as string | number | Date) : null;
    return isValid(date) ? date.toISOString() : null;
};

const parseDateValue = (value: unknown, dateFormat: string): Date => {
    try {
        const formatted = typeof value === 'string' ? DateFnsUtils.formatDate(value, dateFormat) : (value as Date);
        return DateFnsUtils.parseDate(formatted, dateFormat);
    } catch (invalidDate) {
        if (invalidDate instanceof RangeError) {
            return new Date(NaN);
        }
        throw invalidDate;
    }
};

const hasLength = (value: unknown): boolean => (Array.isArray(value) || typeof value === 'string') && value.length > 0;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
