
import * as program from 'commander';
import { logger } from './logger';
/* tslint:disable */
const alfrescoApi = require('@alfresco/js-api');
const path = require('path');
const fs = require('fs');
/* tslint:enable */

const MAX_RETRY = 3;
const TIMEOUT = 10000;
let counter = 0;
let options;

export default async function main(_args: string[]) {

    program
        .version('0.2.0')
        .description('Check Content service is up ')
        .usage('check-cs-env [options]')
        .requiredOption('--host [type]', 'Remote environment host adf.lab.com ')
        .requiredOption('-p, --password [type]', 'password ')
        .requiredOption('-u, --username [type]', 'username ')
        .option('-t, --time [type]', 'time ')
        .option('-r, --retry [type]', 'retry ')
        .parse(process.argv);

    options = program.opts();

    await checkEnv();
    await checkDiskSpaceFullEnv();
}

async function checkEnv() {
    try {
        const alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'ECM',
            hostEcm: options.host
        });
        await alfrescoJsApi.login(options.username, options.password);
    } catch (error) {
        logger.error(`Login error: ${error} `);
        counter++;
        const retry = options.retry || MAX_RETRY;
        const time = options.time || TIMEOUT;
        if (retry === counter) {
            logger.error('Give up');
            process.exit(1);
        } else {
            logger.error(`Retry in ${time / 1000} sec attempt N ${counter}`, error);
            sleep(time);
            checkEnv();
        }
    }
}

async function checkDiskSpaceFullEnv() {
    logger.info(`Start Check disk full space`);

    try {

        const alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'ECM',
            hostEcm: options.host
        });

        await alfrescoJsApi.login(options.username, options.password);

        let folder;

        try {
            folder = await alfrescoJsApi.nodes.addNode('-my-', {
                'name': `try-env`,
                'relativePath': `Builds`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });

        } catch (error) {
            folder = await alfrescoJsApi.nodes.getNode('-my-', {
                'relativePath': `Builds/try-env`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }
        const pathFile = path.join(__dirname, '../', 'README.md');

        const file = fs.createReadStream(pathFile);

        const uploadedFile = await alfrescoJsApi.upload.uploadFile(
            file,
            '',
            folder.entry.id,
            null,
            {
                'name': 'README.md',
                'nodeType': 'cm:content',
                'autoRename': true
            }
        );

        alfrescoJsApi.node.deleteNode(uploadedFile.entry.id, {permanent: true});
    } catch (error) {
        counter++;

        const retry = options.retry || MAX_RETRY;
        const time = options.time || TIMEOUT;
        if (retry === counter) {
            logger.error('=============================================================');
            logger.error('================ Not able to upload a file ==================');
            logger.error('================ Possible cause CS is full ==================');
            logger.error('=============================================================');
            process.exit(1);
        } else {
            logger.error(`Retry N ${counter} ${error?.error?.status}`);
            sleep(time);
            checkDiskSpaceFullEnv();
        }

    }

}

function sleep(delay) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {  }
}
