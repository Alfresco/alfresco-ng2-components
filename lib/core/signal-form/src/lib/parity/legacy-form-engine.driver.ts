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
    ContainerColumnModel,
    ContainerModel,
    FormFieldModel,
    FormModel,
    FormOutcomeModel,
    FormService,
    isOutcomeButtonVisible,
    WidgetVisibilityService
} from '../../../../src/lib/form/public-api';
import {
    DEFAULT_LOAD_OPTIONS,
    FieldSnapshot,
    FormEngineDriver,
    FormInteraction,
    FormSnapshot,
    LoadOptions,
    OutcomeSnapshot,
    RowAddress,
    rowFieldKey,
    SetValueInteraction,
    toSubmittedValues
} from './form-engine-driver';
import { LAYOUT_FIELD_TYPES } from '../definition/form-definition.model';
import { IntentionalDifference, INTENTIONAL_DIFFERENCES } from './intentional-differences';

const ROW_ID_SEPARATOR = '-Row';

interface RepresentationJson {
    formDefinition?: object;
}
const REPEATABLE_SECTION = 'repeatable-section';
const SECTION = 'section';

/**
 * Drives the current `FormModel` engine headlessly, refreshing visibility and validation the way the renderer and
 * widgets do after every change.
 */
export class LegacyFormEngineDriver implements FormEngineDriver {
    private form: FormModel;
    private options: Required<LoadOptions> = DEFAULT_LOAD_OPTIONS;

    constructor(
        private readonly formService: FormService,
        private readonly visibilityService: WidgetVisibilityService,
        private readonly differences: IntentionalDifference[] = INTENTIONAL_DIFFERENCES
    ) {}

    load(definition: RepresentationJson & { formRepresentation?: RepresentationJson }, options: LoadOptions = {}): void {
        const representation: RepresentationJson = structuredClone(definition.formRepresentation ?? definition);
        this.options = { ...DEFAULT_LOAD_OPTIONS, ...options };
        this.form = this.formService.parseForm({ ...representation, ...representation.formDefinition }, undefined, this.options.readOnly);
        this.differences.forEach((difference) => difference.configure?.(this.form));
        this.refresh();
    }

    apply(interaction: FormInteraction): void {
        switch (interaction.kind) {
            case 'setValue':
                this.findField(interaction).value = interaction.value;
                break;
            case 'addRow': {
                const section = this.form.getFieldById(interaction.sectionId);
                section.addRow(section.json.fields, this.form);
                break;
            }
            case 'removeRow':
                this.form.getFieldById(interaction.sectionId).removeRow(interaction.index);
                break;
            case 'setVisibility':
                this.form.changeFieldVisibility(interaction.fieldId, interaction.enabled);
                break;
            case 'setDisabled':
                this.form.changeFieldDisabled(interaction.fieldId, interaction.enabled);
                break;
            case 'setRequired':
                this.form.changeFieldRequired(interaction.fieldId, interaction.enabled);
                break;
            case 'setVariable':
                this.form.changeVariableValue(interaction.variableId, interaction.value);
                break;
            default: {
                const unsupported: never = interaction;
                throw new Error(`Unsupported interaction: ${JSON.stringify(unsupported)}`);
            }
        }
        this.refresh();
    }

    snapshot(): FormSnapshot {
        const fields: Record<string, FieldSnapshot> = {};
        const hiddenByLayout = this.fieldsInHiddenLayout();

        for (const field of this.form.getFormFields()) {
            if (!LAYOUT_FIELD_TYPES.has(field.type)) {
                fields[this.snapshotKey(field)] = {
                    visible: field.isVisible && !hiddenByLayout.has(field),
                    valid: field.isValid,
                    readOnly: field.readOnly
                };
            }
        }

        const outcomes: Record<string, OutcomeSnapshot> = {};
        for (const outcome of this.form.outcomes) {
            outcomes[outcome.id] = { visible: outcome.isVisible && this.isOutcomeVisible(outcome), enabled: this.isOutcomeEnabled(outcome) };
        }

        const snapshot = { valid: this.form.isValid, fields, outcomes, values: toSubmittedValues(this.form.values) };
        this.differences.forEach((difference) => difference.adjust?.(this.form, snapshot));
        return snapshot;
    }

    private isOutcomeVisible(outcome: FormOutcomeModel): boolean {
        const { readOnly, showCompleteButton, showSaveButton } = this.options;
        return isOutcomeButtonVisible(outcome, { isFormReadOnly: readOnly, showCompleteButton, showSaveButton });
    }

    private isOutcomeEnabled(outcome: FormOutcomeModel): boolean {
        if (this.form.readOnly) {
            return false;
        }
        return outcome.name === FormOutcomeModel.SAVE_ACTION || outcome.skipValidation || this.form.isValid;
    }

    private findField({ fieldId, row }: SetValueInteraction): FormFieldModel {
        if (!row) {
            return this.form.getFieldById(fieldId);
        }
        return this.form
            .getFormFields()
            .find(
                (field) => this.rowOf(field)?.sectionId === row.sectionId && this.rowOf(field)?.index === row.index && this.baseId(field) === fieldId
            );
    }

    private snapshotKey(field: FormFieldModel): string {
        const row = this.rowOf(field);
        return row ? rowFieldKey(row, this.baseId(field)) : field.id;
    }

    private rowOf(field: FormFieldModel): RowAddress | undefined {
        return field.parent ? { sectionId: field.parent.id, index: field.parent.rowIndex } : undefined;
    }

    private baseId(field: FormFieldModel): string {
        return field.id.split(ROW_ID_SEPARATOR)[0];
    }

    private fieldsInHiddenLayout(): Set<FormFieldModel> {
        const hidden = new Set<FormFieldModel>();
        const tabHidden = (tabId: string) => this.form.tabs.some((tab) => tab.id === tabId && !tab.isVisible);

        for (const element of this.form.fields) {
            if (element instanceof ContainerModel) {
                const elementHidden = !element.isVisible || (!!element.tab && tabHidden(element.tab));
                this.columnsOf(element.field).forEach((column) => this.markHidden(column, elementHidden, hidden));
            }
        }

        return hidden;
    }

    private markHidden(column: ContainerColumnModel, parentHidden: boolean, hidden: Set<FormFieldModel>): void {
        for (const field of column.fields) {
            if (field.type === SECTION) {
                field.columns.forEach((nested) => this.markHidden(nested, parentHidden || !field.isVisible, hidden));
            } else if (parentHidden) {
                hidden.add(field);
            }
        }
    }

    private columnsOf(field: FormFieldModel): ContainerColumnModel[] {
        return field.type === REPEATABLE_SECTION && field.rows.length ? field.rows.flatMap((row) => row.columns) : field.columns;
    }

    private refresh(): void {
        this.visibilityService.refreshVisibility(this.form);
        this.form.validateForm();
    }
}
