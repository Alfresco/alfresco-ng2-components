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
    id?: string;
    name?: string;
    owner?: string;
    parentTaskId?: string;
    standalone?: boolean;
    priority?: number;
    processDefinitionId?: string;
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
            this.id = obj.id;
            this.name = obj.name;
            this.owner = obj.owner;
            this.parentTaskId = obj.parentTaskId;
            this.standalone = obj.standalone;
            this.priority = obj.priority;
            this.processDefinitionId = obj.processDefinitionId;
            this.processInstanceId = obj.processInstanceId;
            this.status = obj.status;
            this.maxItems = obj.maxItems;
            this.skipCount = obj.skipCount;
            this.sorting = obj.sorting;
        }
    }
}
