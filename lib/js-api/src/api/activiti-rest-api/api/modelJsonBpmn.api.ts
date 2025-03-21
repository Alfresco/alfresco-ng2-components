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

import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

export class ModelJsonBpmnApi extends BaseApi {
    /**
     * Export a previous process definition model to a JSON
     * @param processModelId processModelId
     * @param processModelHistoryId processModelHistoryId
     */
    getHistoricEditorDisplayJsonClient(processModelId: number, processModelHistoryId: number) {
        throwIfNotDefined(processModelId, 'processModelId');
        throwIfNotDefined(processModelHistoryId, 'processModelHistoryId');

        const pathParams = {
            processModelId,
            processModelHistoryId
        };

        return this.get({
            path: '/app/rest/models/{processModelId}/history/{processModelHistoryId}/model-json',
            pathParams
        });
    }

    /**
     * Export a process definition model to a JSON
     * @param processModelId processModelId
     */
    getEditorDisplayJsonClient(processModelId: number) {
        throwIfNotDefined(processModelId, 'processModelId');

        const pathParams = {
            processModelId
        };

        return this.get({
            path: '/app/rest/models/{processModelId}/model-json',
            pathParams
        });
    }

    /**
     * Function to receive the result of the getModelJSONForProcessDefinition operation.
     * @param processDefinitionId processDefinitionId
     */
    getModelJSON(processDefinitionId: string) {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');

        const pathParams = {
            processDefinitionId
        };

        return this.get({
            path: '/app/rest/process-definitions/{processDefinitionId}/model-json',
            pathParams
        });
    }

    /**
     * Function to receive the result of the getModelHistoryJSON operation.
     * @param processInstanceId processInstanceId
     */
    getModelJSONForProcessDefinition(processInstanceId: string) {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/app/rest/process-instances/{processInstanceId}/model-json',
            pathParams
        });
    }
}
