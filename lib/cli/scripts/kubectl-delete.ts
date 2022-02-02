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

export interface KubeArgs {
    username?: string;
    token?: string;
    clusterEnv?: string;
    clusterUrl?: string;
    label?: string;
}

function setCluster(args: KubeArgs) {
    logger.info('Perform set-cluster...');
    const response = exec('kubectl', [`config`, `set-cluster`, `${args.clusterEnv}`, `--server=${args.clusterUrl}`], {});
    logger.info(response);
}

function setCredentials(args: KubeArgs) {
    logger.info('Perform set-credentials...');
    const response = exec('kubectl', [`config`, `set-credentials`, `${args.username}`, `--token=${args.token}`], {});
    logger.info(response);
}

function setContext(args: KubeArgs) {
    logger.info('Perform set-context...');
    const response = exec('kubectl', [`config`, `set-context`, `${args.clusterEnv}`, `--cluster=${args.clusterEnv}`, `--user=${args.username}`], {});
    logger.info(response);
}

function useContext(args: KubeArgs) {
    logger.info('Perform use-context...');
    const response = exec('kubectl', [`config`, `use-context`, `${args.clusterEnv}`], {});
    logger.info(response);
}

function deletePod(args: KubeArgs) {
    logger.info('Perform delete pods...');
    const response = exec('kubectl', [`delete`, `pods`, `--all-namespaces`, `-l`, `app=${args.label}`], {});
    logger.info(response);
}

export default function(args: KubeArgs) {
    main(args);
}

function main(args) {

    program
        .version('0.1.0')
        .option('--username [type]', 'username')
        .option('--password [type]', 'password')
        .option('--token [type]', 'access token')
        .option('--clusterEnv [type]', 'cluster Env')
        .option('--clusterUrl [type]', 'cluster Url')
        .option('--label [type]', 'label cluster')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    if (args.label !== undefined) {
        setCluster(args);
        setCredentials(args);
        setContext(args);
        useContext(args);
        deletePod(args);
    }
}
