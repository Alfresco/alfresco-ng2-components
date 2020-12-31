import { PlugInInterface } from './plugin-model';
import { logger } from '../logger';
import { PluginConfiguration } from './plugin-config';

export class ProcessServicePlugin {
    config: PluginConfiguration;

    constructor(private plugInInfo: PlugInInterface, private alfrescoJsApi: any) {
        this.config = new PluginConfiguration(this.plugInInfo, this.alfrescoJsApi, false);
    }

    async checkProcessServicesPlugin() {
        try {
            const isPluginEnabled = await this.config.isPluginEnabledFromAppConfiguration();
            const isBackendActive = await this.checkBackendHealth();

            if (!isPluginEnabled || !isBackendActive) {
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
