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

import {
    booleanInitialValue,
    dateInitialValue,
    dateTimeInitialValue,
    decimalInitialValue,
    dropdownInitialValue,
    dropdownOptions,
    radioInitialValue,
    radioOptions
} from '../definition/field-value-readers';
import { FormFieldType } from '../definition/form-field-types';
import {
    booleanSubmittedValue,
    dateSubmittedValue,
    dateTimeSubmittedValue,
    decimalSubmittedValue,
    dropdownSubmittedValue,
    noSubmittedValue,
    numberSubmittedValue,
    peopleSubmittedValue,
    radioSubmittedValue,
    uploadSubmittedValue
} from '../submission/submission-values';
import {
    dateValidator,
    decimalValidator,
    dropdownValidator,
    maxLengthValidator,
    maxValueValidator,
    minLengthValidator,
    minValueValidator,
    numberValidator,
    patternValidator,
    requiredValidator
} from '../validation/field-validators';
import { groupDisplayValue, optionDisplayValue, peopleDisplayValue } from '../display/field-display-value';
import { fieldTypeAlias } from './field-type-resolution';
import type { FieldTypeDefinition, FieldTypeResolver } from './field-type-definition.interface';

const TEXT_VALIDATORS = [requiredValidator, minLengthValidator, maxLengthValidator, patternValidator];

const TEXT_FIELD_TYPE: FieldTypeDefinition = { type: FormFieldType.Text, validators: TEXT_VALIDATORS };

/**
 * The field types of today's form, with the same value handling and validation. Each type gets its component when its
 * widget is added.
 */
export const BUILT_IN_FIELD_TYPES: readonly FieldTypeDefinition[] = [
    TEXT_FIELD_TYPE,
    fieldTypeAlias(TEXT_FIELD_TYPE, FormFieldType.String),
    { type: FormFieldType.MultilineText, validators: TEXT_VALIDATORS },
    {
        type: FormFieldType.Integer,
        submittedValue: numberSubmittedValue,
        validators: [requiredValidator, numberValidator, maxLengthValidator, minValueValidator, maxValueValidator]
    },
    {
        type: FormFieldType.Amount,
        submittedValue: numberSubmittedValue,
        validators: [requiredValidator, numberValidator, minValueValidator, maxValueValidator]
    },
    {
        type: FormFieldType.Decimal,
        initialValue: decimalInitialValue,
        submittedValue: decimalSubmittedValue,
        validators: [requiredValidator, minValueValidator, maxValueValidator, decimalValidator]
    },
    {
        type: FormFieldType.Boolean,
        initialValue: booleanInitialValue,
        submittedValue: booleanSubmittedValue,
        validators: [requiredValidator]
    },
    {
        type: FormFieldType.Dropdown,
        options: dropdownOptions,
        initialValue: dropdownInitialValue,
        submittedValue: dropdownSubmittedValue,
        validators: [dropdownValidator],
        displayValue: optionDisplayValue
    },
    {
        type: FormFieldType.RadioButtons,
        options: radioOptions,
        initialValue: radioInitialValue,
        submittedValue: radioSubmittedValue,
        validators: [requiredValidator],
        displayValue: optionDisplayValue
    },
    {
        type: FormFieldType.Date,
        initialValue: dateInitialValue,
        submittedValue: dateSubmittedValue,
        validators: [dateValidator]
    },
    {
        type: FormFieldType.DateTime,
        initialValue: dateTimeInitialValue,
        submittedValue: dateTimeSubmittedValue,
        validators: [dateValidator]
    },
    { type: FormFieldType.Upload, submittedValue: uploadSubmittedValue, validators: [requiredValidator] },
    { type: FormFieldType.People, submittedValue: peopleSubmittedValue, validators: [requiredValidator], displayValue: peopleDisplayValue },
    {
        type: FormFieldType.FunctionalGroup,
        submittedValue: peopleSubmittedValue,
        validators: [requiredValidator],
        displayValue: groupDisplayValue
    },
    { type: FormFieldType.DisplayExternalProperty, validators: [requiredValidator] },
    { type: FormFieldType.FileViewer, validators: [requiredValidator] },
    { type: FormFieldType.PropertiesViewer, validators: [requiredValidator] },
    { type: FormFieldType.Hyperlink, submittedValue: noSubmittedValue },
    { type: FormFieldType.DisplayValue, submittedValue: noSubmittedValue },
    { type: FormFieldType.ReadonlyText, submittedValue: noSubmittedValue },
    { type: FormFieldType.DisplayRichText },
    { type: FormFieldType.DataTable },
    { type: FormFieldType.Json },
    { type: FormFieldType.Button },
    { type: FormFieldType.BaseViewer }
];

/**
 * Resolves field types from a list of definitions; a later definition for the same type replaces an earlier one.
 *
 * @param definitions the definitions, in registration order
 * @returns a resolver over them
 */
export const fieldTypeResolver = (definitions: readonly FieldTypeDefinition[]): FieldTypeResolver => {
    const byType = new Map(definitions.map((definition) => [definition.type, definition]));
    return { definitionFor: (type) => byType.get(type) };
};

export const BUILT_IN_FIELD_TYPE_RESOLVER: FieldTypeResolver = fieldTypeResolver(BUILT_IN_FIELD_TYPES);
