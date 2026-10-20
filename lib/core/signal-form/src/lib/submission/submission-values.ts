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
import { EMPTY_OPTION_ID, FieldDefinition, SectionDefinition } from '../definition/form-definition.model';
import { fieldWidget } from '../widgets/field-widget';
import type { FormWidgetResolver, SubmittedValueWriter } from '../widgets/form-widget-definition';

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
 * @param widgets the field type definitions
 * @returns the submitted values
 */
export const toSubmissionValues = (
    fields: Map<string, FieldDefinition>,
    sections: Map<string, SectionDefinition>,
    model: FormValuesModel,
    widgets: FormWidgetResolver
): FieldValues => {
    const submission = submittedRecord(Object.entries(model.fields).map(([id, value]): FieldEntry => [fields.get(id), value]), widgets);

    for (const [sectionId, rows] of Object.entries(model.sections).filter(([, sectionRows]) => sectionRows.length > 0)) {
        const sectionFields = sections.get(sectionId).fields;
        submission[sectionId] = rows.map((row) => submittedRecord(sectionFields.map((field): FieldEntry => [field, row[field.id]]), widgets));
    }

    return submission;
};

/**
 * Builds the submitted values of some fields, leaving out the fields that submit nothing (`undefined`), as today's form
 * does for read-only fields and hyperlinks.
 *
 * @param entries each field with its current value
 * @param widgets the field type definitions
 * @returns the submitted values, keyed by field id
 */
const submittedRecord = (entries: FieldEntry[], widgets: FormWidgetResolver): FieldValues => {
    const record: FieldValues = {};
    for (const [definition, value] of entries) {
        const submitted = submittedValue(definition, value, widgets);
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
 * @param widgets the field type definitions
 * @returns the submitted value
 */
export const submittedValue = (definition: FieldDefinition, value: unknown, widgets: FormWidgetResolver): unknown =>
    (fieldWidget(widgets, definition)?.definition.submittedValue ?? asIs)({ definition, value });

const asIs: SubmittedValueWriter = ({ value }) => value;

export const noSubmittedValue: SubmittedValueWriter = () => undefined;

export const numberSubmittedValue: SubmittedValueWriter = ({ definition, value }) =>
    definition.enableFractions ? parseFloat(value) : parseInt(value, 10);

export const decimalSubmittedValue: SubmittedValueWriter = ({ value }) => parseFloat(value);

export const booleanSubmittedValue: SubmittedValueWriter = ({ value }) => (value !== null && value !== undefined ? value : false);

export const peopleSubmittedValue: SubmittedValueWriter = ({ value }) => (value ? value : null);

export const dropdownSubmittedValue: SubmittedValueWriter = ({ definition, value }) => {
    if (!value) {
        return null;
    }
    if (Array.isArray(value)) {
        return value;
    }
    const id = typeof value === 'object' ? value.id : value;
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
    if (!(value?.length > 0)) {
        return null;
    }
    return Array.isArray(value) ? value.map((file) => file.id).join(',') : [value];
};

export const dateSubmittedValue: SubmittedValueWriter = ({ definition, value }) => {
    const date = parseDateValue(value, definition.dateDisplayFormat);
    return isValid(date) ? `${format(date, 'yyyy-MM-dd')}T00:00:00.000Z` : null;
};

export const dateTimeSubmittedValue: SubmittedValueWriter = ({ value }) => {
    const date = value !== null ? DateFnsUtils.getDate(value) : null;
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
