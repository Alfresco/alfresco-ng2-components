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

import { BaseApi } from './base.api';

/**
 * Temporary service.
 */
export class TemporaryApi extends BaseApi {
    /**
     * completeTasks
     * @param userId userId
     * @param processDefinitionKey processDefinitionKey
     */
    completeTasks(userId: number, processDefinitionKey: string) {
        // verify the required parameter 'userId' is set
        if (userId === undefined || userId === null) {
            throw new Error(`Missing param 'userId' in completeTasks`);
        }

        // verify the required parameter 'processDefinitionKey' is set
        if (processDefinitionKey === undefined || processDefinitionKey === null) {
            throw new Error(`Missing param 'processDefinitionKey' in completeTasks`);
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
     * @param userId userId
     * @param processDefinitionKey processDefinitionKey
     */
    generateData(userId: number, processDefinitionKey: string) {
        // verify the required parameter 'userId' is set
        if (userId === undefined || userId === null) {
            throw new Error(`Missing param 'userId' in generateData`);
        }

        // verify the required parameter 'processDefinitionKey' is set
        if (processDefinitionKey === undefined || processDefinitionKey === null) {
            throw new Error(`Missing param 'processDefinitionKey' in generateData`);
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
     */
    getHeaders() {
        return this.get({
            path: '/api/enterprise/temporary/example-headers'
        });
    }

    /**
     * Function to receive the result of the getOptions operation.
     */
    getOptions() {
        return this.get({
            path: '/api/enterprise/temporary/example-options'
        });
    }
}
