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
import {
    applyEach,
    disabled,
    FieldTree,
    form,
    hidden,
    PathKind,
    readonly,
    SchemaPath,
    SchemaPathRules,
    SchemaPathTree,
    validate
} from '@angular/forms/signals';
import {
    FieldDefinition,
    FormDefinition,
    LayoutDefinition,
    OutcomeDefinition,
    SectionDefinition,
    TabDefinition,
    VisibilityCondition
} from '../definition/form-definition.model';
import { conditionValueOf, referencedFieldId } from '../expressions/condition-values';
import { findVariable, resolveVariableValue } from '../expressions/form-variables';
import { resolveTextExpressions } from '../expressions/text-expressions';
import { evaluateVisibilityCondition } from '../expressions/visibility-condition';
import { displayFieldValue } from '../display/field-display-value';
import { FieldValues, FormValuesModel, toSubmissionValues } from '../submission/submission-values';
import { firstValidationError } from '../validation/field-validation';
import { BUILT_IN_FORM_WIDGET_RESOLVER } from '../widgets/built-in-form-widgets';
import { fieldWidget } from '../widgets/field-widget';
import type { FormWidgetResolver } from '../widgets/form-widget-definition';

export interface SignalFormOptions {
    readOnly?: boolean;
}

export interface RowAddress {
    sectionId: string;
    index: number;
}

interface RuleOverrides {
    visible: Record<string, boolean>;
    disabled: Record<string, boolean>;
    required: Record<string, boolean>;
}

/**
 * A form running on Angular Signal Forms. Top-level values are keyed by field id, repeatable sections hold one record
 * per row, and every rule a field needs (visibility, validation) is read from its definition through `applyEach`.
 * Changes made by form rules are kept as overrides, so the authored definition is never rewritten.
 */
export class SignalForm {
    readonly fieldTree: FieldTree<FormValuesModel>;
    readonly valid: Signal<boolean>;
    readonly visibleTabs: Signal<TabDefinition[]>;
    readonly submissionValues: Signal<FieldValues>;

    private readonly fields: Map<string, FieldDefinition>;
    private readonly sections: Map<string, SectionDefinition>;
    private readonly tabs: Map<string, TabDefinition>;
    private readonly values: WritableSignal<FormValuesModel>;
    private readonly overrides = signal<RuleOverrides>({ visible: {}, disabled: {}, required: {} });
    private readonly runtimeVariables = signal<Record<string, unknown>>({});
    private readonly initialRows: WritableSignal<Record<string, boolean[]>>;

    constructor(
        readonly definition: FormDefinition,
        private readonly options: SignalFormOptions,
        injector: Injector,
        private readonly widgets: FormWidgetResolver = BUILT_IN_FORM_WIDGET_RESOLVER
    ) {
        this.fields = new Map(definition.fields.map((field) => [field.id, field]));
        this.sections = new Map(definition.sections.map((section) => [section.id, section]));
        this.tabs = new Map(definition.tabs.map((tab) => [tab.id, tab]));
        this.values = signal({
            fields: Object.fromEntries(definition.fields.map((field) => [field.id, structuredClone(field.initialValue ?? null)])),
            sections: Object.fromEntries(
                definition.sections.map((section) => [section.id, Array.from({ length: section.initialRows }, () => this.emptyRow(section))])
            )
        });
        this.initialRows = signal(
            Object.fromEntries(definition.sections.map((section) => [section.id, Array.from({ length: section.initialRows }, () => true)]))
        );
        this.submissionValues = computed(() => toSubmissionValues(this.fields, this.sections, this.values(), this.widgets));
        this.fieldTree = form(this.values, (root) => this.applyRules(root), { injector });
        this.valid = computed(() => this.fieldTree().valid());
        this.visibleTabs = computed(() => definition.tabs.filter((tab) => this.isTabVisible(tab.id)));
    }

    get readOnly(): boolean {
        return !!this.options.readOnly;
    }

    fieldDefinition(fieldId: string, sectionId?: string): FieldDefinition | undefined {
        return sectionId ? this.sections.get(sectionId)?.fields.find((field) => field.id === fieldId) : this.fields.get(fieldId);
    }

    fieldNode(fieldId: string, row?: RowAddress): FieldTree<unknown> {
        return row ? this.fieldTree.sections[row.sectionId][row.index][fieldId] : this.fieldTree.fields[fieldId];
    }

    isLayoutElementVisible(element: LayoutDefinition): boolean {
        return this.isElementVisible(element.id, element.visibilityCondition);
    }

    isTabVisible(tabId: string | undefined): boolean {
        const tab = tabId ? this.tabs.get(tabId) : undefined;
        return !tab || this.isConditionMet(tab.visibilityCondition);
    }

    isOnScreen(field: FieldDefinition): boolean {
        return (
            this.isElementVisible(field.id, field.visibilityCondition) &&
            this.isTabVisible(field.tabId) &&
            field.ancestors.every((ancestor) => this.isElementVisible(ancestor.id, ancestor.visibilityCondition))
        );
    }

    isReadOnly(field: FieldDefinition): boolean {
        return !!this.options.readOnly || (this.overrides().disabled[field.id] ?? field.readOnly);
    }

    /**
     * Resolves the `${field.<id>}` and `${variable.<name>}` expressions in a text with the current values. Read inside
     * a computed or a template, the result follows the values it depends on.
     *
     * @param text the text
     * @param options how the values are shown
     * @param options.formatValues whether typed values (options, people, groups…) are formatted as text
     * @param options.escapeHtml whether the values are HTML-escaped
     * @returns the resolved text
     */
    resolveText(text: string, options: { formatValues?: boolean; escapeHtml?: boolean } = {}): string {
        return resolveTextExpressions(
            text,
            {
                field: (fieldId) => {
                    const definition = this.fields.get(fieldId);
                    return definition && { definition, value: this.values().fields[fieldId] };
                },
                variableValue: (identifier) => this.variableValue(identifier)
            },
            {
                escapeHtml: options.escapeHtml,
                formatFieldValue: options.formatValues ? (definition, value) => displayFieldValue(this.widgets, definition, value) : undefined
            }
        );
    }

    isOutcomeConditionMet(outcome: OutcomeDefinition): boolean {
        return this.isConditionMet(outcome.visibilityCondition);
    }

    /**
     * Whether a visible tab holds a field, or a repeatable section row, that fails validation.
     *
     * @param tabId the tab
     * @returns `true` when the tab is visible and has an invalid field
     */
    hasTabErrors(tabId: string): boolean {
        return (
            this.isTabVisible(tabId) &&
            (this.definition.fields.some((field) => field.tabId === tabId && !this.isFieldValid(field.id)) ||
                this.definition.sections.some((section) => section.tabId === tabId && !this.fieldTree.sections[section.id]().valid()))
        );
    }

    isFieldValid(fieldId: string, row?: RowAddress): boolean {
        return row ? this.fieldTree.sections[row.sectionId][row.index][fieldId]().valid() : this.fieldTree.fields[fieldId]().valid();
    }

    rowCount(sectionId: string): number {
        return this.values().sections[sectionId].length;
    }

    setValue(fieldId: string, value: unknown, row?: RowAddress): void {
        if (!row) {
            this.values.update((model) => ({ ...model, fields: { ...model.fields, [fieldId]: value } }));
            return;
        }
        this.updateRows(row.sectionId, (rows) => rows.map((current, index) => (index === row.index ? { ...current, [fieldId]: value } : current)));
    }

    canAddRow(sectionId: string): boolean {
        const { maxRows } = this.sections.get(sectionId);
        return !maxRows || this.rowCount(sectionId) < maxRows;
    }

    canRemoveRow(sectionId: string, index: number): boolean {
        return !this.initialRows()[sectionId][index] || !!this.sections.get(sectionId).rowOptions.allowInitialRowsDelete;
    }

    addRow(sectionId: string): void {
        if (!this.canAddRow(sectionId)) {
            return;
        }
        const section = this.sections.get(sectionId);
        this.updateRows(sectionId, (rows) => [...rows, this.emptyRow(section)]);
        this.initialRows.update((current) => ({ ...current, [sectionId]: [...current[sectionId], false] }));
    }

    removeRow(sectionId: string, index: number): void {
        const withoutRow = <T>(items: T[]): T[] => [...items.slice(0, index), ...items.slice(index + 1)];
        this.updateRows(sectionId, withoutRow);
        this.initialRows.update((current) => ({ ...current, [sectionId]: withoutRow(current[sectionId]) }));
    }

    setVisibility(fieldId: string, visible: boolean): void {
        this.setOverride('visible', fieldId, visible);
    }

    setDisabled(fieldId: string, isDisabled: boolean): void {
        this.setOverride('disabled', fieldId, isDisabled);
    }

    setRequired(fieldId: string, required: boolean): void {
        this.setOverride('required', fieldId, required);
    }

    setVariable(variableId: string, value: unknown): void {
        const variable = findVariable(variableId, this.definition.variables);
        if (variable) {
            this.runtimeVariables.update((values) => ({ ...values, [variable.id ?? variable.name]: value }));
        }
    }

    private applyRules(root: SchemaPathTree<FormValuesModel>): void {
        applyEach(root.fields, (field) => this.applyFieldRules(field, (id) => this.fields.get(id)));
        for (const section of this.sections.values()) {
            const sectionFields = new Map(section.fields.map((field) => [field.id, field]));
            applyEach(root.sections[section.id], (row) => applyEach(row, (field) => this.applyFieldRules(field, (id) => sectionFields.get(id))));
        }
    }

    private applyFieldRules(
        field: SchemaPath<unknown, SchemaPathRules.Supported, PathKind.Child>,
        definitionOf: (id: string) => FieldDefinition
    ): void {
        hidden(field, (context) => !this.isOnScreen(definitionOf(context.key())));
        readonly(field, (context) => this.isReadOnly(definitionOf(context.key())));
        disabled(field, (context) => this.isReadOnly(definitionOf(context.key())));
        validate(field, (context) => {
            const definition = this.withRequiredOverride(definitionOf(context.key()));
            const kind = firstValidationError(definition, context.value(), fieldWidget(this.widgets, definition)?.definition.validators ?? []);
            return kind ? { kind } : null;
        });
    }

    private withRequiredOverride(field: FieldDefinition): FieldDefinition {
        const required = this.overrides().required[field.id];
        return required === undefined ? field : { ...field, required };
    }

    private isElementVisible(id: string, condition: VisibilityCondition | null | undefined): boolean {
        return this.overrides().visible[id] ?? this.isConditionMet(condition);
    }

    private isConditionMet(condition: VisibilityCondition | null | undefined): boolean {
        return evaluateVisibilityCondition(condition, {
            fieldValue: (reference) => this.conditionValue(reference),
            variableValue: (identifier) => this.variableValue(identifier)
        });
    }

    private variableValue(identifier: string): unknown {
        return resolveVariableValue(identifier, this.definition.variables, this.runtimeVariables());
    }

    private conditionValue(reference: string): unknown {
        const wanted = referencedFieldId(reference).toUpperCase();
        const id = [...this.fields.keys()].find((candidate) => candidate.toUpperCase() === wanted);
        if (!id || !this.isFieldValid(id)) {
            return undefined;
        }
        return conditionValueOf(this.fields.get(id), reference, this.submissionValues()[id], this.values().fields[id]);
    }

    private setOverride(kind: keyof RuleOverrides, fieldId: string, enabled: boolean): void {
        this.overrides.update((current) => ({ ...current, [kind]: { ...current[kind], [fieldId]: enabled } }));
    }

    private emptyRow(section: SectionDefinition): FieldValues {
        return Object.fromEntries(section.fields.map((field) => [field.id, structuredClone(field.initialValue ?? null)]));
    }

    private updateRows(sectionId: string, update: (rows: FieldValues[]) => FieldValues[]): void {
        this.values.update((model) => ({ ...model, sections: { ...model.sections, [sectionId]: update(model.sections[sectionId]) } }));
    }
}
