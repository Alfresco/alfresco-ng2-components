let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');

let MAX_RETRY = 10;
let counter = 0;
let TIMEOUT = 60000;

async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);


    await checkEnv();
}

async function checkEnv() {
    try {
        this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'BPM',
            hostBpm:  program.host
        });

        await this.alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        console.log('Login error environment down or inaccessible');
        counter++;
        if (MAX_RETRY === counter) {
            console.log('Give up');
            process.exit(1);
        } else {
            console.log(`Retry in 1 minute attempt N ${counter}`);
            sleep(TIMEOUT);
            checkEnv();
        }
    }
    console.log('ok');
}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}

main();
