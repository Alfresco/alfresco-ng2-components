import { ProcessServicePlugin } from './ps-plugin';
import { PluginTarget } from './plugins-model';
import { CheckEnv } from './check-env';
import program = require('commander');

let pluginEnv;

async function main() {
    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('--pluginName [type]', 'pluginName ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    pluginEnv = new CheckEnv(program.host, program.username, program.password);
    await pluginEnv.checkEnv();

    if (program.pluginName === PluginTarget.processService) {
        checkProcessServicesPlugin();
    }
}

async function checkProcessServicesPlugin() {
    const processServicePlugin = new ProcessServicePlugin(
        {
            host: program.host,
            name: PluginTarget.processService
        },
        pluginEnv.alfrescoJsApi
    );
    await processServicePlugin.checkProcessServicesPlugin();
}

main();
