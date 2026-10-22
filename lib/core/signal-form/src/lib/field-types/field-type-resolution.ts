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

import type { FieldDefinition } from '../definition/form-definition.interface';
import { FormFieldType } from '../definition/form-field-types';
import type { FieldTypeDefinition, FieldTypeResolver } from './field-type-definition.interface';

/** What resolving a field's type needs to know about the field. */
export interface FieldTypeReference {
    type: string;
    isCustomType?: boolean;
    valueType?: string;
    /** The field a display value shows (`params.field`), for a display value. */
    sourceField?: { type?: string };
}

export interface ResolvedFieldType {
    definition: FieldTypeDefinition;
    /** The value type whose built-in definition handles a Studio custom widget no application implements. */
    derivedFromValueType?: string;
}

const FIELD_TYPE_OF_VALUE_TYPE: Readonly<Record<string, string>> = {
    string: FormFieldType.Text,
    integer: FormFieldType.Integer,
    bigdecimal: FormFieldType.Decimal,
    boolean: FormFieldType.Boolean,
    date: FormFieldType.Date,
    datetime: FormFieldType.DateTime,
    json: FormFieldType.Json
};

/** The types whose component shows a display value of that type, as today's form does, instead of the value as text. */
const SHOWN_BY_SOURCE_COMPONENT: ReadonlySet<string> = new Set([FormFieldType.Json]);

/**
 * Finds how a field is handled: by the definition registered for its type, or, for a Studio custom widget nobody has
 * implemented yet, by the built-in definition of its value type. Returns `undefined` for a truly unknown type.
 *
 * @param fieldTypes the field type definitions
 * @param field the field
 * @returns the field type handling the field
 */
export const resolveFieldType = (fieldTypes: FieldTypeResolver, field: FieldTypeReference): ResolvedFieldType | undefined => {
    const own = fieldTypes.definitionFor(field.type);
    if (own) {
        return { definition: own };
    }
    const valueTypeDefinition = valueTypeDefinitionOf(fieldTypes, field);
    return valueTypeDefinition && { definition: fieldTypeAlias(valueTypeDefinition, field.type), derivedFromValueType: field.valueType };
};

const valueTypeDefinitionOf = (fieldTypes: FieldTypeResolver, field: FieldTypeReference): FieldTypeDefinition | undefined =>
    field.isCustomType && field.valueType ? fieldTypes.definitionFor(FIELD_TYPE_OF_VALUE_TYPE[field.valueType]) : undefined;

/**
 * Returns the component that shows a field: a display value of a JSON field is shown by the JSON component, as
 * today; any other field by its own type's component. Only the component changes: the field keeps its own value
 * handling.
 *
 * @param fieldTypes the field type definitions
 * @param field the field
 * @returns the component loader, `undefined` when the field has no component to show
 */
export const resolveFieldComponent = (fieldTypes: FieldTypeResolver, field: FieldTypeReference): FieldTypeDefinition['component'] => {
    const sourceComponent = isShownBySource(field) ? fieldTypes.definitionFor(field.sourceField?.type ?? '')?.component : undefined;
    return sourceComponent ?? resolveFieldType(fieldTypes, field)?.definition.component;
};

const isShownBySource = (field: FieldTypeReference): boolean =>
    field.type === FormFieldType.DisplayValue && SHOWN_BY_SOURCE_COMPONENT.has(field.sourceField?.type ?? '');

/**
 * Makes a field type an alias of another: a field of the alias type is read, submitted, validated and shown exactly
 * like a field of the original type. Its readers, writers and validators see the field as the original type, since
 * built-in validators check the type they apply to.
 *
 * @param original the definition the alias uses
 * @param aliasType the field type that becomes an alias
 * @returns the definition of the alias type
 */
export const fieldTypeAlias = (original: FieldTypeDefinition, aliasType: string): FieldTypeDefinition => {
    const asOriginalType = (definition: FieldDefinition): FieldDefinition => ({ ...definition, type: original.type });
    const { initialValue, submittedValue, validators, displayValue } = original;
    return {
        ...original,
        type: aliasType,
        initialValue: initialValue && ((json, definition) => initialValue(json, asOriginalType(definition))),
        submittedValue: submittedValue && (({ definition, value }) => submittedValue({ definition: asOriginalType(definition), value })),
        validators: validators?.map((validator) => (definition, value) => validator(asOriginalType(definition), value)),
        displayValue: displayValue && (({ definition, value }) => displayValue({ definition: asOriginalType(definition), value }))
    };
};
