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

import type { FormFieldModel } from '../components/widgets/core/form-field.model';
import type { AuthoredDefault } from './form-state.interface';

type AuthoredDefinition = Record<string, unknown>;

const authoredDefaults = new WeakMap<object, AuthoredDefault>();
const authoredDefinitions = new WeakMap<object, AuthoredDefinition>();

const cloneAuthoredArray = (value: unknown[], ancestors: WeakSet<object>): unknown[] => value.map((entry) => cloneAuthoredValue(entry, ancestors));

const cloneAuthoredRecord = (value: object, ancestors: WeakSet<object>): AuthoredDefinition =>
    Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneAuthoredValue(entry, ancestors)]));

const cloneAuthoredEntries = (value: object, ancestors: WeakSet<object>): unknown => {
    if (Array.isArray(value)) {
        return cloneAuthoredArray(value, ancestors);
    }
    return cloneAuthoredRecord(value, ancestors);
};

const cloneAuthoredObject = (value: object, ancestors: WeakSet<object>): unknown => {
    if (ancestors.has(value)) {
        return undefined;
    }
    ancestors.add(value);
    const cloned = cloneAuthoredEntries(value, ancestors);
    ancestors.delete(value);
    return cloned;
};

const cloneAuthoredValue = (value: unknown, ancestors = new WeakSet<object>()): unknown => {
    if (value instanceof Date) {
        return new Date(value.getTime());
    }
    if (value && typeof value === 'object') {
        return cloneAuthoredObject(value, ancestors);
    }
    return value;
};

const captureDefinitionEntries = (entries: unknown): unknown => {
    if (!Array.isArray(entries)) {
        return entries;
    }
    return entries.map((entry) => captureAuthoredDefinition(entry));
};

const captureNestedDefinitions = (fields: object): AuthoredDefinition =>
    Object.fromEntries(Object.entries(fields).map(([key, entries]) => [key, captureDefinitionEntries(entries)]));

const storeAuthoredDefinition = (definition: AuthoredDefinition): void => {
    const captured = cloneAuthoredValue(definition) as AuthoredDefinition;
    const fields = definition.fields;
    if (fields && typeof fields === 'object') {
        captured.fields = captureNestedDefinitions(fields);
    }
    authoredDefinitions.set(definition, captured);
    captureAuthoredDefault(definition);
};

/**
 * Captures immutable definition and repeatable template data before hydration.
 *
 * @param definition First-seen field definition
 * @returns Detached captured definition
 */
export function captureAuthoredDefinition(definition: Record<string, unknown>): Record<string, unknown> {
    if (!authoredDefinitions.has(definition)) {
        storeAuthoredDefinition(definition);
    }
    return cloneAuthoredValue(authoredDefinitions.get(definition)) as Record<string, unknown>;
}

/**
 * Captures the first-seen definition value and contextual intent before hydration.
 *
 * @param definition Original field definition object
 * @returns A detached authored snapshot
 */
export function captureAuthoredDefault(definition: Record<string, unknown>): AuthoredDefault {
    if (!authoredDefaults.has(definition)) {
        authoredDefaults.set(definition, {
            hasValue: Object.prototype.hasOwnProperty.call(definition, 'value'),
            value: cloneAuthoredValue(definition.value),
            selectLoggedUser: definition.selectLoggedUser === true
        });
    }
    const captured = authoredDefaults.get(definition);
    return { ...captured, value: cloneAuthoredValue(captured.value) };
}

/**
 * Reads immutable authored intent for a live field's original definition.
 *
 * @param field Live field
 * @returns A detached first-seen authored snapshot
 */
export function getAuthoredDefault(field: FormFieldModel): AuthoredDefault {
    return captureAuthoredDefault(field.json);
}
