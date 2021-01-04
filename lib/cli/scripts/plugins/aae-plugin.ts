import { PluginInterface } from './plugin-model';
import { logger } from '../logger';
import { PluginConfiguration } from './plugin-config';

export class ProcessAutomationPlugin {
    config: PluginConfiguration;

    constructor(
        private plugInInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {
        this.config = new PluginConfiguration(
            this.plugInInfo,
            this.alfrescoJsApi,
            true
        );
    }

    async checkProcessServicesPlugin() {
        try {
            const isPluginEnabled = await this.config.isPluginEnabledFromAppConfiguration();
            const isBackendActive = await this.checkBackendHealth();

            if (isPluginEnabled && isBackendActive) {
                logger.info(
                    `The plugin ${
                        this.plugInInfo.name
                    } has been correctly configured`
                );
            } else {
                this.logConfigurationError();
                process.exit(1);
            }
        } catch (e) {
            this.logConfigurationError(e);
            process.exit(1);
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
            } has not been correctly configured`,
            error
        );
    }
}
