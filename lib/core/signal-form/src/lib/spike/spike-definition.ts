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

import { LAYOUT_FIELD_TYPES } from '../parity/form-engine-driver';
import { readInitialValue, readOptions } from './spike-field-values';

const REPEATABLE_SECTION = 'repeatable-section';
const DATETIME = 'datetime';
const EMPTY_OPTION_ID = 'empty';
const DEFAULT_DATE_FORMAT = 'D-M-YYYY';
const DEFAULT_DATETIME_FORMAT = 'D-M-YYYY hh:mm A';

export interface VisibilityConditionJson {
    leftType?: string | null;
    leftValue?: unknown;
    leftFormFieldId?: string;
    leftRestResponseId?: string;
    operator?: string;
    rightType?: string | null;
    rightValue?: unknown;
    rightFormFieldId?: string;
    rightRestResponseId?: string;
    nextConditionOperator?: string;
    nextCondition?: VisibilityConditionJson | null;
}

export interface SpikeLayoutDefinition {
    id: string;
    type: string;
    visibilityCondition?: VisibilityConditionJson | null;
}

export interface SpikeTabDefinition {
    id: string;
    visibilityCondition?: VisibilityConditionJson | null;
}

export interface SpikeOption {
    id: string;
    name: string;
}

export interface SpikeFieldDefinition {
    id: string;
    type: string;
    ancestors: SpikeLayoutDefinition[];
    tabId?: string;
    required: boolean;
    minLength: number;
    maxLength: number;
    minValue?: unknown;
    maxValue?: unknown;
    regexPattern?: string | null;
    visibilityCondition?: VisibilityConditionJson | null;
    options: SpikeOption[];
    optionType?: string;
    hasEmptyValue: boolean;
    emptyOption?: SpikeOption;
    multiple: boolean;
    dateDisplayFormat: string;
    enableFractions: boolean;
    precision?: number;
    dynamicDateRangeSelection: boolean;
    minDateRangeValue?: number | null;
    maxDateRangeValue?: number | null;
    value: unknown;
}

export interface SpikeSectionDefinition {
    id: string;
    initialRows: number;
    maxRows: number | null;
    fields: SpikeFieldDefinition[];
}

export interface SpikeVariable {
    id?: string;
    name?: string;
    type?: string;
    value?: unknown;
}

export interface SpikeVariables {
    formVariables: SpikeVariable[];
    processVariables: SpikeVariable[];
}

export interface FieldJson {
    id: string;
    type: string;
    tab?: string | null;
    fields?: Record<string, FieldJson[]>;
    params?: { initialNumberOfRows?: number; maxNumberOfRows?: number | null; multiple?: boolean };
    visibilityCondition?: VisibilityConditionJson | null;
    [property: string]: any;
}

interface RepresentationJson {
    formDefinition?: { fields?: FieldJson[]; variables?: SpikeVariable[]; tabs?: SpikeTabDefinition[] };
    fields?: FieldJson[];
    tabs?: SpikeTabDefinition[];
    variables?: SpikeVariable[];
    processVariables?: SpikeVariable[];
}

interface DefinitionJson extends RepresentationJson {
    formRepresentation?: RepresentationJson;
}

export const readSpikeFields = (definition: DefinitionJson): SpikeFieldDefinition[] => {
    const result: SpikeFieldDefinition[] = [];
    rootFieldsOf(definition).forEach((root) => collectFields([root], result, [], root.tab ?? undefined));
    return result;
};

export const readSpikeTabs = (definition: DefinitionJson): SpikeTabDefinition[] => {
    const representation = representationOf(definition);
    return (representation.tabs ?? representation.formDefinition?.tabs ?? []).map(({ id, visibilityCondition }) => ({ id, visibilityCondition }));
};

export const readSpikeSections = (definition: DefinitionJson): SpikeSectionDefinition[] =>
    rootFieldsOf(definition)
        .filter((field) => field.type === REPEATABLE_SECTION)
        .map((section) => {
            const fields: SpikeFieldDefinition[] = [];
            const ancestors = [toLayoutDefinition(section)];
            Object.values(section.fields ?? {}).forEach((column) => collectFields(column, fields, ancestors));
            return {
                id: section.id,
                initialRows: section.params?.initialNumberOfRows ?? 1,
                maxRows: section.params?.maxNumberOfRows ?? null,
                fields
            };
        });

export const readSpikeVariables = (definition: DefinitionJson): SpikeVariables => {
    const representation = representationOf(definition);
    return {
        formVariables: representation.variables ?? representation.formDefinition?.variables ?? [],
        processVariables: representation.processVariables ?? []
    };
};

const representationOf = (definition: DefinitionJson): RepresentationJson => definition.formRepresentation ?? definition;

const rootFieldsOf = (definition: DefinitionJson): FieldJson[] => {
    const representation = representationOf(definition);
    return representation.formDefinition?.fields ?? representation.fields ?? [];
};

const collectFields = (fields: FieldJson[], result: SpikeFieldDefinition[], ancestors: SpikeLayoutDefinition[] = [], tabId?: string): void => {
    for (const field of fields) {
        if (field.type === REPEATABLE_SECTION) {
            continue;
        }
        if (LAYOUT_FIELD_TYPES.has(field.type)) {
            const nestedAncestors = [...ancestors, toLayoutDefinition(field)];
            Object.values(field.fields ?? {}).forEach((column) => collectFields(column, result, nestedAncestors, tabId));
        } else {
            result.push({ ...toFieldDefinition(field, ancestors), tabId });
        }
    }
};

const toLayoutDefinition = (field: FieldJson): SpikeLayoutDefinition => ({
    id: field.id,
    type: field.type,
    visibilityCondition: field.visibilityCondition
});

const toFieldDefinition = (field: FieldJson, ancestors: SpikeLayoutDefinition[]): SpikeFieldDefinition => {
    const options = readOptions(field);
    const emptyOption = options.find((option) => option.id === EMPTY_OPTION_ID);
    const definition: SpikeFieldDefinition = {
        id: field.id,
        type: field.type,
        ancestors,
        required: !!field.required,
        minLength: field.minLength || 0,
        maxLength: field.maxLength || 0,
        minValue: field.minValue,
        maxValue: field.maxValue,
        regexPattern: field.regexPattern,
        visibilityCondition: field.visibilityCondition,
        options,
        optionType: field.optionType,
        hasEmptyValue: field.hasEmptyValue ?? !!emptyOption,
        emptyOption,
        multiple: field.selectionType === 'multiple' || !!field.params?.multiple,
        dateDisplayFormat: field.dateDisplayFormat || (field.type === DATETIME ? DEFAULT_DATETIME_FORMAT : DEFAULT_DATE_FORMAT),
        enableFractions: !!field.enableFractions,
        precision: field.precision,
        dynamicDateRangeSelection: !!field.dynamicDateRangeSelection,
        minDateRangeValue: field.minDateRangeValue,
        maxDateRangeValue: field.maxDateRangeValue,
        value: null
    };
    definition.value = readInitialValue(field, definition);
    return definition;
};
