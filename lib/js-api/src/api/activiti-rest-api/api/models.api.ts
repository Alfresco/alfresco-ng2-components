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

import { ModelRepresentation, ObjectNode, ResultListDataRepresentationModelRepresentation, ValidationErrorRepresentation } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

export interface GetModelsQuery {
    filter?: string;
    sort?: string;
    modelType?: number;
    referenceId?: number;
}

/**
 * Models service.
 */
export class ModelsApi extends BaseApi {
    /**
     * Create a new model
     * @param modelRepresentation modelRepresentation
     * @return Promise<ModelRepresentation>
     */
    createModel(modelRepresentation: ModelRepresentation): Promise<ModelRepresentation> {
        throwIfNotDefined(modelRepresentation, 'modelRepresentation');

        return this.post({
            path: '/api/enterprise/models',
            bodyParam: modelRepresentation,
            returnType: ModelRepresentation
        });
    }

    /**
     * Delete a model
     * @param modelId modelId
     * @param opts Optional parameters
     * @param opts.cascade cascade
     * @param opts.deleteRuntimeApp deleteRuntimeApp
     * @return Promise<{}>
     */
    deleteModel(modelId: number, opts?: { cascade?: boolean; deleteRuntimeApp?: boolean }): Promise<any> {
        throwIfNotDefined(modelId, 'modelId');

        const pathParams = {
            modelId
        };

        const queryParams = {
            cascade: opts?.cascade,
            deleteRuntimeApp: opts?.deleteRuntimeApp
        };

        return this.delete({
            path: '/api/enterprise/models/{modelId}',
            pathParams,
            queryParams
        });
    }

    /**
     * Duplicate an existing model
     * @param modelId modelId
     * @param modelRepresentation modelRepresentation
     * @return Promise<ModelRepresentation>
     */
    duplicateModel(modelId: number, modelRepresentation: ModelRepresentation): Promise<ModelRepresentation> {
        throwIfNotDefined(modelId, 'modelId');
        throwIfNotDefined(modelRepresentation, 'modelRepresentation');

        const pathParams = {
            modelId
        };

        return this.post({
            path: '/api/enterprise/models/{modelId}/clone',
            pathParams,
            bodyParam: modelRepresentation,
            returnType: ModelRepresentation
        });
    }

    /**
     * Get model content
     * @param modelId modelId
     * @return Promise<ObjectNode>
     */
    getModelJSON(modelId: number): Promise<ObjectNode> {
        throwIfNotDefined(modelId, 'modelId');

        const pathParams = {
            modelId
        };

        return this.get({
            path: '/api/enterprise/models/{modelId}/editor/json',
            pathParams
        });
    }

    /**
     * Get a model's thumbnail image
     * @param modelId modelId
     * @return Promise<string>
     */
    getModelThumbnail(modelId: number): Promise<string> {
        throwIfNotDefined(modelId, 'modelId');

        const pathParams = {
            modelId
        };

        return this.get({
            path: '/api/enterprise/models/{modelId}/thumbnail',
            pathParams,
            accepts: ['image/png']
        });
    }

    /**
     * Get a model
     *
     * Models act as containers for process, form, decision table and app definitions
     * @param modelId modelId
     * @param opts Optional parameters
     * @return Promise<ModelRepresentation>
     */
    getModel(modelId: number, opts?: { includePermissions?: boolean }): Promise<ModelRepresentation> {
        throwIfNotDefined(modelId, 'modelId');

        const pathParams = {
            modelId
        };

        const queryParams = {
            includePermissions: opts?.includePermissions
        };

        return this.get({
            path: '/api/enterprise/models/{modelId}',
            pathParams,
            queryParams,
            returnType: ModelRepresentation
        });
    }

    /**
     * List process definition models shared with the current user
     * @return Promise<ResultListDataRepresentationModelRepresentation>
     */
    getModelsToIncludeInAppDefinition(): Promise<ResultListDataRepresentationModelRepresentation> {
        return this.get({
            path: '/api/enterprise/models-for-app-definition',
            returnType: ResultListDataRepresentationModelRepresentation
        });
    }

    /**
     * List models (process, form, decision rule or app)
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationModelRepresentation>
     */
    getModels(opts?: GetModelsQuery): Promise<ResultListDataRepresentationModelRepresentation> {
        return this.get({
            path: '/api/enterprise/models',
            queryParams: opts,
            returnType: ResultListDataRepresentationModelRepresentation
        });
    }

    /**
     * Create a new version of a model
     * @param modelId modelId
     * @param file file
     * @return Promise<ModelRepresentation>
     */
    importNewVersion(modelId: number, file: any): Promise<ModelRepresentation> {
        throwIfNotDefined(modelId, 'modelId');
        throwIfNotDefined(file, 'file');

        const pathParams = {
            modelId
        };

        const formParams = {
            file
        };

        return this.post({
            path: '/api/enterprise/models/{modelId}/newversion',
            pathParams,
            formParams,
            contentTypes: ['multipart/form-data'],
            returnType: ModelRepresentation
        });
    }

    /**
     * Import a BPMN 2.0 XML file
     * @param file file
     * @return Promise<ModelRepresentation>
     */
    importProcessModel(file: any): Promise<ModelRepresentation> {
        throwIfNotDefined(file, 'file');

        const formParams = {
            file
        };

        return this.post({
            path: '/api/enterprise/process-models/import',
            contentTypes: ['multipart/form-data'],
            formParams,
            returnType: ModelRepresentation
        });
    }

    /**
     * Update model content
     * @param modelId modelId
     * @param values values
     * @return Promise<ModelRepresentation>
     */
    saveModel(modelId: number, values: any): Promise<ModelRepresentation> {
        throwIfNotDefined(modelId, 'modelId');
        throwIfNotDefined(values, 'values');

        const pathParams = {
            modelId
        };

        return this.post({
            path: '/api/enterprise/models/{modelId}/editor/json',
            pathParams,
            bodyParam: values,
            returnType: ModelRepresentation
        });
    }

    /**
     * Update a model
     *
     * This method allows you to update the metadata of a model. In order to update the content of the model you will need to call the specific endpoint for that model type.
     * @param modelId modelId
     * @param updatedModel updatedModel
     * @return Promise<ModelRepresentation>
     */
    updateModel(modelId: number, updatedModel: ModelRepresentation): Promise<ModelRepresentation> {
        throwIfNotDefined(modelId, 'modelId');
        throwIfNotDefined(updatedModel, 'updatedModel');

        const pathParams = {
            modelId
        };

        return this.put({
            path: '/api/enterprise/models/{modelId}',
            pathParams,
            bodyParam: updatedModel,
            returnType: ModelRepresentation
        });
    }

    /**
     * Validate model content
     * @param modelId modelId
     * @param opts Optional parameters
     * @param opts.values values
     * @return Promise<ValidationErrorRepresentation>
     */
    validateModel(modelId: number, opts?: { values?: any }): Promise<ValidationErrorRepresentation> {
        throwIfNotDefined(modelId, 'modelId');

        const postBody = opts?.values;

        const pathParams = {
            modelId
        };

        return this.post({
            path: '/api/enterprise/models/{modelId}/editor/validate',
            pathParams,
            bodyParam: postBody,
            contentTypes: ['application/x-www-form-urlencoded']
        });
    }
}
