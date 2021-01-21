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

async function npmPublish(project: string) {
    if (options.npmRegistry) {
        changeRegistry(project);
    }

    const version = require(`${options.pathProject}/lib/dist/${project}/package.json`).version;

    const exist = npmCheckExist(project, version);

    if (!exist) {
        logger.info(`Publishing lib ${project} to npm`);
        const optionsCommand = ['publish'];
        if (options.tag) {
            options.push('-tag');
            options.push(`${options.tag}`);
        }
        const response = exec('npm', optionsCommand, { cwd: path.resolve(`${options.pathProject}/lib/dist/${project}`) });
        logger.info(response);
        if (options.npmRegistry) {
            removeNpmConfig(project);
        }

        await sleep(30000);
    } else {
        logger.info(`@alfresco/adf-${project}@${version} already exist`);

    }
}

function npmCheckExist(project: string, version: string) {
    logger.info(`Check if lib  ${project} is already in npm`);

    const exist = exec(`npm`, [`view`, `@alfresco/adf-${project}@${version} version`]  );

    return exist !== '';
}

function changeRegistry(project: string) {
    logger.info(`Change registry... `);
    const folder = `${options.pathProject}/lib/dist/${project}`;
    const content =
        `strict-ssl=false
registry=http://${options.npmRegistry}
//${options.npmRegistry}/:_authToken="${options.tokenRegistry}"`;

    try {
        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(`${folder}/.npmrc`, content);
    } catch (e) {
        logger.error('Cannot write file', e);
    }
}

function removeNpmConfig(project: string) {
    logger.info(`Removing file from ${project}`);
    try {
        const response = exec('rm', ['.npmrc'], { cwd: path.resolve(`${options.pathProject}/lib/dist/${project}`) });
        logger.info(response);
    } catch (e) {
        logger.error('Error removing file', e);
    }
}

let options;

export default async function main(_args: string[]) {

    program
        .version('0.2.0')
        .description('Move in the folder where you have your Dockerfile and run the command \n\n adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)')
        .requiredOption('--tag [type]', 'tag')
        .requiredOption('--npmRegistry [type]', 'npm Registry')
        .requiredOption('--tokenRegistry [type]', 'token Registry')
        .requiredOption('--pathProject [type]', 'pathProject')
        .parse(process.argv);

    options = program.opts();

    for (const project of projects) {
        logger.info(`======== Publishing project: ${project} ========`);
        await npmPublish(project);
    }
}

async function sleep(ms: number) {
    logger.info(`Waiting for ${ms} milliseconds...`);
    return new Promise(resolve => setTimeout(resolve, ms));
}
