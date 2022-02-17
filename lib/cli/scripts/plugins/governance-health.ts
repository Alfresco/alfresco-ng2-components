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
