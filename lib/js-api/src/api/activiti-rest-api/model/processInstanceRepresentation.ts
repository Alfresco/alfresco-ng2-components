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
import { LightUserRepresentation } from './lightUserRepresentation';
import { RestVariable } from './restVariable';

export class ProcessInstanceRepresentation {
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
    suspended?: boolean;
    tenantId?: string;
    variables?: RestVariable[];

    constructor(input?: Partial<ProcessInstanceRepresentation>) {
        if (input) {
            Object.assign(this, input);
            this.ended = input.ended ? DateAlfresco.parseDate(input.ended) : undefined;
            this.started = input.started ? DateAlfresco.parseDate(input.started) : undefined;
            this.startedBy = input.startedBy ? new LightUserRepresentation(input.startedBy) : undefined;
            if (input.variables) {
                this.variables = input.variables.map((item) => {
                    return new RestVariable(item);
                });
            }
        }
    }
}
