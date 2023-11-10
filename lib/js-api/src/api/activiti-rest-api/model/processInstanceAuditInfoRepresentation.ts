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

import { AuditDecisionInfoRepresentation } from './auditDecisionInfoRepresentation';
import { AuditLogEntryRepresentation } from './auditLogEntryRepresentation';

export class ProcessInstanceAuditInfoRepresentation {
    decisionInfo?: AuditDecisionInfoRepresentation;
    entries?: AuditLogEntryRepresentation[];
    processDefinitionName?: string;
    processDefinitionVersion?: string;
    processInstanceDurationInMillis?: number;
    processInstanceEndTime?: string;
    processInstanceId?: string;
    processInstanceInitiator?: string;
    processInstanceName?: string;
    processInstanceStartTime?: string;

    constructor(input?: Partial<ProcessInstanceAuditInfoRepresentation>) {
        if (input) {
            Object.assign(this, input);
            this.decisionInfo = input.decisionInfo ? new AuditDecisionInfoRepresentation(input.decisionInfo) : undefined;
            if (input.entries) {
                this.entries = input.entries.map((item) => {
                    return new AuditLogEntryRepresentation(item);
                });
            }
        }
    }
}
