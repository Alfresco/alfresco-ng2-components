import { PluginTarget } from './plugins/plugin-model';
import { CheckEnv } from './plugins/check-env';
import program = require('commander');
import { ProcessServiceCheckPlugin } from './plugins/process-service-check-plugin';
import { ProcessAutomationCheckPlugin } from './plugins/process-automation-check-plugin';
import { GovernanceCheckPlugin } from './plugins/governance-check-plugin';

let pluginEnv;
let options;

export default async function main(_args: string[]) {
    program
        .version('0.2.0')
        .requiredOption('--host [type]', 'Remote environment host')
        .requiredOption('--pluginName [type]', 'pluginName ')
        .requiredOption('-p, --password [type]', 'password ')
        .requiredOption('-u, --username [type]', 'username ')
        .option('--appName [type]', 'appName ')
        .option('--ui, --uiName [type]', 'uiName')
        .parse(process.argv);

    options = program.opts();

    pluginEnv = new CheckEnv(options.host, options.username, options.password);
    await pluginEnv.checkEnv();

    if (options.pluginName === PluginTarget.processService) {
        await checkProcessServicesPlugin();
    }

    if (options.pluginName === PluginTarget.processAutomation) {
        await checkProcessAutomationPlugin();
    }

    if (program.pluginName === PluginTarget.governance) {
        await checkGovernancePlugin();
    }
}

async function checkProcessServicesPlugin() {
    const processServiceCheckPlugin = new ProcessServiceCheckPlugin(
        {
<<<<<<< HEAD
            host: program.host,
            name: PluginTarget.processService
=======
            host: options.host,
            name: PluginTarget.processService,
            appName: null,
            uiName: null
>>>>>>> Use commander.js 7.0.0 fix tslint
        },
        pluginEnv.alfrescoJsApi
    );
    await processServiceCheckPlugin.checkProcessServicesPlugin();
}

async function checkProcessAutomationPlugin() {
    const processAutomationCheckPlugin = new ProcessAutomationCheckPlugin(
        {
            host: options.host,
            name: PluginTarget.processAutomation,
            appName: options.appName,
            uiName: options.uiName
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
