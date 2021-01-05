import { PluginInterface } from './plugin-model';
import { logger } from '../logger';
import { PluginConfiguration } from './plugin-config';

export class ProcessAutomationHealth {
    config: PluginConfiguration;

    constructor(
        private plugInInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {
        this.config = new PluginConfiguration(
            this.plugInInfo,
            this.alfrescoJsApi
        );
    }

    async isPluginEnabledFromAppConfiguration() {
        try {
            const url = `${this.plugInInfo.host}/${this.plugInInfo.appName}/ui/${this.plugInInfo.uiName}/app.config.json`;
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
                isEnabled = false;
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
        const url = `${this.plugInInfo.host}/${this.plugInInfo.appName}/rb/actuator/health`;
        let isBackendActive = true;
        try {
            const response = await this.config.callCustomApi(url);
            if (response.status === 'UP') {
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
