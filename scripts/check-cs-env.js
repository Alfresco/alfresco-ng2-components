let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');

async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    try {

        this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'BPM',
            hostEcm: program.host
        });
        await this.alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        console.log('Login error environment down or inaccessible');
        process.exit(1);
    }

}

main();
