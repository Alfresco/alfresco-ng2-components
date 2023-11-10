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
import { CommentAuditInfo } from './commentAuditInfo';

export class TaskAuditInfoRepresentation {
    assignee?: string;
    comments?: CommentAuditInfo[];
    endTime?: string;
    formData?: AuditLogFormDataRepresentation[];
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processInstanceId?: string;
    selectedOutcome?: string;
    startTime?: string;
    taskId?: string;
    taskName?: string;

    constructor(input?: Partial<TaskAuditInfoRepresentation>) {
        if (input) {
            Object.assign(this, input);
            if (input.comments) {
                this.comments = input.comments.map((item) => {
                    return new CommentAuditInfo(item);
                });
            }
            if (input.formData) {
                this.formData = input.formData.map((item) => {
                    return new AuditLogFormDataRepresentation(item);
                });
            }
        }
    }
}
