import { PluginInterface } from './plugin-model';
import { logger } from '../logger';
import { ProcessServiceHealth } from './process-services-health';

export class ProcessServiceCheckPlugin {
    processServiceHealth: ProcessServiceHealth;

    constructor(
        private plugInInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {
        this.processServiceHealth = new ProcessServiceHealth(
            this.plugInInfo,
            this.alfrescoJsApi
        );
    }

    async checkProcessServicesPlugin() {
        try {
            const isPluginEnabled = await this.processServiceHealth.isPluginEnabledFromAppConfiguration();
            const isBackendActive = await this.processServiceHealth.checkBackendHealth();

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

    private logConfigurationError(error?: any) {
        logger.error(
            `The plugin ${
                this.plugInInfo.name
            } has not been correctly configured`,
            error
        );
    }
}
