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

import { CustomModel, CustomModelApi, CustomType, TypePaging, TypesApi } from '@alfresco/js-api';
import { ApiService } from '../../core/actions/api.service';
import { ApiUtil } from '../../core/actions/api.util';
import { Logger } from '../../core/utils/logger';

export class ModelActions {
    apiService: ApiService;
    customModelApi: CustomModelApi;
    typesApi: TypesApi;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
        this.customModelApi = new CustomModelApi(apiService.getInstance());
        this.typesApi = new TypesApi(apiService.getInstance());
    }

    async createModel({status, description, name, namespaceUri, namespacePrefix, author}: CustomModel): Promise<{ entry: CustomModel }> {
        return this.customModelApi.createCustomModel(status, description, name, namespaceUri, namespacePrefix, author);
    }

    async createType(modelName, { name, parentName, title, description}: CustomType ): Promise<{ entry: CustomType }> {
        return this.customModelApi.createCustomType(modelName, name, parentName, title, description);
    }

    async activateCustomModel(modelName: string): Promise<{ entry: CustomModel }> {
        return this.customModelApi.activateCustomModel(modelName);
    }

    async deactivateCustomModel(modelName: string): Promise<{ entry: CustomModel }> {
        return this.customModelApi.deactivateCustomModel(modelName);
    }

    async deleteCustomModel(modelName: string): Promise<{ entry: CustomModel }> {
        return this.customModelApi.deleteCustomModel(modelName);
    }

    async listTypes(opts?: any): Promise<TypePaging> {
        return this.typesApi.listTypes(opts);
    }

    async isCustomTypeSearchable(title: string): Promise<any> {
        const predicate = (result: TypePaging) => !!result.list.entries.find(({entry}) => entry.title === title);

        const apiCall = async () => {
            try {
                return this.listTypes({where: `(not namespaceUri matches('http://www.alfresco.*'))`});
            } catch (error) {
                Logger.error('Failed to list types', error);
                return null;
            }
        };
        return ApiUtil.waitForApi(apiCall, predicate);
    }
}
