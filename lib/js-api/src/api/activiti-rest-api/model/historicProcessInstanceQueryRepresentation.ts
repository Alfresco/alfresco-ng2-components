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

export class HistoricProcessInstanceQueryRepresentation {
    excludeSubprocesses?: boolean;
    finished?: boolean;
    finishedAfter?: Date;
    finishedBefore?: Date;
    includeProcessVariables?: boolean;
    involvedUser?: string;
    order?: string;
    processBusinessKey?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processInstanceId?: string;
    processInstanceIds?: string[];
    size?: number;
    sort?: string;
    start?: number;
    startedAfter?: Date;
    startedBefore?: Date;
    startedBy?: string;
    superProcessInstanceId?: string;
    tenantId?: string;
    tenantIdLike?: string;
    variables?: QueryVariable[];
    withoutTenantId?: boolean;

    constructor(input?: Partial<HistoricProcessInstanceQueryRepresentation>) {
        if (input) {
            Object.assign(this, input);
            this.finishedAfter = input.finishedAfter ? DateAlfresco.parseDate(input.finishedAfter) : undefined;
            this.finishedBefore = input.finishedBefore ? DateAlfresco.parseDate(input.finishedBefore) : undefined;
            this.startedAfter = input.startedAfter ? DateAlfresco.parseDate(input.startedAfter) : undefined;
            this.startedBefore = input.startedBefore ? DateAlfresco.parseDate(input.startedBefore) : undefined;
            if (input.variables) {
                this.variables = input.variables.map((item) => {
                    return new QueryVariable(item);
                });
            }
        }
    }
}
