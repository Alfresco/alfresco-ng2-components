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

import { SpikeVariable, SpikeVariables } from './spike-definition';

const PROCESS_VARIABLE_PREFIX = 'variables.';

export const resolveVariableValue = (identifier: string, { formVariables, processVariables }: SpikeVariables): unknown => {
    const names = [`${PROCESS_VARIABLE_PREFIX}${identifier}`, identifier];
    const processVariable = processVariables.find((variable) => names.includes(variable.name));

    if (processVariable) {
        return parseVariableValue(processVariable);
    }

    const formVariable = identifier ? formVariables.find((variable) => variable.name === identifier || variable.id === identifier) : undefined;
    return formVariable && Object.prototype.hasOwnProperty.call(formVariable, 'value') ? parseVariableValue(formVariable) : undefined;
};

const parseVariableValue = ({ type, value }: SpikeVariable): unknown => {
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
