/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AlfrescoApi /*, NodesApi, UploadApi*/ } from '@alfresco/js-api';
import { argv, exit } from 'node:process';
// import { Buffer } from 'node:buffer';
const program = require('commander');
import { logger } from './logger';
const MAX_RETRY = 3;
const TIMEOUT = 20000;
let counter = 0;
let alfrescoJsApi: AlfrescoApi;

/**
 * Check CS environment command
 */
export default async function main() {
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

/**
 * Check environment
 */
async function checkEnv() {
    try {
        alfrescoJsApi = new AlfrescoApi({
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

// TODO: https://alfresco.atlassian.net/browse/ACS-5873
/*
async function checkDiskSpaceFullEnv() {
    logger.info(`Start Check disk full space`);

    try {
        const nodesApi = new NodesApi(alfrescoJsApi);
        const uploadApi = new UploadApi(alfrescoJsApi);

        const fileContent = 'x'.repeat(1024 * 1024);
        const file = Buffer.from(fileContent, 'utf8');

        const uploadedFile = await uploadApi.uploadFile(file, '', '-my-', null, {
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
            logger.error(`Retry N ${counter}`);
            logger.error(JSON.stringify(error));
            sleep(time);
            await checkDiskSpaceFullEnv();
        }
    }
}
*/

/**
 * Perform a delay
 *
 * @param delay timeout in milliseconds
 */
function sleep(delay: number) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {}
}
