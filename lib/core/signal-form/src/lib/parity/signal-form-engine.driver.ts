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

import { Injector } from '@angular/core';
import { readFormDefinition } from '../definition/read-form-definition';
import { isOutcomeEnabled, isOutcomeShown } from '../outcomes/outcome-rules';
import { SignalForm } from '../state/signal-form';
import {
    DEFAULT_LOAD_OPTIONS,
    FieldSnapshot,
    FormEngineDriver,
    FormInteraction,
    FormSnapshot,
    LoadOptions,
    OutcomeSnapshot,
    rowFieldKey,
    toSubmittedValues
} from './form-engine-driver';

/**
 * Drives the new engine (`SignalForm`) through the parity harness contract.
 */
export class SignalFormEngineDriver implements FormEngineDriver {
    private form: SignalForm;
    private options: Required<LoadOptions> = DEFAULT_LOAD_OPTIONS;

    constructor(private readonly injector: Injector) {}

    load(definition: object, options: LoadOptions = {}): void {
        this.options = { ...DEFAULT_LOAD_OPTIONS, ...options };
        this.form = new SignalForm(readFormDefinition(definition), { readOnly: this.options.readOnly }, this.injector);
    }

    apply(interaction: FormInteraction): void {
        switch (interaction.kind) {
            case 'setValue':
                this.form.setValue(interaction.fieldId, interaction.value, interaction.row);
                break;
            case 'addRow':
                this.form.addRow(interaction.sectionId);
                break;
            case 'removeRow':
                this.form.removeRow(interaction.sectionId, interaction.index);
                break;
            case 'setVisibility':
                this.form.setVisibility(interaction.fieldId, interaction.enabled);
                break;
            case 'setDisabled':
                this.form.setDisabled(interaction.fieldId, interaction.enabled);
                break;
            case 'setRequired':
                this.form.setRequired(interaction.fieldId, interaction.enabled);
                break;
            case 'setVariable':
                this.form.setVariable(interaction.variableId, interaction.value);
                break;
            case 'refreshProcessVariables':
                this.form.refreshProcessVariables(interaction.processVariables);
                break;
            default: {
                const unsupported: never = interaction;
                throw new Error(`Unsupported interaction: ${JSON.stringify(unsupported)}`);
            }
        }
    }

    snapshot(): FormSnapshot {
        const { definition } = this.form;
        const fields: Record<string, FieldSnapshot> = {};

        for (const field of definition.fields) {
            fields[field.id] = {
                visible: this.form.isOnScreen(field),
                valid: this.form.isFieldValid(field.id),
                readOnly: this.form.isReadOnly(field)
            };
        }

        for (const section of definition.sections) {
            for (let index = 0; index < this.form.rowCount(section.id); index++) {
                const row = { sectionId: section.id, index };
                for (const field of section.fields) {
                    fields[rowFieldKey(row, field.id)] = {
                        visible: this.form.isOnScreen(field, row),
                        valid: this.form.isFieldValid(field.id, row),
                        readOnly: this.form.isReadOnly(field, row)
                    };
                }
            }
        }

        const valid = this.form.valid();
        const outcomes: Record<string, OutcomeSnapshot> = {};
        for (const outcome of definition.outcomes) {
            outcomes[outcome.id] = {
                visible: this.form.isOutcomeConditionMet(outcome) && isOutcomeShown(outcome, this.options),
                enabled: isOutcomeEnabled(outcome, valid, this.options)
            };
        }

        return { valid, fields, outcomes, values: toSubmittedValues(this.form.submissionValues()) };
    }
}
