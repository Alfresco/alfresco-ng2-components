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
            if (appConfig && appConfig.plugins && appConfig.plugins[this.plugInInfo.name]) {
                logger.info(
                    `The plugin ${
                        this.plugInInfo.name
                    } has been correctly configured in app.config.json`
                );
            } else {
                this.logConfigurationError();
                isEnabled = false;
            }

            return isEnabled;
        } catch (error) {
            this.logConfigurationError(error);
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

    private logConfigurationError(error?: any) {
        logger.error(
            `The plugin ${
                this.plugInInfo.name
            } has not been correctly configured in app.config.json`,
            error
        );
    }
}
