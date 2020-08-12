/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

export class FormCloudRepresentation {

    id?: string;
    name?: string;
    description?: string;
    version?: number;
    tabs?: any[];
    fields?: any[];
    outcomes?: any[];
    metadata?: any;
    variables?: any[];
    taskId?: string;
    taskName?: string;
    processDefinitionId?: string;
    processInstanceId?: string;
    selectedOutcome?: string;

    constructor(obj?: any) {
        this.id = obj.id || null;
        this.name = obj.name || null;
        this.description = obj.description || null;
        this.version = obj.version || null;
        this.tabs = obj.tabs || null;
        this.fields = obj.fields || null;
        this.outcomes = obj.outcomes || null;
        this.metadata = obj.metadata || null;
        this.variables = obj.variables || null;
        this.taskId = obj.taskId || null;
        this.taskName = obj.taskName || null;
        this.processDefinitionId = obj.processDefinitionId || null;
        this.processInstanceId = obj.processInstanceId || null;
        this.selectedOutcome = obj.selectedOutcome || null;
    }
}

export interface DestinationFolderPathModel {
    alias: string;
    path: string;
}
