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

import type { ThemeModel } from '@alfresco/adf-core';
import type { FieldJson } from './form-definition-json.interface';

/** A value written in a visibility condition: a field id, a variable name, or a constant to compare with. */
export type ConditionLiteral = string | number | boolean;

export interface VisibilityCondition {
    leftType?: string | null;
    leftValue?: ConditionLiteral | null;
    leftFormFieldId?: string;
    leftRestResponseId?: string;
    operator?: string;
    rightType?: string | null;
    rightValue?: ConditionLiteral | null;
    rightFormFieldId?: string;
    rightRestResponseId?: string;
    nextConditionOperator?: string;
    nextCondition?: VisibilityCondition | null;
}

export interface FieldOption {
    id: string;
    name: string;
}

/** A person picked in a people field. */
export interface PersonValue {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

/** A group picked in a group field. */
export interface GroupValue {
    id?: string;
    name?: string;
}

/** A file attached to an upload field. */
export interface FileValue {
    id?: string | number;
    name?: string;
}

/** What a dropdown or radio holds for one choice: the option, or its id. */
export type ChoiceValue = FieldOption | string;

/** One choice or several, as a dropdown or radio shows them. */
export type ChoiceSelection = ChoiceValue | ChoiceValue[];

/** The value of a dropdown: one choice, the options of a multiple selection, or none. */
export type DropdownFieldValue = ChoiceValue | FieldOption[] | null;

/** The value of a radio: the id of the picked option, or none. */
export type RadioFieldValue = string | null;

/** The value of an integer, amount or decimal field, and of a number limit: the number, its text, or none. */
export type NumberFieldValue = string | number | null;

/** The value of a checkbox: checked or not, or none. */
export type BooleanFieldValue = boolean | null;

/** The value of a date or datetime field: the date, the text typed when it is no date, or none. */
export type DateFieldValue = Date | string | null;

/** The value of an upload field: the attached files, a file id, or none. */
export type UploadFieldValue = FileValue[] | string | null;

/** The value of a people field: one person or several. */
export type PeopleFieldValue = PersonValue | PersonValue[];

/** The value of a group field: one group or several. */
export type GroupFieldValue = GroupValue | GroupValue[];

/** The value of a people or group field, or none. */
export type IdentityFieldValue = PeopleFieldValue | GroupFieldValue | null;

/** A value with properties a field can hold: a choice, a person, a group, a file, or a JSON object. */
export type ObjectValue = FieldOption | PersonValue | GroupValue | FileValue | Record<string, unknown>;

/** A value as JSON holds it, for example in a JSON field. */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Any value a field holds: a text, a number, a checkbox state, a date, an object such as an option or a person, a list
 * of objects, of choices or of JSON values, or no value.
 */
export type FieldValue = string | number | boolean | Date | ObjectValue | ObjectValue[] | ChoiceValue[] | JsonValue[] | null;

/** A value submitted for a field; `undefined` when the field submits nothing. */
export type SubmittedValue = FieldValue | undefined;

export interface LayoutDefinition {
    id: string;
    type: string;
    visibilityCondition?: VisibilityCondition | null;
}

export interface TabDefinition {
    id: string;
    title?: string;
    visibilityCondition?: VisibilityCondition | null;
}

export interface FieldDefinition {
    id: string;
    type: string;
    isCustomType: boolean;
    valueType?: string;
    name?: string;
    placeholder?: string;
    tooltip?: string;
    colspan: number;
    ancestors: LayoutDefinition[];
    tabId?: string;
    required: boolean;
    readOnly: boolean;
    minLength: number;
    maxLength: number;
    minValue?: NumberFieldValue;
    maxValue?: NumberFieldValue;
    regexPattern?: string | null;
    customValidationMessage?: string;
    inputMask?: InputMask;
    /** CSS classes the form author gave the field (`className`). */
    className?: string;
    /** Whether a multi-line text grows with its content (`params.autoGrow`); `false` caps its height. */
    autoGrow?: boolean;
    /** The name of the theme style the field uses (`style`), from the form theme or ADF's predefined theme. */
    style?: string;
    visibilityCondition?: VisibilityCondition | null;
    options: FieldOption[];
    optionType?: string;
    hasEmptyValue: boolean;
    emptyOption?: FieldOption;
    multiple: boolean;
    dateDisplayFormat: string;
    enableFractions: boolean;
    currency?: string;
    precision?: number;
    dynamicDateRangeSelection: boolean;
    /** The day a dynamic date range counts from: when the form was read, so it stays the same while the form is open. */
    dateRangeReference?: Date;
    minDateRangeValue?: number | null;
    maxDateRangeValue?: number | null;
    hyperlinkUrl?: string;
    displayText?: string;
    sourceField?: SourceFieldReference;
    initialValue: FieldValue;
    /** The field's JSON as authored, for widgets that read settings of their own, such as an application's widget. */
    json: Readonly<FieldJson>;
}

/**
 * A text field's input mask (`params.inputMask`): see `applyInputMask` for the mask characters.
 */
export interface InputMask {
    mask: string;
    reversed: boolean;
    /** Shown instead of the field placeholder while the field has a mask. */
    placeholder?: string;
}

/**
 * The process field a read-only field shows (`params.field`), whose value it takes from the process variables.
 */
export interface SourceFieldReference {
    id?: string;
    name?: string;
    type?: string;
}

export interface SectionRowOptions {
    allowInitialRowsDelete?: boolean;
    displayRowLabels?: boolean;
    rowLabelText?: string;
    appendRowNumber?: boolean;
}

export interface SectionDefinition {
    id: string;
    initialRows: number;
    maxRows: number | null;
    rowOptions: SectionRowOptions;
    readOnly: boolean;
    tabId?: string;
    fields: FieldDefinition[];
    /** The saved rows (the section's `value`), read like field values; empty for a section never saved. */
    savedRows: Record<string, FieldValue>[];
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

export interface FieldLayoutNode {
    kind: 'field';
    fieldId: string;
    colspan: number;
}

/**
 * How a group's header behaves (`params.allowCollapse`, `params.collapseByDefault`, `params.hideHeader`).
 */
export interface GroupHeader {
    collapsible: boolean;
    collapsedByDefault: boolean;
    hidden: boolean;
}

export interface ContainerLayoutNode {
    kind: 'container';
    element: LayoutDefinition;
    name?: string;
    numberOfColumns: number;
    columns: LayoutNode[][];
    /** Set for a group only: other containers have no header. */
    groupHeader?: GroupHeader;
    /** The name of the theme style the container uses (`style`). */
    style?: string;
}

export interface RepeatableLayoutNode {
    kind: 'repeatable';
    sectionId: string;
    element: LayoutDefinition;
    name?: string;
    numberOfColumns: number;
    columns: LayoutNode[][];
}

export type LayoutNode = FieldLayoutNode | ContainerLayoutNode | RepeatableLayoutNode;

export interface LayoutRoot {
    tabId?: string;
    node: LayoutNode;
}

/**
 * A form definition JSON read once into an immutable model.
 */
export interface FormDefinition {
    name: string | null;
    theme: ThemeModel | null;
    /** Whether the form shows previous and next buttons to move between its tabs. */
    showTabNavigation: boolean;
    /** Whether the tab bar stays in view while the form scrolls. */
    stickyTabs: boolean;
    /** Whether field labels are shown to the left of the fields instead of inside them. */
    leftLabels: boolean;
    /** CSS classes the form author gave the form (`className`). */
    className?: string;
    fields: FieldDefinition[];
    sections: SectionDefinition[];
    tabs: TabDefinition[];
    outcomes: OutcomeDefinition[];
    variables: FormVariables;
    layout: LayoutRoot[];
}
