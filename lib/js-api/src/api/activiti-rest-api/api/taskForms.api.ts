/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    CompleteFormRepresentation,
    FormDefinitionRepresentation,
    FormValueRepresentation,
    ProcessInstanceVariableRepresentation,
    SaveFormRepresentation
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * TaskFormsApi service.
 */
export class TaskFormsApi extends BaseApi {
    /**
     * Complete a task form
     *
     * @param taskId taskId
     * @param completeTaskFormRepresentation completeTaskFormRepresentation
     * @return Promise<{ /* empty */ }>
     */
    completeTaskForm(taskId: string, completeTaskFormRepresentation: CompleteFormRepresentation): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(completeTaskFormRepresentation, 'completeTaskFormRepresentation');

        const pathParams = {
            taskId
        };

        return this.post({
            path: '/api/enterprise/task-forms/{taskId}',
            pathParams,
            bodyParam: completeTaskFormRepresentation
        });
    }

    /**
     * Get task variables
     *
     * @param taskId taskId
     * @return Promise<ProcessInstanceVariableRepresentation>
     */
    getProcessInstanceVariables(taskId: string): Promise<ProcessInstanceVariableRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/task-forms/{taskId}/variables',
            pathParams
        });
    }

    /**
     * Retrieve Column Field Values
     * Specific case to retrieve information on a specific column
     *
     * @param taskId taskId
     * @param field field
     * @param column column
     */
    getRestFieldColumnValues(taskId: string, field: string, column: string) {
        // verify the required parameter 'taskId' is set
        if (taskId === undefined || taskId === null) {
            throw new Error(`Missing param 'taskId' in getRestFieldValues`);
        }

        // verify the required parameter 'field' is set
        if (field === undefined || field === null) {
            throw new Error(`Missing param 'field' in getRestFieldValues`);
        }

        // verify the required parameter 'column' is set
        if (column === undefined || column === null) {
            throw new Error(`Missing param 'column' in getRestFieldValues`);
        }

        const pathParams = {
            taskId,
            field,
            column
        };

        return this.get({
            path: '/api/enterprise/task-forms/{taskId}/form-values/{field}/{column}',
            pathParams
        });
    }

    /**
     * Retrieve populated field values
     *
     * Form field values that are populated through a REST backend, can be retrieved via this service
     *
     * @param taskId taskId
     * @param field field
     * @return Promise<FormValueRepresentation []>
     */
    getRestFieldValues(taskId: string, field: string): Promise<FormValueRepresentation[]> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(field, 'field');

        const pathParams = {
            taskId,
            field
        };

        return this.get({
            path: '/api/enterprise/task-forms/{taskId}/form-values/{field}',
            pathParams
        });
    }

    /**
     * Get a task form
     *
     * @param taskId taskId
     * @returns Promise<FormDefinitionRepresentation>
     */
    getTaskForm(taskId: string): Promise<FormDefinitionRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/task-forms/{taskId}',
            pathParams
        });
    }

    /**
     * Save a task form
     *
     * @param taskId taskId
     * @param saveTaskFormRepresentation saveTaskFormRepresentation
     * @return Promise<{ /* empty */ }>
     */
    saveTaskForm(taskId: string, saveTaskFormRepresentation: SaveFormRepresentation): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(saveTaskFormRepresentation, 'saveTaskFormRepresentation');

        const pathParams = {
            taskId
        };

        return this.post({
            path: '/api/enterprise/task-forms/{taskId}/save-form',
            pathParams,
            bodyParam: saveTaskFormRepresentation
        });
    }

    /**
     * Retrieve Task Form Variables
     *
     * @param taskId taskId
     */
    getTaskFormVariables(taskId: string) {
        // verify the required parameter 'taskId' is set
        if (taskId === undefined || taskId === null) {
            throw new Error(`Missing param 'taskId' in getTaskFormVariables`);
        }

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/task-forms/{taskId}/variables',
            pathParams
        });
    }
}
