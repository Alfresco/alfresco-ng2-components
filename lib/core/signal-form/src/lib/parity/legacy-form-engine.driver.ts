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
    FormService,
    WidgetVisibilityService
} from '../../../../src/lib/form/public-api';
import {
    FieldSnapshot,
    FormEngineDriver,
    FormInteraction,
    FormSnapshot,
    LAYOUT_FIELD_TYPES,
    RowAddress,
    rowFieldKey,
    SetValueInteraction,
    toSubmittedValues
} from './form-engine-driver';
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

    constructor(
        private readonly formService: FormService,
        private readonly visibilityService: WidgetVisibilityService,
        private readonly differences: IntentionalDifference[] = INTENTIONAL_DIFFERENCES
    ) {}

    load(definition: RepresentationJson & { formRepresentation?: RepresentationJson }): void {
        const representation: RepresentationJson = definition.formRepresentation ?? definition;
        this.form = this.formService.parseForm({ ...representation, ...representation.formDefinition });
        this.differences.forEach((difference) => difference.configure?.(this.form));
        this.refresh();
    }

    apply(interaction: FormInteraction): void {
        if (interaction.kind === 'setValue') {
            this.findField(interaction).value = interaction.value;
        } else if (interaction.kind === 'addRow') {
            const section = this.form.getFieldById(interaction.sectionId);
            section.addRow(section.json.fields, this.form);
        } else {
            this.form.getFieldById(interaction.sectionId).removeRow(interaction.index);
        }
        this.refresh();
    }

    snapshot(): FormSnapshot {
        const fields: Record<string, FieldSnapshot> = {};
        const hiddenByLayout = this.fieldsInHiddenLayout();

        for (const field of this.form.getFormFields()) {
            if (!LAYOUT_FIELD_TYPES.has(field.type)) {
                fields[this.snapshotKey(field)] = { visible: field.isVisible && !hiddenByLayout.has(field), valid: field.isValid };
            }
        }

        const snapshot = { valid: this.form.isValid, fields, values: toSubmittedValues(this.form.values) };
        this.differences.forEach((difference) => difference.adjust?.(this.form, snapshot));
        return snapshot;
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
