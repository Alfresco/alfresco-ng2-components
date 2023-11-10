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

import { ModelRepresentation } from '../model/modelRepresentation';
import { ResultListDataRepresentationModelRepresentation } from '../model/resultListDataRepresentationModelRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
* ModelsHistoryApi service.
* @module ModelsHistoryApi
*/
export class ModelsHistoryApi extends BaseApi {
    /**
    * List a model's historic versions
    *
    * @param modelId modelId
    * @param opts Optional parameters
    * @param opts.includeLatestVersion includeLatestVersion
    * @return Promise<ResultListDataRepresentationModelRepresentation>
    */
    getModelHistoryCollection(modelId: number, opts?: { includeLatestVersion?: boolean }): Promise<ResultListDataRepresentationModelRepresentation> {
        throwIfNotDefined(modelId, 'modelId');

        const pathParams = {
            modelId
        };

        const queryParams = {
            includeLatestVersion: opts?.includeLatestVersion
        };

        return this.get({
            path: '/api/enterprise/models/{modelId}/history',
            pathParams,
            queryParams,
            returnType: ResultListDataRepresentationModelRepresentation
        });
    }

    /**
    * Get a historic version of a model
    *
    * @param modelId modelId
    * @param modelHistoryId modelHistoryId
    * @return Promise<ModelRepresentation>
    */
    getProcessModelHistory(modelId: number, modelHistoryId: number): Promise<ModelRepresentation> {
        throwIfNotDefined(modelId, 'modelId');
        throwIfNotDefined(modelHistoryId, 'modelHistoryId');

        const pathParams = {
            modelId,
            modelHistoryId
        };

        return this.get({
            path: '/api/enterprise/models/{modelId}/history/{modelHistoryId}',
            pathParams,
            returnType: ModelRepresentation
        });
    }
}
