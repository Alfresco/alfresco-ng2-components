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

import { FullNamePipe } from '@alfresco/adf-core';
import { FieldDefinition, FieldOption } from '../definition/form-definition.model';
import type { DisplayValueFormatter, FormWidgetResolver } from '../widgets/form-widget-definition';
import { fieldWidget } from '../widgets/field-widget';

const fullNamePipe = new FullNamePipe();

type User = Parameters<FullNamePipe['transform']>[0];

/**
 * Turns any value into text: strings as they are, objects as JSON.
 *
 * @param value the value
 * @returns the text
 */
export const stringifyValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'object' && !(value instanceof Date)) {
        return JSON.stringify(value);
    }
    return String(value);
};

/**
 * Returns the text shown for a field value, using the field type's own formatter when it has one.
 *
 * @param widgets the field type definitions
 * @param definition the field
 * @param value the field value
 * @returns the text
 */
export const displayFieldValue = (widgets: FormWidgetResolver, definition: FieldDefinition, value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }
    const formatter = fieldWidget(widgets, definition)?.definition.displayValue;
    return formatter ? formatter({ definition, value }) : stringifyValue(value);
};

const joinNames = (names: string[]): string => names.filter((name) => !!name).join(', ');

const optionName = (definition: FieldDefinition, option: string | FieldOption): string => {
    if (typeof option === 'string') {
        return definition.options.find(({ id }) => id === option)?.name ?? option;
    }
    return option?.name ?? '';
};

export const optionDisplayValue: DisplayValueFormatter = ({ definition, value }) => {
    if (Array.isArray(value)) {
        return joinNames(value.map((option) => optionName(definition, option)));
    }
    if (typeof value === 'string') {
        return optionName(definition, value);
    }
    return value?.name ?? JSON.stringify(value);
};

export const peopleDisplayValue: DisplayValueFormatter = ({ value }) =>
    joinNames((Array.isArray(value) ? value : [value]).map((user: User) => fullNamePipe.transform(user)));

export const groupDisplayValue: DisplayValueFormatter = ({ value }) =>
    joinNames((Array.isArray(value) ? value : [value]).map((group: { name?: string }) => group?.name ?? ''));
