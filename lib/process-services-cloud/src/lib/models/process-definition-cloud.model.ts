/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ProcessVariableDefinition } from './variable-definition';

export class ProcessDefinitionCloud {
    id: string;
    appName: string;
    key: string;
    formKey?: string;
    appVersion: number;
    version: number;
    name: string;
    category: string;
    description: string;
    variableDefinitions?: ProcessVariableDefinition[];

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.name = obj && obj.name || null;
        this.appName = obj && obj.appName || null;
        this.key = obj && obj.key || null;
        this.formKey = obj && obj.formKey || null;
        this.version = obj && obj.version || 0;
        this.appVersion = obj && obj.appVersion || 0;
        this.category = obj && obj?.category || '';
        this.description = obj && obj?.description || '';
        this.variableDefinitions = obj?.variableDefinitions ?? [];
    }
}
