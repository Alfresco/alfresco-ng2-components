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

import {} from '../model/';
import { RestVariable } from '../model/restVariable';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * ProcessInstanceVariablesApi service.
 * @module ProcessInstanceVariablesApi
 */
export class ProcessInstanceVariablesApi extends BaseApi {
    /**
     * Create or update variables
     *
     * @param processInstanceId Process instance ID
     * @param restVariables restVariables
     * @return Promise<RestVariable>
     */
    createOrUpdateProcessInstanceVariables(processInstanceId: string, restVariables: RestVariable[]): Promise<RestVariable[]> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(restVariables, 'restVariables');

        const pathParams = {
            processInstanceId
        };

        return this.put({
            path: '/api/enterprise/process-instances/{processInstanceId}/variables',
            pathParams,
            bodyParam: restVariables
        });
    }

    /**
     * Delete a variable
     *
     * @param processInstanceId processInstanceId
     * @param variableName variableName
     * @return Promise<{}>
     */
    deleteProcessInstanceVariable(processInstanceId: string, variableName: string): Promise<void> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(variableName, 'variableName');

        const pathParams = {
            processInstanceId,
            variableName
        };

        return this.delete({
            path: '/api/enterprise/process-instances/{processInstanceId}/variables/{variableName}',
            pathParams
        });
    }

    /**
     * Get a variable
     *
     * @param processInstanceId processInstanceId
     * @param variableName variableName
     * @return Promise<RestVariable>
     */
    getProcessInstanceVariable(processInstanceId: string, variableName: string): Promise<RestVariable> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(variableName, 'variableName');

        const pathParams = {
            processInstanceId,
            variableName
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/variables/{variableName}',
            pathParams,
            returnType: RestVariable
        });
    }

    /**
     * List variables
     *
     * @param processInstanceId Process instance ID
     * @return Promise<RestVariable>
     */
    getProcessInstanceVariables(processInstanceId: string): Promise<RestVariable[]> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/variables',
            pathParams
        });
    }

    /**
     * Update a variable
     *
     * @param processInstanceId processInstanceId
     * @param variableName variableName
     * @param restVariable restVariable
     * @return Promise<RestVariable>
     */
    updateProcessInstanceVariable(processInstanceId: string, variableName: string, restVariable: RestVariable): Promise<RestVariable> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(variableName, 'variableName');
        throwIfNotDefined(restVariable, 'restVariable');

        const pathParams = {
            processInstanceId,
            variableName
        };

        return this.put({
            path: '/api/enterprise/process-instances/{processInstanceId}/variables/{variableName}',
            pathParams,
            bodyParam: restVariable,
            returnType: RestVariable
        });
    }
}
