#!/usr/bin/env node

/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { exec } from './exec';
import * as program from 'commander';
import { logger } from './logger';

function setCluster() {
    logger.info('Perform set-cluster...');
    const response = exec('kubectl', [`config`, `set-cluster`, `${options.clusterEnv}`, `--server=${options.clusterUrl}`], {});
    logger.info(response);
}

function setCredentials() {
    logger.info('Perform set-credentials...');
    const response = exec('kubectl', [`config`, `set-credentials`, `${options.username}`, `--token=${options.token}`], {});
    logger.info(response);
}

function setContext() {
    logger.info('Perform set-context...');
    const response = exec('kubectl', [`config`, `set-context`, `${options.clusterEnv}`, `--cluster=${options.clusterEnv}`, `--user=${options.username}`], {});
    logger.info(response);
}

function useContext() {
    logger.info('Perform use-context...');
    const response = exec('kubectl', [`config`, `use-context`, `${options.clusterEnv}`], {});
    logger.info(response);
}

function deletePod() {
    logger.info('Perform delete pods...');
    const response = exec('kubectl', [`delete`, `pods`, `--all-namespaces`, `-l`, `app=${options.label}`], {});
    logger.info(response);
}

let options;

export default async function main(_args: string[]) {

    program
        .version('0.2.0')
        .requiredOption('--username [type]', 'username')
        .requiredOption('--password [type]', 'password')
        .requiredOption('--token [type]', 'access token')
        .requiredOption('--clusterEnv [type]', 'cluster Env')
        .requiredOption('--clusterUrl [type]', 'cluster Url')
        .option('--label [type]', 'label cluster')
        .parse(process.argv);

    options = program.opts();

    if (options.label !== undefined) {
        setCluster();
        setCredentials();
        setContext();
        useContext();
        deletePod();
    }
}
