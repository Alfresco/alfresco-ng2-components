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

import type { FieldOption } from './form-definition.interface';

export const FormFieldType = {
    Text: 'text',
    String: 'string',
    MultilineText: 'multi-line-text',
    Integer: 'integer',
    Amount: 'amount',
    Decimal: 'bigdecimal',
    Boolean: 'boolean',
    Dropdown: 'dropdown',
    RadioButtons: 'radio-buttons',
    Date: 'date',
    DateTime: 'datetime',
    Upload: 'upload',
    People: 'people',
    FunctionalGroup: 'functional-group',
    Hyperlink: 'hyperlink',
    DisplayValue: 'readonly',
    ReadonlyText: 'readonly-text',
    DisplayExternalProperty: 'display-external-property',
    FileViewer: 'file-viewer',
    PropertiesViewer: 'properties-viewer',
    BaseViewer: 'base-viewer',
    DisplayRichText: 'display-rich-text',
    DataTable: 'data-table',
    Json: 'json',
    Button: 'button',
    Container: 'container',
    Group: 'group',
    Section: 'section',
    RepeatableSection: 'repeatable-section'
} as const;

export type FormFieldType = (typeof FormFieldType)[keyof typeof FormFieldType];

export const LAYOUT_FIELD_TYPES: ReadonlySet<string> = new Set([
    FormFieldType.Container,
    FormFieldType.Group,
    FormFieldType.Section,
    FormFieldType.RepeatableSection
]);

/** The field types whose value never comes from saved form values. */
export const CONSTANT_VALUE_FIELD_TYPES: ReadonlySet<string> = new Set([FormFieldType.DisplayExternalProperty]);

/** The field types that only show a value, which they can take from a process field (`params.field`). */
export const READ_ONLY_FIELD_TYPES: ReadonlySet<string> = new Set([FormFieldType.Hyperlink, FormFieldType.DisplayValue, FormFieldType.ReadonlyText]);

export const SystemOutcomeName = {
    Save: 'SAVE',
    Complete: 'COMPLETE',
    StartProcess: 'START PROCESS'
} as const;

export const EMPTY_OPTION_ID = 'empty';

export const DEFAULT_EMPTY_OPTION: Readonly<FieldOption> = { id: EMPTY_OPTION_ID, name: 'Choose one...' };

/** The type of a process field shown through its label (`<id>_LABEL`) rather than its value. */
export const TYPEAHEAD_FIELD_TYPE = 'typeahead';
