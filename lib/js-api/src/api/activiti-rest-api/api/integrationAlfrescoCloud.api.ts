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
    ResultListDataRepresentationAlfrescoContentRepresentation,
    ResultListDataRepresentationAlfrescoNetworkRepresenation,
    ResultListDataRepresentationAlfrescoSiteRepresenation
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * IntegrationAlfrescoCloudApi service.
 */
export class IntegrationAlfrescoCloudApi extends BaseApi {
    /**
     * Alfresco Cloud Authorization
     * Returns Alfresco OAuth HTML Page
     *
     * @param code code
     * @return Promise<{}>
     */
    confirmAuthorisation(code: string): Promise<any> {
        throwIfNotDefined(code, 'code');

        const queryParams = {
            code
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco-cloud/confirm-auth-request',
            queryParams,
            accepts: ['text/html']
        });
    }

    /**
     * List Alfresco networks
     *
     * @return Promise<ResultListDataRepresentationAlfrescoNetworkRepresenation>
     */
    getAllNetworks(): Promise<ResultListDataRepresentationAlfrescoNetworkRepresenation> {
        return this.get({
            path: '/api/enterprise/integration/alfresco-cloud/networks'
        });
    }

    /**
     * List Alfresco sites
     * Returns ALL Sites
     *
     * @param networkId networkId
     * @return Promise<ResultListDataRepresentationAlfrescoSiteRepresenation>
     */
    getAllSites(networkId: string): Promise<ResultListDataRepresentationAlfrescoSiteRepresenation> {
        throwIfNotDefined(networkId, 'networkId');

        const pathParams = {
            networkId
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco-cloud/networks/{networkId}/sites',
            pathParams
        });
    }

    /**
     * List files and folders inside a specific folder identified by path
     *
     * @param networkId networkId
     * @param opts Optional parameters
     * @param opts.siteId {string} siteId
     * @param opts.path {string} path
     * @return Promise<ResultListDataRepresentationAlfrescoContentRepresentation>
     */
    getContentInFolderPath(
        networkId: string,
        opts?: { siteId?: string; path?: string }
    ): Promise<ResultListDataRepresentationAlfrescoContentRepresentation> {
        throwIfNotDefined(networkId, 'networkId');

        const pathParams = {
            networkId
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco-cloud/networks/{networkId}/sites/{siteId}/folderpath/{folderPath}/content',
            pathParams,
            queryParams: opts
        });
    }

    /**
     * List files and folders inside a specific folder
     *
     * @param networkId networkId
     * @param folderId folderId
     * @return Promise<ResultListDataRepresentationAlfrescoContentRepresentation>
     */
    getContentInFolder(networkId: string, folderId: string): Promise<ResultListDataRepresentationAlfrescoContentRepresentation> {
        throwIfNotDefined(networkId, 'networkId');
        throwIfNotDefined(folderId, 'folderId');

        const pathParams = {
            networkId,
            folderId
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco-cloud/networks/{networkId}/folders/{folderId}/content',
            pathParams
        });
    }

    /**
     * List files and folders inside a specific site
     *
     * @param networkId networkId
     * @param siteId siteId
     * @return Promise<ResultListDataRepresentationAlfrescoContentRepresentation>
     */
    getContentInSite(networkId: string, siteId: string): Promise<ResultListDataRepresentationAlfrescoContentRepresentation> {
        throwIfNotDefined(networkId, 'networkId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            networkId,
            siteId
        };

        return this.get({
            path: '/api/enterprise/integration/alfresco-cloud/networks/{networkId}/sites/{siteId}/content',
            pathParams
        });
    }
}
