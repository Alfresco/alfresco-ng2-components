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

import type { FormFieldModel } from '../components/widgets/core/form-field.model';
import { FormFieldTypes } from '../components/widgets/core/form-field-types';
import { captureAuthoredDefinition, getAuthoredDefault } from './form-authored-state.model';
import type { AuthoredDefault } from './form-state.interface';
import { children, descendants } from './form-reset-eligibility';

export type AuthoredRow = Record<string, unknown>;

type FieldDefinitions = Record<string, unknown>;

export type RowDefaultNormalizer = (definition: Record<string, unknown>, row?: AuthoredRow) => unknown;

export interface AuthoredFieldValue {
    readonly snapshot: AuthoredDefault;
    readonly hasRowValue: boolean;
    readonly value: unknown;
}

const NUMERIC_TYPES = [FormFieldTypes.INTEGER, FormFieldTypes.DECIMAL, FormFieldTypes.AMOUNT];
const DATE_TYPES = [FormFieldTypes.DATE, FormFieldTypes.DATETIME];
const OPTION_TYPES = [FormFieldTypes.DROPDOWN, FormFieldTypes.RADIO_BUTTONS];

const isRelativeDateKeyword = (field: FormFieldModel, value: unknown): boolean =>
    (field.type === FormFieldTypes.DATE && value === 'today') || (field.type === FormFieldTypes.DATETIME && value === 'now');

const isInvalidNumber = (field: FormFieldModel, parsed: unknown): boolean =>
    NUMERIC_TYPES.includes(field.type) && parsed !== null && !Number.isFinite(Number(parsed));

const isInvalidDate = (field: FormFieldModel, parsed: unknown): boolean =>
    DATE_TYPES.includes(field.type) && parsed !== null && (!(parsed instanceof Date) || !Number.isFinite(parsed.getTime()));

const isUnknownOption = (field: FormFieldModel, parsed: unknown): boolean =>
    OPTION_TYPES.includes(field.type) &&
    typeof parsed === 'string' &&
    !field.options.some((option) => option.id === parsed || option.name === parsed);

const isInvalidDefault = (field: FormFieldModel, parsed: unknown): boolean =>
    isInvalidNumber(field, parsed) || isInvalidDate(field, parsed) || isUnknownOption(field, parsed);

export const parseDefault = (field: FormFieldModel, value: unknown): unknown => {
    const definition = { ...field.json, value: isRelativeDateKeyword(field, value) ? Date.now() : value };
    const parsed = field.parseValue(definition);
    if (isInvalidDefault(field, parsed)) {
        return field.parseValue({ ...definition, value: null });
    }
    return parsed;
};

export const hasOwnValue = (row: AuthoredRow, id: unknown): boolean => Object.prototype.hasOwnProperty.call(row, String(id));

export const authoredFieldValue = (field: FormFieldModel, authoredRow?: AuthoredRow): AuthoredFieldValue => {
    const snapshot = getAuthoredDefault(field);
    const hasRowValue = !!authoredRow && hasOwnValue(authoredRow, field.json.id);
    if (hasRowValue) {
        return { snapshot, hasRowValue, value: authoredRow[field.json.id] };
    }
    return { snapshot, hasRowValue, value: snapshot.hasValue ? snapshot.value : null };
};

export const requiresContextualDefault = (field: FormFieldModel, authored: AuthoredFieldValue): boolean =>
    field.type === FormFieldTypes.PEOPLE && !authored.hasRowValue && !authored.snapshot.hasValue && authored.snapshot.selectLoggedUser;

export const authoredRowFor = (value: unknown, child: FormFieldModel): AuthoredRow | undefined =>
    Array.isArray(value) ? value[child.parent?.rowIndex ?? 0] : undefined;

export const initialRows = (section: FormFieldModel, value: unknown): AuthoredRow[] => {
    if (Array.isArray(value)) {
        return value;
    }
    return Array.from({ length: section.json.params?.initialNumberOfRows ?? 0 }, () => ({}));
};

const sectionRowValue = (section: FormFieldModel, row: AuthoredRow): unknown => {
    if (hasOwnValue(row, section.json.id)) {
        return row[section.json.id];
    }
    return getAuthoredDefault(section).value;
};

const rowsWithin = (child: FormFieldModel, rows: AuthoredRow[]): AuthoredRow[] => {
    if (child.type !== FormFieldTypes.REPEATABLE_SECTION) {
        return rows;
    }
    return rows.flatMap((row) => initialRows(child, sectionRowValue(child, row)));
};

export const authoredRowsOf = (current: FormFieldModel, target: FormFieldModel, rows: AuthoredRow[]): AuthoredRow[] => {
    for (const child of children(current)) {
        if (child === target) {
            return rows;
        }
        if (descendants(child).includes(target)) {
            return authoredRowsOf(child, target, rowsWithin(child, rows));
        }
    }
    return [];
};

const usesContextualDefault = (authored: Record<string, unknown>): boolean =>
    !Object.prototype.hasOwnProperty.call(authored, 'value') && authored.selectLoggedUser === true;

const initialRowValue = (
    definition: Record<string, unknown>,
    row: AuthoredRow | undefined,
    contextualDefaults: ReadonlyMap<string, unknown>
): unknown => {
    const hasLiteral = row && hasOwnValue(row, definition.id);
    const authored = captureAuthoredDefinition(definition);
    if (hasLiteral) {
        return row[String(definition.id)];
    }
    if (usesContextualDefault(authored)) {
        return contextualDefaults.get(String(definition.id));
    }
    return authored.value;
};

const parseRowDefault = (target: FormFieldModel | undefined, initial: unknown): unknown => (target ? parseDefault(target, initial ?? null) : initial);

const toSerializableDate = (value: unknown): unknown => (value instanceof Date ? value.getTime() : value);

export const rowDefaultNormalizer =
    (existing: FormFieldModel[], contextualDefaults: ReadonlyMap<string, unknown>): RowDefaultNormalizer =>
    (definition, row) => {
        const target = existing.find((child) => child.json.id === definition.id);
        const initial = initialRowValue(definition, row, contextualDefaults);
        return toSerializableDate(parseRowDefault(target, initial));
    };

const prepareTemplateDefinition = (definition: Record<string, unknown>, normalize: RowDefaultNormalizer): Record<string, unknown> => {
    const captured = captureAuthoredDefinition(definition);
    captureAuthoredDefinition(captured);
    if (captured.fields) {
        captured.fields = prepareTemplateFields(captured.fields as FieldDefinitions, normalize);
    } else {
        captured.value = normalize(definition);
    }
    return captured;
};

export const prepareTemplateFields = (fields: FieldDefinitions, normalize: RowDefaultNormalizer): FieldDefinitions =>
    Object.fromEntries(
        Object.entries(fields).map(([key, definitions]) => [
            key,
            (definitions as Record<string, unknown>[]).map((definition) => prepareTemplateDefinition(definition, normalize))
        ])
    );

const normalizeDefinitionValue = (
    normalized: AuthoredRow,
    definition: Record<string, unknown>,
    row: AuthoredRow,
    normalize: RowDefaultNormalizer
): void => {
    const id = String(definition.id);
    if (definition.type === FormFieldTypes.REPEATABLE_SECTION && Array.isArray(row[id])) {
        normalized[id] = (row[id] as AuthoredRow[]).map((nested) => normalizeRowValues(definition.fields as FieldDefinitions, nested, normalize));
        return;
    }
    if (definition.fields) {
        Object.assign(normalized, normalizeRowValues(definition.fields as FieldDefinitions, row, normalize));
        return;
    }
    if (hasOwnValue(row, id)) {
        normalized[id] = normalize(definition, row);
    }
};

export const normalizeRowValues = (definitions: FieldDefinitions, row: AuthoredRow, normalize: RowDefaultNormalizer): AuthoredRow => {
    const normalized = { ...row };
    for (const entries of Object.values(definitions)) {
        for (const definition of entries as Record<string, unknown>[]) {
            normalizeDefinitionValue(normalized, definition, row, normalize);
        }
    }
    return normalized;
};

export const normalizeSectionValue = (definition: Record<string, unknown>, value: unknown, normalize: RowDefaultNormalizer): unknown => {
    if (!Array.isArray(value)) {
        return value;
    }
    return value.map((row) => normalizeRowValues(definition.fields as FieldDefinitions, row, normalize));
};
