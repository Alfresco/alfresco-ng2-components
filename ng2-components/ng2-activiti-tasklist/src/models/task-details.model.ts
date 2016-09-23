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
 * This object represent the details of a task.
 *
 *
 * @returns {TaskDetailsModel} .
 */
import { User } from './user.model';

export class TaskDetailsModel {
    id: string;
    name: string;
    assignee: User;
    priority: number;
    adhocTaskCanBeReassigned: number;
    category: string;
    created: string;
    description: string;
    dueDate: string;
    duration: string;
    endDate: string;
    executionId: string;
    formKey: string;
    initiatorCanCompleteTask: boolean;
    managerOfCandidateGroup: boolean;
    memberOfCandidateGroup: boolean;
    memberOfCandidateUsers: boolean;
    involvedPeople: User [];
    parentTaskId: string;
    parentTaskName: string;
    processDefinitionCategory: string;
    processDefinitionDeploymentId: string;
    processDefinitionDescription: string;
    processDefinitionId: string;
    processDefinitionKey: string;
    processDefinitionName: string;
    processDefinitionVersion: number = 0;
    processInstanceId: string;
    processInstanceName: string;
    processInstanceStartUserId: string;
    taskDefinitionKey: string;


    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.name = obj && obj.name || null;
        this.priority = obj && obj.priority;
        this.assignee = new User(obj.assignee);
        this.adhocTaskCanBeReassigned = obj && obj.adhocTaskCanBeReassigned;
        this.category = obj && obj.category || null;
        this.created = obj && obj.created || null;
        this.description = obj && obj.description || null;
        this.dueDate = obj && obj.dueDate || null;
        this.duration = obj && obj.duration || null;
        this.endDate = obj && obj.endDate || null;
        this.executionId = obj && obj.executionId || null;
        this.formKey = obj && obj.formKey || null;
        this.initiatorCanCompleteTask = obj && obj.initiatorCanCompleteTask || false;
        this.managerOfCandidateGroup = obj && obj.managerOfCandidateGroup || false;
        this.memberOfCandidateGroup = obj && obj.memberOfCandidateGroup || false;
        this.memberOfCandidateUsers = obj && obj.memberOfCandidateUsers || false;
        this.involvedPeople = obj && obj.involvedPeople;
        this.parentTaskId = obj && obj.parentTaskId || null;
        this.parentTaskName = obj && obj.parentTaskName || null;
        this.processDefinitionCategory = obj && obj.processDefinitionCategory || null;
        this.processDefinitionDeploymentId = obj && obj.processDefinitionDeploymentId || null;
        this.processDefinitionDescription = obj && obj.processDefinitionDescription || null;
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.processDefinitionKey = obj && obj.processDefinitionKey || null;
        this.processDefinitionName = obj && obj.processDefinitionName || null;
        this.processDefinitionVersion = obj && obj.processDefinitionVersion || 0;
        this.processInstanceId = obj && obj.processInstanceId || null;
        this.processInstanceName = obj && obj.processInstanceName || null;
        this.processInstanceStartUserId = obj && obj.processInstanceStartUserId || null;
        this.taskDefinitionKey = obj && obj.taskDefinitionKey || null;
    }
}
