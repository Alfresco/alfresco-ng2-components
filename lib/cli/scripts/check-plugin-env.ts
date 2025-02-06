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

import { argv } from 'node:process';
import { CheckEnv } from './plugins/check-env';
import { Command } from 'commander';
import { ProcessServiceCheckPlugin } from './plugins/process-service-check-plugin';
import { ProcessAutomationCheckPlugin } from './plugins/process-automation-check-plugin';
import { GovernanceCheckPlugin } from './plugins/governance-check-plugin';

const program = new Command();
let pluginEnv: CheckEnv;

interface CheckPluginArgs {
    host?: string;
    pluginName?: 'processService' | 'processAutomation' | 'governance';
    clientId?: string;
    appName?: string;
    username?: string;
    password?: string;
    uiName?: string;
}

/**
 * Check environment plugin
 */
export default async function main() {
    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('--pluginName [type]', 'pluginName')
        .option('--clientId [type]', 'sso client', 'alfresco')
        .option('--appName [type]', 'appName ', 'Deployed appName on activiti-cloud')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .option('--ui, --uiName [type]', 'uiName', 'Deployed app UI type on activiti-cloud')
        .parse(argv);

    const options = program.opts();

    pluginEnv = new CheckEnv(options.host, options.username, options.password, options.clientId);
    await pluginEnv.checkEnv();

    if (options.pluginName === 'processService') {
        await checkProcessServicesPlugin(options);
    }

    if (options.pluginName === 'processAutomation') {
        await checkProcessAutomationPlugin(options);
    }

    if (options.pluginName === 'governance') {
        await checkGovernancePlugin(options);
    }
}

/**
 * Check PS plugin
 *
 * @param options program arguments
 */
async function checkProcessServicesPlugin(options: CheckPluginArgs) {
    const processServiceCheckPlugin = new ProcessServiceCheckPlugin(
        {
            host: options.host,
            name: 'processService'
        },
        pluginEnv.alfrescoJsApi
    );
    await processServiceCheckPlugin.checkProcessServicesPlugin();
}

/**
 * Check APA plugin
 *
 * @param options program arguments
 */
async function checkProcessAutomationPlugin(options: CheckPluginArgs) {
    const processAutomationCheckPlugin = new ProcessAutomationCheckPlugin(
        {
            host: options.host,
            name: 'processAutomation',
            appName: options.appName,
            uiName: options.uiName
        },
        pluginEnv.alfrescoJsApi
    );
    await processAutomationCheckPlugin.checkProcessAutomationPlugin();
}

/**
 * Check AGS plugin
 *
 * @param options program arguments
 */
async function checkGovernancePlugin(options: CheckPluginArgs) {
    const governancePluginCheck = new GovernanceCheckPlugin(
        {
            host: options.host,
            name: 'governance'
        },
        pluginEnv.alfrescoJsApi
    );

    await governancePluginCheck.checkRecordManagement();
}
