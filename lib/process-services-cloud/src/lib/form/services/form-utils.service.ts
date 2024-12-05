/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { FormModel, FormVariableModel } from '@alfresco/adf-core';

@Injectable({
    providedIn: 'root'
})
export class FormUtilsService {
    getRestUrlVariablesMap(formModel: FormModel, restUrl: string, inputBody: { [key: string]: any }) {
        return formModel.variables.reduce((map: { [key: string]: any }, variable: FormVariableModel) => {
            const variablePattern = new RegExp(`\\$\\{${variable.name}\\}`);
            if (variablePattern.test(restUrl)) map[variable.name] = formModel.getProcessVariableValue(variable.name);
            return map;
        }, inputBody);
    }
}
