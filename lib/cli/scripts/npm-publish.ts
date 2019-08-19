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
import fs = require('fs');

export interface PublishArgs {
    tag?: string;
    npmRegistry?: string;
    tokenRegistry?: string;
    pathProject: string;
}

const projects = [
    'cli',
    'core',
    'insights',
    'testing',
    'content-services',
    'process-services',
    'process-services-cloud',
    'extensions'
];

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

function _npmPublish(args: PublishArgs, project: string, logger: logging.Logger) {
    if (args.npmRegistry) {
        _changeRegistry(args, project, logger);
    }
    logger.info(`Publishing lib ${project} to npm`);
    const options = ['publish'];
    if (args.tag) {
        options.push('-tag');
        options.push(`${args.tag}`);
    }
    const response = _exec('npm', options, {cwd: path.resolve(`${args.pathProject}/lib/${project}`)}, logger);
    logger.info(response);
}

function _changeRegistry(args: PublishArgs, project: string, logger: logging.Logger) {
    logger.info(`Change registry... `);
    const folder = `${args.pathProject}/lib/${project}`;
    const content =
`strict-ssl=false
registry=http://${args.npmRegistry}
//${args.npmRegistry}/:_authToken="${args.tokenRegistry}"`;
    try {
        fs.writeFileSync(`${folder}/.npmrc`, content);
    } catch (e) {
        logger.error('Cannot write file', e);
    }
}

export default async function (args: PublishArgs, logger: logging.Logger) {
    projects.forEach( (project: string) => {
        logger.info(`========Analyzing project: ${project} ========`);
        _npmPublish(args, project, logger);
    });
}
