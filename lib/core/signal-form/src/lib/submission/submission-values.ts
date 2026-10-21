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
import type {
    BooleanFieldValue,
    DateFieldValue,
    DropdownFieldValue,
    FieldDefinition,
    FieldValue,
    IdentityFieldValue,
    NumberFieldValue,
    RadioFieldValue,
    SectionDefinition,
    SubmittedValue,
    UploadFieldValue
} from '../definition/form-definition.interface';
import { EMPTY_OPTION_ID } from '../definition/form-field-types';
import { hasLength, isBlank } from '../form-value-guards';
import { resolveFieldType } from '../field-types/field-type-resolution';
import type { FieldTypeResolver, SubmittedValueWriter } from '../field-types/field-type-definition.interface';

/** The values of a form or of a repeatable section row, by field id. */
export type FieldValues = Record<string, FieldValue>;

/** The values a form submits, by field id; a repeatable section submits its rows. */
export type SubmittedValues = Record<string, SubmittedValue>;

type FieldEntry = [definition: FieldDefinition, value: FieldValue];

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
): SubmittedValues => {
    const submission = submittedRecord(
        Object.entries(model.fields).map(([id, value]): FieldEntry => [fields.get(id), value]),
        fieldTypes
    );

    for (const [sectionId, rows] of Object.entries(model.sections).filter(([, sectionRows]) => sectionRows.length > 0)) {
        const sectionFields = sections.get(sectionId).fields;
        submission[sectionId] = rows.map((row) =>
            submittedRecord(
                sectionFields.map((field): FieldEntry => [field, row[field.id]]),
                fieldTypes
            )
        );
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
const submittedRecord = (entries: FieldEntry[], fieldTypes: FieldTypeResolver): SubmittedValues => {
    const record: SubmittedValues = {};
    for (const [definition, value] of entries) {
        const submitted = submittedValue(definition, value, fieldTypes);
        if (submitted !== undefined) {
            record[definition.id] = copyWithoutTrackingIds(submitted);
        }
    }
    return record;
};

/**
 * Copies a submitted value without the tracking ids Signal Forms writes on the objects of a list to follow them when
 * they move, so only the field's own data is submitted. A structured clone copies only text keys, and the ids are
 * symbol keys.
 *
 * @param value the submitted value
 * @returns a copy of the value without tracking ids
 */
const copyWithoutTrackingIds = (value: SubmittedValue): SubmittedValue => structuredClone(value);

/**
 * Converts one field value the way its type submits it, or returns `undefined` when the field submits nothing. A type
 * without its own writer submits its value as it is.
 *
 * @param definition the field definition
 * @param value the field value
 * @param fieldTypes the field type definitions
 * @returns the submitted value
 */
export const submittedValue = (definition: FieldDefinition, value: FieldValue, fieldTypes: FieldTypeResolver): SubmittedValue =>
    (resolveFieldType(fieldTypes, definition)?.definition.submittedValue ?? asIs)({ definition, value });

const asIs: SubmittedValueWriter = ({ value }) => value;

export const noSubmittedValue: SubmittedValueWriter = () => undefined;

/**
 * Submits an integer or amount as a number, as today's form does, and no value for an empty field rather than `NaN`.
 *
 * @param input the field and its value
 * @param input.definition the field
 * @param input.value the value
 * @returns the number, `null` for an empty field
 */
export const numberSubmittedValue: SubmittedValueWriter<NumberFieldValue> = ({ definition, value }) => {
    if (isBlank(value)) {
        return null;
    }
    return definition.enableFractions ? parseFloat(`${value}`) : parseInt(`${value}`, 10);
};

/**
 * Submits a decimal as a number, as today's form does, and no value for an empty field rather than `NaN`.
 *
 * @param input the field and its value
 * @param input.value the value
 * @returns the number, `null` for an empty field
 */
export const decimalSubmittedValue: SubmittedValueWriter<NumberFieldValue> = ({ value }) => (isBlank(value) ? null : parseFloat(`${value}`));

export const booleanSubmittedValue: SubmittedValueWriter<BooleanFieldValue> = ({ value }) => value ?? false;

export const peopleSubmittedValue: SubmittedValueWriter<IdentityFieldValue> = ({ value }) => value || null;

export const dropdownSubmittedValue: SubmittedValueWriter<DropdownFieldValue> = ({ definition, value }) => {
    if (!value) {
        return null;
    }
    if (Array.isArray(value)) {
        return value;
    }
    const id = typeof value === 'string' ? value : value.id;
    if (id === EMPTY_OPTION_ID || id === '') {
        return null;
    }
    return definition.options.find((option) => option.id === id) ?? null;
};

export const radioSubmittedValue: SubmittedValueWriter<RadioFieldValue> = ({ definition, value }) => {
    const option = definition.options.find((candidate) => candidate.id === value);
    if (definition.optionType === 'rest') {
        return option ? { ...option, options: definition.options } : { id: null, name: null, options: definition.options };
    }
    return option ? { ...option } : null;
};

export const uploadSubmittedValue: SubmittedValueWriter<UploadFieldValue> = ({ value }) => {
    if (!hasLength(value)) {
        return null;
    }
    return Array.isArray(value) ? value.map((file) => file.id).join(',') : [value];
};

export const dateSubmittedValue: SubmittedValueWriter<DateFieldValue> = ({ definition, value }) => {
    const date = parseDateValue(value, definition.dateDisplayFormat);
    return isValid(date) ? `${format(date, 'yyyy-MM-dd')}T00:00:00.000Z` : null;
};

export const dateTimeSubmittedValue: SubmittedValueWriter<DateFieldValue> = ({ value }) => {
    const date = value !== null ? DateFnsUtils.getDate(value) : null;
    return isValid(date) ? date.toISOString() : null;
};

const parseDateValue = (value: DateFieldValue, dateFormat: string): Date => {
    if (value === null) {
        return new Date(NaN);
    }
    try {
        const formatted = typeof value === 'string' ? DateFnsUtils.formatDate(value, dateFormat) : value;
        return DateFnsUtils.parseDate(formatted, dateFormat);
    } catch (invalidDate) {
        if (invalidDate instanceof RangeError) {
            return new Date(NaN);
        }
        throw invalidDate;
    }
};
