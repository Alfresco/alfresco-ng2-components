/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { PluginInterface } from './plugin-model';
import { logger } from '../logger';
import { ProcessAutomationHealth } from './process-automation-health';
import { AlfrescoApi } from '@alfresco/js-api';
import { exit } from 'node:process';

export class ProcessAutomationCheckPlugin {
    processAutomationHealth: ProcessAutomationHealth;

    constructor(private plugInInfo: PluginInterface, private alfrescoJsApi: AlfrescoApi) {
        this.processAutomationHealth = new ProcessAutomationHealth(this.plugInInfo, this.alfrescoJsApi);
    }

    async checkProcessAutomationPlugin(): Promise<void> {
        let pluginStatus;
        try {
            const isPluginEnabled = await this.processAutomationHealth.isPluginEnabledFromAppConfiguration();
            const isBackendActive = await this.processAutomationHealth.checkBackendHealth();

            if (isPluginEnabled && isBackendActive) {
                logger.info(`The plugin ${this.plugInInfo.name} has been correctly configured`);

                pluginStatus = [{ PluginName: this.plugInInfo.name, Status: 'Active', BE: 'UP', FE: 'Enabled' }];
                console.table(pluginStatus);
            } else {
                this.logConfigurationError();
                pluginStatus = [
                    {
                        PluginName: this.plugInInfo.name,
                        Status: 'Inactive',
                        BE: isBackendActive ? 'UP' : 'DOWN',
                        FE: isPluginEnabled ? 'Enabled' : 'Disabled'
                    }
                ];
                console.table(pluginStatus);
                exit(1);
            }
        } catch (e) {
            this.logConfigurationError(e);
            pluginStatus = [{ PluginName: this.plugInInfo.name, Status: 'Inactive', BE: 'DOWN', FE: 'Disabled' }];
            console.table(pluginStatus);
            exit(1);
        }
    }

    private logConfigurationError(error?: any): void {
        logger.error(`The plugin ${this.plugInInfo.name} has not been correctly configured`, error);
    }
}
