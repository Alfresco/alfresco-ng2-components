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
    dockerRepo?: string;
    label?: string;
    namespaces?: string;
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

function getNamespaces(): string [] {
    logger.info('Perform get namespaces name...');
    const result =  exec('kubectl', [`get`, `namespaces`, `-l`, `type=application`, `-o`, `name`], {});
    const namespaces = result.replace(/namespace[\/]+/g, '').split(/\r?\n/);
    logger.info(`namespaces found: ${namespaces}`);
    return namespaces;
}

function getDeploymentName(args: KubeArgs, namespace: string): string {
    logger.info('Perform get deployment name...');
    const result =  exec('kubectl', [`get`, `deployments`, `--namespace=${namespace}`, `-l`, `app=${args.label}`, `-o`, `name`], {});
    logger.info(`deployment name: ${result}`);
    return result;
}

function setImage(args: KubeArgs, deploymentName: string, serviceName: string, namespace: string) {
    logger.info('Perform set image...');
    const response = exec('kubectl', [`set`, `image`, `--namespace=${namespace}`, `${deploymentName}`, `${serviceName}=${args.dockerRepo}:${args.tag}`], {});
    logger.info(response);
}

function installPerform() {
    logger.info('Perform install...');
    const responseK8sStable = exec('curl', [`-s`, `https://storage.googleapis.com/kubernetes-release/release/stable.txt`], {}).trim();
    const k8sRelease = `https://storage.googleapis.com/kubernetes-release/release/${responseK8sStable}/bin/linux/amd64/kubectl`;
    exec('curl', [`LO`, `${k8sRelease}`], {});
}

export default function(args: KubeArgs) {
    main(args);
}

function main(args) {

    program
        .version('0.1.0')
        .description('his command allows you to update a specific service on the rancher env with a specific tag \n\n' +
            'adf-cli kubectl-image --clusterEnv ${clusterEnv} --clusterUrl ${clusterUrl} --username ${username} --token ${token} --label ${label} --namespaces ${namespaces} --dockerRepo ${dockerRepo} --tag ${tag}')
        .option('--tag [type]', 'tag')
        .option('--installCheck [type]', 'install kube ctl')
        .option('--username [type]', 'username')
        .option('--clusterEnv [type]', 'cluster Env')
        .option('--clusterUrl [type]', 'cluster Url')
        .option('--dockerRepo [type]', 'docker Repo')
        .option('--label [type]', 'pod label')
        .option('--namespaces [type]', 'list of namespaces')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    if (args.installCheck === true) {
        installPerform();
    }

    if (args.tag !== undefined) {
        setCluster(args);
        setCredentials(args);
        setContext(args);
        useContext(args);
        let namespaces: string [];
        if (args.namespaces === null || args.namespaces === 'default') {
            logger.info(`No namespaces provided. Fetch all of them`);
            namespaces = getNamespaces();
        } else {
            namespaces = args.namespaces.split(',');
        }
        namespaces.forEach( (namespace) => {
            logger.info(`Find deployment name based on label ${args.label} and namespace ${namespace}`);
            const deploymentName = getDeploymentName(args, namespace);
            if (deploymentName) {
                logger.info(`Found ${deploymentName}`);
                setImage(args, deploymentName.trim(), '*', namespace);
            } else {
                logger.info(`No container with the label app=${args.label} found`);
            }

        });
    }
}
