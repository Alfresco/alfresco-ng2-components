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

import {
    AppDefinitionPublishRepresentation,
    AppDefinitionRepresentation,
    AppDefinitionSaveRepresentation,
    AppDefinitionUpdateResultRepresentation
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * AppDefinitionsApi service.
 */
export class AppDefinitionsApi extends BaseApi {
    /**
     * deleteAppDefinition
     *
     * @param appDefinitionId appDefinitionId
     * @return Promise<{ /* empty */ }>
     */
    deleteAppDefinition(appDefinitionId: number): Promise<void> {
        throwIfNotDefined(appDefinitionId, 'appDefinitionId');

        const pathParams = {
            appDefinitionId
        };

        return this.delete({
            path: '/api/enterprise/app-definitions/{appDefinitionId}',
            pathParams
        });
    }

    /**
     * Export an app definition
     *
     * This will return a zip file containing the app definition model and all related models (process definitions and forms).
     *
     * @param modelId modelId from a runtime app or the id of an app definition model
     * @return Promise<{ /* empty */ }>
     */
    exportAppDefinition(modelId: number): Promise<any> {
        throwIfNotDefined(modelId, 'modelId');

        const pathParams = {
            modelId
        };

        const contentTypes = ['application/json'];
        const accepts = ['application/json', 'application/zip'];

        return this.get({
            path: '/api/enterprise/app-definitions/{modelId}/export',
            pathParams,
            contentTypes,
            accepts
        });
    }

    /**
     * Get an app definition
     *
     * @param modelId Application definition ID
     * @return Promise<AppDefinitionRepresentation>
     */
    getAppDefinition(modelId: number): Promise<AppDefinitionRepresentation> {
        throwIfNotDefined(modelId, 'modelId');

        const pathParams = {
            modelId
        };

        return this.get({
            path: '/api/enterprise/app-definitions/{modelId}',
            pathParams
        });
    }

    /**
     * importAndPublishApp
     *
     * @param file file
     * @param opts options
     * @return Promise<AppDefinitionUpdateResultRepresentation>
     */
    importAndPublishApp(file: any, opts?: { renewIdmEntries?: boolean }): Promise<AppDefinitionUpdateResultRepresentation> {
        throwIfNotDefined(file, 'file');

        const formParams = {
            file
        };

        const queryParams = {
            renewIdmEntries: opts?.renewIdmEntries
        };

        return this.post({
            path: '/api/enterprise/app-definitions/publish-app',
            formParams,
            queryParams,
            contentTypes: ['multipart/form-data']
        });
    }

    /**
     * Import a new app definition
     *
     * Allows a zip file to be uploaded containing an app definition and any number of included models.
     * <p>This is useful to bootstrap an environment (for users or continuous integration).<p>
     * Before using any processes included in the import the app must be published and deployed.
     *
     * @param file file
     * @param opts Optional parameters
     * @param opts.renewIdmEntries Whether to renew user and group identifiers (default to false)
     * @return Promise<AppDefinitionRepresentation>
     */
    importAppDefinition(file: any, opts?: { renewIdmEntries?: string }): Promise<AppDefinitionRepresentation> {
        throwIfNotDefined(file, 'file');

        const formParams = {
            file
        };

        return this.post({
            path: '/api/enterprise/app-definitions/import',
            queryParams: opts,
            formParams,
            contentTypes: ['multipart/form-data']
        });
    }

    /**
     * Publish an app definition
     *
     * Publishing an app definition makes it available for use. The application must not have any validation errors or an error will be returned.<p>Before an app definition can be used by other users, it must also be deployed for their use
     *
     * @param modelId modelId
     * @param publishModel publishModel
     * @return Promise<AppDefinitionUpdateResultRepresentation>
     */
    publishAppDefinition(modelId: number, publishModel: AppDefinitionPublishRepresentation): Promise<AppDefinitionUpdateResultRepresentation> {
        throwIfNotDefined(modelId, 'modelId');
        throwIfNotDefined(publishModel, 'publishModel');

        const pathParams = {
            modelId
        };

        return this.post({
            path: '/api/enterprise/app-definitions/{modelId}/publish',
            pathParams,
            bodyParam: publishModel
        });
    }

    /**
     * Update an app definition
     *
     * @param modelId Application definition ID
     * @param updatedModel updatedModel |
     * @return Promise<AppDefinitionUpdateResultRepresentation>
     */
    updateAppDefinition(modelId: number, updatedModel: AppDefinitionSaveRepresentation | any): Promise<any> {
        throwIfNotDefined(modelId, 'modelId');
        throwIfNotDefined(updatedModel, 'updatedModel');

        const pathParams = {
            modelId
        };

        if (!updatedModel['appDefinition']) {
            const formParams = {
                file: updatedModel
            };

            return this.post({
                path: '/api/enterprise/app-definitions/{modelId}/import',
                pathParams,
                formParams,
                bodyParam: updatedModel,
                contentTypes: ['multipart/form-data']
            });
        } else {
            return this.put({
                path: '/api/enterprise/app-definitions/{modelId}',
                pathParams,
                bodyParam: updatedModel
            });
        }
    }
}
