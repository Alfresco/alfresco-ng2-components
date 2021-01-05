import { PluginInterface } from './plugin-model';
import { logger } from '../logger';
import { PluginConfiguration } from './plugin-config';

export class ProcessServiceHealth {

    config: PluginConfiguration;

    constructor(private plugInInfo: PluginInterface, private alfrescoJsApi: any) {
        this.config = new PluginConfiguration(this.plugInInfo, this.alfrescoJsApi);
    }

    async isPluginEnabledFromAppConfiguration() {
        try {
            const url = `${this.plugInInfo.host}/app.config.json`;
            const appConfig = await this.config.getAppConfig(url);
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

    async checkBackendHealth() {
        try {
            const systemProperties = await this.alfrescoJsApi.activiti.systemPropertiesApi.getProperties();
            let isBackendActive = true;
            if (systemProperties) {
                logger.info(`${this.plugInInfo.host} is UP!`);
            } else {
                logger.error(`${this.plugInInfo.host} is DOWN `);
                isBackendActive = false;
            }
            return isBackendActive;
        } catch (error) {
            logger.error(
                `${this.plugInInfo.host} is not reachable error: `,
                error
            );
            return false;
        }
    }
}
