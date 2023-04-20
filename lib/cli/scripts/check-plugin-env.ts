/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { PluginTarget } from './plugins/plugin-model';
import { CheckEnv } from './plugins/check-env';
import program = require('commander');
import { ProcessServiceCheckPlugin } from './plugins/process-service-check-plugin';
import { ProcessAutomationCheckPlugin } from './plugins/process-automation-check-plugin';
import { GovernanceCheckPlugin } from './plugins/governance-check-plugin';

let pluginEnv;

export default async function main(_args: string[]) {
    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('--pluginName [type]', 'pluginName')
        .option('--clientId [type]', 'sso client', 'alfresco')
        .option('--appName [type]', 'appName ', 'Deployed appName on activiti-cloud')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .option('--ui, --uiName [type]', 'uiName', 'Deployed app UI type on activiti-cloud')
        .parse(process.argv);

    pluginEnv = new CheckEnv(program.host, program.username, program.password, program.clientId);
    await pluginEnv.checkEnv();

    if (program.pluginName === PluginTarget.processService) {
        await checkProcessServicesPlugin();
    }

    if (program.pluginName === PluginTarget.processAutomation) {
        await checkProcessAutomationPlugin();
    }

    if (program.pluginName === PluginTarget.governance) {
        await checkGovernancePlugin();
    }
}

async function checkProcessServicesPlugin() {
    const processServiceCheckPlugin = new ProcessServiceCheckPlugin(
        {
            host: program.host,
            name: PluginTarget.processService
        },
        pluginEnv.alfrescoJsApi
    );
    await processServiceCheckPlugin.checkProcessServicesPlugin();
}

async function checkProcessAutomationPlugin() {
    const processAutomationCheckPlugin = new ProcessAutomationCheckPlugin(
        {
            host: program.host,
            name: PluginTarget.processAutomation,
            appName: program.appName,
            uiName: program.uiName
        },
        pluginEnv.alfrescoJsApi
    );
    await processAutomationCheckPlugin.checkProcessAutomationPlugin();
}

async function checkGovernancePlugin() {
    const governancePluginCheck = new GovernanceCheckPlugin(
        {
            host: program.host,
            name: PluginTarget.governance
        },
        pluginEnv.alfrescoJsApi
    );

    await governancePluginCheck.checkRecordManagement();
}
