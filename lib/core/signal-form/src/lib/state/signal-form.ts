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

import { computed, DestroyRef, Injector, Signal, signal, WritableSignal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
import type {
    FieldDefinition,
    FieldValue,
    FormDefinition,
    FormVariable,
    LayoutDefinition,
    OutcomeDefinition,
    SectionDefinition,
    SubmittedValue,
    TabDefinition,
    VisibilityCondition
} from '../definition/form-definition.interface';
import { CONSTANT_VALUE_FIELD_TYPES, EMPTY_OPTION_ID } from '../definition/form-field-types';
import { readSavedRow, readValueForField, savedValueFor, toFieldValue } from '../definition/field-value-readers';
import { displayFieldValue } from '../display/field-display-value';
import { FieldOperandValue, fieldOperandValue, referencedFieldId } from '../expressions/field-operand';
import { findVariable, resolveVariableValue } from '../expressions/form-variables';
import { resolveTextExpressions } from '../expressions/text-expressions';
import { evaluateVisibilityCondition } from '../expressions/visibility-condition';
import { BUILT_IN_FIELD_TYPE_RESOLVER } from '../field-types/built-in-field-types';
import type { FieldTypeResolver, FieldValidator } from '../field-types/field-type-definition.interface';
import { resolveFieldType } from '../field-types/field-type-resolution';
import { isBlank, isRecord } from '../form-value-guards';
import { CurrentFormValues, FieldValues, SubmittedValues, toSubmittedValues } from '../submission/submission-values';
import { firstValidationError } from '../validation/field-validators';
import { LOCALE_AMOUNTS, TYPED_VALUE_FORMATTING } from './field-metadata';
import { SignalFormEvent, SignalFormEventType } from './signal-form-event';

export interface SignalFormFeatures {
    typedValueFormatting?: boolean | Signal<boolean>;
    tabErrorIndicators?: boolean | Signal<boolean>;
    localeAmounts?: boolean | Signal<boolean>;
}

export interface SignalFormOptions {
    readOnly?: boolean;
    features?: SignalFormFeatures;
    validators?: readonly FieldValidator[];
}

export interface RowAddress {
    sectionId: string;
    index: number;
}

export interface TextResolutionOptions {
    formatValues?: boolean;
    escapeHtml?: boolean;
}

interface RuleOverrides {
    visible: Record<string, boolean>;
    disabled: Record<string, boolean>;
    required: Record<string, boolean>;
    outcomes: Record<string, boolean>;
}

interface FieldValidationError {
    kind: string;
    message?: string;
}

type FieldSchemaPath = SchemaPath<FieldValue, SchemaPathRules.Supported, PathKind.Child>;

export class SignalForm {
    readonly fieldTree: FieldTree<CurrentFormValues>;
    readonly valid: Signal<boolean>;
    readonly visibleTabs: Signal<TabDefinition[]>;
    readonly submittedValues: Signal<SubmittedValues>;

    private readonly fields: Map<string, FieldDefinition>;
    private readonly sections: Map<string, SectionDefinition>;
    private readonly tabs: Map<string, TabDefinition>;
    private readonly values: WritableSignal<CurrentFormValues>;
    private readonly overrides = signal<RuleOverrides>({ visible: {}, disabled: {}, required: {}, outcomes: {} });
    private readonly eventStream = new Subject<SignalFormEvent>();
    private readonly outcomeRequestStream = new Subject<OutcomeDefinition>();
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
        private readonly fieldTypes: FieldTypeResolver = BUILT_IN_FIELD_TYPE_RESOLVER
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
        this.submittedValues = computed(() => toSubmittedValues(this.fields, this.sections, this.values(), this.fieldTypes));
        this.fieldTree = form(this.values, (root) => this.applyRules(root), { injector });
        this.valid = computed(() => this.fieldTree().valid());
        this.visibleTabs = computed(() => definition.tabs.filter((tab) => this.isTabVisible(tab.id)));
        injector.get(DestroyRef).onDestroy(() => {
            this.eventStream.complete();
            this.outcomeRequestStream.complete();
        });
    }

    readonly events: Observable<SignalFormEvent> = this.eventStream.asObservable();

    readonly outcomeRequests: Observable<OutcomeDefinition> = this.outcomeRequestStream.asObservable();

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
    fieldNode(fieldId: string, row?: RowAddress): FieldTree<FieldValue> | undefined {
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
     * @param options how the values are shown: typed values formatted as text, HTML-escaped
     * @returns the resolved text
     */
    resolveText(text: string, options: TextResolutionOptions = {}): string {
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
    displayValue(definition: FieldDefinition, value: FieldValue): string {
        return displayFieldValue(this.fieldTypes, definition, value);
    }

    isOutcomeConditionMet(outcome: OutcomeDefinition): boolean {
        return this.overrides().outcomes[outcome.id] ?? this.isConditionMet(outcome.visibilityCondition);
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

    /**
     * Reads a value given as JSON, for example by a form rule, the way the field's type reads its saved value: a date
     * text becomes a date, a multi-select takes its options. The field's definition is left as it is.
     *
     * @param fieldId the field
     * @param value the JSON value
     * @param row the repeatable section row, for a field of a repeatable section
     * @returns the value the field holds for it
     */
    readValue(fieldId: string, value: unknown, row?: RowAddress): FieldValue {
        const definition = this.fieldDefinition(fieldId, row?.sectionId);
        return definition ? readValueForField({ ...definition, options: [...definition.options] }, value, this.fieldTypes) : toFieldValue(value);
    }

    setValue(fieldId: string, value: FieldValue, row?: RowAddress): void {
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
        this.notify({ type: SignalFormEventType.RowCountChanged, fieldId: sectionId });
    }

    removeRow(sectionId: string, index: number): void {
        if (this.isSectionReadOnly(sectionId)) {
            return;
        }
        const withoutRow = <TItem>(items: TItem[]): TItem[] => [...items.slice(0, index), ...items.slice(index + 1)];
        this.updateRows(sectionId, withoutRow);
        this.initialRows.update((current) => ({ ...current, [sectionId]: withoutRow(current[sectionId]) }));
        this.keys.update((current) => ({ ...current, [sectionId]: withoutRow(current[sectionId]) }));
        this.notify({ type: SignalFormEventType.RowCountChanged, fieldId: sectionId });
    }

    /**
     * Sets the values the host refreshed (for example a task's data after an update), keyed as saved values are: by
     * field id or `variables.<name>`. Each is read by the field's type, as at load; a repeatable section's value gives
     * its rows. Only the given fields change, so what the user typed elsewhere stays. Constant-value types keep their
     * value.
     *
     * @param values the refreshed values
     */
    refreshValues(values: Record<string, unknown>): void {
        for (const field of this.refreshableFields()) {
            const saved = savedValueFor(values, field);
            if (saved !== undefined) {
                this.setValue(field.id, readValueForField(field, saved, this.fieldTypes));
            }
        }
        for (const section of this.sections.values()) {
            const rows = values[section.id];
            if (Array.isArray(rows)) {
                this.replaceRows(section, rows);
            }
        }
        this.notify({ type: SignalFormEventType.DataRefreshed });
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
                this.setValue(field.id, readValueForField(field, saved, this.fieldTypes));
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

    /**
     * Shows or hides an outcome whatever its visibility condition, as a form rule does.
     *
     * @param outcomeId the outcome
     * @param visible whether the outcome is shown
     */
    setOutcomeVisibility(outcomeId: string, visible: boolean): void {
        this.setOverride('outcomes', outcomeId, visible);
    }

    /**
     * Asks the host to run an outcome as if it were clicked, as a form rule does to submit the form. The host checks
     * it as for a click: a read-only form ignores it, and an invalid form shows its errors instead.
     *
     * @param outcomeId the outcome
     * @returns `false` when the form has no such outcome
     */
    requestOutcome(outcomeId: string): boolean {
        const outcome = this.definition.outcomes.find((candidate) => candidate.id === outcomeId);
        if (outcome) {
            this.outcomeRequestStream.next(outcome);
        }
        return !!outcome;
    }

    /**
     * Tells the form's listeners that something happened on a field, for example a widget click.
     *
     * @param event the event
     */
    notify(event: SignalFormEvent): void {
        this.eventStream.next(event);
    }

    setVariable(variableId: string, value: unknown): void {
        const variable = findVariable(variableId, this.definition.variables);
        if (variable) {
            this.runtimeVariables.update((values) => ({ ...values, [variable.id ?? variable.name]: value }));
        }
    }

    /**
     * Returns the value of a form or process variable, by id or name: the value a rule set, the process value the host
     * refreshed, or the variable's own value.
     *
     * @param identifier the variable id or name
     * @returns the value, `undefined` for an unknown variable
     */
    variableValue(identifier: string): unknown {
        return resolveVariableValue(identifier, this.definition.variables, this.runtimeVariables(), this.refreshedProcessVariables());
    }

    private applyRules(root: SchemaPathTree<CurrentFormValues>): void {
        applyEach(root.fields, (field) => this.applyFieldRules(field, (id) => this.fields.get(id)));
        for (const section of this.sections.values()) {
            const sectionFields = new Map(section.fields.map((field) => [field.id, field]));
            applyEach(root.sections[section.id], (row) => applyEach(row, (field) => this.applyFieldRules(field, (id) => sectionFields.get(id))));
        }
    }

    private applyFieldRules(field: FieldSchemaPath, definitionOf: (id: string) => FieldDefinition): void {
        hidden(field, (context) => !this.isOnScreen(definitionOf(context.key()), rowOf(context.pathKeys())));
        readonly(field, (context) => this.isReadOnly(definitionOf(context.key()), rowOf(context.pathKeys())));
        disabled(field, (context) => this.isReadOnly(definitionOf(context.key()), rowOf(context.pathKeys())));
        metadata(field, REQUIRED, (context) => this.withRequiredOverride(definitionOf(context.key())).required);
        metadata(field, TYPED_VALUE_FORMATTING, () => this.isFeatureOn('typedValueFormatting'));
        metadata(field, LOCALE_AMOUNTS, () => this.isFeatureOn('localeAmounts'));
        validate(field, (context) => {
            const definition = this.withRequiredOverride(definitionOf(context.key()));
            const typeValidators = resolveFieldType(this.fieldTypes, definition)?.definition.validators ?? [];
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
                const inRow = row && this.rowOperandValue(reference, row);
                return inRow ? inRow.value : this.operandValue(reference);
            },
            variableValue: (identifier) => this.variableValue(identifier)
        });
    }

    private operandValue(reference: string): FieldOperandValue {
        const id = matchingId(reference, this.fields.keys());
        if (!id || !this.isFieldValid(id)) {
            return undefined;
        }
        return fieldOperandValue(this.fields.get(id), reference, this.submittedValues()[id], this.values().fields[id]);
    }

    private rowOperandValue(reference: string, row: RowAddress): { value: FieldOperandValue } | undefined {
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
        const definition = section.fields.find((field) => field.id === id);
        return { value: fieldOperandValue(definition, reference, this.submittedRowValue(row, id), rowValues[id]) };
    }

    private submittedRowValue(row: RowAddress, fieldId: string): SubmittedValue {
        const rows = this.submittedValues()[row.sectionId];
        const submittedRow = Array.isArray(rows) ? rows[row.index] : undefined;
        return isRecord(submittedRow) ? toFieldValue(submittedRow[fieldId]) : undefined;
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
        return [...this.fields.values()].filter(isRefreshable);
    }

    private replaceRows(section: SectionDefinition, savedRows: Record<string, unknown>[]): void {
        const refreshableFields = section.fields.filter(isRefreshable);
        const rows = savedRows.map((saved) => ({ ...this.emptyRow(section), ...readSavedRow(refreshableFields, saved, this.fieldTypes) }));
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
const SECTIONS_KEY = 'sections';

const validationError = (kind: string, definition: FieldDefinition): FieldValidationError =>
    kind === PATTERN_ERROR && definition.customValidationMessage ? { kind, message: definition.customValidationMessage } : { kind };

const matchingId = (reference: string, ids: Iterable<string>): string | undefined => {
    const wanted = referencedFieldId(reference).toUpperCase();
    return [...ids].find((candidate) => candidate.toUpperCase() === wanted);
};

const rowOf = (pathKeys: readonly string[]): RowAddress | undefined =>
    pathKeys[0] === SECTIONS_KEY ? { sectionId: pathKeys[1], index: Number(pathKeys[2]) } : undefined;

const isRefreshable = (field: FieldDefinition): boolean => !CONSTANT_VALUE_FIELD_TYPES.has(field.type);

const isMissingValue = (value: FieldValue): boolean =>
    isBlank(value) || (Array.isArray(value) && value.length === 0) || (isRecord(value) && value['id'] === EMPTY_OPTION_ID);
