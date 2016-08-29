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
    initiatorCanCompleteTask: boolean = false;
    managerOfCandidateGroup: boolean = false;
    memberOfCandidateGroup: boolean = false;
    memberOfCandidateUsers: boolean = false;
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


    constructor(obj: any) {
        this.id = obj.id;
        this.name = obj.name;
        this.priority = obj.priority;
        this.assignee = new User(obj.assignee.id, obj.assignee.email, obj.assignee.firstName, obj.assignee.lastName);
        this.adhocTaskCanBeReassigned = obj.adhocTaskCanBeReassigned;
        this.created = obj.created;
        this.description = obj.description;
        this.dueDate = obj.dueDate;
        this.duration = obj.duration;
        this.endDate = obj.endDate;
        this.executionId = obj.executionId;
        this.formKey = obj.formKey;
        this.initiatorCanCompleteTask = obj.initiatorCanCompleteTask;
        this.managerOfCandidateGroup = obj.managerOfCandidateGroup;
        this.memberOfCandidateGroup = obj.memberOfCandidateGroup;
        this.memberOfCandidateUsers = obj.memberOfCandidateUsers;
        this.involvedPeople = obj.involvedPeople;
        this.parentTaskId = obj.parentTaskId;
        this.parentTaskName = obj.parentTaskName;
        this.processDefinitionCategory = obj.processDefinitionCategory;
        this.processDefinitionDeploymentId = obj.processDefinitionDeploymentId;
        this.processDefinitionDescription = obj.processDefinitionDescription;
        this.processDefinitionId = obj.processDefinitionId;
        this.processDefinitionKey = obj.processDefinitionKey;
        this.processDefinitionName = obj.processDefinitionName;
        this.processDefinitionVersion = obj.processDefinitionVersion;
        this.processInstanceId = obj.processInstanceId;
        this.processInstanceName = obj.processInstanceName;
        this.processInstanceStartUserId = obj.processInstanceStartUserId;
        this.taskDefinitionKey = obj.taskDefinitionKey;
    }
}
