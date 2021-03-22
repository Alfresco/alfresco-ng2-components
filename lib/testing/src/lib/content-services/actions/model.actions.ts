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

import { ApiService } from '../../core/actions/api.service';
import { CustomModel, CustomModelApi, CustomType, TypePaging, TypesApi } from '@alfresco/js-api';

export class ModelActions {

    customModelApi: CustomModelApi;
    typesApi: TypesApi;

    constructor(api: ApiService) {
        this.customModelApi = new CustomModelApi(api.getInstance());
        this.typesApi = new TypesApi(api.getInstance());
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

    async listTypes(opts?: any): Promise<TypePaging> {
        return this.typesApi.listTypes(opts);
    }
}
