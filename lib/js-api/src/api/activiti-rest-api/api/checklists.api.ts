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

import { ChecklistOrderRepresentation } from '../model/checklistOrderRepresentation';
import { ResultListDataRepresentationTaskRepresentation } from '../model/resultListDataRepresentationTaskRepresentation';
import { TaskRepresentation } from '../model/taskRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
* Checklists service.
* @module ChecklistsApi
*/
export class ChecklistsApi extends BaseApi {
    /**
    * Create a task checklist
    *
    * @param taskId taskId
    * @param taskRepresentation taskRepresentation
    * @return Promise<TaskRepresentation>
    */
    addSubtask(taskId: string, taskRepresentation: TaskRepresentation): Promise<TaskRepresentation> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(taskRepresentation, 'taskRepresentation');

        const pathParams = {
            taskId
        };

        return this.post({
            path: '/api/enterprise/tasks/{taskId}/checklist',
            pathParams,
            bodyParam: taskRepresentation,
            returnType: TaskRepresentation
        });
    }

    /**
    * Get checklist for a task
    *
    * @param taskId taskId
    * @return Promise<ResultListDataRepresentationTaskRepresentation>
    */
    getChecklist(taskId: string): Promise<ResultListDataRepresentationTaskRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}/checklist',
            pathParams,
            returnType: ResultListDataRepresentationTaskRepresentation
        });
    }

    /**
    * Change the order of items on a checklist
    *
    * @param taskId taskId
    * @param orderRepresentation orderRepresentation
    * @return Promise<{}>
    */
    orderChecklist(taskId: string, orderRepresentation: ChecklistOrderRepresentation): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(orderRepresentation, 'orderRepresentation');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/checklist',
            bodyParam: orderRepresentation,
            pathParams
        });
    }

}
