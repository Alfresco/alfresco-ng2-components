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

import { RMSiteBodyCreate, RMSiteBodyUpdate, RMSiteEntry } from '../model';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsFieldsQuery } from './types';

/**
 * GsSitesApi service.
 */
export class GsSitesApi extends BaseApi {
    /**
     * Create the Records Management (RM) site
     *
     * The creator will be added as a member with Site Manager role.
     * When you create the RM site, the **filePlan** structure is also created including special containers, such as containers for transfers, holds and, unfiled records.
     * @param siteBodyCreate The site details
     * @param opts Optional parameters
     * @param opts.skipAddToFavorites Flag to indicate whether the RM site should not be added to the user's site favorites. (default to false)
     * @returns Promise<RMSiteEntry>
     */
    createRMSite(siteBodyCreate: RMSiteBodyCreate, opts?: { skipAddToFavorites?: boolean }): Promise<RMSiteEntry> {
        throwIfNotDefined(siteBodyCreate, 'siteBodyCreate');

        return this.post({
            path: '/gs-sites',
            queryParams: opts,
            bodyParam: siteBodyCreate
        });
    }

    /**
     * Delete the Records Management (RM) site
     * @returns Promise<{}>
     */
    deleteRMSite(): Promise<void> {
        return this.delete({
            path: '/gs-sites/rm'
        });
    }

    /**
     * Get the Records Management (RM) site
     * @param opts Optional parameters
     * @returns Promise<RMSiteEntry>
     */
    getRMSite(opts?: RecordsFieldsQuery): Promise<RMSiteEntry> {
        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/gs-sites/rm',
            queryParams
        });
    }

    /**
     * Update the Records Management (RM) site
     *
     * Update the details for the RM site. Site Manager or other (site) admin can update title or description.
     * **Note**: the id, site visibility, or compliance of the RM site cannot be updated once the site has been created.
     * @param siteBodyUpdate The RM site information to update.
     * @param opts Optional parameters
     * @returns Promise<RMSiteEntry>
     */
    updateRMSite(siteBodyUpdate: RMSiteBodyUpdate, opts?: RecordsFieldsQuery): Promise<RMSiteEntry> {
        throwIfNotDefined(siteBodyUpdate, 'siteBodyUpdate');

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/gs-sites/rm',
            queryParams,
            bodyParam: siteBodyUpdate
        });
    }
}
