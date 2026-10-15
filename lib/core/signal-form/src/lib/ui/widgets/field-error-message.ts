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

import { FieldDefinition } from '../../definition/form-definition.model';

export interface FieldErrorMessage {
    key: string;
    params?: Record<string, unknown>;
}

const MESSAGES: Readonly<Record<string, (field: FieldDefinition) => FieldErrorMessage>> = {
    required: () => ({ key: 'FORM.FIELD.REQUIRED' }),
    dropdown: () => ({ key: 'FORM.FIELD.REQUIRED' }),
    number: () => ({ key: 'FORM.FIELD.VALIDATOR.INVALID_NUMBER' }),
    minLength: ({ minLength }) => ({ key: 'FORM.FIELD.VALIDATOR.AT_LEAST_LONG', params: { minLength } }),
    maxLength: ({ maxLength }) => ({ key: 'FORM.FIELD.VALIDATOR.NO_LONGER_THAN', params: { maxLength } }),
    minValue: ({ minValue }) => ({ key: 'FORM.FIELD.VALIDATOR.NOT_LESS_THAN', params: { minValue } }),
    maxValue: ({ maxValue }) => ({ key: 'FORM.FIELD.VALIDATOR.NOT_GREATER_THAN', params: { maxValue } }),
    pattern: () => ({ key: 'FORM.FIELD.VALIDATOR.INVALID_VALUE' }),
    decimal: () => ({ key: 'FORM.FIELD.VALIDATOR.INVALID_DECIMAL_NUMBER' }),
    precision: ({ precision }) => ({ key: 'FORM.FIELD.VALIDATOR.INVALID_DECIMAL_PRECISION', params: { precision } }),
    date: () => ({ key: 'FORM.FIELD.VALIDATOR.INVALID_DATE' })
};

/**
 * Returns the translation key and parameters for a validation error, using ADF's existing messages. An error kind
 * defined by a custom widget is used as the translation key.
 *
 * @param kind the error kind
 * @param field the field definition
 * @returns the message to show
 */
export const fieldErrorMessage = (kind: string, field: FieldDefinition): FieldErrorMessage => MESSAGES[kind]?.(field) ?? { key: kind };
