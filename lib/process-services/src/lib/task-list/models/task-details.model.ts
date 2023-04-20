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

/**
 * This object represent the details of a task.
 */
import { TaskRepresentation } from '@alfresco/js-api';
import { UserProcessModel } from '../../common/models/user-process.model';
import { UserGroupModel } from './user-group.model';

export class TaskDetailsModel implements TaskRepresentation {
    id?: string;
    name?: string;
    assignee?: UserProcessModel;
    priority?: number;
    adhocTaskCanBeReassigned?: boolean;
    category?: string;
    created?: Date;
    description?: string;
    parentName?: string;
    dueDate?: Date;
    duration?: number;
    endDate?: Date;
    executionId?: string;
    formKey?: string;
    initiatorCanCompleteTask?: boolean;
    managerOfCandidateGroup?: boolean;
    memberOfCandidateGroup?: boolean;
    memberOfCandidateUsers?: boolean;
    involvedGroups?: UserGroupModel [];
    involvedPeople?: UserProcessModel [];
    parentTaskId?: string;
    parentTaskName?: string;
    processDefinitionCategory?: string;
    processDefinitionDeploymentId?: string;
    processDefinitionDescription?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number = 0;
    processInstanceId?: string;
    processInstanceName?: string;
    processInstanceStartUserId?: string;
    taskDefinitionKey?: string;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.name = obj.name || null;
            this.priority = obj.priority;
            this.assignee = obj.assignee ? new UserProcessModel(obj.assignee) : null;
            this.adhocTaskCanBeReassigned = obj.adhocTaskCanBeReassigned;
            this.category = obj.category || null;
            this.created = obj.created || null;
            this.description = obj.description || null;
            this.dueDate = obj.dueDate || null;
            this.duration = obj.duration || null;
            this.endDate = obj.endDate || null;
            this.executionId = obj.executionId || null;
            this.formKey = obj.formKey || null;
            this.initiatorCanCompleteTask = !!obj.initiatorCanCompleteTask;
            this.managerOfCandidateGroup = !!obj.managerOfCandidateGroup;
            this.memberOfCandidateGroup = !!obj.memberOfCandidateGroup;
            this.memberOfCandidateUsers = !!obj.memberOfCandidateUsers;
            this.involvedGroups = obj.involvedGroups;
            this.involvedPeople = obj.involvedPeople;
            this.parentTaskId = obj.parentTaskId || null;
            this.parentTaskName = obj.parentTaskName || null;
            this.processDefinitionCategory = obj.processDefinitionCategory || null;
            this.processDefinitionDeploymentId = obj.processDefinitionDeploymentId || null;
            this.processDefinitionDescription = obj.processDefinitionDescription || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.processDefinitionKey = obj.processDefinitionKey || null;
            this.processDefinitionName = obj.processDefinitionName || null;
            this.processDefinitionVersion = obj.processDefinitionVersion || 0;
            this.processInstanceId = obj.processInstanceId || null;
            this.processInstanceName = obj.processInstanceName || null;
            this.processInstanceStartUserId = obj.processInstanceStartUserId || null;
            this.taskDefinitionKey = obj.taskDefinitionKey || null;
        }
    }

    getFullName(): string {
        let fullName: string = '';

        if (this.assignee) {
            const firstName: string = this.assignee.firstName ? this.assignee.firstName : '';
            const lastName: string = this.assignee.lastName ? this.assignee.lastName : '';
            fullName = `${firstName} ${lastName}`;
        }

        return fullName.trim();
    }

    isCompleted(): boolean {
        return !!this.endDate;
    }
}
