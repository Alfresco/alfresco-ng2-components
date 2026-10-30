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
import type { ContainerColumnModel } from '../components/widgets/core/container-column.model';
import type { ContainerModel } from '../components/widgets/core/container.model';
import type { FormModel } from '../components/widgets/core/form.model';

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

export const isStructural = (field: FormFieldModel): boolean =>
    FormFieldTypes.isContainerType(field.type) || FormFieldTypes.isSectionType(field.type);

export const isPreserved = (field: FormFieldModel): boolean =>
    field.readOnly ||
    (!isStructural(field) && FormFieldTypes.isReadOnlyType(field.type)) ||
    FormFieldTypes.isConstantValueType(field.type) ||
    isDisplayOnly(field);

export const hasContentReferences = (value: unknown): boolean => (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined);

export const isUnsupportedCategory = (field: FormFieldModel): boolean =>
    field.type !== FormFieldTypes.REPEATABLE_SECTION && !RESETTABLE_TYPES.includes(field.type);

export const hasUploadedContent = (field: FormFieldModel): boolean => field.type === FormFieldTypes.UPLOAD && hasContentReferences(field.value);

export const rootFieldOf = (entry: ContainerModel | FormFieldModel): FormFieldModel => (entry instanceof FormFieldModel ? entry : entry.field);

const renderedColumnsOf = (field: FormFieldModel): ContainerColumnModel[] => {
    if (!field.rows.length) {
        return field.columns;
    }
    return field.rows.flatMap((row) => row.columns);
};

const allColumnsOf = (field: FormFieldModel): ContainerColumnModel[] => [...field.columns, ...field.rows.flatMap((row) => row.columns)];

export const children = (field: FormFieldModel): FormFieldModel[] => renderedColumnsOf(field).flatMap((column) => column.fields);

export const descendants = (field: FormFieldModel): FormFieldModel[] => children(field).flatMap((child) => [child, ...descendants(child)]);

const retainsState = (child: FormFieldModel, handledFields?: ReadonlySet<FormFieldModel>): boolean => {
    if (isDisplayOnly(child)) {
        return false;
    }
    if (isPreserved(child)) {
        return true;
    }
    if (handledFields?.has(child)) {
        return hasContentReferences(child.value);
    }
    return hasUploadedContent(child) || (!isStructural(child) && isUnsupportedCategory(child)) || hasRetainedDescendant(child, handledFields);
};

/**
 * Checks whether rebuilding a repeatable section would discard state that reset must keep.
 * Display-only widgets hold no user state. A host-handled child blocks only while it still holds content.
 *
 * @param field Repeatable section or structural descendant
 * @param handledFields Fields whose content the host has already reset
 * @returns Whether any descendant must be retained
 */
export const hasRetainedDescendant = (field: FormFieldModel, handledFields?: ReadonlySet<FormFieldModel>): boolean =>
    children(field).some((child) => retainsState(child, handledFields));

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
        for (const column of allColumnsOf(field)) {
            column.fields.forEach(visit);
        }
    };
    form.fields.forEach((entry) => visit(rootFieldOf(entry)));
    return editable;
}
