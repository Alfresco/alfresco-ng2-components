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

import { BUILT_IN_FIELD_TYPE_RESOLVER } from '../field-types/built-in-field-types';
import type { FieldTypeResolver } from '../field-types/field-type-definition.interface';
import { LABEL_SUFFIX } from '../expressions/condition-values';
import { resolveVariableValue } from '../expressions/form-variables';
import { jsonOptions, readInitialValue, readOptions, readSavedRow, savedValueFor, toFieldValue } from './field-value-readers';
import { isRecord } from '../form-value-guards';
import type { FieldJson, FormDefinitionJson, FormRepresentationJson, OutcomeJson } from './form-definition-json.interface';
import type {
    FieldDefinition,
    FieldValue,
    FormDefinition,
    FormVariables,
    GroupHeader,
    LayoutDefinition,
    LayoutNode,
    LayoutRoot,
    OutcomeDefinition,
    SectionDefinition,
    TabDefinition
} from './form-definition.interface';
import {
    CONSTANT_VALUE_FIELD_TYPES,
    EMPTY_OPTION_ID,
    FormFieldType,
    LAYOUT_FIELD_TYPES,
    READ_ONLY_FIELD_TYPES,
    SystemOutcomeName,
    TYPEAHEAD_FIELD_TYPE
} from './form-field-types';

type FieldIdentity = Pick<
    FieldDefinition,
    'id' | 'type' | 'isCustomType' | 'valueType' | 'name' | 'placeholder' | 'tooltip' | 'colspan' | 'ancestors' | 'tabId'
>;
type FieldValidationSettings = Pick<
    FieldDefinition,
    'required' | 'readOnly' | 'minLength' | 'maxLength' | 'minValue' | 'maxValue' | 'regexPattern' | 'customValidationMessage'
>;
type FieldDisplaySettings = Pick<
    FieldDefinition,
    'style' | 'autoGrow' | 'className' | 'inputMask' | 'visibilityCondition' | 'hyperlinkUrl' | 'displayText' | 'sourceField'
>;
type FieldChoices = Pick<FieldDefinition, 'options' | 'optionType' | 'hasEmptyValue' | 'emptyOption' | 'multiple'>;
type FieldNumberSettings = Pick<FieldDefinition, 'enableFractions' | 'currency' | 'precision'>;
type FieldDateSettings = Pick<
    FieldDefinition,
    'dateDisplayFormat' | 'dynamicDateRangeSelection' | 'dateRangeReference' | 'minDateRangeValue' | 'maxDateRangeValue'
>;

const DEFAULT_DATE_FORMAT = 'D-M-YYYY';
const DEFAULT_DATETIME_FORMAT = 'D-M-YYYY hh:mm A';
const SAVE_OUTCOME: OutcomeJson = { id: '$save', name: SystemOutcomeName.Save };
const DEFAULT_OUTCOMES: OutcomeJson[] = [
    { id: '$complete', name: SystemOutcomeName.Complete },
    { id: '$startProcess', name: SystemOutcomeName.StartProcess }
];

/**
 * Reads a form definition JSON, nested or flattened, into the immutable model the engine runs on. The JSON itself is
 * never modified.
 *
 * @param json the form definition as the backend or the designer provides it
 * @param fieldTypes the field type definitions, the built-in ones by default
 * @param values saved form values (for example a task's data), keyed by field id or `variables.<name>`; they replace
 * the fields' own values, and a repeatable section's value gives its rows
 * @returns the form definition model
 */
export const parseFormJson = (
    json: FormDefinitionJson,
    fieldTypes: FieldTypeResolver = BUILT_IN_FIELD_TYPE_RESOLVER,
    values?: Record<string, unknown>
): FormDefinition => {
    const representation = json.formRepresentation ?? json;
    const content = { ...representation, ...representation.formDefinition };
    const roots = structuredClone(content.fields ?? []);
    if (values) {
        applySavedValues(roots, values);
    }
    const variables = readVariables(content);
    const withSourceValue = (field: FieldDefinition) => withSourceFieldValue(field, variables);

    return {
        name: content.name ?? null,
        theme: content.theme ? structuredClone(content.theme) : null,
        showTabNavigation: content.showBottomTabNavButtons === true,
        stickyTabs: content.stickyTabs === true,
        leftLabels: !!content.leftLabels,
        className: content.className || undefined,
        fields: roots.flatMap((root) => collectFields([root], [], fieldTypes, root.tab ?? undefined)).map(withSourceValue),
        sections: roots
            .filter((root) => root.type === FormFieldType.RepeatableSection)
            .map((section) => toSectionDefinition(section, fieldTypes))
            .map((section) => ({ ...section, fields: section.fields.map(withSourceValue) })),
        tabs: (content.tabs ?? []).map(({ id, title, visibilityCondition }): TabDefinition => ({ id, title, visibilityCondition })),
        outcomes: content.fields ? readOutcomes(content.outcomes ?? [], content.selectedOutcome) : [],
        variables,
        layout: roots.map((root): LayoutRoot => ({ tabId: root.tab ?? undefined, node: toLayoutNode(root) }))
    };
};

const toLayoutNode = (field: FieldJson): LayoutNode => {
    if (!LAYOUT_FIELD_TYPES.has(field.type)) {
        return { kind: 'field', fieldId: field.id, colspan: field.colspan ?? 1 };
    }
    const container = {
        style: field.style || undefined,
        element: toLayoutDefinition(field),
        name: field.name,
        numberOfColumns: field.numberOfColumns ?? 1,
        columns: Object.values(field.fields ?? {}).map((column) => column.map(toLayoutNode))
    };
    if (field.type === FormFieldType.RepeatableSection) {
        return { kind: 'repeatable', sectionId: field.id, ...container };
    }
    return field.type === FormFieldType.Group
        ? { kind: 'container', ...container, groupHeader: groupHeaderOf(field) }
        : { kind: 'container', ...container };
};

const groupHeaderOf = (group: FieldJson): GroupHeader => {
    const collapsible = !!group.params?.allowCollapse;
    return { collapsible, collapsedByDefault: collapsible && !!group.params?.collapseByDefault, hidden: !!group.params?.hideHeader };
};

const readOutcomes = (outcomes: OutcomeJson[], selectedOutcome: string | undefined): OutcomeDefinition[] => {
    const toOutcome = ({ id, name, skipValidation, visibilityCondition }: OutcomeJson): OutcomeDefinition => ({
        id,
        name,
        skipValidation: skipValidation ?? false,
        isSelected: name === selectedOutcome,
        visibilityCondition
    });
    return [SAVE_OUTCOME, ...(outcomes.length > 0 ? outcomes : DEFAULT_OUTCOMES)].map(toOutcome);
};

const readVariables = (content: FormRepresentationJson): FormVariables => ({
    formVariables: structuredClone(content.variables ?? []),
    processVariables: structuredClone(content.processVariables ?? [])
});

const toSectionDefinition = (section: FieldJson, fieldTypes: FieldTypeResolver): SectionDefinition => {
    const ancestors = [toLayoutDefinition(section)];
    const tabId = section.tab ?? undefined;
    const fields = Object.values(section.fields ?? {}).flatMap((column) => collectFields(column, ancestors, fieldTypes, tabId));
    return {
        id: section.id,
        initialRows: section.params?.initialNumberOfRows ?? 1,
        maxRows: section.params?.maxNumberOfRows ?? null,
        rowOptions: {
            allowInitialRowsDelete: section.params?.allowInitialRowsDelete,
            displayRowLabels: section.params?.displayRowLabels,
            rowLabelText: section.params?.rowLabelText,
            appendRowNumber: section.params?.appendRowNumber
        },
        readOnly: !!section.readOnly,
        tabId,
        fields,
        savedRows: readSavedRows(section, fields, fieldTypes)
    };
};

/**
 * Reads a repeatable section's saved rows, each field value read like the field's own JSON value. Every saved row is
 * kept, even beyond the section maximum: today's form submits them all, so none is dropped.
 *
 * @param section the section JSON
 * @param fields the section's field definitions
 * @param fieldTypes the field type definitions
 * @returns the saved rows
 */
const readSavedRows = (section: FieldJson, fields: FieldDefinition[], fieldTypes: FieldTypeResolver): Record<string, FieldValue>[] =>
    savedRowsOf(section).map((row) => readSavedRow(fields, row, fieldTypes));

const savedRowsOf = (section: FieldJson): Array<Record<string, unknown> | null> =>
    Array.isArray(section.value) ? section.value.map(asSavedRow) : [];

const asSavedRow = (row: unknown): Record<string, unknown> | null => (isRecord(row) ? row : null);

/**
 * Puts saved form values into the field JSON, as today's form does: a field takes the value saved for
 * `variables.<name>` or for its id, except the types whose value is constant.
 *
 * @param fields the field JSON, modified in place (a copy of the definition)
 * @param values the saved values
 */
const applySavedValues = (fields: FieldJson[], values: Record<string, unknown>): void => {
    for (const field of fields) {
        if (LAYOUT_FIELD_TYPES.has(field.type) && field.type !== FormFieldType.RepeatableSection) {
            Object.values(field.fields ?? {}).forEach((column) => applySavedValues(column, values));
        } else if (!CONSTANT_VALUE_FIELD_TYPES.has(field.type)) {
            const saved = savedValueFor(values, field);
            if (saved !== undefined) {
                field.value = saved;
            }
        }
    }
};

const collectFields = (fields: FieldJson[], ancestors: LayoutDefinition[], fieldTypes: FieldTypeResolver, tabId?: string): FieldDefinition[] =>
    fields.flatMap((field) => {
        if (field.type === FormFieldType.RepeatableSection) {
            return [];
        }
        if (LAYOUT_FIELD_TYPES.has(field.type)) {
            const nestedAncestors = [...ancestors, toLayoutDefinition(field)];
            return Object.values(field.fields ?? {}).flatMap((column) => collectFields(column, nestedAncestors, fieldTypes, tabId));
        }
        return [toFieldDefinition(field, ancestors, fieldTypes, tabId)];
    });

const toLayoutDefinition = (field: FieldJson): LayoutDefinition => ({
    id: field.id,
    type: field.type,
    visibilityCondition: field.visibilityCondition
});

const toFieldDefinition = (
    field: FieldJson,
    ancestors: LayoutDefinition[],
    fieldTypes: FieldTypeResolver,
    tabId: string | undefined
): FieldDefinition => {
    const definition: FieldDefinition = {
        ...readIdentity(field, ancestors, tabId),
        ...readValidationSettings(field),
        ...readDisplaySettings(field),
        ...readChoices(field, fieldTypes),
        ...readNumberSettings(field),
        ...readDateSettings(field),
        initialValue: null,
        json: field
    };
    return { ...definition, initialValue: readInitialValue(field, definition, fieldTypes) };
};

const readIdentity = (field: FieldJson, ancestors: LayoutDefinition[], tabId: string | undefined): FieldIdentity => ({
    id: field.id,
    type: field.type,
    isCustomType: !!field.isCustomType,
    valueType: field.valueType,
    name: field.name,
    placeholder: field.placeholder && field.placeholder !== 'null' ? field.placeholder : undefined,
    tooltip: field.tooltip || undefined,
    colspan: field.colspan ?? 1,
    ancestors,
    tabId
});

const readValidationSettings = (field: FieldJson): FieldValidationSettings => ({
    required: !!field.required,
    readOnly: !!field.readOnly || field.type === FormFieldType.DisplayValue,
    minLength: field.minLength || 0,
    maxLength: field.maxLength || 0,
    minValue: field.minValue,
    maxValue: field.maxValue,
    regexPattern: field.regexPattern,
    customValidationMessage: field.customValidationMessage || undefined
});

const readDisplaySettings = (field: FieldJson): FieldDisplaySettings => ({
    style: field.style || undefined,
    autoGrow: field.params?.autoGrow,
    className: field.className || undefined,
    inputMask: readInputMask(field),
    visibilityCondition: field.visibilityCondition,
    hyperlinkUrl: field.hyperlinkUrl,
    displayText: field.displayText,
    sourceField: READ_ONLY_FIELD_TYPES.has(field.type) ? (field.params?.field ?? undefined) : undefined
});

const readInputMask = (field: FieldJson): FieldDefinition['inputMask'] =>
    field.params?.inputMask
        ? { mask: field.params.inputMask, reversed: !!field.params.inputMaskReversed, placeholder: field.params.inputMaskPlaceholder || undefined }
        : undefined;

/**
 * Reads what a field offers to choose from, complete before its value is read: its options, as its type completes
 * them, and its empty option.
 *
 * @param field the field JSON
 * @param fieldTypes the field type definitions
 * @returns the choice settings
 */
const readChoices = (field: FieldJson, fieldTypes: FieldTypeResolver): FieldChoices => {
    const hasEmptyValue = field.hasEmptyValue ?? jsonOptions(field).some(({ id }) => id === EMPTY_OPTION_ID);
    const options = readOptions(field, hasEmptyValue, fieldTypes);
    return {
        options,
        optionType: field.optionType,
        hasEmptyValue,
        emptyOption: options.find(({ id }) => id === EMPTY_OPTION_ID),
        multiple: field.selectionType === 'multiple' || !!field.params?.multiple
    };
};

const readNumberSettings = (field: FieldJson): FieldNumberSettings => ({
    enableFractions: !!field.enableFractions,
    currency: field.currency,
    precision: field.precision
});

const readDateSettings = (field: FieldJson): FieldDateSettings => ({
    dateDisplayFormat: field.dateDisplayFormat || defaultDateFormat(field),
    dynamicDateRangeSelection: !!field.dynamicDateRangeSelection,
    dateRangeReference: field.dynamicDateRangeSelection ? new Date() : undefined,
    minDateRangeValue: field.minDateRangeValue,
    maxDateRangeValue: field.maxDateRangeValue
});

const defaultDateFormat = (field: FieldJson): string => {
    const shownType = READ_ONLY_FIELD_TYPES.has(field.type) ? (field.params?.field?.type ?? field.type) : field.type;
    return shownType === FormFieldType.DateTime ? DEFAULT_DATETIME_FORMAT : DEFAULT_DATE_FORMAT;
};

/**
 * Gives a read-only field showing a process field the value of that field's process variable, when it has one. A
 * falsy value (`0`, `false`, an empty text) is a value; only a missing or `null` one keeps the field's own value.
 *
 * @param field the field definition
 * @param variables the form and process variables
 * @returns the field, with its initial value taken from the process variable when there is one
 */
const withSourceFieldValue = (field: FieldDefinition, variables: FormVariables): FieldDefinition => {
    const source = field.sourceField;
    if (!source) {
        return field;
    }
    const variableName = source.type === TYPEAHEAD_FIELD_TYPE ? `${source.id}${LABEL_SUFFIX}` : source.name;
    const value = resolveVariableValue(variableName, variables);
    return value !== undefined && value !== null ? { ...field, initialValue: toFieldValue(value) } : field;
};
