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

import { DateAlfresco } from '../../content-custom-api/model/dateAlfresco';
import { QueryVariable } from './queryVariable';

export class HistoricTaskInstanceQueryRepresentation {
    dueDate?: Date;
    dueDateAfter?: Date;
    dueDateBefore?: Date;
    executionId?: string;
    finished?: boolean;
    includeProcessVariables?: boolean;
    includeTaskLocalVariables?: boolean;
    order?: string;
    parentTaskId?: string;
    processBusinessKey?: string;
    processBusinessKeyLike?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionKeyLike?: string;
    processDefinitionName?: string;
    processDefinitionNameLike?: string;
    processFinished?: boolean;
    processInstanceId?: string;
    processVariables?: QueryVariable[];
    size?: number;
    sort?: string;
    start?: number;
    taskAssignee?: string;
    taskAssigneeLike?: string;
    taskCandidateGroup?: string;
    taskCompletedAfter?: Date;
    taskCompletedBefore?: Date;
    taskCompletedOn?: Date;
    taskCreatedAfter?: Date;
    taskCreatedBefore?: Date;
    taskCreatedOn?: Date;
    taskDefinitionKey?: string;
    taskDefinitionKeyLike?: string;
    taskDeleteReason?: string;
    taskDeleteReasonLike?: string;
    taskDescription?: string;
    taskDescriptionLike?: string;
    taskId?: string;
    taskInvolvedUser?: string;
    taskMaxPriority?: number;
    taskMinPriority?: number;
    taskName?: string;
    taskNameLike?: string;
    taskOwner?: string;
    taskOwnerLike?: string;
    taskPriority?: number;
    taskVariables?: QueryVariable[];
    tenantId?: string;
    tenantIdLike?: string;
    withoutDueDate?: boolean;
    withoutTenantId?: boolean;

    constructor(input?: Partial<HistoricTaskInstanceQueryRepresentation>) {
        if (input) {
            Object.assign(this, input);
            this.dueDate = input.dueDate ? DateAlfresco.parseDate(input.dueDate) : undefined;
            this.dueDateAfter = input.dueDateAfter ? DateAlfresco.parseDate(input.dueDateAfter) : undefined;
            this.dueDateBefore = input.dueDateBefore ? DateAlfresco.parseDate(input.dueDateBefore) : undefined;
            if (input.processVariables) {
                this.processVariables = input.processVariables.map((item) => {
                    return new QueryVariable(item);
                });
            }
            this.taskCompletedAfter = input.taskCompletedAfter ? DateAlfresco.parseDate(input.taskCompletedAfter) : undefined;
            this.taskCompletedBefore = input.taskCompletedBefore ? DateAlfresco.parseDate(input.taskCompletedBefore) : undefined;
            this.taskCompletedOn = input.taskCompletedOn ? DateAlfresco.parseDate(input.taskCompletedOn) : undefined;
            this.taskCreatedAfter = input.taskCreatedAfter ? DateAlfresco.parseDate(input.taskCreatedAfter) : undefined;
            this.taskCreatedBefore = input.taskCreatedBefore ? DateAlfresco.parseDate(input.taskCreatedBefore) : undefined;
            this.taskCreatedOn = input.taskCreatedOn ? DateAlfresco.parseDate(input.taskCreatedOn) : undefined;
            if (input.taskVariables) {
                this.taskVariables = input.taskVariables.map((item) => {
                    return new QueryVariable(item);
                });
            }
        }
    }

}
