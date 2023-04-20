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

import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../../shared/api/api.service';
import { ModelsApi } from '@alfresco/js-api';
import { ResultListDataRepresentationModelRepresentation } from '@alfresco/js-api/typings/src/api/activiti-rest-api/model/resultListDataRepresentationModelRepresentation';

export class ModelsActions {

    api: ApiService;
    modelsApi: ModelsApi;

    constructor(api: ApiService) {
        this.api = api;
        this.modelsApi = new ModelsApi(api.getInstance());
    }

    async deleteModel(modelId): Promise<any> {
        try {
            return await this.modelsApi.deleteModel(modelId, { cascade: false, deleteRuntimeApp: true });
        } catch (error) {
            Logger.error('Delete Model Version - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
        }
    }

    async deleteEntireModel(modelId): Promise<any> {
        try {
            return await this.modelsApi.deleteModel(modelId, { cascade: true, deleteRuntimeApp: true });
        } catch (error) {
            Logger.error('Delete Model - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
        }
    }

    async getModels(opts: any): Promise<ResultListDataRepresentationModelRepresentation> {
        const options = opts || {};
        let models;
        try {
            models = await this.modelsApi.getModels(options);
        } catch (error) {
            Logger.error('Get Models - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
        }
        return models;
    }
}
