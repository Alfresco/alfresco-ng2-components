/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Moment } from 'moment';

export interface FormContent {
    formRepresentation: FormRepresentation;
}

export interface FormRepresentation {
    id: string;
    name: string;
    description: string;
    version?: number;
    formDefinition?: FormDefinition;
    standAlone?: boolean;
}

export interface FormTab {
    id: string;
    title: string;
    visibilityCondition: VisibilityCondition | null;
}

export interface FormOutcome {
    id: string;
    name: string;
}

export interface FormDefinition {
    tabs: FormTab[];
    fields: Container[] | HeaderRepresentation[];
    outcomes: FormOutcome[];
    metadata: any;
    variables: any[];
}

export interface Container {
    id: string;
    type: string;
    tab: string;
    name: string;
    numberOfColumns: number;
    fields: {
        [key: string]: FormFieldRepresentation[];
    };
}

export type FormFieldRepresentation = (DateField | DateTimeField | TextField | AttachFileField | DropDownField |
    RadioField | TypeaheadField | PeopleField | AmountField | NumberField | CheckboxField | HyperlinkField );

export interface AttachFileField extends FormField {
    required: boolean;
}

export interface TypeaheadField extends RestField {
    required: boolean;
}

export interface RestField extends FormField {
    required: boolean;
    restUrl: string;
    restResponsePath: string;
    restIdProperty: string;
    restLabelProperty: string;
}

export interface HeaderRepresentation extends Container {
    numberOfColumns: number;
    params: {
        [key: string]: any;
    };
    visibilityCondition: VisibilityCondition;
}

export interface ColumnDefinitionRepresentation extends Container {
    id: string;
    name: string;
    type: string;
    value: any;
    required: boolean;
    editable: boolean;
    sortable: boolean;
    visible: boolean;
}

export interface DynamicTableRepresentation extends FormField {
    required: boolean;
    tab: string;
    placeholder: string;
    columnDefinitions: ColumnDefinitionRepresentation[];
}

export interface VisibilityCondition {
    leftType: string;
    leftValue: string;
    operator: string;
    rightValue: string | number | Date | Moment;
    rightType: string;
    nextConditionOperator?: string;
    nextCondition?: VisibilityCondition;
}

export interface FormField {
    id: string;
    name: string;
    value: any;
    type: FormFieldType | string;
    readOnly?: boolean;
    colspan: number;
    params: {
        [anyKey: string]: any;
    };
    visibilityCondition: null | VisibilityCondition;
}

export interface FormOption {
    id: string;
    name: string;
}

export interface OptionsField {
    value: any;
    restUrl: string | null;
    restResponsePath: string | null;
    restIdProperty: string | null;
    restLabelProperty: string | null;
    optionType: 'manual' | 'rest';
    options: FormOption[];
}

export interface AmountField extends FormField {
    required: boolean;
    placeholder: string | null;
    minValue: number | null;
    maxValue: number | null;
    enableFractions: boolean;
    currency: string;
}

export interface CheckboxField extends FormField {
    required: boolean;
}

export interface DateField extends FormField {
    required: boolean;
    placeholder: string | null;
    minValue: string | null;
    maxValue: string | null;
    dateDisplayFormat: string;
}

export interface DateTimeField extends FormField {
    required: boolean;
    placeholder: string | null;
    minValue: string | null;
    maxValue: string | null;
    dateDisplayFormat: string;
}

export interface DropDownField extends OptionsField, FormField {
    required: boolean;
}

export interface HyperlinkField extends FormField {
    hyperlinkUrl: string | null;
    displayText: string | null;
}

export interface NumberField extends FormField {
    placeholder: string | null;
    minValue: number | null;
    maxValue: number | null;
    required: boolean;
}

export interface RadioField extends OptionsField, FormField {
    required: boolean;
}

export interface TextField extends FormField {
    regexPattern: string | null;
    required: boolean;
    minLength: number;
    maxLength: number;
    placeholder: string | null;
}

// eslint-disable-next-line no-shadow
export enum PeopleModeOptions {
    single = 'single',
    multiple = 'multiple'
}

export interface PeopleField extends FormField {
    required: boolean;
    optionType: PeopleModeOptions;
}

// eslint-disable-next-line no-shadow
export enum FormFieldType {
    text = 'text',
    multiline = 'multi-line-text',
    // eslint-disable-next-line id-blacklist
    number = 'integer',
    checkbox = 'boolean',
    date = 'date',
    datetime = 'datetime',
    dropdown = 'dropdown',
    typeahead = 'typeahead',
    amount = 'amount',
    radio = 'radio-buttons',
    people = 'people',
    groupOfPeople = 'functional-group',
    dynamicTable = 'dynamicTable',
    hyperlink = 'hyperlink',
    header = 'group',
    uploadFile = 'upload',
    uploadFolder = 'uploadFolder',
    displayValue = 'readonly',
    displayText = 'readonly-text',
    fileViewer = 'file-viewer'
}
