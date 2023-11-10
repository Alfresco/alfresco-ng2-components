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
import { LightGroupRepresentation } from './lightGroupRepresentation';
import { LightUserRepresentation } from './lightUserRepresentation';
import { RestVariable } from './restVariable';

export class TaskRepresentation {
    adhocTaskCanBeReassigned?: boolean;
    assignee?: LightUserRepresentation;
    category?: string;
    created?: Date;
    description?: string;
    dueDate?: Date;
    duration?: number;
    endDate?: Date;
    executionId?: string;
    formKey?: string;
    id?: string;
    initiatorCanCompleteTask?: boolean;
    involvedGroups?: LightGroupRepresentation[];
    involvedPeople?: LightUserRepresentation[];
    managerOfCandidateGroup?: boolean;
    memberOfCandidateGroup?: boolean;
    memberOfCandidateUsers?: boolean;
    name?: string;
    parentTaskId?: string;
    parentTaskName?: string;
    priority?: number;
    processDefinitionCategory?: string;
    processDefinitionDeploymentId?: string;
    processDefinitionDescription?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processInstanceId?: string;
    processInstanceName?: string;
    processInstanceStartUserId?: string;
    taskDefinitionKey?: string;
    variables?: RestVariable[];
    parentName?: string;

    constructor(input?: Partial<TaskRepresentation>) {
        if (input) {
            Object.assign(this, input);
            this.assignee = input.assignee ? new LightUserRepresentation(input.assignee) : undefined;
            this.created = input.created ? DateAlfresco.parseDate(input.created) : undefined;
            this.dueDate = input.dueDate ? DateAlfresco.parseDate(input.dueDate) : undefined;
            this.endDate = input.endDate ? DateAlfresco.parseDate(input.endDate) : undefined;
            if (input.involvedGroups) {
                this.involvedGroups = input.involvedGroups.map((item) => {
                    return new LightGroupRepresentation(item);
                });
            }
            if (input.involvedPeople) {
                this.involvedPeople = input.involvedPeople.map((item) => {
                    return new LightUserRepresentation(item);
                });
            }
            if (input.variables) {
                this.variables = input.variables.map((item) => {
                    return new RestVariable(item);
                });
            }
        }
    }

    getFullName(): string {
        let fullName = '';

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
