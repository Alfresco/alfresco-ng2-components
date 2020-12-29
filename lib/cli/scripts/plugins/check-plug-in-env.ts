import { ProcessServicePlugin } from './ps-plug-in';
import { PluginTarget } from './plugins-targets';
import { CheckEnv } from './check-env';
import program = require('commander');

async function main() {
    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('--pluginName [type]', 'pluginName ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    const pluginEnv = new CheckEnv(
        program.host,
        program.username,
        program.password
    );
    await pluginEnv.checkEnv();

    if (program.pluginName === PluginTarget.processService) {
        const processServicePlugin = new ProcessServicePlugin(
            { host: program.host, name: PluginTarget.processService },
            pluginEnv.alfrescoJsApi
        );
        await processServicePlugin.checkProcessServicesPlugin();
    }
}

main();
