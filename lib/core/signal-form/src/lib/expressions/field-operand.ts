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

import type { FieldDefinition, FieldValue, SubmittedValue } from '../definition/form-definition.interface';
import { isRecord } from '../form-value-guards';

export const LABEL_SUFFIX = '_LABEL';

/** The value of a field used as an operand of a visibility condition: its value, or the ids or names of the options it holds. */
export type FieldOperandValue = SubmittedValue | Array<ItemId | undefined>;

/** The id an option, a person, a group or a file carries. */
type ItemId = string | number;

export const isLabelReference = (reference: string): boolean => reference.indexOf(LABEL_SUFFIX) > 0;

export const referencedFieldId = (reference: string): string => (isLabelReference(reference) ? reference.replace(LABEL_SUFFIX, '') : reference);

/**
 * Returns the value a visibility condition compares for a field it names as an operand: the option ids it holds, or
 * their names for a `_LABEL` reference, else its submitted value, falling back to its raw value.
 *
 * @param definition the field the condition names
 * @param reference the field as the condition names it, possibly with the `_LABEL` suffix
 * @param submitted the field's submitted value
 * @param value the field's raw value
 * @returns the operand value
 */
export const fieldOperandValue = (
    definition: FieldDefinition,
    reference: string,
    submitted: SubmittedValue,
    value: FieldValue
): FieldOperandValue => {
    const label = isLabelReference(reference);
    const found = label ? optionNamesOf(submitted) : optionIdsOf(submitted);
    return found ?? rawOperandValue(definition, label, value);
};

const optionNamesOf = (submitted: SubmittedValue): FieldOperandValue => {
    if (!submitted) {
        return undefined;
    }
    return Array.isArray(submitted) ? submitted.map(nameOf) : nameOf(submitted);
};

const optionIdsOf = (submitted: SubmittedValue): FieldOperandValue => {
    const id = idOf(submitted);
    if (id) {
        return id;
    }
    return Array.isArray(submitted) ? submitted.map(idOf) : submitted;
};

/**
 * Finds the operand value in the raw field value: an option's name or id, else the value itself.
 *
 * @param definition the field
 * @param label whether the condition compares names (`_LABEL`) rather than ids
 * @param value the raw field value
 * @returns the value, an empty text when there is none
 */
const rawOperandValue = (definition: FieldDefinition, label: boolean, value: FieldValue): FieldOperandValue => {
    const option = definition.options.find((candidate) => candidate.id === value);
    const optionValue = option && (label ? option.name : option.id);
    return nameOf(value) || optionValue || idOf(value) || (value ?? '');
};

/**
 * Returns the name of an item a field value holds, such as an option or a group; `undefined` for an item without one.
 *
 * @param item the item, which can be any value a list holds
 * @returns the name
 */
const nameOf = (item: unknown): string | undefined => (isRecord(item) && typeof item['name'] === 'string' ? item['name'] : undefined);

/**
 * Returns the id of an item a field value holds, such as an option or a file; `undefined` for an item without one.
 *
 * @param item the item, which can be any value a list holds
 * @returns the id
 */
const idOf = (item: unknown): ItemId | undefined => {
    const id = isRecord(item) ? item['id'] : undefined;
    return typeof id === 'string' || typeof id === 'number' ? id : undefined;
};
