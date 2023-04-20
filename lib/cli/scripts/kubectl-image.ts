#!/usr/bin/env node

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

import { exec } from './exec';
import program from 'commander';
import { logger } from './logger';
import * as kube from './kube-utils';

const installPerform = () => {
    logger.info('Perform install...');
    const responseK8sStable = exec('curl', [`-s`, `https://storage.googleapis.com/kubernetes-release/release/stable.txt`], {}).trim();
    const k8sRelease = `https://storage.googleapis.com/kubernetes-release/release/${responseK8sStable}/bin/linux/amd64/kubectl`;
    exec('curl', [`LO`, `${k8sRelease}`], {});
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export default function(args: kube.KubeArgs) {
    main(args);
}

const main = (args: kube.KubeArgs) => {
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
        kube.setCluster(args.clusterEnv, args.clusterUrl);
        kube.setCredentials(args.username, args.token);
        kube.setContext(args.clusterEnv, args.username);
        kube.useContext(args.clusterEnv);

        let namespaces: string [];
        if (args.namespaces === null || args.namespaces === 'default') {
            logger.info(`No namespaces provided. Fetch all of them`);
            namespaces = kube.getNamespaces();
        } else {
            namespaces = args.namespaces.split(',');
        }

        namespaces.forEach((namespace) => {
            logger.info(`Find deployment name based on label ${args.label} and namespace ${namespace}`);
            const deploymentName = kube.getDeploymentName(args, namespace);
            if (deploymentName) {
                logger.info(`Found ${deploymentName}`);
                kube.setImage(args, deploymentName.trim(), '*', namespace);
            } else {
                logger.info(`No container with the label app=${args.label} found`);
            }
        });
    }
};
