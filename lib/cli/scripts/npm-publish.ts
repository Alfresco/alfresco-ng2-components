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

import * as path from 'path';
import fs = require('fs');
import { exec } from './exec';
import * as program from 'commander';
import { logger } from './logger';

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

function npmPublish(args: PublishArgs, project: string) {
    if (args.npmRegistry) {
        changeRegistry(args, project);
    }
    logger.info(`Publishing lib ${project} to npm`);
    const options = ['publish'];
    if (args.tag) {
        options.push('-tag');
        options.push(`${args.tag}`);
    }
    const response = exec('npm', options, { cwd: path.resolve(`${args.pathProject}/lib/dist/${project}`) });
    logger.info(response);
    if (args.npmRegistry) {
        removeNPMRC(args, project);
    }
}

function changeRegistry(args: PublishArgs, project: string) {
    logger.info(`Change registry... `);
    const folder = `${args.pathProject}/lib/dist/${project}`;
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

function removeNPMRC(args: PublishArgs, project: string) {
    logger.info(`Removing file from ${project}`);
    const response = exec('rm', ['.npmrc'], { cwd: path.resolve(`${args.pathProject}/lib/dist/${project}`) });
    logger.info(response);
}

export default function (args: PublishArgs) {

    main(args);
}

function main(args) {

    program
        .version('0.1.0')
        .description('Move in the folder where you have your Dockerfile and run the command \n\n adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)')
        .option('--tag [type]', 'tag')
        .option('--npmRegistry [type]', 'npm Registry')
        .option('--tokenRegistry [type]', 'token Registry')
        .option('--pathProject [type]', 'pathProject')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
    }

    projects.forEach((project: string) => {
        logger.info(`========Analyzing project: ${project} ========`);
        npmPublish(args, project);
    });
}
