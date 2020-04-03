/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { Logger } from '../../utils/logger';

export class ModelsActions {

    api: AlfrescoApi;

    constructor(api: AlfrescoApi) {
        this.api = api;
    }

    async deleteVersionModel(modelId) {
        try {
            return this.api.activiti.modelsApi.deleteModel(modelId, { cascade: false, deleteRuntimeApp : true });
        } catch (error) {
            Logger.error('Delete Model Version - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async deleteEntireModel(modelId) {
        try {
            return this.api.activiti.modelsApi.deleteModel(modelId, { cascade: true, deleteRuntimeApp : true });
        } catch (error) {
            Logger.error('Delete Model - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }
}
