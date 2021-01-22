import { logger } from '../logger';

export class GovernanceHealth {
    constructor(private alfrescoJsApi: any) {}

    async isRecordManagementAvailable() {
        try {
            const site = await this.alfrescoJsApi.gsCore.gsSitesApi.getRMSite();
            logger.info(
                `Record Management site is present: ${site.entry.title}`
            );
            return true;
        } catch (error) {
            logger.error(
                `Record Management site get failed: ${
                    JSON.parse(error.message).error.errorKey
                }`
            );
            return false;
        }
    }

    async createRecordManagementSite() {
        const body = { title: 'Records Management' };
        const opts = { skipAddToFavorites: false }; //  | Flag to indicate whether the RM site should not be added to the user's site favorites.

        try {
            const site = await this.alfrescoJsApi.gsCore.gsSitesApi.createRMSite(
                body,
                opts
            );
            logger.info('Record Management site: created' + site);
        } catch (error) {
            logger.error(
                `Record Management site creation failed: ${
                    JSON.parse(error.message).error.errorKey
                }`
            );
        }
    }
}
