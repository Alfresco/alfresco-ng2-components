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

export class DecisionAuditRepresentation {
    activityId?: string;
    activityName?: string;
    auditTrailJson?: string;
    created?: Date;
    decisionExecutionFailed?: boolean;
    decisionKey?: string;
    decisionModelJson?: string;
    decisionName?: string;
    dmnDeploymentId?: number;
    executionId?: string;
    id?: number;
    processDefinitionId?: string;
    processInstanceId?: string;
    renderedVariables?: any;

    constructor(input?: Partial<DecisionAuditRepresentation>) {
        if (input) {
            Object.assign(this, input);
            this.created = input.created ? DateAlfresco.parseDate(input.created) : undefined;
        }
    }
}
