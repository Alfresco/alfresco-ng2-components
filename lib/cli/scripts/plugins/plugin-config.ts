import { PluginInterface } from './plugin-model';
import { logger } from '../logger';

export class PluginConfiguration {
    constructor(
        private plugInInfo: PluginInterface,
        private alfrescoJsApi: any,
        private isProcessAutomation: boolean
    ) {
        this.plugInInfo = plugInInfo;
        this.alfrescoJsApi = alfrescoJsApi;
    }

    async isPluginEnabledFromAppConfiguration() {
        try {
            const appConfig = await this.getAppConfig();
            let isEnabled = true;
            if (appConfig && appConfig.plugins[this.plugInInfo.name]) {
                logger.info(
                    `${
                        this.plugInInfo.name
                    } plugin is configured in app.config.json`
                );
            } else {
                logger.error(
                    `${
                        this.plugInInfo.name
                    } plugin is not configured in app.config.json`
                );
                return (isEnabled = false);
            }

            return isEnabled;
        } catch (error) {
            logger.error(
                `${this.plugInInfo.host} is not reachable error: `,
                error
            );
            return false;
        }
    }

    async getAppConfig() {
        const url = this.isProcessAutomation ? `${this.plugInInfo.host}/${this.plugInInfo.appName}/ui/${this.plugInInfo.uiName}/app.config.json` : `${this.plugInInfo.host}/app.config.json`;
        return this.callCustomApi(url);
    }

    async callCustomApi(url: string) {
        const pathParams = {},
            headerParams = {},
            formParams = {},
            bodyParam = {},
            queryParams = {},
            contentTypes = ['application/json'],
            accepts = ['application/json'];
        try {
            const response = await this.alfrescoJsApi.oauth2Auth.callCustomApi(
                url,
                'GET',
                pathParams,
                queryParams,
                headerParams,
                formParams,
                bodyParam,
                contentTypes,
                accepts
            );

            return response;
        } catch (error) {
            logger.error(
                `${this.plugInInfo.host} is not reachable error: `,
                error
            );
            return {};
        }
    }
}
