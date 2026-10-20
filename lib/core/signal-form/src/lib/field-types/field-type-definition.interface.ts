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

import type { Type } from '@angular/core';
import type { FieldJson } from '../definition/form-definition-json.interface';
import type { FieldDefinition, FieldOption } from '../definition/form-definition.interface';

/**
 * Returns an error kind when the value is invalid for the field, or `null` when it is valid.
 */
export type FieldValidator = (field: FieldDefinition, value: unknown) => string | null;

/**
 * Completes the options a field offers, before its value is read: for example a dropdown's empty option, or the
 * option its saved value holds.
 */
export type FieldOptionsReader = (field: FieldJson, options: FieldOption[], hasEmptyValue: boolean) => FieldOption[];

/**
 * Reads a field's initial value from its JSON, with the field's options already complete. It only reads: neither the
 * JSON nor the definition is modified.
 */
export type InitialValueReader = (field: FieldJson, definition: FieldDefinition) => unknown;

export interface FieldValueInput {
    definition: FieldDefinition;
    value: unknown;
}

/**
 * Converts a field value into the value submitted to the backend; `undefined` means the field submits nothing.
 */
export type SubmittedValueWriter = (input: FieldValueInput) => unknown;

/**
 * Turns a field value, never `null`, into the text shown for it, for example by an expression in a read-only text.
 */
export type DisplayValueFormatter = (input: FieldValueInput) => string;

/**
 * Everything the form needs to know about one field type: how it reads, validates, submits and shows its value, and
 * the component that shows it. Registering a definition is the only step needed to add a field type, whether it comes
 * from ADF, from an application or from a plugin.
 */
export interface FieldTypeDefinition {
    type: string;
    component?: () => Promise<Type<unknown>>;
    options?: FieldOptionsReader;
    initialValue?: InitialValueReader;
    submittedValue?: SubmittedValueWriter;
    validators?: FieldValidator[];
    displayValue?: DisplayValueFormatter;
}

/** Finds the definition of a field type. */
export interface FieldTypeResolver {
    definitionFor(type: string): FieldTypeDefinition | undefined;
}
