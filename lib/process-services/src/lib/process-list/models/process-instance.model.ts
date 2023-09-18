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
        this.businessKey = data?.businessKey;
        this.ended = data?.ended;
        this.graphicalNotationDefined = data?.graphicalNotationDefined;
        this.id = data?.id;
        this.name = data?.name;
        this.processDefinitionCategory = data?.processDefinitionCategory;
        this.processDefinitionDeploymentId = data?.processDefinitionDeploymentId;
        this.processDefinitionDescription = data?.processDefinitionDescription;
        this.processDefinitionId = data?.processDefinitionId;
        this.processDefinitionKey = data?.processDefinitionKey;
        this.processDefinitionName = data?.processDefinitionName;
        this.processDefinitionVersion = data?.processDefinitionVersion;
        this.startFormDefined = data?.startFormDefined;
        this.started = data?.started;
        this.startedBy = data?.startedBy;
        this.tenantId = data?.tenantId;
        this.variables = data?.variables;
    }
}
