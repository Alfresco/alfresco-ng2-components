import { PlugInInterface } from './plugins-model';
import { logger } from '../logger';

export class ProcessServicePlugin {
    alfrescoJsApi: any;
    plugInInfo: PlugInInterface;

    constructor(plugInInfo: PlugInInterface, alfrescoJsApi: any) {
        this.plugInInfo = plugInInfo;
        this.alfrescoJsApi = alfrescoJsApi;
    }

    async checkProcessServicesPlugin() {
        try {
            const isPluginEnabled = await this.isPluginEnabledFromAppConfiguration();
            const isBackEndActive = await this.checkProcessServicesEnv();

            if (!isPluginEnabled || !isBackEndActive) {
                logger.error(
                    `The plugin ${
                        this.plugInInfo.name
                    } has not been correctly configured`
                );
                process.exit(1);
            } else {
                logger.info(
                    `The plugin ${
                        this.plugInInfo.name
                    } has been correctly configured`
                );
            }
        } catch (e) {
            logger.error(
                `The plugin ${
                    this.plugInInfo.name
                } has not been correctly configured`,
                e
            );
            process.exit(1);
        }
    }

    async checkProcessServicesEnv() {
        try {
            const systemProperties = await this.alfrescoJsApi.activiti.systemPropertiesApi.getProperties();
            let isBackEndEnabled = true;
            if (systemProperties) {
                logger.info(`${this.plugInInfo.host} is UP!`);
            } else {
                logger.error(`${this.plugInInfo.host} is DOWN `);
                isBackEndEnabled = false;
            }
            return isBackEndEnabled;
        } catch (error) {
            logger.error(
                `${this.plugInInfo.host} is not reachable error: `,
                error
            );
            return false;
        }
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
        const url = `${this.plugInInfo.host}/app.config.json`;
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
