/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AlfrescoApi, SharedlinksApi, FavoritesApi, NodesApi, UploadApi, NodeEntry } from '@alfresco/js-api';
import { exit, argv } from 'node:process';
import { parseArgs } from 'node:util';
import { createReadStream } from 'fs';
import * as path from 'path';
import { logger } from './logger';

interface InitAcsEnvArgs {
    host?: string;
    clientId?: string;
    username?: string;
    password?: string;
}
const MAX_RETRY = 10;
let counter = 0;
const TIMEOUT = 6000;
const ACS_DEFAULT = require('./resources').ACS_DEFAULT;

let alfrescoJsApi: AlfrescoApi;

/**
 * Init ACS environment command
 */
export default async function main() {
    if (argv.includes('-h') || argv.includes('--help')) {
        console.log(`
Usage: init-acs-env [options]

Initialize ACS environment

Options:
  -v, --version         Output the version number
  --host <host>         Remote environment host
  --clientId <id>       SSO client (default: "alfresco")
  -p, --password <pass> Password
  -u, --username <user> Username
  -h, --help            Display help for command
`);
        exit(0);
    }

    if (argv.includes('-v') || argv.includes('--version')) {
        console.log('0.1.0');
        exit(0);
    }

    const { values } = parseArgs({
        args: argv.slice(2),
        options: {
            host: {
                type: 'string'
            },
            clientId: {
                type: 'string',
                default: 'alfresco'
            },
            password: {
                type: 'string',
                short: 'p'
            },
            username: {
                type: 'string',
                short: 'u'
            }
        },
        allowPositionals: true
    });

    const opts: InitAcsEnvArgs = {
        host: values.host as string | undefined,
        clientId: values.clientId as string | undefined,
        username: values.username as string | undefined,
        password: values.password as string | undefined
    };

    await checkEnv(opts);

    const alreadyInitialized = await isEnvironmentAlreadyInitialized();
    if (alreadyInitialized) {
        logger.info(`ACS environment already initialized (terraform). Skipping.`);
        return;
    }

    logger.info(`***** Step initialize ACS *****`);
    await initializeDefaultFiles();
}

/**
 * Check if the ACS environment was already initialized (e.g. by terraform).
 * Verifies the e2e-test-data folder and expected files exist.
 */
async function isEnvironmentAlreadyInitialized(): Promise<boolean> {
    const folderName = ACS_DEFAULT.e2eFolder.name;
    const expectedFiles: string[] = ACS_DEFAULT.files.map((f: { name: string }) => f.name);

    try {
        const nodesApi = new NodesApi(alfrescoJsApi);
        const folderPath = `/${folderName}`;
        const folder = await nodesApi.getNode('-my-', { relativePath: folderPath });

        if (!folder?.entry?.id) {
            return false;
        }

        for (const fileName of expectedFiles) {
            try {
                await nodesApi.getNode(folder.entry.id, { relativePath: `/${fileName}` });
            } catch (error) {
                logger.info(`File '${fileName}' missing in folder '${folderName}'`, error);
                return false;
            }
        }

        logger.info(`All expected files found in folder '${folderName}'`);
        return true;
    } catch (error) {
        logger.info(`Folder '${folderName}' not found or not accessible - environment needs initialization`, error);
        return false;
    }
}

/**
 * Setup default files
 */
async function initializeDefaultFiles() {
    const e2eFolder = ACS_DEFAULT.e2eFolder;
    const parentFolder = await createFolder(e2eFolder.name, '-my-');
    const parentFolderId = parentFolder.entry.id;

    for (let j = 0; j < ACS_DEFAULT.files.length; j++) {
        const fileInfo = ACS_DEFAULT.files[j];
        switch (fileInfo.action) {
            case 'UPLOAD': {
                await uploadFile(fileInfo.name, parentFolderId);
                break;
            }
            case 'LOCK': {
                const fileToLock = await uploadFile(fileInfo.name, parentFolderId);
                await lockFile(fileToLock.entry.id);
                break;
            }
            case 'SHARE': {
                const fileToShare = await uploadFile(fileInfo.name, parentFolderId);
                await shareFile(fileToShare.entry.id);
                break;
            }
            case 'FAVORITE': {
                const fileToFav = await uploadFile(fileInfo.name, parentFolderId);
                await favoriteFile(fileToFav.entry.id);
                break;
            }
            default: {
                logger.error('No action found for file ', fileInfo.name, parentFolderId);
                break;
            }
        }
    }
}

/**
 * Create folder
 *
 * @param folderName folder name
 * @param parentId parent folder id
 */
async function createFolder(folderName: string, parentId: string) {
    let createdFolder: NodeEntry;
    const body = {
        name: folderName,
        nodeType: 'cm:folder'
    };
    try {
        createdFolder = await new NodesApi(alfrescoJsApi).createNode(parentId, body, { overwrite: true });

        logger.info(`Folder ${folderName} was created`);
    } catch (err) {
        if (err.status === 409) {
            const relativePath = `/${folderName}`;
            createdFolder = await new NodesApi(alfrescoJsApi).getNode('-my-', { relativePath });
        }
    }
    return createdFolder;
}

/**
 * Upload file
 *
 * @param fileName file name
 * @param fileDestination destination path
 */
async function uploadFile(fileName: string, fileDestination: string): Promise<NodeEntry> {
    const filePath = `../resources/content/${fileName}`;
    const file = createReadStream(path.join(__dirname, filePath));
    let uploadedFile: NodeEntry;
    try {
        uploadedFile = await new UploadApi(alfrescoJsApi).uploadFile(file, '', fileDestination, null, {
            name: fileName,
            nodeType: 'cm:content',
            renditions: 'doclib',
            overwrite: true
        });
        logger.info(`File ${fileName} was uploaded`);
    } catch (err) {
        logger.error(`Failed to upload file with error: `, err);
    }
    return uploadedFile;
}

/**
 * Lock file node
 *
 * @param nodeId node id
 */
async function lockFile(nodeId: string): Promise<NodeEntry> {
    const data = {
        type: 'ALLOW_OWNER_CHANGES'
    };
    try {
        const result = await new NodesApi(alfrescoJsApi).lockNode(nodeId, data);
        logger.info('File was locked');
        return result;
    } catch (error) {
        logger.error('Failed to lock file with error: ', error);
        return null;
    }
}

/**
 * Share file node
 *
 * @param nodeId node id
 */
async function shareFile(nodeId: string) {
    const data = {
        nodeId
    };
    try {
        await new SharedlinksApi(alfrescoJsApi).createSharedLink(data);
        logger.info('File was shared');
    } catch (error) {
        logger.error('Failed to share file with error: ', error);
    }
}

/**
 * Favorite file node
 *
 * @param nodeId node id
 */
async function favoriteFile(nodeId: string) {
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
        logger.error('Failed to add the file to favorites with error: ', error);
    }
}

/**
 * Check environment state
 *
 * @param opts command options
 */
async function checkEnv(opts: InitAcsEnvArgs) {
    try {
        alfrescoJsApi = new AlfrescoApi({
            provider: 'ALL',
            hostBpm: opts.host,
            hostEcm: opts.host,
            authType: 'OAUTH',
            oauth2: {
                host: `${opts.host}/auth/realms/alfresco`,
                clientId: `${opts.clientId}`,
                scope: 'openid',
                redirectUri: '/'
            },
            contextRoot: 'alfresco'
        });
        await alfrescoJsApi.login(opts.username, opts.password);
    } catch (e: any) {
        if (e?.error?.code === 'ETIMEDOUT') {
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
            await checkEnv(opts);
        }
    }
}

/**
 * Perform a delay
 *
 * @param delay timeout in milliseconds
 */
function sleep(delay: number) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) {}
}
