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

import { Observable } from 'rxjs';
import { TaskListRequestModel, TaskQueryCloudRequestModel } from '../models/filter-cloud-model';

export interface TaskListCloudServiceInterface {
    /**
     * Finds a task using an object with optional query properties.
     * @deprecated From Activiti 8.7.0 forward, use TaskListCloudService.fetchTaskList instead.
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns Task information
     */
    getTaskByRequest(requestNode: TaskQueryCloudRequestModel, queryUrl?: string): Observable<any>;

    /**
     * Available from Activiti version 8.7.0 onwards.
     * Retrieves a list of tasks using an object with optional query properties.
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns List of tasks
     */
    fetchTaskList(requestNode: TaskListRequestModel, queryUrl?: string): Observable<any>;
}
