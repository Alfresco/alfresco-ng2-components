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

export class StartTaskCloudRequestModel {

    name: string;
    description: string;
    assignee: string;
    priority: string;
    dueDate: Date;
    candidateUsers: string[];
    candidateGroups: string[];
    payloadType: string;
    formKey: string;

    constructor(obj?: any) {
        if (obj) {
            this.name = obj.name || null;
            this.description = obj.description || null;
            this.assignee = obj.assignee || null;
            this.priority = obj.priority || null;
            this.dueDate = obj.dueDate || null;
            this.candidateUsers = obj.candidateUsers || null;
            this.candidateGroups = obj.candidateGroups || null;
            this.formKey = obj.formKey || null;
            this.payloadType = 'CreateTaskPayload';
        }
    }
}
