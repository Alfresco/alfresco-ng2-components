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

import { computed, Injector, Signal, signal, WritableSignal } from '@angular/core';
import { applyEach, FieldTree, form, hidden, PathKind, SchemaPath, SchemaPathRules, validate } from '@angular/forms/signals';
import { FieldSnapshot, FormEngineDriver, FormInteraction, FormSnapshot, rowFieldKey, toSubmittedValues } from '../parity/form-engine-driver';
import {
    readSpikeFields,
    readSpikeSections,
    readSpikeTabs,
    readSpikeVariables,
    SpikeFieldDefinition,
    SpikeSectionDefinition,
    SpikeTabDefinition,
    SpikeVariables
} from './spike-definition';
import { conditionValueOf, submittedValue } from './spike-field-values';
import { firstValidationError } from './spike-validation';
import { resolveVariableValue } from './spike-variables';
import { isVisible } from './spike-visibility';

type FieldValues = Record<string, unknown>;

interface SpikeModel {
    fields: FieldValues;
    sections: Record<string, FieldValues[]>;
}

const LABEL_SUFFIX = '_LABEL';

/**
 * Phase 0 spike: runs a form definition on Angular Signal Forms. Top-level values are keyed by field id, repeatable
 * sections hold one record per row, and per-field rules are applied through `applyEach`.
 */
export class SignalFormEngineDriver implements FormEngineDriver {
    private definitions = new Map<string, SpikeFieldDefinition>();
    private sections = new Map<string, SpikeSectionDefinition>();
    private tabs = new Map<string, SpikeTabDefinition>();
    private variables: SpikeVariables;
    private model: WritableSignal<SpikeModel>;
    private payload: Signal<FieldValues>;
    private tree: FieldTree<SpikeModel>;

    constructor(private readonly injector: Injector) {}

    load(definition: object): void {
        const fields = readSpikeFields(definition);
        const sections = readSpikeSections(definition);
        this.definitions = new Map(fields.map((field) => [field.id, field]));
        this.sections = new Map(sections.map((section) => [section.id, section]));
        this.variables = readSpikeVariables(definition);
        this.tabs = new Map(readSpikeTabs(definition).map((tab) => [tab.id, tab]));
        this.model = signal({
            fields: Object.fromEntries(fields.map((field) => [field.id, field.value ?? null])),
            sections: Object.fromEntries(
                sections.map((section) => [section.id, Array.from({ length: section.initialRows }, () => this.emptyRow(section))])
            )
        });
        this.payload = computed(() => this.toPayload(this.model()));
        this.tree = form(
            this.model,
            (root) => {
                applyEach(root.fields, (field) => this.applyFieldRules(field, (id) => this.definitions.get(id)));
                for (const section of sections) {
                    const sectionFields = new Map(section.fields.map((field) => [field.id, field]));
                    applyEach(root.sections[section.id], (row) =>
                        applyEach(row, (field) => this.applyFieldRules(field, (id) => sectionFields.get(id)))
                    );
                }
            },
            { injector: this.injector }
        );
    }

    apply(interaction: FormInteraction): void {
        if (interaction.kind === 'setValue' && !interaction.row) {
            this.model.update((model) => ({ ...model, fields: { ...model.fields, [interaction.fieldId]: interaction.value } }));
        } else if (interaction.kind === 'setValue') {
            const { sectionId, index } = interaction.row;
            this.updateRows(sectionId, (rows) =>
                rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [interaction.fieldId]: interaction.value } : row))
            );
        } else if (interaction.kind === 'addRow') {
            const section = this.sections.get(interaction.sectionId);
            this.updateRows(section.id, (rows) => (!section.maxRows || rows.length < section.maxRows ? [...rows, this.emptyRow(section)] : rows));
        } else {
            this.updateRows(interaction.sectionId, (rows) => [...rows.slice(0, interaction.index), ...rows.slice(interaction.index + 1)]);
        }
    }

    snapshot(): FormSnapshot {
        const fields: Record<string, FieldSnapshot> = {};

        for (const [id, definition] of this.definitions) {
            fields[id] = { visible: this.isOnScreen(definition), valid: this.tree.fields[id]().valid() };
        }

        for (const section of this.sections.values()) {
            const rowCount = this.model().sections[section.id].length;
            for (let index = 0; index < rowCount; index++) {
                for (const definition of section.fields) {
                    fields[rowFieldKey({ sectionId: section.id, index }, definition.id)] = {
                        visible: this.isOnScreen(definition),
                        valid: this.tree.sections[section.id][index][definition.id]().valid()
                    };
                }
            }
        }

        return { valid: this.tree().valid(), fields, values: toSubmittedValues(this.payload()) };
    }

    private applyFieldRules(
        field: SchemaPath<unknown, SchemaPathRules.Supported, PathKind.Child>,
        definitionOf: (id: string) => SpikeFieldDefinition
    ): void {
        hidden(field, (context) => {
            const definition = definitionOf(context.key());
            return !this.isOnScreen(definition);
        });
        validate(field, (context) => {
            const kind = firstValidationError(definitionOf(context.key()), context.value());
            return kind ? { kind } : null;
        });
    }

    private emptyRow(section: SpikeSectionDefinition): FieldValues {
        return Object.fromEntries(section.fields.map((field) => [field.id, field.value ?? null]));
    }

    private updateRows(sectionId: string, update: (rows: FieldValues[]) => FieldValues[]): void {
        this.model.update((model) => ({ ...model, sections: { ...model.sections, [sectionId]: update(model.sections[sectionId]) } }));
    }

    private isOnScreen(definition: SpikeFieldDefinition): boolean {
        return (
            this.isFieldVisible(definition) &&
            this.isTabVisible(definition.tabId) &&
            definition.ancestors.every((ancestor) => this.isConditionMet(ancestor.visibilityCondition))
        );
    }

    private isFieldVisible(definition: SpikeFieldDefinition | undefined): boolean {
        return this.isConditionMet(definition?.visibilityCondition);
    }

    private isTabVisible(tabId: string | undefined): boolean {
        const tab = tabId ? this.tabs.get(tabId) : undefined;
        return !tab || this.isConditionMet(tab.visibilityCondition);
    }

    private isConditionMet(condition: SpikeFieldDefinition['visibilityCondition']): boolean {
        return isVisible(condition, {
            fieldValue: (reference) => this.conditionValue(reference),
            variableValue: (identifier) => resolveVariableValue(identifier, this.variables)
        });
    }

    private conditionValue(reference: string): unknown {
        const id = this.findFieldId(reference);
        if (!id || !this.tree.fields[id]().valid()) {
            return undefined;
        }

        return conditionValueOf(this.definitions.get(id), reference, this.payload()[id], this.model().fields[id]);
    }

    private findFieldId(reference: string): string | undefined {
        const wanted = (reference.indexOf(LABEL_SUFFIX) > 0 ? reference.replace(LABEL_SUFFIX, '') : reference).toUpperCase();
        return [...this.definitions.keys()].find((id) => id.toUpperCase() === wanted);
    }

    private toPayload({ fields, sections }: SpikeModel): FieldValues {
        const payload: FieldValues = {};

        for (const [id, value] of Object.entries(fields)) {
            payload[id] = submittedValue(this.definitions.get(id), value);
        }

        for (const [sectionId, rows] of Object.entries(sections)) {
            const sectionFields = this.sections.get(sectionId).fields;
            payload[sectionId] = rows.map((row) =>
                Object.fromEntries(sectionFields.map((field) => [field.id, submittedValue(field, row[field.id])]))
            );
        }

        return payload;
    }
}
