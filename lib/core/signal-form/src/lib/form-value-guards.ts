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

/**
 * Whether a field value is an object with properties, such as an option, a person or a file: not `null`, not a list.
 * Field values come from the form JSON, saved data and users, so they are checked before their properties are read.
 *
 * @param value the value
 * @returns `true` for an object with properties
 */
export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Whether a field value is a non-empty list or text, as for an upload's files or a required value.
 *
 * @param value the value
 * @returns `true` for a list or text with at least one item
 */
export const hasLength = (value: unknown): boolean => (Array.isArray(value) || typeof value === 'string') && value.length > 0;

/**
 * Whether a field holds no value: none at all, or an empty text.
 *
 * @param value the value
 * @returns `true` for `null`, `undefined` or `''`
 */
export const isBlank = (value: unknown): boolean => value === null || value === undefined || value === '';

/**
 * Whether a value is a number or a text that reads as one, as today's form checks it.
 *
 * @param value the value
 * @returns `true` for a number or a numeric text, `false` for no value or an empty text
 */
export const isNumeric = (value: unknown): boolean => !isBlank(value) && !Number.isNaN(Number(value));
