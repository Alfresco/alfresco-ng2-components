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

const alfrescoApi = require('@alfresco/js-api');
const program = require('commander');
const fs = require ('fs');
const path = require('path');
import { logger } from './logger';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { SharedlinksApi, FavoritesApi, NodesApi } = require('@alfresco/js-api');
const MAX_RETRY = 10;
let counter = 0;
const TIMEOUT = 6000;
const ACS_DEFAULT = require('./resources').ACS_DEFAULT;

let alfrescoJsApi;

export default async function() {
    await main();
}

async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('--clientId [type]', 'sso client', 'alfresco')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    await checkEnv();

    logger.info(`***** Step initialize ACS *****`);
    await initializeDefaultFiles();

}

async function initializeDefaultFiles() {
    const e2eFolder = ACS_DEFAULT.e2eFolder;
    const parentFolder = await createFolder(e2eFolder.name, '-my-');
    const parentFolderId = parentFolder.entry.id;

    for (let j = 0; j < ACS_DEFAULT.files.length; j++) {
        const fileInfo = ACS_DEFAULT.files[j];
        switch (fileInfo.action) {
            case 'UPLOAD':
                await uploadFile(fileInfo.name, parentFolderId);
                break;
            case 'LOCK':
                const fileToLock = await uploadFile(fileInfo.name, parentFolderId);
                await lockFile(fileToLock.entry.id);
                break;
            case 'SHARE':
                const fileToShare = await uploadFile(fileInfo.name, parentFolderId);
                await shareFile(fileToShare.entry.id);
                break;
            case 'FAVORITE':
                const fileToFav = await uploadFile(fileInfo.name, parentFolderId);
                await favoriteFile(fileToFav.entry.id);
                break;
            default:
                logger.error('No action found for file ', fileInfo.name, parentFolderId);
                break;
        }
    }
}

async function createFolder(folderName: string, parentId: string) {
        let createdFolder: any;
        const body = {
            name: folderName,
            nodeType: 'cm:folder'
        };
        try {
            createdFolder = await new NodesApi(alfrescoJsApi).createNode(parentId, body, {overwrite: true});

            logger.info(`Folder ${folderName} was created`);
        } catch (err) {
            if (err.status === 409) {
                const relativePath = `/${folderName}`;
                createdFolder = await new NodesApi(alfrescoJsApi).getNode('-my-', { relativePath });
             }
        }
        return createdFolder;
}

async function uploadFile(fileName: string, fileDestination: string) {
    const filePath = `../resources/content/${fileName}`;
    const file = fs.createReadStream(path.join(__dirname, filePath));
    let uploadedFile: any;
    try {
        uploadedFile = await alfrescoJsApi.upload.uploadFile(
            file,
            '',
            fileDestination,
            null,
            {
                name: fileName,
                nodeType: 'cm:content',
                renditions: 'doclib',
                overwrite: true
            }
        );
        logger.info(`File ${fileName} was uploaded`);
    } catch (err) {
        logger.error(`Failed to upload file with error: `, err.stack);
    }
    return uploadedFile;
}

async function lockFile(nodeId) {
    const data = {
        type: 'ALLOW_OWNER_CHANGES'
    };
    try {
        await alfrescoJsApi.nodes.lockNode(nodeId, data);
        logger.info('File was locked');
     } catch (error) {
        logger.error('Failed to lock file with error: ', error.stack);
    }
}

async function shareFile(nodeId) {
    const data = {
        nodeId
    };
    try {
        await new SharedlinksApi(alfrescoJsApi).createSharedLink(data);
        logger.info('File was shared');
     } catch (error) {
        logger.error('Failed to share file with error: ', error.stack);
    }
}

async function favoriteFile(nodeId) {
    const data = {
        target: {
          ['file']: {
            guid: nodeId
          }
        }
    };
    try {
        await new FavoritesApi(alfrescoJsApi).createFavorite('-me-', data);
        logger.info('File was add to favorites');
    } catch (error) {
        logger.error('Failed to add the file to favorites with error: ', error.stack);
    }
}

async function checkEnv() {
    try {

        alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'ALL',
            hostBpm: program.host,
            hostEcm: program.host,
            authType: 'OAUTH',
            oauth2: {
                host: `${program.host}/auth/realms/alfresco`,
                clientId: `${program.clientId}`,
                scope: 'openid'
            }
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

/* eslint-enable */

function sleep(delay) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {  }
}
