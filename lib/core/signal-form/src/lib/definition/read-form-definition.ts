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

import { BUILT_IN_FORM_WIDGET_RESOLVER } from '../widgets/built-in-form-widgets';
import type { FormWidgetResolver } from '../widgets/form-widget-definition';
import { readInitialValue, readOptions } from './field-initial-values';
import type { FieldJson, FormDefinitionJson, FormRepresentationJson, OutcomeJson } from './form-definition.json';
import {
    EMPTY_OPTION_ID,
    FieldDefinition,
    FormDefinition,
    FormFieldType,
    FormVariables,
    LAYOUT_FIELD_TYPES,
    LayoutDefinition,
    OutcomeDefinition,
    SectionDefinition,
    SystemOutcomeName,
    TabDefinition
} from './form-definition.model';

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
 * @param widgets the field type definitions, the built-in ones by default
 * @returns the form definition model
 */
export const readFormDefinition = (json: FormDefinitionJson, widgets: FormWidgetResolver = BUILT_IN_FORM_WIDGET_RESOLVER): FormDefinition => {
    const representation = json.formRepresentation ?? json;
    const content = { ...representation, ...representation.formDefinition };
    const roots = structuredClone(content.fields ?? []);

    return {
        fields: roots.flatMap((root) => collectFields([root], [], widgets, root.tab ?? undefined)),
        sections: roots.filter((root) => root.type === FormFieldType.RepeatableSection).map((section) => toSectionDefinition(section, widgets)),
        tabs: (content.tabs ?? []).map(({ id, visibilityCondition }): TabDefinition => ({ id, visibilityCondition })),
        outcomes: readOutcomes(content.outcomes ?? [], content.selectedOutcome),
        variables: readVariables(content)
    };
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

const toSectionDefinition = (section: FieldJson, widgets: FormWidgetResolver): SectionDefinition => {
    const ancestors = [toLayoutDefinition(section)];
    return {
        id: section.id,
        initialRows: section.params?.initialNumberOfRows ?? 1,
        maxRows: section.params?.maxNumberOfRows ?? null,
        fields: Object.values(section.fields ?? {}).flatMap((column) => collectFields(column, ancestors, widgets))
    };
};

const collectFields = (fields: FieldJson[], ancestors: LayoutDefinition[], widgets: FormWidgetResolver, tabId?: string): FieldDefinition[] =>
    fields.flatMap((field) => {
        if (field.type === FormFieldType.RepeatableSection) {
            return [];
        }
        if (LAYOUT_FIELD_TYPES.has(field.type)) {
            const nestedAncestors = [...ancestors, toLayoutDefinition(field)];
            return Object.values(field.fields ?? {}).flatMap((column) => collectFields(column, nestedAncestors, widgets, tabId));
        }
        return [toFieldDefinition(field, ancestors, widgets, tabId)];
    });

const toLayoutDefinition = (field: FieldJson): LayoutDefinition => ({
    id: field.id,
    type: field.type,
    visibilityCondition: field.visibilityCondition
});

const toFieldDefinition = (
    field: FieldJson,
    ancestors: LayoutDefinition[],
    widgets: FormWidgetResolver,
    tabId: string | undefined
): FieldDefinition => {
    const options = readOptions(field);
    const emptyOption = options.find((option) => option.id === EMPTY_OPTION_ID);
    const definition: FieldDefinition = {
        id: field.id,
        type: field.type,
        isCustomType: !!field.isCustomType,
        valueType: field.valueType,
        ancestors,
        tabId,
        required: !!field.required,
        readOnly: !!field.readOnly || field.type === FormFieldType.DisplayValue,
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
        dateDisplayFormat: field.dateDisplayFormat || (field.type === FormFieldType.DateTime ? DEFAULT_DATETIME_FORMAT : DEFAULT_DATE_FORMAT),
        enableFractions: !!field.enableFractions,
        precision: field.precision,
        dynamicDateRangeSelection: !!field.dynamicDateRangeSelection,
        minDateRangeValue: field.minDateRangeValue,
        maxDateRangeValue: field.maxDateRangeValue,
        initialValue: null
    };
    definition.initialValue = readInitialValue(field, definition, widgets);
    return definition;
};
