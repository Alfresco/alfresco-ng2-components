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

import { FormFieldModel } from '../components/widgets/core/form-field.model';
import { FormFieldTypes } from '../components/widgets/core/form-field-types';
import type { FormModel } from '../components/widgets/core/form.model';
import {
    captureAuthoredDefinition,
    commitFormState,
    FormResetItemResult,
    FormResetOptions,
    FormResetResult,
    FormWriteContext,
    getAuthoredDefault,
    hasFormStateBinding,
    formStateCommits
} from './form-state.model';

const RESETTABLE_TYPES = [
    FormFieldTypes.TEXT,
    FormFieldTypes.STRING,
    FormFieldTypes.MULTILINE_TEXT,
    FormFieldTypes.INTEGER,
    FormFieldTypes.DECIMAL,
    FormFieldTypes.AMOUNT,
    FormFieldTypes.BOOLEAN,
    FormFieldTypes.DATE,
    FormFieldTypes.DATETIME,
    FormFieldTypes.DROPDOWN,
    FormFieldTypes.RADIO_BUTTONS,
    FormFieldTypes.PEOPLE,
    FormFieldTypes.FUNCTIONAL_GROUP,
    FormFieldTypes.UPLOAD
];

const DISPLAY_ONLY_TYPES = [
    FormFieldTypes.ALFRESCO_FILE_VIEWER,
    FormFieldTypes.PROPERTIES_VIEWER,
    FormFieldTypes.VIEWER,
    FormFieldTypes.DATA_TABLE,
    FormFieldTypes.JSON,
    FormFieldTypes.DISPLAY_RICH_TEXT,
    FormFieldTypes.BUTTON
];

const isDisplayOnly = (field: FormFieldModel): boolean => DISPLAY_ONLY_TYPES.includes(field.type);

const isPreserved = (field: FormFieldModel): boolean =>
    field.readOnly ||
    (!isStructural(field) && FormFieldTypes.isReadOnlyType(field.type)) ||
    FormFieldTypes.isConstantValueType(field.type) ||
    isDisplayOnly(field);

const children = (field: FormFieldModel): FormFieldModel[] =>
    (field.rows.length ? field.rows.flatMap((row) => row.columns) : field.columns).flatMap((column) => column.fields);

const isStructural = (field: FormFieldModel): boolean => FormFieldTypes.isContainerType(field.type) || FormFieldTypes.isSectionType(field.type);

/**
 * Captures reset eligibility, including zero-row authored templates.
 *
 * @param form Exact live model before asynchronous reset work
 * @returns Exact fields eligible at reset entry
 */
export function captureFormResetEditability(form: FormModel): ReadonlySet<FormFieldModel> {
    const visited = new Set<FormFieldModel>();
    const editable = new Set<FormFieldModel>();
    const visit = (field: FormFieldModel) => {
        if (!field || visited.has(field)) {
            return;
        }
        visited.add(field);
        if (!form.readOnly && !isPreserved(field)) {
            editable.add(field);
        }
        for (const column of [...field.columns, ...field.rows.flatMap((row) => row.columns)]) {
            column.fields.forEach(visit);
        }
    };
    form.fields.forEach((entry) => visit(entry instanceof FormFieldModel ? entry : entry.field));
    return editable;
}

/**
 * Checks whether rebuilding a repeatable section would discard state that reset must keep.
 * Display-only widgets hold no user state. A host-handled child blocks only while it still holds content.
 *
 * @param field Repeatable section or structural descendant
 * @param handledFields Fields whose content the host has already reset
 * @returns Whether any descendant must be retained
 */
const hasRetainedDescendant = (field: FormFieldModel, handledFields?: ReadonlySet<FormFieldModel>): boolean =>
    children(field).some(
        (child) =>
            !isDisplayOnly(child) &&
            (isPreserved(child) ||
                (handledFields?.has(child)
                    ? hasContentReferences(child.value)
                    : (child.type === FormFieldTypes.UPLOAD && hasContentReferences(child.value)) ||
                      (!isStructural(child) && child.type !== FormFieldTypes.REPEATABLE_SECTION && !RESETTABLE_TYPES.includes(child.type)) ||
                      hasRetainedDescendant(child, handledFields)))
    );

const hasContentReferences = (value: unknown): boolean => (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined);

const parseDefault = (field: FormFieldModel, value: unknown): unknown => {
    if ((field.type === FormFieldTypes.DATE && value === 'today') || (field.type === FormFieldTypes.DATETIME && value === 'now')) {
        value = Date.now();
    }
    const definition = { ...field.json, value };
    const parsed = field.parseValue(definition);
    const invalidNumber =
        [FormFieldTypes.INTEGER, FormFieldTypes.DECIMAL, FormFieldTypes.AMOUNT].includes(field.type) &&
        parsed !== null &&
        !Number.isFinite(Number(parsed));
    const invalidDate =
        [FormFieldTypes.DATE, FormFieldTypes.DATETIME].includes(field.type) &&
        parsed !== null &&
        (!(parsed instanceof Date) || !Number.isFinite(parsed.getTime()));
    const invalidOption =
        [FormFieldTypes.DROPDOWN, FormFieldTypes.RADIO_BUTTONS].includes(field.type) &&
        typeof parsed === 'string' &&
        !field.options.some((option) => option.id === parsed || option.name === parsed);
    return invalidNumber || invalidDate || invalidOption ? field.parseValue({ ...definition, value: null }) : parsed;
};

type RowDefaultNormalizer = (definition: Record<string, unknown>, row?: Record<string, unknown>) => unknown;

const hasOwnValue = (row: Record<string, unknown>, id: unknown): boolean => Object.prototype.hasOwnProperty.call(row, String(id));

const descendants = (field: FormFieldModel): FormFieldModel[] => children(field).flatMap((child) => [child, ...descendants(child)]);

const initialRows = (section: FormFieldModel, value: unknown): Record<string, unknown>[] =>
    Array.isArray(value) ? value : Array.from({ length: section.json.params?.initialNumberOfRows ?? 0 }, () => ({}));

const authoredRowsOf = (current: FormFieldModel, target: FormFieldModel, rows: Record<string, unknown>[]): Record<string, unknown>[] => {
    for (const child of children(current)) {
        if (child === target) {
            return rows;
        }
        if (descendants(child).includes(target)) {
            const nested =
                child.type === FormFieldTypes.REPEATABLE_SECTION
                    ? rows.flatMap((row) =>
                          initialRows(child, hasOwnValue(row, child.json.id) ? row[child.json.id] : getAuthoredDefault(child).value)
                      )
                    : rows;
            return authoredRowsOf(child, target, nested);
        }
    }
    return [];
};

const rowDefaultNormalizer =
    (existing: FormFieldModel[], contextualDefaults: ReadonlyMap<string, unknown>): RowDefaultNormalizer =>
    (definition, row) => {
        const target = existing.find((child) => child.json.id === definition.id);
        const literal = row && hasOwnValue(row, definition.id);
        const authored = captureAuthoredDefinition(definition);
        let initial = literal ? row[String(definition.id)] : authored.value;
        if (!literal && !Object.prototype.hasOwnProperty.call(authored, 'value') && authored.selectLoggedUser === true) {
            initial = contextualDefaults.get(String(definition.id));
        }
        const parsed = target ? parseDefault(target, initial ?? null) : initial;
        return parsed instanceof Date ? parsed.getTime() : parsed;
    };

const prepareTemplateFields = (fields: Record<string, unknown>, normalize: RowDefaultNormalizer): Record<string, unknown> =>
    Object.fromEntries(
        Object.entries(fields).map(([key, definitions]) => [
            key,
            (definitions as Record<string, unknown>[]).map((definition) => {
                const captured = captureAuthoredDefinition(definition);
                captureAuthoredDefinition(captured);
                if (captured.fields) {
                    captured.fields = prepareTemplateFields(captured.fields as Record<string, unknown>, normalize);
                } else {
                    captured.value = normalize(definition);
                }
                return captured;
            })
        ])
    );

const normalizeRowValues = (
    definitions: Record<string, unknown>,
    row: Record<string, unknown>,
    normalize: RowDefaultNormalizer
): Record<string, unknown> => {
    const normalized = { ...row };
    for (const entries of Object.values(definitions)) {
        for (const definition of entries as Record<string, unknown>[]) {
            const id = String(definition.id);
            if (definition.type === FormFieldTypes.REPEATABLE_SECTION && Array.isArray(row[id])) {
                normalized[id] = (row[id] as Record<string, unknown>[]).map((nested) =>
                    normalizeRowValues(definition.fields as Record<string, unknown>, nested, normalize)
                );
            } else if (definition.fields) {
                Object.assign(normalized, normalizeRowValues(definition.fields as Record<string, unknown>, row, normalize));
            } else if (hasOwnValue(row, id)) {
                normalized[id] = normalize(definition, row);
            }
        }
    }
    return normalized;
};

/**
 * Resets the exact live model without publishing ordinary edit events.
 *
 * @param form Exact live model
 * @param context Invocation ownership
 * @param options Optional contextual principal resolver
 * @returns Independent item results and aggregate status
 */
export async function resetFormToDefaults(form: FormModel, context: FormWriteContext, options: FormResetOptions = {}): Promise<FormResetResult> {
    const items: FormResetItemResult[] = [];
    const contextualDefaults = new Map<string, unknown>();
    const isCurrent = () => context?.form === form && hasFormStateBinding(form, context.renderer, context.generation) && context.isCurrent();
    const record = (field: FormFieldModel, status: FormResetItemResult['status'], reason?: FormResetItemResult['reason']) =>
        items.push({ field, fieldId: field.id, status, ...(reason ? { reason } : {}) });

    const resolveContextualDefault = async (field: FormFieldModel): Promise<unknown> => {
        try {
            return await options.resolveContextualDefault?.(field, context);
        } catch {
            return undefined;
        }
    };

    const resolveRowContextualDefaults = async (section: FormFieldModel, existing: FormFieldModel[], value: unknown): Promise<boolean> => {
        for (const target of existing.filter((child) => child.type === FormFieldTypes.PEOPLE)) {
            const authored = getAuthoredDefault(target);
            const rows = authoredRowsOf(section, target, initialRows(section, value));
            const missingRowLiteral = rows.some((row) => !hasOwnValue(row, target.json.id));
            if (!authored.hasValue && authored.selectLoggedUser && missingRowLiteral && !contextualDefaults.has(target.json.id)) {
                const resolved = await resolveContextualDefault(target);
                if (!isCurrent()) {
                    return false;
                }
                if (resolved == null) {
                    record(target, 'failed', 'contextual-default-unavailable');
                    record(section, 'failed', 'reset-shape-retained');
                    return false;
                }
                contextualDefaults.set(target.json.id, resolved);
            }
        }
        return true;
    };

    const prepareRepeatableReset = async (
        section: FormFieldModel,
        repeatableDefinition: Record<string, unknown>,
        value: unknown
    ): Promise<{ value: unknown } | undefined> => {
        const start = items.length;
        for (const child of children(section)) {
            await reset(child, Array.isArray(value) ? value[child.parent?.rowIndex ?? 0] : undefined);
        }
        if (items.slice(start).some((item) => item.status === 'failed')) {
            record(section, 'failed', 'reset-shape-retained');
            return undefined;
        }
        const existing = descendants(section);
        if (!(await resolveRowContextualDefaults(section, existing, value))) {
            return undefined;
        }
        const normalize = rowDefaultNormalizer(existing, contextualDefaults);
        repeatableDefinition.fields = prepareTemplateFields(repeatableDefinition.fields as Record<string, unknown>, normalize);
        return {
            value: Array.isArray(value)
                ? value.map((row) => normalizeRowValues(repeatableDefinition.fields as Record<string, unknown>, row, normalize))
                : value
        };
    };

    const publishRowCommits = (field: FormFieldModel) => {
        if (isCurrent()) {
            formStateCommits.next({ field, context });
            children(field).forEach(publishRowCommits);
        }
    };

    const reset = async (field: FormFieldModel, authoredRow?: Record<string, unknown>): Promise<void> => {
        if (!isCurrent()) {
            return;
        }
        if (options.handledFields?.has(field)) {
            return;
        }
        if (options.editableFields ? !options.editableFields.has(field) : form.readOnly || isPreserved(field)) {
            record(field, 'skipped');
            return;
        }
        if (isStructural(field)) {
            for (const child of children(field)) {
                await reset(child, authoredRow);
            }
            return;
        }
        const snapshot = getAuthoredDefault(field);
        const hasRowValue = authoredRow && Object.prototype.hasOwnProperty.call(authoredRow, field.json.id);
        let value = hasRowValue ? authoredRow[field.json.id] : snapshot.hasValue ? snapshot.value : null;
        if (field.type === FormFieldTypes.REPEATABLE_SECTION && hasRetainedDescendant(field, options.handledFields)) {
            record(field, 'failed', 'reset-shape-retained');
            for (const child of children(field)) {
                await reset(child, Array.isArray(value) ? value[child.parent?.rowIndex ?? 0] : undefined);
            }
            return;
        }
        if (field.type !== FormFieldTypes.REPEATABLE_SECTION && !RESETTABLE_TYPES.includes(field.type)) {
            record(field, 'failed', 'unsupported-category');
            return;
        }
        if (field.type === FormFieldTypes.UPLOAD && hasContentReferences(field.value)) {
            record(field, 'failed', 'content-policy-unavailable');
            return;
        }
        if (field.type === FormFieldTypes.PEOPLE && !hasRowValue && !snapshot.hasValue && snapshot.selectLoggedUser) {
            value = await resolveContextualDefault(field);
            if (!isCurrent()) {
                return;
            }
            if (value === undefined || value === null) {
                record(field, 'failed', 'contextual-default-unavailable');
                return;
            }
            contextualDefaults.set(field.json.id, value);
        }
        try {
            const repeatableDefinition = field.type === FormFieldTypes.REPEATABLE_SECTION ? captureAuthoredDefinition(field.json) : undefined;
            if (repeatableDefinition) {
                const prepared = await prepareRepeatableReset(field, repeatableDefinition, value);
                if (!prepared) {
                    return;
                }
                value = prepared.value;
            }
            const parsed = parseDefault(field, value);
            if (!isCurrent()) {
                return;
            }
            if (commitFormState(field, parsed, context, repeatableDefinition)) {
                record(field, 'applied');
                if (repeatableDefinition) {
                    children(field).forEach(publishRowCommits);
                }
            }
        } catch {
            record(field, 'failed', 'application-failed');
        }
    };

    if (isCurrent()) {
        for (const root of form.fields) {
            await reset(root instanceof FormFieldModel ? root : root.field);
        }
    }
    const failed = items.some((item) => item.status === 'failed');
    const applied = items.some((item) => item.status === 'applied');
    return { context, items, status: !isCurrent() ? 'unavailable' : failed ? (applied ? 'partial' : 'failed') : 'complete' };
}
