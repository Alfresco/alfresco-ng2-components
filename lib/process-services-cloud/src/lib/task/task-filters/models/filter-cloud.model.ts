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

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */

import { DateCloudFilterType } from '../../../models/date-cloud-filter.model';
import { DateRangeFilterService } from '../../../common/date-range-filter/date-range-filter.service';
import { ComponentSelectionMode } from '../../../types';
import { IdentityGroupModel } from '../../../group/models/identity-group.model';
import { IdentityUserModel } from '../../../people/models/identity-user.model';

export class TaskFilterCloudModel  {
    id: string;
    name: string;
    key: string;
    environmentId?: string;
    icon: string;
    index: number;
    appName: string;
    status: TaskStatusFilter;
    sort: string;
    assignee: string;
    assignedUsers: IdentityUserModel[];
    candidateGroups: IdentityGroupModel[];
    order: string;
    owner: string;
    processDefinitionName?: string;
    processDefinitionId: string;
    processInstanceId: string;
    createdDate: Date;
    dueDateType: DateCloudFilterType;
    dueDate: Date;
    taskName: string;
    taskId: string;
    parentTaskId: string;
    priority: number;
    standalone: boolean;
    lastModifiedFrom: string;
    lastModifiedTo: string;
    completedDateType: DateCloudFilterType;
    createdDateType: DateCloudFilterType;
    assignmentType: AssignmentType;
    completedDate: Date;
    completedBy: IdentityUserModel;
    showCounter: boolean;

    private _completedFrom: string;
    private _completedTo: string;
    private _dueDateFrom: string;
    private _dueDateTo: string;
    private _createdFrom: string;
    private _createdTo: string;
    private dateRangeFilterService = new DateRangeFilterService();

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substr(2, 9);
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.environmentId = obj.environmentId || null;
            this.icon = obj.icon || null;
            this.index = obj.index || null;
            this.appName = obj.appName || obj.appName === '' ? obj.appName : null;
            this.status = obj.status || null;
            this.sort = obj.sort || null;
            this.assignee = obj.assignee || null;
            this.assignedUsers = obj.assignedUsers || null;
            this.order = obj.order || null;
            this.owner = obj.owner || null;
            this.processDefinitionName = obj.processDefinitionName || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.processInstanceId = obj.processInstanceId || null;
            this.createdDate = obj.createdDate || null;
            this.dueDateType = obj.dueDateType || null;
            this.dueDate = obj.dueDate || null;
            this._dueDateFrom = obj._dueDateFrom || null;
            this._dueDateTo = obj._dueDateTo || null;
            this.taskName = obj.taskName || null;
            this.taskId = obj.taskId || null;
            this.parentTaskId = obj.parentTaskId || null;
            this.priority = obj.priority || null;
            this.standalone = obj.standalone || null;
            this.lastModifiedFrom = obj.lastModifiedFrom || null;
            this.lastModifiedTo = obj.lastModifiedTo || null;
            this.completedBy = obj.completedBy || null;
            this.completedDateType = obj.completedDateType || null;
            this.completedFrom = obj._completedFrom || null;
            this.completedTo = obj._completedTo || null;
            this.completedDate = obj.completedDate || null;
            this.createdDateType = obj.createdDateType || null;
            this.createdFrom = obj._createdFrom || null;
            this.createdTo = obj._createdTo || null;
            this.candidateGroups = obj.candidateGroups || null;
            this.showCounter = obj.showCounter || false;
        }
    }

    set dueDateFrom(dueDateFrom: string) {
        this._dueDateFrom = dueDateFrom;
    }

    get dueDateFrom() {
        if (this.isDateRangeType(this.dueDateType)) {
            return this._dueDateFrom;
        }
        return this.getStartDate(this.dueDateType);
    }

    set dueDateTo(dueDateTo: string) {
        this._dueDateTo = dueDateTo;
    }

    get dueDateTo() {
        if (this.isDateRangeType(this.dueDateType)) {
            return this._dueDateTo;
        }
        return this.getEndDate(this.dueDateType);
    }

    set completedFrom(completedFrom: string) {
        this._completedFrom = completedFrom;
    }

    get completedFrom(): string {
        if (this.isDateRangeType(this.completedDateType)) {
            return this._completedFrom;
        }
        return this.getStartDate(this.completedDateType);
    }

    set completedTo(completedTo: string) {
        this._completedTo = completedTo;
    }

    get completedTo(): string {
        if (this.isDateRangeType(this.completedDateType)) {
            return this._completedTo;
        }
        return this.getEndDate(this.completedDateType);
    }

    set createdFrom(createdFrom: string) {
        this._createdFrom = createdFrom;
    }

    get createdFrom() {
        if (this.isDateRangeType(this.createdDateType)) {
            return this._createdFrom;
        }
        return this.getStartDate(this.createdDateType);
    }

    set createdTo(createdTo: string) {
        this._createdTo = createdTo;
    }

    get createdTo() {
        if (this.isDateRangeType(this.createdDateType)) {
            return this._createdTo;
        }
        return this.getEndDate(this.createdDateType);
    }

    private getStartDate(key: DateCloudFilterType) {
        return this.dateRangeFilterService.getDateRange(key).startDate;
    }

    private getEndDate(key: DateCloudFilterType) {
        return this.dateRangeFilterService.getDateRange(key).endDate;
    }

    private isDateRangeType(type: DateCloudFilterType) {
        return !!this.dateRangeFilterService.isDateRangeType(type);
    }
}

export interface ServiceTaskFilterCloudModel {
    id?: string;
    name?: string;
    environmentId?: string;
    key?: string;
    icon?: string;
    index?: number;
    appName?: string;
    status?: string;
    sort?: string;
    order?: string;
    activityName?: string;
    activityType?: string;
    completedDate?: Date;
    elementId?: string;
    executionId?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionVersion?: number;
    processInstanceId?: string;
    serviceTaskId?: string;
    serviceFullName?: string;
    serviceName?: string;
    serviceVersion?: string;
    startedDate?: Date;
}

export interface FilterParamsModel {
    id?: string;
    name?: string;
    key?: string;
    index?: number;
}

export interface TaskFilterAction {
    actionType?: string;
    icon?: string;
    tooltip?: string;
    filter?: TaskFilterCloudModel | ServiceTaskFilterCloudModel;
}

export interface FilterOptions {
    label?: string;
    value?: string;
}

export enum AssignmentType {
    CURRENT_USER = 'CURRENT_USER',
    UNASSIGNED = 'UNASSIGNED',
    NONE = 'NONE',
    CANDIDATE_GROUPS = 'CANDIDATE_GROUPS',
    ASSIGNED_TO = 'ASSIGNED_TO'
}

export enum TaskStatusFilter {
    ALL = '',
    CREATED = 'CREATED',
    ASSIGNED = 'ASSIGNED',
    SUSPENDED = 'SUSPENDED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

export interface TaskFilterProperties {
    label?: string;
    type?: string;
    value?: any;
    key?: string;
    attributes?: { [key: string]: string };
    options?: FilterOptions[];
    dateFilterOptions?: DateCloudFilterType[];
    selectionMode?: ComponentSelectionMode;
}
