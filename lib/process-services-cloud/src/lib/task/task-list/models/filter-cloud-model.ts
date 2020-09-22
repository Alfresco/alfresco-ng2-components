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

import { TaskListCloudSortingModel } from './task-list-sorting.model';

export class TaskQueryCloudRequestModel {
    appName: string;
    appVersion?: string;
    assignee?: string;
    claimedDate?: string;
    createdDate?: Date;
    description?: string;
    dueDate?: null;
    lastModifiedFrom?: null;
    lastModifiedTo?: null;
    dueDateFrom?: null;
    dueDateTo?: null;
    id?: string;
    name?: string;
    owner?: string;
    parentTaskId?: string;
    standalone?: boolean;
    priority?: number;
    processDefinitionId?: string;
    processDefinitionName?: string;
    processInstanceId?: string;
    status?: string;
    maxItems: number;
    skipCount: number;
    sorting?: TaskListCloudSortingModel[];

    constructor(obj?: any) {
        if (obj) {
            this.appName = obj.appName;
            this.appVersion = obj.appVersion;
            this.assignee = obj.assignee;
            this.claimedDate = obj.claimedDate;
            this.createdDate = obj.createdDate;
            this.description = obj.description;
            this.dueDate = obj.dueDate;
            this.lastModifiedFrom = obj.lastModifiedFrom;
            this.lastModifiedTo = obj.lastModifiedTo;
            this.dueDateFrom = obj.dueDateFrom;
            this.dueDateTo = obj.dueDateTo;
            this.id = obj.id;
            this.name = obj.name;
            this.owner = obj.owner;
            this.parentTaskId = obj.parentTaskId;
            this.standalone = obj.standalone;
            this.priority = obj.priority;
            this.processDefinitionId = obj.processDefinitionId;
            this.processDefinitionName = obj.processDefinitionName;
            this.processInstanceId = obj.processInstanceId;
            this.status = obj.status;
            this.maxItems = obj.maxItems;
            this.skipCount = obj.skipCount;
            this.sorting = obj.sorting;
        }
    }
}

export class ServiceTaskQueryCloudRequestModel {
    appName: string;
    appVersion?: string;
    id?: string;
    status?: string;
    maxItems: number;
    skipCount: number;
    sorting?: TaskListCloudSortingModel[];
    activityName?: string;
    activityType?: string;
    completedDate?: Date;
    elementId?: string;
    executionId?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionVersion?: number;
    processInstanceId?: string;
    serviceFullName?: string;
    serviceName?: string;
    serviceVersion?: string;
    startedDate?: Date;

    constructor(obj?: any) {

        if (obj) {
            this.appName = obj.appName;
            this.appVersion = obj.appVersion;
            this.id = obj.id;
            this.status = obj.status;
            this.maxItems = obj.maxItems;
            this.skipCount = obj.skipCount;
            this.sorting = obj.sorting;
            this.activityName = obj.activityName;
            this.activityType = obj.activityType;
            this.elementId = obj.elementId;
            this.executionId = obj.executionId;
            this.processDefinitionKey = obj.processDefinitionKey;
            this.processDefinitionVersion = obj.processDefinitionVersion;
            this.processInstanceId = obj.processInstanceId;
            this.completedDate = obj.completedDate;
            this.startedDate = obj.startedDate;
            this.serviceVersion = obj.serviceVersion;
            this.serviceName = obj.serviceName;
            this.serviceFullName = obj.serviceFullName;
        }
    }
}
