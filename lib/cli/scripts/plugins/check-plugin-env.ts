import { ProcessServicePlugin } from './aps-plugin';
import { PluginTarget } from './plugin-model';
import { CheckEnv } from './check-env';
import program = require('commander');
import { ProcessAutomationPlugin } from './aae-plugin';

let pluginEnv;

async function main() {
    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('--pluginName [type]', 'pluginName ')
        .option('--appName [type]', 'appName ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    pluginEnv = new CheckEnv(program.host, program.username, program.password);
    await pluginEnv.checkEnv();

    if (program.pluginName === PluginTarget.processService) {
        checkProcessServicesPlugin();
    }

    if (program.pluginName === PluginTarget.processAutomation) {
        checkProcessAutomationPlugin();
    }
}

async function checkProcessServicesPlugin() {
    const processServicePlugin = new ProcessServicePlugin(
        {
            host: program.host,
            name: PluginTarget.processService,
            appName: null
        },
        pluginEnv.alfrescoJsApi
    );
    await processServicePlugin.checkProcessServicesPlugin();
}

async function checkProcessAutomationPlugin() {
    const processServicePlugin = new ProcessAutomationPlugin(
        {
            host: program.host,
            name: PluginTarget.processAutomation,
            appName: program.appName
        },
        pluginEnv.alfrescoJsApi
    );
    await processServicePlugin.checkProcessServicesPlugin();
}

main();
