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

import { FormFieldType } from '../definition/form-definition.model';
import type { FormWidgetDefinition, FormWidgetResolver } from './form-widget-definition';

export interface WidgetField {
    type: string;
    isCustomType?: boolean;
    valueType?: string;
}

export interface FieldWidget {
    definition: FormWidgetDefinition;
    derivedFromValueType?: string;
}

const VALUE_TYPE_WIDGETS: Readonly<Record<string, string>> = {
    string: FormFieldType.Text,
    integer: FormFieldType.Integer,
    bigdecimal: FormFieldType.Decimal,
    boolean: FormFieldType.Boolean,
    date: FormFieldType.Date,
    datetime: FormFieldType.DateTime,
    json: FormFieldType.Json
};

/**
 * Finds how a field is handled: by the definition registered for its type, or, for a Studio custom widget nobody has
 * implemented yet, by the built-in definition of its value type. Returns `undefined` for a truly unknown type.
 *
 * @param widgets the field type definitions
 * @param field the field
 * @returns the widget handling the field
 */
export const fieldWidget = (widgets: FormWidgetResolver, field: WidgetField): FieldWidget | undefined => {
    const own = widgets.definitionFor(field.type);
    if (own) {
        return { definition: own };
    }
    if (!field.isCustomType || !field.valueType) {
        return undefined;
    }
    const valueTypeDefinition = widgets.definitionFor(VALUE_TYPE_WIDGETS[field.valueType]);
    return valueTypeDefinition
        ? { definition: borrowedDefinition(valueTypeDefinition, field.type), derivedFromValueType: field.valueType }
        : undefined;
};

/**
 * Lends a built-in definition to a custom field type. The borrowed readers, writers and validators see the field as
 * the built-in type, since built-in validators check the type they apply to.
 *
 * @param borrowed the built-in definition
 * @param type the custom field type
 * @returns the definition for the custom field type
 */
const borrowedDefinition = (borrowed: FormWidgetDefinition, type: string): FormWidgetDefinition => {
    const asBorrowedType = <T extends { type: string }>(field: T): T => ({ ...field, type: borrowed.type });
    const { initialValue, submittedValue, validators } = borrowed;
    return {
        ...borrowed,
        type,
        initialValue: initialValue && ((json, definition) => initialValue(json, asBorrowedType(definition))),
        submittedValue: submittedValue && (({ definition, value }) => submittedValue({ definition: asBorrowedType(definition), value })),
        validators: validators?.map((validator) => (definition, value) => validator(asBorrowedType(definition), value))
    };
};
