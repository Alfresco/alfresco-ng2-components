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

export class TaskFilterCloudModel  {
    id: string;
    name: string;
    key: string;
    icon: string;
    index: number;
    appName: string;
    processDefinitionId: string;
    state: string;
    sort: string;
    assignment: string;
    order: string;
    description: string;
    dueAfter: Date;
    dueBefore: Date;
    owner: string;
    processInstanceId: string;
    claimedDateFrom: Date;
    claimedDateTo: Date;
    createdDateFrom: Date;
    createdDateTo: Date;
    dueDateFrom: Date;
    dueDateTo: Date;
    taskName: string;
    parentTaskId: string;
    priority: number;
    standAlone: any;
    lastModifiedFrom: Date;
    lastModifiedTo: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substr(2, 9);
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.icon = obj.icon || null;
            this.index = obj.index || null;
            this.appName = obj.appName || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.state = obj.state || null;
            this.sort = obj.sort || null;
            this.assignment = obj.assignment || null;
            this.order = obj.order || null;
            this.description = obj.description || null;
            this.dueAfter = obj.dueAfter || null;
            this.dueBefore = obj.dueBefore || null;
            this.processInstanceId = obj.processInstanceId || null;
            this.claimedDateFrom = obj.claimedDateFrom || null;
            this.claimedDateTo = obj.claimedDateTo || null;
            this.createdDateFrom = obj.createdDateFrom || null;
            this.createdDateTo = obj.createdDateTo || null;
            this.dueDateFrom = obj.dueDateFrom || null;
            this.dueDateTo = obj.dueDateTo || null;
            this.taskName = obj.taskName || null;
            this.parentTaskId = obj.parentTaskId || null;
            this.owner = obj.owner;
            this.priority = obj.priority || null;
            this.standAlone = obj.standAlone || null;
            this.lastModifiedFrom = obj.lastModifiedFrom || null;
            this.lastModifiedTo = obj.lastModifiedTo || null;
        }
    }
}
export class FilterParamsModel {

    id?: string;
    name?: string;
    key?: string;
    index?: number;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.index = obj.index;
        }
    }
}

export interface FilterActionType {
    actionType: string;
    filter: TaskFilterCloudModel;
}

export class TaskFilterAction {
    actionType: string;
    icon: string;
    tooltip: string;

    constructor(obj?: any) {
        if (obj) {
            this.actionType = obj.actionType || null;
            this.icon = obj.icon || null;
            this.tooltip = obj.tooltip || null;
        }
    }
}

export interface FilterOptions {
    label?: string;
    value?: string;
}

export class TaskFilterProperties {
    label: string;
    type: string;
    value: string;
    key: string;
    options: FilterOptions[];

    constructor(obj?: any) {
        if (obj) {
            this.label = obj.label || null;
            this.type = obj.type || null;
            this.value = obj.value || null;
            this.key = obj.key || null;
            this.options = obj.options || null;
        }
    }
}
