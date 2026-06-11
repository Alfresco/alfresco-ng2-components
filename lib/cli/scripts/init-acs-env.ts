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
const RETRY_DELAY_MS = 6000;
const ACS_DEFAULT = require('./resources').ACS_DEFAULT;

let alfrescoJsApi: AlfrescoApi;
let nodesApi: NodesApi;
let uploadApi: UploadApi;
let sharedlinksApi: SharedlinksApi;
let favoritesApi: FavoritesApi;

/**
 * Init ACS environment command
 */
export default async function main() {
    if (argv.includes('-h') || argv.includes('--help')) {
        console.log(`
Usage: init-acs-env [options]

Initialize ACS environment

Options:
  --host <host>         Remote environment host
  --clientId <id>       SSO client (default: "alfresco")
  -p, --password <pass> Password
  -u, --username <user> Username
  -h, --help            Display help for command
`);
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

    logger.info('***** Step initialize ACS *****');
    await initializeDefaultFiles();
}

/**
 * Initialize default files. Creates the e2e folder and ensures each file
 * exists with its required state (locked, shared, favorite).
 * Idempotent: only creates/modifies what is missing.
 */
async function initializeDefaultFiles() {
    const e2eFolderName: string = ACS_DEFAULT.e2eFolder.name;

    let parentFolder: NodeEntry;
    try {
        parentFolder = await withRetry(() => ensureFolder(e2eFolderName, '-my-'), `ensure folder ${e2eFolderName}`);
    } catch (error: any) {
        logger.warn(`Skipping file initialization: test-data folder could not be created: ${formatError(error)}`);
        return;
    }

    const parentFolderId = getEntryId(parentFolder, `folder ${e2eFolderName}`);

    for (const fileInfo of ACS_DEFAULT.files) {
        await withRetry(() => processFile(fileInfo, parentFolderId), `initialize ${fileInfo.name}`);
    }
}

/**
 * Process a single file: upload if missing, then apply its action (lock/share/favorite).
 * @param fileInfo file descriptor from ACS_DEFAULT
 * @param fileInfo.name file name
 * @param fileInfo.action action to apply (LOCK, SHARE, FAVORITE)
 * @param parentFolderId parent folder node id
 */
async function processFile(fileInfo: { name: string; action: string }, parentFolderId: string) {
    const existingNode = await findNodeByRelativePath(parentFolderId, fileInfo.name);

    let nodeId: string;
    if (existingNode?.entry?.id) {
        logger.info(`File ${fileInfo.name} already exists, verifying required state.`);
        nodeId = existingNode.entry.id;
    } else {
        const createdNode = await uploadFile(fileInfo.name, parentFolderId);
        nodeId = getEntryId(createdNode, `file ${fileInfo.name}`);
    }

    switch (fileInfo.action) {
        case 'LOCK':
            await ensureLocked(nodeId, fileInfo.name, existingNode?.entry?.isLocked);
            break;
        case 'SHARE':
            await ensureShared(nodeId, fileInfo.name);
            break;
        case 'FAVORITE':
            await ensureFavorite(nodeId, fileInfo.name);
            break;
        default:
            break;
    }
}

/**
 * Ensure a folder exists under the given parent. Creates it if missing.
 * Handles 409 conflict (race condition) by fetching the existing folder.
 * @param folderName folder name
 * @param parentId parent node id
 * @returns the folder node entry
 */
async function ensureFolder(folderName: string, parentId: string): Promise<NodeEntry> {
    const existingFolder = await findNodeByRelativePath(parentId, folderName);

    if (existingFolder?.entry?.id) {
        if (!existingFolder.entry.isFolder) {
            throw new Error(
                `Cannot use ${folderName} as test-data folder: a non-folder node with that name already exists (nodeType: ${existingFolder.entry.nodeType}, id: ${existingFolder.entry.id}).`
            );
        }
        logger.info(`Folder ${folderName} already exists.`);
        return existingFolder;
    }

    try {
        const createdFolder = await nodesApi.createNode(parentId, { name: folderName, nodeType: 'cm:folder' }, { overwrite: true });
        logger.info(`Folder ${folderName} was created`);
        return createdFolder;
    } catch (error: any) {
        if (error?.status === 409) {
            const conflictingFolder = await findNodeByRelativePath(parentId, folderName);

            if (conflictingFolder?.entry?.id) {
                if (!conflictingFolder.entry.isFolder) {
                    throw new Error(
                        `Cannot use ${folderName} as test-data folder: a non-folder node with that name already exists (nodeType: ${conflictingFolder.entry.nodeType}, id: ${conflictingFolder.entry.id}).`
                    );
                }
                logger.info(`Folder ${folderName} already exists.`);
                return conflictingFolder;
            }
        }

        throw new Error(`Failed to ensure folder ${folderName}: ${formatError(error)}`);
    }
}

/**
 * Find a node by relative path under a parent. Returns null if not found (404).
 * @param parentId parent node id
 * @param fileName relative path / file name
 * @returns the node entry or null if not found
 */
async function findNodeByRelativePath(parentId: string, fileName: string): Promise<NodeEntry | null> {
    try {
        return await nodesApi.getNode(parentId, { relativePath: `/${fileName}`, include: ['isLocked'] });
    } catch (error: any) {
        if (error?.status === 404) {
            return null;
        }

        throw new Error(`Failed to fetch ${fileName}: ${formatError(error)}`);
    }
}

/**
 * Upload a file to the given destination folder.
 * @param fileName file name
 * @param destinationId destination folder node id
 * @returns the uploaded node entry
 */
async function uploadFile(fileName: string, destinationId: string): Promise<NodeEntry> {
    const filePath = `../resources/content/${fileName}`;
    const file = createReadStream(path.join(__dirname, filePath));

    try {
        const uploadedFile = await uploadApi.uploadFile(file, '', destinationId, null, {
            name: fileName,
            nodeType: 'cm:content',
            renditions: 'doclib',
            overwrite: true
        });
        logger.info(`File ${fileName} was uploaded`);
        return uploadedFile;
    } catch (error: any) {
        throw new Error(`Failed to upload ${fileName}: ${formatError(error)}`);
    }
}

/**
 * Ensure a file is locked. Skips if already locked.
 * @param nodeId node id
 * @param fileName file name (for logging)
 * @param isAlreadyLocked whether the node is already locked
 */
async function ensureLocked(nodeId: string, fileName: string, isAlreadyLocked = false) {
    if (isAlreadyLocked) {
        logger.info(`File ${fileName} is already locked.`);
        return;
    }

    try {
        await nodesApi.lockNode(nodeId, { type: 'ALLOW_OWNER_CHANGES' });
        logger.info(`File ${fileName} was locked`);
    } catch (error: any) {
        throw new Error(`Failed to lock ${fileName}: ${formatError(error)}`);
    }
}

/**
 * Ensure a file is shared. Handles 409 (already shared) gracefully.
 * @param nodeId node id
 * @param fileName file name (for logging)
 */
async function ensureShared(nodeId: string, fileName: string) {
    try {
        await sharedlinksApi.createSharedLink({ nodeId });
        logger.info(`File ${fileName} was shared`);
    } catch (error: any) {
        if (error?.status === 409) {
            logger.info(`File ${fileName} is already shared.`);
            return;
        }

        throw new Error(`Failed to share ${fileName}: ${formatError(error)}`);
    }
}

/**
 * Ensure a file is favorite. Handles 409 (already favorite) gracefully.
 * @param nodeId node id
 * @param fileName file name (for logging)
 */
async function ensureFavorite(nodeId: string, fileName: string) {
    try {
        await favoritesApi.createFavorite('-me-', {
            target: {
                file: {
                    guid: nodeId
                }
            }
        });
        logger.info(`File ${fileName} was added to favorites`);
    } catch (error: any) {
        if (error?.status === 409) {
            logger.info(`File ${fileName} is already a favorite.`);
            return;
        }

        throw new Error(`Failed to favorite ${fileName}: ${formatError(error)}`);
    }
}

/**
 * Extract entry id from a node response. Throws if missing.
 * @param nodeEntry node entry response
 * @param label label for error message
 * @returns the node id
 */
function getEntryId(nodeEntry: NodeEntry, label: string): string {
    const nodeId = nodeEntry?.entry?.id;

    if (nodeId) {
        return nodeId;
    }

    throw new Error(`Missing ACS response entry for ${label}.`);
}

/**
 * Format an error for logging.
 * @param error error object
 * @returns formatted error string
 */
function formatError(error: any): string {
    if (!error) {
        return 'Unknown error';
    }

    if (typeof error === 'string') {
        return error;
    }

    try {
        return error?.message || error?.stack || JSON.stringify(error);
    } catch {
        return 'Unknown error (unable to serialize)';
    }
}

/**
 * Retry wrapper for transient failures.
 * @param fn async function to execute
 * @param label label for logging
 * @param maxAttempts maximum retry attempts
 * @returns the result of the function
 */
async function withRetry<T>(fn: () => Promise<T>, label: string, maxAttempts = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            if (attempt === maxAttempts) {
                logger.error(`${label}: failed after ${maxAttempts} attempts: ${formatError(error)}`);
                throw error;
            }

            logger.warn(`${label}: attempt ${attempt} failed, retrying in ${RETRY_DELAY_MS / 1000}s: ${formatError(error)}`);
            await wait(RETRY_DELAY_MS);
        }
    }

    throw new Error(`${label}: exhausted all ${maxAttempts} attempts`);
}

/**
 * Async delay.
 * @param ms milliseconds to wait
 * @returns a promise that resolves after the delay
 */
function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check environment state and authenticate. Retries on transient failures.
 * @param opts command options
 * @param attempt current attempt number
 */
async function checkEnv(opts: InitAcsEnvArgs, attempt = 1) {
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

        nodesApi = new NodesApi(alfrescoJsApi);
        uploadApi = new UploadApi(alfrescoJsApi);
        sharedlinksApi = new SharedlinksApi(alfrescoJsApi);
        favoritesApi = new FavoritesApi(alfrescoJsApi);
    } catch (error: any) {
        const errorCode = error?.error?.code;

        if (errorCode === 'ETIMEDOUT' || error?.status === 504) {
            logger.warn('Login attempt timed out or received a gateway error, environment may still be starting up.');
        } else {
            logger.error('Login error, environment down or inaccessible.');
        }

        if (attempt >= MAX_RETRY) {
            logger.error('Give up');
            exit(1);
        }

        logger.warn(`Retry in ${RETRY_DELAY_MS / 1000} seconds, attempt ${attempt}`);
        await wait(RETRY_DELAY_MS);
        await checkEnv(opts, attempt + 1);
    }
}
