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

import { FormVariable, FormVariables } from '../definition/form-definition.model';

const PROCESS_VARIABLE_PREFIX = 'variables.';

export const findVariable = (identifier: string, { formVariables }: FormVariables): FormVariable | undefined =>
    identifier ? formVariables.find((variable) => variable.name === identifier || variable.id === identifier) : undefined;

export const resolveVariableValue = (identifier: string, variables: FormVariables, runtimeValues: Record<string, unknown> = {}): unknown => {
    const formVariable = findVariable(identifier, variables);
    const runtimeKey = formVariable ? (formVariable.id ?? formVariable.name) : undefined;
    if (runtimeKey !== undefined && Object.prototype.hasOwnProperty.call(runtimeValues, runtimeKey)) {
        return parseVariableValue({ ...formVariable, value: runtimeValues[runtimeKey] });
    }

    const names = [`${PROCESS_VARIABLE_PREFIX}${identifier}`, identifier];
    const processVariable = variables.processVariables.find((variable) => names.includes(variable.name));

    if (processVariable) {
        return parseVariableValue(processVariable);
    }

    return formVariable && Object.prototype.hasOwnProperty.call(formVariable, 'value') ? parseVariableValue(formVariable) : undefined;
};

const parseVariableValue = ({ type, value }: FormVariable): unknown => {
    if (!type || !value) {
        return value;
    }
    if (type === 'date') {
        return value.toString().includes('T') ? value : `${value}T00:00:00.000Z`;
    }
    if (type === 'boolean') {
        return typeof value === 'string' ? JSON.parse(value) : value;
    }
    return value;
};
