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
import * as path from 'path';

export interface PublishArgs {
    tag?: string;
    loginCheck?: boolean;
    loginUsername?: string;
    loginPassword?: string;
    loginRepo?: string;
    dockerRepo?: string;
    dockerTags?: string;
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

function _loginPerform(args: PublishArgs, logger: logging.Logger) {
    logger.info('Perform docker login...');
    const loginDockerRes = _exec('docker', ['login', `-u=${args.loginUsername}`, `-p=${args.loginPassword}`, `${args.loginRepo}`], {}, logger);
    logger.info(loginDockerRes);
}

function _buildImagePerform(args: PublishArgs, tag: string, logger: logging.Logger) {
    logger.info('Perform docker build...');
    const rootPath = path.join(process.cwd(), '../', '../');
    const buildDockerRes = _exec('docker', ['build', `-t=${args.dockerRepo}:${tag}`, rootPath], {}, logger);
    logger.info(buildDockerRes);
}

export default async function (args: PublishArgs, logger: logging.Logger) {
    if (args.loginCheck === true) {
        _loginPerform(args, logger);
    }

    if (args.dockerTags !== undefined) {
        args.dockerTags.split(',').forEach( (tag) => {
            logger.info(`Building docker image for tag ${tag} ...`);
            _buildImagePerform(args, tag, logger);
        });
    }

}
