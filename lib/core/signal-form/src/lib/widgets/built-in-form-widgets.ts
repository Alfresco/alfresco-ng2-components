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
    radioInitialValue
} from '../definition/field-initial-values';
import { FormFieldType } from '../definition/form-definition.model';
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
} from '../validation/field-validation';
import { groupDisplayValue, optionDisplayValue, peopleDisplayValue } from '../display/field-display-value';
import { borrowedDefinition } from './field-widget';
import { FormWidgetDefinition, FormWidgetResolver } from './form-widget-definition';

const TEXT_VALIDATORS = [requiredValidator, minLengthValidator, maxLengthValidator, patternValidator];

const textWidget = () => import('../ui/widgets/text/text-widget.component').then((widgets) => widgets.SignalTextWidgetComponent);
const integerWidget = () => import('../ui/widgets/text/text-widget.component').then((widgets) => widgets.SignalIntegerWidgetComponent);
const decimalWidget = () => import('../ui/widgets/text/text-widget.component').then((widgets) => widgets.SignalDecimalWidgetComponent);
const amountWidget = () => import('../ui/widgets/amount/amount-widget.component').then((widgets) => widgets.SignalAmountWidgetComponent);
const checkboxWidget = () => import('../ui/widgets/checkbox/checkbox-widget.component').then((widgets) => widgets.SignalCheckboxWidgetComponent);
const radioWidget = () => import('../ui/widgets/radio/radio-widget.component').then((widgets) => widgets.SignalRadioWidgetComponent);
const dropdownWidget = () => import('../ui/widgets/dropdown/dropdown-widget.component').then((widgets) => widgets.SignalDropdownWidgetComponent);
const dateWidget = () => import('../ui/widgets/date/date-widget.component').then((widgets) => widgets.SignalDateWidgetComponent);
const dateTimeWidget = () => import('../ui/widgets/date-time/date-time-widget.component').then((widgets) => widgets.SignalDateTimeWidgetComponent);
const hyperlinkWidget = () => import('../ui/widgets/hyperlink/hyperlink-widget.component').then((widgets) => widgets.SignalHyperlinkWidgetComponent);
const displayTextWidget = () =>
    import('../ui/widgets/display-text/display-text-widget.component').then((widgets) => widgets.SignalDisplayTextWidgetComponent);
const jsonWidget = () => import('../ui/widgets/json/json-widget.component').then((widgets) => widgets.SignalJsonWidgetComponent);
const multilineTextWidget = () =>
    import('../ui/widgets/multiline-text/multiline-text-widget.component').then((widgets) => widgets.SignalMultilineTextWidgetComponent);

/**
 * The field types the current engine supports, with today's value handling and validation. Components are added per
 * widget as the widgets are written.
 */
const TEXT_DEFINITION: FormWidgetDefinition = { type: FormFieldType.Text, component: textWidget, validators: TEXT_VALIDATORS };

export const BUILT_IN_FORM_WIDGETS: readonly FormWidgetDefinition[] = [
    TEXT_DEFINITION,
    borrowedDefinition(TEXT_DEFINITION, FormFieldType.String),
    { type: FormFieldType.MultilineText, component: multilineTextWidget, validators: TEXT_VALIDATORS },
    {
        type: FormFieldType.Integer,
        component: integerWidget,
        submittedValue: numberSubmittedValue,
        validators: [requiredValidator, numberValidator, maxLengthValidator, minValueValidator, maxValueValidator]
    },
    {
        type: FormFieldType.Amount,
        component: amountWidget,
        submittedValue: numberSubmittedValue,
        validators: [requiredValidator, numberValidator, minValueValidator, maxValueValidator]
    },
    {
        type: FormFieldType.Decimal,
        component: decimalWidget,
        initialValue: decimalInitialValue,
        submittedValue: decimalSubmittedValue,
        validators: [requiredValidator, minValueValidator, maxValueValidator, decimalValidator]
    },
    {
        type: FormFieldType.Boolean,
        component: checkboxWidget,
        initialValue: booleanInitialValue,
        submittedValue: booleanSubmittedValue,
        validators: [requiredValidator]
    },
    {
        type: FormFieldType.Dropdown,
        component: dropdownWidget,
        initialValue: dropdownInitialValue,
        submittedValue: dropdownSubmittedValue,
        validators: [dropdownValidator],
        displayValue: optionDisplayValue
    },
    {
        type: FormFieldType.RadioButtons,
        component: radioWidget,
        initialValue: radioInitialValue,
        submittedValue: radioSubmittedValue,
        validators: [requiredValidator],
        displayValue: optionDisplayValue
    },
    {
        type: FormFieldType.Date,
        component: dateWidget,
        initialValue: dateInitialValue,
        submittedValue: dateSubmittedValue,
        validators: [dateValidator]
    },
    {
        type: FormFieldType.DateTime,
        component: dateTimeWidget,
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
    { type: FormFieldType.Hyperlink, component: hyperlinkWidget, submittedValue: noSubmittedValue },
    { type: FormFieldType.DisplayValue, component: textWidget, submittedValue: noSubmittedValue },
    { type: FormFieldType.ReadonlyText, component: displayTextWidget, submittedValue: noSubmittedValue },
    { type: FormFieldType.DisplayRichText },
    { type: FormFieldType.DataTable },
    { type: FormFieldType.Json, component: jsonWidget },
    { type: FormFieldType.Button },
    { type: FormFieldType.BaseViewer }
];

/**
 * Resolves field types from a list of definitions; a later definition for the same type replaces an earlier one.
 *
 * @param definitions the definitions, in registration order
 * @returns a resolver over them
 */
export const formWidgetResolver = (definitions: readonly FormWidgetDefinition[]): FormWidgetResolver => {
    const byType = new Map(definitions.map((definition) => [definition.type, definition]));
    return { definitionFor: (type) => byType.get(type) };
};

export const BUILT_IN_FORM_WIDGET_RESOLVER: FormWidgetResolver = formWidgetResolver(BUILT_IN_FORM_WIDGETS);
