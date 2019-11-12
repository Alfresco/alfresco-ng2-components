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
    tag?: string;
    installCheck?: boolean;
    username?: string;
    token?: string;
    clusterEnv?: string;
    clusterUrl?: string;
    serviceName?: string;
    dockerRepo?: string;
    deployName?: string;
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

function setImage(args: KubeArgs) {
    logger.info('Perform set image...');
    const response = exec('kubectl', [`set`, `image`, `deployment/${args.deployName}`, `${args.serviceName}=${args.dockerRepo}:${args.tag}`], {});
    logger.info(response);
}

function installPerform() {
    logger.info('Perform install...');
    const responseK8sStable = exec('curl', [`-s`, `https://storage.googleapis.com/kubernetes-release/release/stable.txt`], {}).trim();
    const k8sRelease = `https://storage.googleapis.com/kubernetes-release/release/${responseK8sStable}/bin/linux/amd64/kubectl`;
    exec('curl', [`LO`, `${k8sRelease}`], {});
}

export default function (args: KubeArgs) {
    main(args);
}

function main(args) {

    program
        .version('0.1.0')
        .description('his command allows you to update a specific service on the rancher env with a specifig tag \n\n' +
            'adf-cli kubectl-image --clusterEnv ${clusterEnv} --clusterUrl ${clusterUrl} --username ${username} --token ${token} --deployName ${deployName} --dockerRepo ${dockerRepo} --tag ${tag}')
        .option('--tag [type]', 'tag')
        .option('--installCheck [type]', 'install kube ctl')
        .option('--username [type]', 'username')
        .option('--clusterEnv [type]', 'cluster Env')
        .option('--clusterUrl [type]', 'cluster Url')
        .option('--serviceName [type]', 'serviceName')
        .option('--dockerRepo [type]', 'docker Repo')
        .option('--deployName [type]', 'deploy Name')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
    }

    if (args.installCheck === true) {
        installPerform();
    }

    if (args.tag !== undefined) {
        setCluster(args);
        setCredentials(args);
        setContext(args);
        useContext(args);
        setImage(args);
    }
}
