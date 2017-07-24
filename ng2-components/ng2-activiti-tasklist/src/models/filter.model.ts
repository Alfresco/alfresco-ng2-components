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
    icon: string;
    id: number;
    modelId: number;
    tenantId: number;

    constructor(obj?: any) {
        if (obj) {
            this.defaultAppId = obj.defaultAppId;
            this.deploymentId = obj.deploymentId;
            this.name = obj.name;
            this.description = obj.description;
            this.theme = obj.theme;
            this.icon = obj.icon;
            this.id = obj.id;
            this.modelId = obj.modelId;
            this.tenantId = obj.tenantId;
        }
    }
}

/**
 *
 * This object represent the parameters to filter a filter.
 *
 *
 * @returns {FilterParamsModel} .
 */
export class FilterParamsModel {
    id: string;
    name: string;
    index: number;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id;
            this.name = obj.name;
            this.index = obj.index;
        }
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
    id: string;
    appId: string;
    name: string;
    recent: boolean;
    icon: string;
    filter: FilterParamRepresentationModel;
    index: number;
    landingTaskId: string;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id;
            this.appId = obj.appId;
            this.name = obj.name;
            this.recent = !!obj.recent;
            this.icon = obj.icon;
            this.filter = new FilterParamRepresentationModel(obj.filter);
            this.index = obj.index;
            this.landingTaskId = obj.landingTaskId;
        }
    }

    hasFilter() {
        return this.filter ? true : false;
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
    assignment: string;
    dueAfter: Date;
    dueBefore: Date;

    constructor(obj?: any) {
        if (obj) {
            this.processDefinitionId = obj.processDefinitionId;
            this.processDefinitionKey = obj.processDefinitionKey;
            this.name = obj.name;
            this.state = obj.state;
            this.sort = obj.sort;
            this.assignment = obj.assignment;
            this.dueAfter = obj.dueAfter;
            this.dueBefore = obj.dueBefore;
        }
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
    landingTaskId: string;

    constructor(obj?: any) {
        if (obj) {

            this.appDefinitionId = obj.appDefinitionId;
            this.processInstanceId = obj.processInstanceId;
            this.processDefinitionId = obj.processDefinitionId;
            this.processDefinitionKey = obj.processDefinitionKey;
            this.text = obj.text;
            this.assignment = obj.assignment;
            this.state = obj.state;
            this.sort = obj.sort;
            this.page = obj.page || 0;
            this.size = obj.size || 25;
            this.landingTaskId = obj.landingTaskId || '';
        }
    }
}
