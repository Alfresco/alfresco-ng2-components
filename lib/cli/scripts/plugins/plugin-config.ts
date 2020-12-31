import { PlugInInterface } from './plugins-model';
import { logger } from '../logger';

export class PluginConfiguration {
    alfrescoJsApi: any;
    plugInInfo: PlugInInterface;

    constructor(
        plugInInfo: PlugInInterface,
        alfrescoJsApi: any,
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
        let url = `${this.plugInInfo.host}/app.config.json`;
        if (this.isProcessAutomation) {
            url = `${this.plugInInfo.host}/${
                this.plugInInfo.appName
            }/ui/content/app.config.json`;
        }
        const pathParams = {},
            headerParams = {},
            formParams = {},
            bodyParam = {},
            queryParams = {},
            contentTypes = ['application/json'],
            accepts = ['application/json'];
        try {
            const appConfig = await this.alfrescoJsApi.oauth2Auth.callCustomApi(
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
            return appConfig;
        } catch (error) {
            logger.error(
                `${this.plugInInfo.host} is not reachable error: `,
                error
            );
        }
    }
}
