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

export const FormFieldType = {
    Text: 'text',
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

export const SystemOutcomeName = {
    Save: 'SAVE',
    Complete: 'COMPLETE',
    StartProcess: 'START PROCESS'
} as const;

export const EMPTY_OPTION_ID = 'empty';

export interface VisibilityCondition {
    leftType?: string | null;
    leftValue?: unknown;
    leftFormFieldId?: string;
    leftRestResponseId?: string;
    operator?: string;
    rightType?: string | null;
    rightValue?: unknown;
    rightFormFieldId?: string;
    rightRestResponseId?: string;
    nextConditionOperator?: string;
    nextCondition?: VisibilityCondition | null;
}

export interface FieldOption {
    id: string;
    name: string;
}

export const DEFAULT_EMPTY_OPTION: Readonly<FieldOption> = { id: EMPTY_OPTION_ID, name: 'Choose one...' };

export interface LayoutDefinition {
    id: string;
    type: string;
    visibilityCondition?: VisibilityCondition | null;
}

export interface TabDefinition {
    id: string;
    visibilityCondition?: VisibilityCondition | null;
}

export interface FieldDefinition {
    id: string;
    type: string;
    isCustomType: boolean;
    valueType?: string;
    ancestors: LayoutDefinition[];
    tabId?: string;
    required: boolean;
    readOnly: boolean;
    minLength: number;
    maxLength: number;
    minValue?: unknown;
    maxValue?: unknown;
    regexPattern?: string | null;
    visibilityCondition?: VisibilityCondition | null;
    options: FieldOption[];
    optionType?: string;
    hasEmptyValue: boolean;
    emptyOption?: FieldOption;
    multiple: boolean;
    dateDisplayFormat: string;
    enableFractions: boolean;
    precision?: number;
    dynamicDateRangeSelection: boolean;
    minDateRangeValue?: number | null;
    maxDateRangeValue?: number | null;
    initialValue: unknown;
}

export interface SectionDefinition {
    id: string;
    initialRows: number;
    maxRows: number | null;
    fields: FieldDefinition[];
}

export interface OutcomeDefinition {
    id: string;
    name: string;
    skipValidation: boolean;
    isSelected: boolean;
    visibilityCondition?: VisibilityCondition | null;
}

export interface FormVariable {
    id?: string;
    name?: string;
    type?: string;
    value?: unknown;
}

export interface FormVariables {
    formVariables: FormVariable[];
    processVariables: FormVariable[];
}

/**
 * A form definition JSON read once into an immutable model.
 */
export interface FormDefinition {
    fields: FieldDefinition[];
    sections: SectionDefinition[];
    tabs: TabDefinition[];
    outcomes: OutcomeDefinition[];
    variables: FormVariables;
}
