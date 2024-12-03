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

import { Pagination } from '@alfresco/js-api';
import { TaskListCloudSortingModel, TaskListRequestSortingModel } from './task-list-sorting.model';
import { TaskFilterCloudModel } from '../task/task-filters/models/filter-cloud.model';
import { ProcessVariableFilterModel } from './process-variable-filter.model';

export class TaskQueryCloudRequestModel {
    appName: string;
    appVersion?: string;
    assignee?: string;
    environmentId?: string;
    claimedDate?: string;
    createdDate?: Date;
    createdFrom?: string;
    createdTo?: string;
    description?: string;
    dueDate?: any;
    lastModifiedFrom?: any;
    lastModifiedTo?: any;
    dueDateFrom?: any;
    dueDateTo?: any;
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
    completedBy?: string;
    maxItems: number;
    skipCount: number;
    sorting?: TaskListCloudSortingModel[];
    completedDate?: Date;
    completedFrom?: string;
    completedTo?: string;
    candidateGroupId?: string;
    variableKeys?: string[];

    constructor(obj?: any) {
        if (obj) {
            this.appName = obj.appName;
            this.appVersion = obj.appVersion;
            this.assignee = obj.assignee;
            this.environmentId = obj.environmentId;
            this.claimedDate = obj.claimedDate;
            this.createdDate = obj.createdDate;
            this.createdFrom = obj.createdFrom;
            this.createdTo = obj.createdTo;
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
            this.completedBy = obj.completedBy;
            this.maxItems = obj.maxItems;
            this.skipCount = obj.skipCount;
            this.sorting = obj.sorting;
            this.completedFrom = obj.completedFrom;
            this.completedTo = obj.completedTo;
            this.completedDate = obj.completedDate;
            this.candidateGroupId = obj.candidateGroupId;
            this.variableKeys = obj.variableKeys;
        }
    }
}

export class TaskListRequestModel {
    appName: string;
    pagination?: Pagination;
    sorting?: TaskListRequestSortingModel;

    onlyStandalone?: boolean;
    onlyRoot?: boolean;
    name?: string[];
    description?: string[];
    processDefinitionName?: string[];
    processName?: string[];
    priority?: string[];
    status?: string[];
    completedBy?: string[];
    assignee?: string[];
    processInstanceId?: string;
    createdFrom?: string;
    createdTo?: string;
    lastModifiedFrom?: string;
    lastModifiedTo?: string;
    lastClaimedFrom?: string;
    lastClaimedTo?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    completedFrom?: string;
    completedTo?: string;
    candidateUserId?: string[];
    candidateGroupId?: string[];

    processVariableKeys?: string[];
    processVariableFilters?: ProcessVariableFilterModel[];

    constructor(obj: Partial<TaskListRequestModel>) {
        if (!obj.appName) {
            throw new Error('appName not configured');
        }

        this.appName = obj.appName;
        this.pagination = obj.pagination;
        this.sorting = obj.sorting;

        this.onlyStandalone = obj.onlyStandalone;
        this.onlyRoot = obj.onlyRoot;
        this.name = obj.name;
        this.description = obj.description;
        this.processDefinitionName = obj.processDefinitionName;
        this.processName = obj.processName;
        this.priority = obj.priority;
        this.status = obj.status;
        this.completedBy = obj.completedBy;
        this.assignee = obj.assignee;
        this.processInstanceId = obj.processInstanceId;
        this.createdFrom = obj.createdFrom;
        this.createdTo = obj.createdTo;
        this.lastModifiedFrom = obj.lastModifiedFrom;
        this.lastModifiedTo = obj.lastModifiedTo;
        this.lastClaimedFrom = obj.lastClaimedFrom;
        this.lastClaimedTo = obj.lastClaimedTo;
        this.dueDateFrom = obj.dueDateFrom;
        this.dueDateTo = obj.dueDateTo;
        this.completedFrom = obj.completedFrom;
        this.completedTo = obj.completedTo;
        this.candidateUserId = obj.candidateUserId;
        this.candidateGroupId = obj.candidateGroupId;
        this.processVariableFilters = obj.processVariableFilters ?? [];
        this.processVariableKeys = obj.processVariableKeys;
    }
}

export class TaskFilterCloudAdapter extends TaskListRequestModel {
    constructor(filter: TaskFilterCloudModel) {
        super({
            appName: filter.appName,
            pagination: { maxItems: 25, skipCount: 0 },
            sorting: new TaskListRequestSortingModel({
                orderBy: filter.sort,
                direction: filter.order,
                isFieldProcessVariable: false
            }),

            onlyStandalone: filter.standalone,
            name: filter.taskNames,
            processDefinitionName: filter.processDefinitionNames,
            processName: filter.processNames,
            priority: filter.priorities?.map((priority) => priority.toString()),
            status: filter.statuses,
            completedBy: filter.completedByUsers,
            assignee: filter.assignees,
            createdFrom: filter.createdFrom,
            createdTo: filter.createdTo,
            lastModifiedFrom: filter.lastModifiedFrom,
            lastModifiedTo: filter.lastModifiedTo,
            dueDateFrom: filter.dueDateFrom,
            dueDateTo: filter.dueDateTo,
            completedFrom: filter.completedFrom,
            completedTo: filter.completedTo,
            candidateGroupId: filter.candidateGroups?.map((group) => group.id)
        });
    }
}
