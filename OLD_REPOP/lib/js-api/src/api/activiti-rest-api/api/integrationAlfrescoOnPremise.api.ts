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

import {
    ResultListDataRepresentationAlfrescoContentRepresentation,
    ResultListDataRepresentationAlfrescoEndpointRepresentation,
    ResultListDataRepresentationAlfrescoSiteRepresenation
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * IntegrationAlfrescoOnPremiseApi service.
 */
export class IntegrationAlfrescoOnPremiseApi extends BaseApi {
    /**
     * List Alfresco sites
     * Returns ALL Sites
     * @param repositoryId repositoryId
     * @return Promise<ResultListDataRepresentationAlfrescoSiteRepresenation>
     */
    getAllSites(repositoryId: string): Promise<ResultListDataRepresentationAlfrescoSiteRepresenation> {
        throwIfNotDefined(repositoryId, 'networkId');

        const pathParams = {
            repositoryId
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco/{repositoryId}/sites',
            pathParams
        });
    }

    /**
     * List files and folders inside a specific folder identified by folder path
     * @param repositoryId repositoryId
     * @param siteId siteId
     * @param folderPath folderPath
     * @return Promise<ResultListDataRepresentationAlfrescoContentRepresentation>
     */
    getContentInFolderPath(
        repositoryId: string,
        siteId: string,
        folderPath: string
    ): Promise<ResultListDataRepresentationAlfrescoContentRepresentation> {
        throwIfNotDefined(repositoryId, 'networkId');
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(folderPath, 'folderPath');

        const pathParams = {
            repositoryId,
            siteId,
            folderPath
        };

        return this.get({
            path: '/api/enterprise/rest/integration/alfresco/{repositoryId}/sites/{siteId}/folderpath/{folderPath}/content',
            pathParams
        });
    }

    /**
     * List files and folders inside a specific folder
     * @param repositoryId repositoryId
     * @param folderId folderId
     * @return Promise<ResultListDataRepresentationAlfrescoContentRepresentation>
     */
    getContentInFolder(repositoryId: string, folderId: string): Promise<ResultListDataRepresentationAlfrescoContentRepresentation> {
        throwIfNotDefined(repositoryId, 'networkId');
        throwIfNotDefined(folderId, 'folderId');

        const pathParams = {
            repositoryId,
            folderId
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco/{repositoryId}/folders/{folderId}/content',
            pathParams
        });
    }

    /**
     * List files and folders inside a specific site
     * @param repositoryId repositoryId
     * @param siteId siteId
     * @return Promise<ResultListDataRepresentationAlfrescoContentRepresentation>
     */
    getContentInSite(repositoryId: string, siteId: string): Promise<ResultListDataRepresentationAlfrescoContentRepresentation> {
        throwIfNotDefined(repositoryId, 'networkId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            repositoryId,
            siteId
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco/{repositoryId}/sites/{siteId}/content',
            pathParams
        });
    }

    /**
     * List Alfresco repositories
     *
     * A tenant administrator can configure one or more Alfresco repositories to use when working with content.
     * @param opts Optional parameters
     * @param opts.tenantId {string} tenantId
     * @param opts.includeAccounts {boolean} includeAccounts (default to true)
     * @return Promise<ResultListDataRepresentationAlfrescoEndpointRepresentation>
     */
    getRepositories(opts?: { tenantId?: string; includeAccounts?: boolean }): Promise<ResultListDataRepresentationAlfrescoEndpointRepresentation> {
        return this.get({
            path: '/api/enterprise/profile/accounts/alfresco',
            queryParams: opts,
            returnType: ResultListDataRepresentationAlfrescoEndpointRepresentation
        });
    }
}
