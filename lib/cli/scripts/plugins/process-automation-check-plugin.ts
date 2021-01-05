import { PluginInterface } from './plugin-model';
import { logger } from '../logger';
import { ProcessAutomationHealth } from './process-automation-health';

export class ProcessAutomationCheckPlugin {
    processAutomationHealth: ProcessAutomationHealth;

    constructor(
        private plugInInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {
        this.processAutomationHealth = new ProcessAutomationHealth(
            this.plugInInfo,
            this.alfrescoJsApi
        );
    }

    async checkProcessAutomationPlugin() {
        try {
            const isPluginEnabled = await this.processAutomationHealth.isPluginEnabledFromAppConfiguration();
            const isBackendActive = await this.processAutomationHealth.checkBackendHealth();

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
