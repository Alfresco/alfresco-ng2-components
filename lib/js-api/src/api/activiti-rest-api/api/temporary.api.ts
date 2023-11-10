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

import { BaseApi } from './base.api';

/**
 * Temporary service.
 * @module api/TemporaryApi
 * @version 1.4.0
 */
export class TemporaryApi extends BaseApi {
    /**
     * completeTasks
     * @param {Integer} userId userId
     * @param {String} processDefinitionKey processDefinitionKey
     */
    completeTasks(userId: number, processDefinitionKey: string) {
        // verify the required parameter 'userId' is set
        if (userId === undefined || userId === null) {
            throw 'Missing param \'userId\' in completeTasks';
        }

        // verify the required parameter 'processDefinitionKey' is set
        if (processDefinitionKey === undefined || processDefinitionKey === null) {
            throw 'Missing param \'processDefinitionKey\' in completeTasks';
        }

        const queryParams = {
            userId,
            processDefinitionKey
        };

        return this.get({
            path: '/api/enterprise/temporary/generate-report-data/complete-tasks',
            queryParams
        });
    }

    /**
     * generateData
     * @param {Integer} userId userId
     * @param {String} processDefinitionKey processDefinitionKey
     */
    generateData(userId: number, processDefinitionKey: string) {
        // verify the required parameter 'userId' is set
        if (userId === undefined || userId === null) {
            throw 'Missing param \'userId\' in generateData';
        }

        // verify the required parameter 'processDefinitionKey' is set
        if (processDefinitionKey === undefined || processDefinitionKey === null) {
            throw 'Missing param \'processDefinitionKey\' in generateData';
        }

        const queryParams = {
            userId,
            processDefinitionKey
        };

        return this.get({
            path: '/api/enterprise/temporary/generate-report-data/start-process',
            queryParams
        });
    }

    /**
     * Function to receive the result of the getHeaders operation.
     * @param {String} error Error message, if any.
     * @param {module:model/ArrayNode} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */
    getHeaders() {
        return this.get({
            path: '/api/enterprise/temporary/example-headers'
        });
    }

    /**
     * Function to receive the result of the getOptions operation.
     * @param {String} error Error message, if any.
     * @param {module:model/ArrayNode} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */
    getOptions() {
        return this.get({
            path: '/api/enterprise/temporary/example-options'
        });
    }
}
