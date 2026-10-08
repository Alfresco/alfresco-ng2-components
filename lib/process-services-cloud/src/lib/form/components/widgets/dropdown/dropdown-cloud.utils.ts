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

import { FormFieldModel, FormFieldOption, VariableConfig } from '@alfresco/adf-core';

export const DEFAULT_OPTION = {
    id: 'empty',
    name: 'Choose one...'
};

const DEFAULT_VARIABLE_OPTION_ID = 'id';
const DEFAULT_VARIABLE_OPTION_LABEL = 'name';
const DEFAULT_VARIABLE_OPTION_PATH = 'data';

export const toDropdownCloudControlValue = (value: any): FormFieldOption | FormFieldOption[] | null => {
    if (Array.isArray(value)) {
        return value;
    }
    if (value && typeof value === 'object') {
        return { id: value.id, name: value.name };
    }
    if (value === null || value === undefined || value === '') {
        return null;
    }
    return { id: value, name: '' };
};

export const isDropdownCloudValueInOptions = (value: any, options: FormFieldOption[]): boolean => {
    const optionIds = new Set(options.map((option) => option.id));
    if (Array.isArray(value)) {
        return value.every((valueOption) => optionIds.has(valueOption.id));
    }
    if (value && typeof value === 'object') {
        return optionIds.has(value.id);
    }
    return optionIds.has(value);
};

export const isDropdownCloudValidValue = (value: any, options: FormFieldOption[]): boolean =>
    !!value && isDropdownCloudValueInOptions(value, options);

export const isDropdownCloudRestField = (field: FormFieldModel): boolean => field?.optionType === 'rest' && !!field?.restUrl;

export const isDropdownCloudLinkedField = (field: FormFieldModel): boolean => !!field?.rule?.ruleOn;

const getOptionsFromPath = (data: any, path: string, id: string, label: string): { options: FormFieldOption[]; errors: string[] } => {
    const properties = path.split('.');
    const currentProperty = properties.shift();

    if (data === null || typeof data !== 'object' || !Object.hasOwn(data, currentProperty)) {
        return { options: [], errors: [`${currentProperty} not found in ${JSON.stringify(data)}`] };
    }

    const nestedData = data[currentProperty];

    if (Array.isArray(nestedData)) {
        const options: FormFieldOption[] = nestedData.map((item) => ({ id: item?.[id], name: item?.[label] }));
        const invalidOptionErrors = options.filter((option) => !option.id || !option.name).map(() => `'id' or 'label' is not properly defined`);
        return invalidOptionErrors.length ? { options: [], errors: invalidOptionErrors } : { options, errors: [] };
    }

    return getOptionsFromPath(nestedData, properties.join('.'), id, label);
};

export const resolveDropdownCloudVariableOptions = (
    field: FormFieldModel,
    variableConfig: VariableConfig | undefined = field?.variableConfig
): { options: FormFieldOption[]; errors: string[] } | null => {
    const data = field?.form?.resolveVariableValue(variableConfig?.variableName);

    if (data == null) {
        return null;
    }

    return getOptionsFromPath(
        data,
        variableConfig?.optionsPath ?? DEFAULT_VARIABLE_OPTION_PATH,
        variableConfig?.optionsId ?? DEFAULT_VARIABLE_OPTION_ID,
        variableConfig?.optionsLabel ?? DEFAULT_VARIABLE_OPTION_LABEL
    );
};
