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

import type { FieldDefinition } from '../definition/form-definition.interface';

export const LABEL_SUFFIX = '_LABEL';

export const isLabelReference = (reference: string): boolean => reference.indexOf(LABEL_SUFFIX) > 0;

export const referencedFieldId = (reference: string): string => (isLabelReference(reference) ? reference.replace(LABEL_SUFFIX, '') : reference);

/**
 * Returns the value a visibility condition reads for a field that is valid: the submitted value, or the option id
 * (or name, for a `_LABEL` reference), falling back to the raw field value.
 *
 * @param definition the referenced field
 * @param reference the reference as written in the condition, possibly with the `_LABEL` suffix
 * @param submitted the field's submitted value
 * @param value the field's raw value
 * @returns the value the condition compares
 */
export const conditionValueOf = (definition: FieldDefinition, reference: string, submitted: unknown, value: unknown): unknown => {
    const label = isLabelReference(reference);
    const found = label ? namesOf(submitted) : idsOf(submitted);
    return found === undefined || found === null ? searchValue(definition, label, value) : found;
};

const namesOf = (submitted: unknown): unknown => {
    if (!submitted) {
        return undefined;
    }
    return Array.isArray(submitted) ? submitted.map(nameOf) : nameOf(submitted);
};

const idsOf = (submitted: unknown): unknown => {
    if (idOf(submitted)) {
        return idOf(submitted);
    }
    return Array.isArray(submitted) ? submitted.map(idOf) : submitted;
};

/**
 * Finds the value a condition compares in the raw field value: an option's name or id, else the value itself.
 *
 * @param definition the field
 * @param label whether the condition compares names (`_LABEL`) rather than ids
 * @param value the raw field value
 * @returns the value, an empty text when there is none
 */
const searchValue = (definition: FieldDefinition, label: boolean, value: unknown): unknown => {
    const option = definition.options.find((candidate) => candidate.id === value);
    const optionValue = option && (label ? option.name : option.id);
    return nameOf(value) || optionValue || idOf(value) || (value ?? '');
};

const nameOf = (value: unknown): unknown => (isRecord(value) ? value['name'] : undefined);

const idOf = (value: unknown): unknown => (isRecord(value) ? value['id'] : undefined);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
