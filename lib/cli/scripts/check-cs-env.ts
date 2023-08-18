/* eslint-disable */
import { AlfrescoApi, NodesApi, UploadApi } from '@alfresco/js-api';
import { argv, exit } from 'node:process';
const program = require('commander');
const path = require('path');
const fs = require('fs');
/* eslint-enable */
import { logger } from './logger';
const MAX_RETRY = 3;
const TIMEOUT = 20000;
let counter = 0;

export default async function main(_args: string[]) {
    program
        .version('0.1.0')
        .description('Check Content service is up ')
        .usage('check-cs-env [options]')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .option('-t, --time [type]', 'time ')
        .option('-r, --retry [type]', 'retry ')
        .parse(argv);

    await checkEnv();
    // TODO: https://alfresco.atlassian.net/browse/ACS-5873
    // await checkDiskSpaceFullEnv();
}

async function checkEnv() {
    try {
        const alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: program.host,
            contextRoot: 'alfresco'
        });

        await alfrescoJsApi.login(program.username, program.password);
    } catch (error) {
        if (error?.error?.code === 'ETIMEDOUT') {
            logger.error('The env is not reachable. Terminating');
            exit(1);
        }
        logger.error('Login error environment down or inaccessible');
        counter++;
        const retry = program.retry || MAX_RETRY;
        const time = program.time || TIMEOUT;
        if (retry === counter) {
            logger.error('Give up');
            exit(1);
        } else {
            logger.error(`Retry in 1 minute attempt N ${counter}`, error);
            sleep(time);
            await checkEnv();
        }
    }
}

// @ts-ignore
async function checkDiskSpaceFullEnv() {
    logger.info(`Start Check disk full space`);

    try {
        const alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: program.host,
            contextRoot: 'alfresco'
        });

        const nodesApi = new NodesApi(alfrescoJsApi);
        const uploadApi = new UploadApi(alfrescoJsApi);

        await alfrescoJsApi.login(program.username, program.password);

        let folder;

        try {
            folder = await nodesApi.createNode(
                '-my-',
                {
                    name: `try-env`,
                    relativePath: `Builds`,
                    nodeType: 'cm:folder'
                },
                {},
                {
                    overwrite: true
                }
            );
        } catch (error) {
            folder = await nodesApi.createNode(
                '-my-',
                {
                    name: `retry-env`,
                    relativePath: `Builds/try-env`,
                    nodeType: 'cm:folder'
                },
                {},
                {
                    overwrite: true
                }
            );
        }
        const pathFile = path.join(__dirname, '../', 'README.md');

        const file = fs.createReadStream(pathFile);

        const uploadedFile = await uploadApi.uploadFile(file, '', folder.entry.id, null, {
            name: 'README.md',
            nodeType: 'cm:content',
            autoRename: true
        });

        await nodesApi.deleteNode(uploadedFile.entry.id, { permanent: true });
    } catch (error) {
        counter++;

        const retry = program.retry || MAX_RETRY;
        const time = program.time || TIMEOUT;
        if (retry === counter) {
            logger.info('=============================================================');
            logger.info('================ Not able to upload a file ==================');
            logger.info('================ Possible cause CS is full ==================');
            logger.info('=============================================================');
            exit(1);
        } else {
            logger.error(`Retry N ${counter} ${error?.error?.status}`);
            sleep(time);
            await checkDiskSpaceFullEnv();
        }
    }
}

function sleep(delay: number) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {}
}
