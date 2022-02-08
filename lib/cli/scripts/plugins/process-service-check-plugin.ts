/* eslint-disable @typescript-eslint/naming-convention */

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
        let pluginStatus;
        try {
            const isPluginEnabled = await this.processServiceHealth.isPluginEnabledFromAppConfiguration();
            const isBackendActive = await this.processServiceHealth.checkBackendHealth();

            if (isPluginEnabled && isBackendActive) {
                logger.info(
                    `The plugin ${
                        this.plugInInfo.name
                    } has been correctly configured`
                );
                pluginStatus = [{ PluginName: this.plugInInfo.name, Status: `${'Active'}`, BE: 'UP', FE: 'Enabled' }];
                console.table(pluginStatus);
            } else {
                this.logConfigurationError();
                pluginStatus = [{ PluginName: this.plugInInfo.name, Status: 'Inactive', BE: isBackendActive ? 'UP' : 'DOWN', FE: isPluginEnabled ? 'Enabled' : 'Disabled' }];
                console.table(pluginStatus);
                process.exit(1);
            }
        } catch (e) {
            this.logConfigurationError(e);
            pluginStatus = [{ PluginName: this.plugInInfo.name, Status: 'Inactive', BE: 'DOWN', FE: 'Disabled' }];
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
