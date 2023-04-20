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

import { Pagination } from '@alfresco/js-api';
import { IdentityGroupModel } from '../group/models/identity-group.model';
import { IdentityUserModel } from '../people/models/identity-user.model';
import { ProcessInstanceVariable } from './process-instance-variable.model';

export class TaskCloudNodePaging {
    list: TaskCloudPagingList;
}

export class TaskCloudPagingList {
    pagination: Pagination;
    entries: TaskCloudEntryModel[];
}

export class TaskCloudEntryModel {
    entry: TaskCloudModel;
}

export interface TaskCloudModel {
    appName: string;
    appVersion: string;
    assignee: string;
    candidateGroups: IdentityGroupModel[];
    candidateUsers: IdentityUserModel[];
    createdDate: string;
    formKey: string;
    id: string;
    inFinalState: boolean;
    lastModified: string;
    name: string;
    priority: number;
    processDefinitionId: string;
    processDefinitionName: string;
    processDefinitionVersion: number;
    processInstanceId: string;
    serviceFullName: string;
    serviceName: string;
    serviceVersion: string;
    standalone: boolean;
    status: string;
    taskDefinitionKey: string;
    processVariables?: ProcessInstanceVariable[];
 }
