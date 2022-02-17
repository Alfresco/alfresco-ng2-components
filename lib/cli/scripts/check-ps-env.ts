/* eslint-disable */
const alfrescoApi = require('@alfresco/js-api');
const program = require('commander');
/* eslint-enable */
import { logger } from './logger';
const MAX_RETRY = 10;
const TIMEOUT = 60000;
let counter = 0;

export default async function main(_args: string[]) {

    program
        .version('0.1.0')
        .description('Check Process service is up ')
        .usage('check-ps-env [options]')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    await checkEnv();
}

async function checkEnv() {
    try {
        const alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'BPM',
            hostBpm:  program.host
        });

        await alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        if (e.error.code === 'ETIMEDOUT') {
            logger.error('The env is not reachable. Terminating');
            process.exit(1);
        }
        logger.error('Login error environment down or inaccessible');
        counter++;
        if (MAX_RETRY === counter) {
            logger.error('Give up');
            process.exit(1);
        } else {
            logger.error(`Retry in 1 minute attempt N ${counter}`);
            sleep(TIMEOUT);
            checkEnv();
        }
    }
}

function sleep(delay) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {  }
}
