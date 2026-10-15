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

import { FieldDefinition } from '../definition/form-definition.model';

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
export const conditionValueOf = (definition: FieldDefinition, reference: string, submitted: any, value: any): unknown => {
    const label = isLabelReference(reference);
    const found = label ? labelOf(submitted) : idOf(submitted);
    return found === undefined || found === null ? searchValue(definition, label, value) : found;
};

const labelOf = (submitted: any): unknown => {
    if (!submitted) {
        return undefined;
    }
    return Array.isArray(submitted) ? submitted.map(({ name }) => name) : submitted.name;
};

const idOf = (submitted: any): unknown => {
    if (submitted?.id) {
        return submitted.id;
    }
    return submitted && Array.isArray(submitted) ? submitted.map(({ id }) => id) : submitted;
};

const searchValue = (definition: FieldDefinition, label: boolean, value: any): unknown => {
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
