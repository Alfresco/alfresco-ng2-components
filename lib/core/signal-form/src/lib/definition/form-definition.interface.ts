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
    minValue?: unknown;
    maxValue?: unknown;
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
    initialValue: unknown;
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
    savedRows: Record<string, unknown>[];
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
