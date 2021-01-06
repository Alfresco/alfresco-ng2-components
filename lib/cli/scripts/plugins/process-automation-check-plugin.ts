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
        let pluginStatus;
        try {
            const isPluginEnabled = await this.processAutomationHealth.isPluginEnabledFromAppConfiguration();
            const isBackendActive = await this.processAutomationHealth.checkBackendHealth();

            if (isPluginEnabled && isBackendActive) {
                logger.info(
                    `The plugin ${
                        this.plugInInfo.name
                    } has been correctly configured`
                );

                pluginStatus = [{ PluginName: this.plugInInfo.name, Status: 'Active', BE: 'Enabled', FE: 'Enabled' }];
                console.table(pluginStatus);
            } else {
                this.logConfigurationError();
                pluginStatus = [{ PluginName: this.plugInInfo.name, Status: 'Inactive', BE: isBackendActive ? 'Enabled' : 'Disabled', FE: isPluginEnabled ? 'Enabled' : 'Disabled' }];
                console.table(pluginStatus);
                process.exit(1);
            }
        } catch (e) {
            this.logConfigurationError(e);
            pluginStatus = [{ PluginName: this.plugInInfo.name, Status: 'Inactive', BE: 'Disabled', FE: 'Disabled' }];
            console.table(pluginStatus);
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
