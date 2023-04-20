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

export class ProcessDefinitionRepresentation {
    id: string;
    name: string;
    description: string;
    key: string;
    category: string;
    version: number;
    deploymentId: string;
    tenantId: string;
    metaDataValues: any[];
    hasStartForm: boolean;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.key = obj && obj.key || null;
        this.category = obj && obj.category || null;
        this.version = obj && obj.version || 0;
        this.deploymentId = obj && obj.deploymentId || null;
        this.tenantId = obj && obj.tenantId || null;
        this.metaDataValues = obj && obj.metaDataValues || [];
        this.hasStartForm = obj && obj.hasStartForm === true;
    }
}
