/* eslint-disable */
import { AlfrescoApi } from '@alfresco/js-api';
import { exit, argv } from 'node:process';
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
        .parse(argv);

    await checkEnv();
}

async function checkEnv() {
    try {
        const alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: program.host,
            contextRoot: 'alfresco'
        });

        await alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        if (e.error.code === 'ETIMEDOUT') {
            logger.error('The env is not reachable. Terminating');
            exit(1);
        }
        logger.error('Login error environment down or inaccessible');
        counter++;
        if (MAX_RETRY === counter) {
            logger.error('Give up');
            exit(1);
        } else {
            logger.error(`Retry in 1 minute attempt N ${counter}`);
            sleep(TIMEOUT);
            await checkEnv();
        }
    }
}

function sleep(delay: number) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {}
}
