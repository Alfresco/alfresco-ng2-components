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

import { logging } from '@angular-devkit/core';
import { spawnSync } from 'child_process';

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

function _exec(command: string, args: string[], opts: { cwd?: string }, logger: logging.Logger) {
    if (process.platform.startsWith('win')) {
        args.unshift('/c', command);
        command = 'cmd.exe';
    }

    const { status, error, stderr, stdout } = spawnSync(command, args, { ...opts });

    if (status !== 0) {
        logger.error(`Command failed: ${command} ${args.map((x) => JSON.stringify(x)).join(', ')}`);
        if (error) {
            logger.error('Error: ' + (error ? error.message : 'undefined'));
        } else {
            logger.error(`STDERR:\n${stderr}`);
        }
        throw error;
    } else {
        return stdout.toString();
    }
}

function _setCluster(args: KubeArgs, logger: logging.Logger) {
    logger.info('Perform set-cluster...');
    const response = _exec('kubectl', [`config`, `set-cluster`, `${args.clusterEnv}`, `--server=${args.clusterUrl}`], {}, logger);
    logger.info(response);
}

function _setCredentials(args: KubeArgs, logger: logging.Logger) {
    logger.info('Perform set-credentials...');
    const response = _exec('kubectl', [`config`, `set-credentials`, `${args.username}`, `--token=${args.token}`], {}, logger);
    logger.info(response);
}

function _setContext(args: KubeArgs, logger: logging.Logger) {
    logger.info('Perform set-context...');
    const response = _exec('kubectl', [`config`, `set-context`, `${args.clusterEnv}`, `--cluster=${args.clusterEnv}`, `--user=${args.username}`], {}, logger);
    logger.info(response);
}

function _useContext(args: KubeArgs, logger: logging.Logger) {
    logger.info('Perform use-context...');
    const response = _exec('kubectl', [`config`, `use-context`, `${args.clusterEnv}`], {}, logger);
    logger.info(response);
}

function _setImage(args: KubeArgs, logger: logging.Logger) {
    logger.info('Perform set image...');
    const response = _exec('kubectl', [`set`, `image`, `deployment/${args.deployName}`, `${args.serviceName}=${args.dockerRepo}:${args.tag}`], {}, logger);
    logger.info(response);
}

function _installPerform(logger: logging.Logger) {
    logger.info('Perform install...');
    const responseK8sStable = _exec('curl', [`-s`, `https://storage.googleapis.com/kubernetes-release/release/stable.txt`], {}, logger).trim();
    const k8sRelease = `https://storage.googleapis.com/kubernetes-release/release/${responseK8sStable}/bin/linux/amd64/kubectl`;
    _exec('curl', [`LO`, `${k8sRelease}`], {}, logger);
}

export default async function (args: KubeArgs, logger: logging.Logger) {
    if (args.installCheck === true) {
        _installPerform(logger);
    }
    if (args.tag !== undefined) {
        _setCluster(args, logger);
        _setCredentials(args, logger);
        _setContext(args, logger);
        _useContext(args, logger);
        _setImage(args, logger);
    }
}
