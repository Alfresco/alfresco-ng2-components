/* tslint:disable */
const alfrescoApi = require('@alfresco/js-api');
/* tslint:enable */
import program = require('commander');
import { logger } from './logger';
const MAX_RETRY = 10;
const TIMEOUT = 10000;
let counter = 0;
let options;
export default async function main(_args: string[]) {

    program
        .version('0.2.0')
        .description('Check Process service is up ')
        .usage('check-ps-env [options]')
        .requiredOption('--host [type]', 'Remote environment host adf.lab.com ')
        .requiredOption('-p, --password [type]', 'password ')
        .requiredOption('-u, --username [type]', 'username ')
        .parse(process.argv);

    options = program.opts();

    await checkEnv();
}

async function checkEnv() {
    try {
        const alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'BPM',
            hostBpm:  options.host
        });

        await alfrescoJsApi.login(options.username, options.password);
    } catch (e) {
        logger.error(`Login error: ${e} `);
        counter++;
        if (MAX_RETRY === counter) {
            logger.error('Give up');
            process.exit(1);
        } else {
            logger.error(`Retry in ${TIMEOUT / 1000} sec attempt N ${counter}`);
            sleep(TIMEOUT);
            checkEnv();
        }
    }
    logger.info('ok');
}

function sleep(delay) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {  }
}
