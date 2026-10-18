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

export interface FieldSnapshot {
    visible: boolean;
    valid: boolean;
    readOnly: boolean;
}

export interface OutcomeSnapshot {
    visible: boolean;
    enabled: boolean;
}

export interface FormSnapshot {
    valid: boolean;
    fields: Record<string, FieldSnapshot>;
    outcomes: Record<string, OutcomeSnapshot>;
    values: Record<string, unknown>;
}

/**
 * Inputs the host component gives the form, with the cloud form's defaults.
 */
export interface LoadOptions {
    readOnly?: boolean;
    showSaveButton?: boolean;
    showCompleteButton?: boolean;
}

export const DEFAULT_LOAD_OPTIONS: Required<LoadOptions> = { readOnly: false, showSaveButton: true, showCompleteButton: false };

import type { RowAddress } from '../state/signal-form';

export type { RowAddress } from '../state/signal-form';

export interface SetValueInteraction {
    kind: 'setValue';
    fieldId: string;
    value: unknown;
    row?: RowAddress;
}

export interface AddRowInteraction {
    kind: 'addRow';
    sectionId: string;
}

export interface RemoveRowInteraction {
    kind: 'removeRow';
    sectionId: string;
    index: number;
}

export interface RuleFieldInteraction {
    kind: 'setVisibility' | 'setDisabled' | 'setRequired';
    fieldId: string;
    enabled: boolean;
}

export interface RuleVariableInteraction {
    kind: 'setVariable';
    variableId: string;
    value: unknown;
}

export interface RefreshProcessVariablesInteraction {
    kind: 'refreshProcessVariables';
    processVariables: { id?: string; name?: string; type?: string; value?: unknown }[];
}

export type FormInteraction =
    | SetValueInteraction
    | AddRowInteraction
    | RemoveRowInteraction
    | RuleFieldInteraction
    | RuleVariableInteraction
    | RefreshProcessVariablesInteraction;

export interface FormEngineDriver {
    load(definition: object, options?: LoadOptions): void;
    apply(interaction: FormInteraction): void;
    snapshot(): FormSnapshot;
}

export const toSubmittedValues = (values: object): Record<string, unknown> => JSON.parse(JSON.stringify(values));

export const rowFieldKey = ({ sectionId, index }: RowAddress, fieldId: string): string => `${sectionId}[${index}].${fieldId}`;
