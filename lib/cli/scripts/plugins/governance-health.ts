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

/* eslint-disable @typescript-eslint/naming-convention */

import { logger } from '../logger';
import { PluginInterface } from './plugin-model';

export class GovernanceHealth {
    constructor(private pluginInfo: PluginInterface, private alfrescoJsApi: any) {}

    async isRecordManagementAvailable() {
        try {
            const site = await this.alfrescoJsApi.gsCore.gsSitesApi.getRMSite();
            logger.info(
                `Record Management site is present: ${site.entry.title}`
            );
            console.table([{ PluginName: this.pluginInfo.name, Status: 'Active', RecordManagement: 'Available' }]);
            return true;
        } catch (error) {
            logger.error(
                `Record Management site get failed: ${
                    JSON.parse(error.message).error.errorKey
                }`
            );
            console.table([{ PluginName: this.pluginInfo.name, Status: 'Inactive', RecordManagement: 'Not available'}]);
            return false;
        }
    }

    async createRecordManagementSite() {
        const body = { title: 'Records Management' };
        const opts = { skipAddToFavorites: false }; //  | Flag to indicate whether the RM site should not be added to the user's site favorites.

        try {
            logger.info('Trying to create Record Management site...');
            const site = await this.alfrescoJsApi.gsCore.gsSitesApi.createRMSite(
                body,
                opts
            );
            logger.info('Record Management site: created' + site);
            console.table([{ PluginName: this.pluginInfo.name, Status: 'Active', RecordManagement: 'Created'}]);
        } catch (error) {
            logger.error(
                `Record Management site creation failed: ${
                    JSON.parse(error.message).error.errorKey
                }`
            );
            console.table([{ PluginName: this.pluginInfo.name, Status: 'Inactive', RecordManagement: 'Not created'}]);
        }
    }
}
