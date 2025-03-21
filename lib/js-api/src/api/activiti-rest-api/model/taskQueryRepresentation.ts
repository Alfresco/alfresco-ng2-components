/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DateAlfresco } from '../../content-custom-api';

export class TaskQueryRepresentation {
    appDefinitionId?: number;
    assignment?: string;
    dueAfter?: Date;
    dueBefore?: Date;
    includeProcessInstance?: boolean;
    page?: number;
    processDefinitionId?: string;
    processInstanceId?: string;
    size?: number;
    sort?: 'created-desc' | 'created-asc' | 'due-desc' | 'due-asc' | string;
    start?: number;
    state?: 'active' | 'completed' | 'all' | 'open' | string;
    taskId?: string;
    text?: string;

    constructor(input?: Partial<TaskQueryRepresentation>) {
        if (input) {
            Object.assign(this, input);
            this.dueAfter = input.dueAfter ? DateAlfresco.parseDate(input.dueAfter) : undefined;
            this.dueBefore = input.dueBefore ? DateAlfresco.parseDate(input.dueBefore) : undefined;
        }
    }
}
