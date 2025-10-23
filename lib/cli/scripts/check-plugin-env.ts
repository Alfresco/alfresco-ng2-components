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

import { argv, exit } from 'node:process';
import { parseArgs } from 'node:util';
import { CheckEnv } from './plugins/check-env';
import { ProcessServiceCheckPlugin } from './plugins/process-service-check-plugin';
import { ProcessAutomationCheckPlugin } from './plugins/process-automation-check-plugin';
import { GovernanceCheckPlugin } from './plugins/governance-check-plugin';

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
    if (argv.includes('-h') || argv.includes('--help')) {
        console.log(`
Usage: check-plugin-env [options]

Check plugin status

Options:
  -v, --version           Output the version number
  --host <host>           Remote environment host
  --pluginName <name>     Plugin name (processService, processAutomation, governance)
  --clientId <id>         SSO client (default: "alfresco")
  --appName <name>        Deployed appName on activiti-cloud
  -p, --password <pass>   Password
  -u, --username <user>   Username
  --ui, --uiName <name>   Deployed app UI type on activiti-cloud
  -h, --help              Display help for command
`);
        exit(0);
    }

    if (argv.includes('-v') || argv.includes('--version')) {
        console.log('0.1.0');
        exit(0);
    }

    const { values } = parseArgs({
        args: argv.slice(2),
        options: {
            host: {
                type: 'string'
            },
            pluginName: {
                type: 'string'
            },
            clientId: {
                type: 'string',
                default: 'alfresco'
            },
            appName: {
                type: 'string'
            },
            password: {
                type: 'string',
                short: 'p'
            },
            username: {
                type: 'string',
                short: 'u'
            },
            ui: {
                type: 'string'
            },
            uiName: {
                type: 'string'
            }
        },
        allowPositionals: true
    });

    const options: CheckPluginArgs = {
        host: values.host as string | undefined,
        pluginName: values.pluginName as 'processService' | 'processAutomation' | 'governance' | undefined,
        clientId: values.clientId as string | undefined,
        appName: values.appName as string | undefined,
        username: values.username as string | undefined,
        password: values.password as string | undefined,
        uiName: (values.ui || values.uiName) as string | undefined
    };

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
