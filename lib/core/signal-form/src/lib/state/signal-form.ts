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
    metadata,
    PathKind,
    readonly,
    REQUIRED,
    SchemaPath,
    SchemaPathRules,
    SchemaPathTree,
    validate
} from '@angular/forms/signals';
import {
    CONSTANT_VALUE_FIELD_TYPES,
    EMPTY_OPTION_ID,
    FieldDefinition,
    FormDefinition,
    FormVariable,
    LayoutDefinition,
    OutcomeDefinition,
    SectionDefinition,
    TabDefinition,
    VisibilityCondition
} from '../definition/form-definition.model';
import { readFieldValue, readSavedRow, savedValueFor } from '../definition/field-initial-values';
import { conditionValueOf, referencedFieldId } from '../expressions/condition-values';
import { findVariable, resolveVariableValue } from '../expressions/form-variables';
import { resolveTextExpressions } from '../expressions/text-expressions';
import { evaluateVisibilityCondition } from '../expressions/visibility-condition';
import { displayFieldValue } from '../display/field-display-value';
import { FieldValues, FormValuesModel, toSubmissionValues } from '../submission/submission-values';
import { firstValidationError } from '../validation/field-validation';
import { BUILT_IN_FORM_WIDGET_RESOLVER } from '../widgets/built-in-form-widgets';
import { fieldWidget } from '../widgets/field-widget';
import type { FieldValidator, FormWidgetResolver } from '../widgets/form-widget-definition';
import { LOCALE_AMOUNTS, TYPED_VALUE_FORMATTING } from './field-metadata';

/**
 * Behaviours being rolled out, off by default. Each is a value or a signal (for example a feature flag), and is
 * removed once its behaviour becomes the default.
 */
export interface SignalFormFeatures {
    /** Shows typed values (options, people, groups…) by name in read-only texts. */
    typedValueFormatting?: boolean | Signal<boolean>;
    /** Marks the visible tabs that hold an invalid field. */
    tabErrorIndicators?: boolean | Signal<boolean>;
    /** Shows amounts formatted for the user's locale while they aren't being edited. */
    localeAmounts?: boolean | Signal<boolean>;
}

export interface SignalFormOptions {
    readOnly?: boolean;
    features?: SignalFormFeatures;
    /**
     * Validators the application adds to every field, run after the field type's own ones. Each decides which fields it
     * applies to, and returns an error kind: one of ADF's, or a translation key for its own message. Hidden and
     * read-only fields are not validated.
     */
    validators?: readonly FieldValidator[];
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
    private readonly allErrorsRequested = signal(false);
    private readonly refreshedProcessVariables = signal<readonly FormVariable[]>([]);
    private readonly initialRows: WritableSignal<Record<string, boolean[]>>;
    private readonly rowCounts: Map<string, Signal<number>>;
    private readonly keys: WritableSignal<Record<string, number[]>>;
    private nextRowKey = 0;

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
            sections: Object.fromEntries(definition.sections.map((section) => [section.id, this.startingRows(section)]))
        });
        this.initialRows = signal(
            Object.fromEntries(
                definition.sections.map((section) => [
                    section.id,
                    [...Array(section.savedRows.length || section.initialRows).keys()].map((index) => index < section.initialRows)
                ])
            )
        );
        this.keys = signal(
            Object.fromEntries(definition.sections.map((section) => [section.id, this.newRowKeys(this.values().sections[section.id].length)]))
        );
        this.rowCounts = new Map(definition.sections.map((section) => [section.id, computed(() => this.values().sections[section.id].length)]));
        this.submissionValues = computed(() => toSubmissionValues(this.fields, this.sections, this.values(), this.widgets));
        this.fieldTree = form(this.values, (root) => this.applyRules(root), { injector });
        this.valid = computed(() => this.fieldTree().valid());
        this.visibleTabs = computed(() => definition.tabs.filter((tab) => this.isTabVisible(tab.id)));
    }

    /** Whether every field shows its errors, touched or not, since `showAllErrors()` was called. */
    readonly allErrorsShown = this.allErrorsRequested.asReadonly();

    get readOnly(): boolean {
        return !!this.options.readOnly;
    }

    /**
     * Whether a feature being rolled out is on for this form. Read inside a computed or a template, it follows a
     * feature given as a signal.
     *
     * @param feature the feature
     * @returns `true` when the feature is on
     */
    isFeatureOn(feature: keyof SignalFormFeatures): boolean {
        const setting = this.options.features?.[feature];
        return typeof setting === 'function' ? setting() : !!setting;
    }

    fieldDefinition(fieldId: string, sectionId?: string): FieldDefinition | undefined {
        return sectionId ? this.sections.get(sectionId)?.fields.find((field) => field.id === fieldId) : this.fields.get(fieldId);
    }

    /**
     * Returns a field's Signal Forms node. A row field's node changes when rows are added or removed, so read inside a
     * computed or a template, it follows the row it addresses.
     *
     * @param fieldId the field
     * @param row the repeatable section row, for a field of a repeatable section
     * @returns the field's node, `undefined` for a row that no longer exists
     */
    fieldNode(fieldId: string, row?: RowAddress): FieldTree<unknown> | undefined {
        if (!row) {
            return this.fieldTree.fields[fieldId];
        }
        this.rowCount(row.sectionId);
        return this.fieldTree.sections[row.sectionId][row.index]?.[fieldId];
    }

    isLayoutElementVisible(element: LayoutDefinition, row?: RowAddress): boolean {
        return this.isElementVisible(element.id, element.visibilityCondition, row);
    }

    isTabVisible(tabId: string | undefined): boolean {
        const tab = tabId ? this.tabs.get(tabId) : undefined;
        return !tab || this.isConditionMet(tab.visibilityCondition);
    }

    /**
     * Whether a field is shown: its own condition, its tab and every layout element around it. In a repeatable
     * section row, conditions read the row's own fields first.
     *
     * @param field the field
     * @param row the repeatable section row the field is in, if any
     * @returns `true` when the field is shown
     */
    isOnScreen(field: FieldDefinition, row?: RowAddress): boolean {
        return (
            this.isElementVisible(field.id, field.visibilityCondition, row) &&
            this.isTabVisible(field.tabId) &&
            field.ancestors.every((ancestor) => this.isElementVisible(ancestor.id, ancestor.visibilityCondition, row))
        );
    }

    /**
     * Whether a field is read-only: the whole form is, the field is (by its definition or a rule), or, for a field of
     * a repeatable section row, its section is. A section made editable again leaves each field as it is on its own.
     *
     * @param field the field
     * @param row the repeatable section row the field is in, if any
     * @returns `true` when the field is read-only
     */
    isReadOnly(field: FieldDefinition, row?: RowAddress): boolean {
        return !!this.options.readOnly || (this.overrides().disabled[field.id] ?? field.readOnly) || (!!row && this.isSectionReadOnly(row.sectionId));
    }

    /**
     * Whether a repeatable section is read-only, by the form, its definition or a rule: its rows can't be added or
     * removed, and their fields are read-only.
     *
     * @param sectionId the repeatable section
     * @returns `true` when the section is read-only
     */
    isSectionReadOnly(sectionId: string): boolean {
        return !!this.options.readOnly || (this.overrides().disabled[sectionId] ?? this.sections.get(sectionId).readOnly);
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
                formatFieldValue: options.formatValues ? (definition, value) => this.displayValue(definition, value) : undefined
            }
        );
    }

    /**
     * Returns the text shown for a field value, by the field type's own formatter when it has one (options, people and
     * groups by name).
     *
     * @param definition the field
     * @param value the value
     * @returns the text
     */
    displayValue(definition: FieldDefinition, value: unknown): string {
        return displayFieldValue(this.widgets, definition, value);
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

    /**
     * Returns a stable key per row of a repeatable section, kept while the row exists, to track rows when rendering
     * them: removing a row then removes only that row's views.
     *
     * @param sectionId the repeatable section
     * @returns the row keys, in row order
     */
    rowKeys(sectionId: string): number[] {
        return this.keys()[sectionId];
    }

    rowCount(sectionId: string): number {
        return this.rowCounts.get(sectionId)();
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
        if (!this.canAddRow(sectionId) || this.isSectionReadOnly(sectionId)) {
            return;
        }
        const section = this.sections.get(sectionId);
        this.updateRows(sectionId, (rows) => [...rows, this.emptyRow(section)]);
        this.initialRows.update((current) => ({ ...current, [sectionId]: [...current[sectionId], false] }));
        this.keys.update((current) => ({ ...current, [sectionId]: [...current[sectionId], ...this.newRowKeys(1)] }));
    }

    removeRow(sectionId: string, index: number): void {
        if (this.isSectionReadOnly(sectionId)) {
            return;
        }
        const withoutRow = <T>(items: T[]): T[] => [...items.slice(0, index), ...items.slice(index + 1)];
        this.updateRows(sectionId, withoutRow);
        this.initialRows.update((current) => ({ ...current, [sectionId]: withoutRow(current[sectionId]) }));
        this.keys.update((current) => ({ ...current, [sectionId]: withoutRow(current[sectionId]) }));
    }

    /**
     * Sets the values the host refreshed (for example a task's data after an update), keyed as saved values are: by
     * field id or `variables.<name>`. Each is read by the field's type, as at load; a repeatable section's value gives
     * its rows. Only the given fields change, so what the user typed elsewhere stays: the host passes the values that
     * changed. Constant-value types keep their value.
     *
     * @param values the refreshed values
     */
    refreshValues(values: Record<string, unknown>): void {
        for (const field of this.refreshableFields()) {
            const saved = savedValueFor(values, field);
            if (saved !== undefined) {
                this.setValue(field.id, readFieldValue(field, saved, this.widgets));
            }
        }
        for (const section of this.sections.values()) {
            const rows = values[section.id];
            if (Array.isArray(rows)) {
                this.replaceRows(section, rows);
            }
        }
    }

    /**
     * Sets the given values only on fields still without one (an empty dropdown counts as without one), as today's
     * form does when values are requested only where missing.
     *
     * @param values the values, keyed as saved values are
     */
    fillMissingValues(values: Record<string, unknown>): void {
        for (const field of this.refreshableFields()) {
            const saved = savedValueFor(values, field);
            if (saved !== undefined && isMissingValue(this.values().fields[field.id])) {
                this.setValue(field.id, readFieldValue(field, saved, this.widgets));
            }
        }
    }

    /**
     * Gives the form the process variables the host refreshed (for example a task's variables after an update). They
     * come before the form's own process variables, matched by id or name; conditions reading them follow.
     *
     * @param processVariables the refreshed process variables
     */
    refreshProcessVariables(processVariables: readonly FormVariable[]): void {
        this.refreshedProcessVariables.set(processVariables);
    }

    /**
     * Shows the errors of every field, including fields added later (repeatable section rows), as today's form does
     * when it validates on request (a rule's validate action, an outcome requested on an invalid form).
     */
    showAllErrors(): void {
        this.allErrorsRequested.set(true);
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
        hidden(field, (context) => !this.isOnScreen(definitionOf(context.key()), rowOf(context.pathKeys())));
        readonly(field, (context) => this.isReadOnly(definitionOf(context.key()), rowOf(context.pathKeys())));
        disabled(field, (context) => this.isReadOnly(definitionOf(context.key()), rowOf(context.pathKeys())));
        metadata(field, REQUIRED, (context) => this.withRequiredOverride(definitionOf(context.key())).required);
        metadata(field, TYPED_VALUE_FORMATTING, () => this.isFeatureOn('typedValueFormatting'));
        metadata(field, LOCALE_AMOUNTS, () => this.isFeatureOn('localeAmounts'));
        validate(field, (context) => {
            const definition = this.withRequiredOverride(definitionOf(context.key()));
            const typeValidators = fieldWidget(this.widgets, definition)?.definition.validators ?? [];
            const kind = firstValidationError(definition, context.value(), [...typeValidators, ...(this.options.validators ?? [])]);
            return kind ? validationError(kind, definition) : null;
        });
    }

    private withRequiredOverride(field: FieldDefinition): FieldDefinition {
        const required = this.overrides().required[field.id];
        return required === undefined ? field : { ...field, required };
    }

    private isElementVisible(id: string, condition: VisibilityCondition | null | undefined, row?: RowAddress): boolean {
        return this.overrides().visible[id] ?? this.isConditionMet(condition, row);
    }

    private isConditionMet(condition: VisibilityCondition | null | undefined, row?: RowAddress): boolean {
        return evaluateVisibilityCondition(condition, {
            fieldValue: (reference) => {
                const inRow = row && this.rowConditionValue(reference, row);
                return inRow ? inRow.value : this.conditionValue(reference);
            },
            variableValue: (identifier) => this.variableValue(identifier)
        });
    }

    private variableValue(identifier: string): unknown {
        return resolveVariableValue(identifier, this.definition.variables, this.runtimeVariables(), this.refreshedProcessVariables());
    }

    private conditionValue(reference: string): unknown {
        const id = matchingId(reference, this.fields.keys());
        if (!id || !this.isFieldValid(id)) {
            return undefined;
        }
        return conditionValueOf(this.fields.get(id), reference, this.submissionValues()[id], this.values().fields[id]);
    }

    /**
     * The value a condition in a repeatable section row reads for a field of that same section: the row's own value.
     * Returns `undefined` when the reference isn't a field of the section, so the condition reads the form's field.
     *
     * @param reference the field reference in the condition
     * @param row the row the condition is evaluated in
     * @returns a holder with the row's value, or `undefined`
     */
    private rowConditionValue(reference: string, row: RowAddress): { value: unknown } | undefined {
        const section = this.sections.get(row.sectionId);
        const id =
            section &&
            matchingId(
                reference,
                section.fields.map((field) => field.id)
            );
        if (!id) {
            return undefined;
        }
        const rowValues = this.values().sections[row.sectionId]?.[row.index];
        if (!rowValues || !this.isFieldValid(id, row)) {
            return { value: undefined };
        }
        const submittedRow = (this.submissionValues()[row.sectionId] as FieldValues[] | undefined)?.[row.index];
        const definition = section.fields.find((field) => field.id === id);
        return { value: conditionValueOf(definition, reference, submittedRow?.[id], rowValues[id]) };
    }

    private setOverride(kind: keyof RuleOverrides, fieldId: string, enabled: boolean): void {
        this.overrides.update((current) => ({ ...current, [kind]: { ...current[kind], [fieldId]: enabled } }));
    }

    private newRowKeys(count: number): number[] {
        return [...Array(count).keys()].map(() => this.nextRowKey++);
    }

    private startingRows(section: SectionDefinition): FieldValues[] {
        return section.savedRows.length
            ? section.savedRows.map((saved) => ({ ...this.emptyRow(section), ...structuredClone(saved) }))
            : Array.from({ length: section.initialRows }, () => this.emptyRow(section));
    }

    private refreshableFields(): FieldDefinition[] {
        return [...this.fields.values()].filter((field) => !CONSTANT_VALUE_FIELD_TYPES.has(field.type));
    }

    private replaceRows(section: SectionDefinition, savedRows: Record<string, unknown>[]): void {
        const rows = savedRows.map((saved) => ({ ...this.emptyRow(section), ...readSavedRow(section.fields, saved, this.widgets) }));
        this.updateRows(section.id, () => rows);
        this.initialRows.update((current) => ({ ...current, [section.id]: [...rows.keys()].map((index) => index < section.initialRows) }));
        this.keys.update((current) => ({ ...current, [section.id]: this.newRowKeys(rows.length) }));
    }

    private emptyRow(section: SectionDefinition): FieldValues {
        return Object.fromEntries(section.fields.map((field) => [field.id, structuredClone(field.initialValue ?? null)]));
    }

    private updateRows(sectionId: string, update: (rows: FieldValues[]) => FieldValues[]): void {
        this.values.update((model) => ({ ...model, sections: { ...model.sections, [sectionId]: update(model.sections[sectionId]) } }));
    }
}

const PATTERN_ERROR = 'pattern';

/**
 * Builds a field's validation error. A pattern error carries the field's own message when the form author wrote one.
 *
 * @param kind the error kind
 * @param definition the field
 * @returns the error
 */
const validationError = (kind: string, definition: FieldDefinition): { kind: string; message?: string } =>
    kind === PATTERN_ERROR && definition.customValidationMessage ? { kind, message: definition.customValidationMessage } : { kind };

const SECTIONS_KEY = 'sections';

/**
 * Finds the id a condition reference points at, ignoring case and the `_LABEL` suffix, as today's engine does.
 *
 * @param reference the field reference in the condition
 * @param ids the candidate field ids
 * @returns the matching id, or `undefined`
 */
const matchingId = (reference: string, ids: Iterable<string>): string | undefined => {
    const wanted = referencedFieldId(reference).toUpperCase();
    return [...ids].find((candidate) => candidate.toUpperCase() === wanted);
};

/**
 * Returns the repeatable section row a field's path is in, if any.
 *
 * @param pathKeys the field's path in the values model, for example `['sections', 'lines', '0', 'item']`
 * @returns the row address, or `undefined` for a field outside repeatable sections
 */
const rowOf = (pathKeys: readonly string[]): RowAddress | undefined =>
    pathKeys[0] === SECTIONS_KEY ? { sectionId: pathKeys[1], index: Number(pathKeys[2]) } : undefined;

/**
 * Whether a field value counts as missing: no value, an empty text or list, or a dropdown's empty option.
 *
 * @param value the field value
 * @returns `true` when the value is missing
 */
const isMissingValue = (value: unknown): boolean =>
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && (value as { id?: string }).id === EMPTY_OPTION_ID);
