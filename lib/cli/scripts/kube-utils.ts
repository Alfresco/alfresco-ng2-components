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

import { logger } from './logger';
import { exec } from './exec';

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

export const setCluster = (clusterEnv: string, clusterUrl: string) => {
    logger.info('Perform set-cluster...');
    const response = exec('kubectl', [`config`, `set-cluster`, `${clusterEnv}`, `--server=${clusterUrl}`], {});
    logger.info(response);
};

export const setCredentials = (username: string, token: string) => {
    logger.info('Perform set-credentials...');
    const response = exec('kubectl', [`config`, `set-credentials`, `${username}`, `--token=${token}`], {});
    logger.info(response);
};

export const setContext = (clusterEnv: string, username: string) => {
    logger.info('Perform set-context...');
    const response = exec('kubectl', [`config`, `set-context`, `${clusterEnv}`, `--cluster=${clusterEnv}`, `--user=${username}`], {});
    logger.info(response);
};

export const useContext = (clusterEnv: string) => {
    logger.info('Perform use-context...');
    const response = exec('kubectl', [`config`, `use-context`, `${clusterEnv}`], {});
    logger.info(response);
};

export const deletePod = (args: KubeArgs) => {
    logger.info('Perform delete pods...');
    const response = exec('kubectl', [`delete`, `pods`, `--all-namespaces`, `-l`, `app=${args.label}`], {});
    logger.info(response);
};

export const getNamespaces = (): string[] => {
    logger.info('Perform get namespaces name...');
    const result =  exec('kubectl', [`get`, `namespaces`, `-l`, `type=application`, `-o`, `name`], {});
    const namespaces = result.replace(/namespace[\/]+/g, '').split(/\r?\n/);
    logger.info(`namespaces found: ${namespaces}`);
    return namespaces;
};

export const getDeploymentName = (args: KubeArgs, namespace: string): string => {
    logger.info('Perform get deployment name...');
    const result =  exec('kubectl', [`get`, `deployments`, `--namespace=${namespace}`, `-l`, `app=${args.label}`, `-o`, `name`], {});
    logger.info(`deployment name: ${result}`);
    return result;
};

export const setImage = (args: KubeArgs, deploymentName: string, serviceName: string, namespace: string) => {
    logger.info('Perform set image...');
    const response = exec('kubectl', [`set`, `image`, `--namespace=${namespace}`, `${deploymentName}`, `${serviceName}=${args.dockerRepo}:${args.tag}`], {});
    logger.info(response);
};
