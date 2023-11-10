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

import { AuditLogFormDataRepresentation } from './auditLogFormDataRepresentation';

export class AuditLogEntryRepresentation {
    activityId?: string;
    activityName?: string;
    activityType?: string;
    durationInMillis?: number;
    endTime?: string;
    formData?: AuditLogFormDataRepresentation[];
    index?: number;
    selectedOutcome?: string;
    startTime?: string;
    taskAssignee?: string;
    taskName?: string;
    type?: string;

    constructor(input?: Partial<AuditLogEntryRepresentation>) {

        if (input) {
            Object.assign(this, input);
            if (input.formData) {
                this.formData = input.formData.map((item) => {
                    return new AuditLogFormDataRepresentation(item);
                });
            }
        }
    }

}
