/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

/**
 *
 * This object represent the app definition.
 *
 *
 * @returns {AppDefinitionRepresentationModel} .
 */
export class AppDefinitionRepresentationModel {
    defaultAppId: string;
    deploymentId: string;
    name: string;
    description: string;
    theme: string;
    id: number;
    modelId: number;
    tenantId: number;

    constructor(obj?: any) {
        this.defaultAppId = obj && obj.defaultAppId || null;
        this.deploymentId = obj && obj.deploymentId || false;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.theme = obj && obj.theme || null;
        this.id = obj && obj.id;
        this.modelId = obj && obj.modelId;
        this.tenantId = obj && obj.tenantId;
    }
}

/**
 *
 * This object represent the filter.
 *
 *
 * @returns {FilterRepresentationModel} .
 */
export class FilterRepresentationModel {
    id: number;
    appId: string;
    name: string;
    recent: boolean;
    icon: string;
    filter: FilterParamRepresentationModel;
    index: number;

    constructor(obj?: any) {
        this.appId = obj && obj.appId || null;
        this.name = obj && obj.name || null;
        this.recent = obj && obj.recent || false;
        this.icon = obj && obj.icon || null;
        this.filter = new FilterParamRepresentationModel(obj.filter);
        this.index = obj && obj.index;
    }
}

/**
 *
 * This object represent the parameters of a filter.
 *
 *
 * @returns {FilterParamRepresentationModel} .
 */
export class FilterParamRepresentationModel {
    processDefinitionId: string;
    processDefinitionKey: string;
    name: string;
    state: string;
    sort: string;

    constructor(obj?: any) {
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.processDefinitionKey = obj && obj.processDefinitionKey || null;
        this.name = obj && obj.name || null;
        this.state = obj && obj.state || null;
        this.sort = obj && obj.sort || null;
    }
}

export class UserProcessInstanceFilterRepresentationModel extends FilterRepresentationModel {
    public filter: ProcessInstanceFilterRepresentation;
    constructor(obj?: any) {
        super(obj);
        this.filter = new ProcessInstanceFilterRepresentation(obj.filter);
    }
}

export class ProcessInstanceFilterRepresentation extends FilterParamRepresentationModel {
    constructor(obj?: any) {
        super(obj);
    }
}

export class UserTaskFilterRepresentationModel extends FilterRepresentationModel {
    public filter: TaskFilterRepresentationModel;
    constructor(obj?: any) {
        super(obj);
        this.filter = new TaskFilterRepresentationModel(obj.filter);
    }
}

export class TaskFilterRepresentationModel extends FilterParamRepresentationModel {
    assignment: string;
    dueAfter: Date;
    dueBefore: Date;

    constructor(obj?: any) {
        super(obj);
        this.assignment = obj && obj.assignment || null;
        this.dueAfter = obj && obj.dueAfter || null;
        this.dueBefore = obj && obj.dueBefore || null;
    }
}

export class TaskQueryRequestRepresentationModel {
    appDefinitionId: string;
    processInstanceId: string;
    processDefinitionId: string;
    processDefinitionKey: string;
    text: string;
    assignment: string;
    state: string;
    sort: string;
    page: number;
    size: number;

    constructor(obj?: any) {
        this.appDefinitionId = obj && obj.appDefinitionId || null;
        this.processInstanceId = obj && obj.processInstanceId || null;
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.processDefinitionKey = obj && obj.processDefinitionKey || null;
        this.text = obj && obj.text || null;
        this.assignment = obj && obj.assignment || null;
        this.state = obj && obj.state || null;
        this.sort = obj && obj.sort || null;
        this.page = obj && obj.page || 0;
        this.size = obj && obj.size || 25;
    }
}
