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

import { LightUserRepresentation, ProcessInstanceRepresentation, RestVariable } from '@alfresco/js-api';

export class ProcessInstance implements ProcessInstanceRepresentation {

    businessKey?: string;
    ended?: Date;
    graphicalNotationDefined?: boolean;
    id?: string;
    name?: string;
    processDefinitionCategory?: string;
    processDefinitionDeploymentId?: string;
    processDefinitionDescription?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    startFormDefined?: boolean;
    started?: Date;
    startedBy?: LightUserRepresentation;
    tenantId?: string;
    variables?: RestVariable[];

    constructor(data?: any) {
        this.businessKey = data && data.businessKey !== undefined ? data.businessKey : null;
        this.ended = data && data.ended !== undefined ? data.ended : null;
        this.graphicalNotationDefined = data && data.graphicalNotationDefined !== undefined ? data.graphicalNotationDefined : null;
        this.id = data && data.id !== undefined ? data.id : null;
        this.name = data && data.name !== undefined ? data.name : null;
        this.processDefinitionCategory = data && data.processDefinitionCategory !== undefined ? data.processDefinitionCategory : null;
        this.processDefinitionDeploymentId = data && data.processDefinitionDeploymentId !== undefined ? data.processDefinitionDeploymentId : null;
        this.processDefinitionDescription = data && data.processDefinitionDescription !== undefined ? data.processDefinitionDescription : null;
        this.processDefinitionId = data && data.processDefinitionId !== undefined ? data.processDefinitionId : null;
        this.processDefinitionKey = data && data.processDefinitionKey !== undefined ? data.processDefinitionKey : null;
        this.processDefinitionName = data && data.processDefinitionName !== undefined ? data.processDefinitionName : null;
        this.processDefinitionVersion = data && data.processDefinitionVersion !== undefined ? data.processDefinitionVersion : null;
        this.startFormDefined = data && data.startFormDefined !== undefined ? data.startFormDefined : null;
        this.started = data && data.started !== undefined ? data.started : null;
        this.startedBy = data && data.startedBy !== undefined ? data.startedBy : null;
        this.tenantId = data && data.tenantId !== undefined ? data.tenantId : null;
        this.variables = data && data.variables !== undefined ? data.variables : null;
    }

}
