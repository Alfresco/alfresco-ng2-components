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

export interface TaskDetailsCloudModel {
    id?: string;
    name?: string;
    appName?: string;
    assignee?: string;
    appVersion?: number;
    createdDate?: Date;
    claimedDate?: Date;
    completedDate?: Date;
    formKey?: any;
    category?: any;
    description?: string;
    dueDate?: Date;
    lastModified?: Date;
    lastModifiedTo?: Date;
    lastModifiedFrom?: Date;
    owner?: any;
    parentTaskId?: string;
    priority?: number;
    processDefinitionId?: string;
    processInstanceId?: string;
    status?: TaskStatus;
    standalone?: boolean;
    candidateUsers?: string[];
    candidateGroups?: string[];
    managerOfCandidateGroup?: boolean;
    memberOfCandidateGroup?: boolean;
    memberOfCandidateUsers?: boolean;
    processDefinitionDeploymentId?: string;
}

export interface StartTaskCloudResponseModel {
    entry: TaskDetailsCloudModel;
}

export type TaskStatus = |
    'COMPLETED' |
    'CREATED' |
    'ASSIGNED' |
    'SUSPENDED' |
    'CANCELLED';
