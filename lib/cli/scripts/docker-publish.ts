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

export interface PublishArgs {
    tag?: string;
    loginCheck?: boolean;
    loginUsername?: string;
    loginPassword?: string;
    loginRepo?: string;
    dockerRepo?: string;
    dockerTags?: string;
    pathProject: string;
}

function loginPerform(args: PublishArgs) {
    logger.info(`Perform docker login...${args.loginRepo}`);
    const loginDockerRes = exec('docker', ['login', `-u=${args.loginUsername}`, `-p=${args.loginPassword}`, `${args.loginRepo}`], {});
    logger.info(loginDockerRes);
}

function buildImagePerform(args: PublishArgs, tag: string) {
    logger.info(`Perform docker build...${args.dockerRepo}:${tag}`);
    const response = exec('docker', ['build', `-t=${args.dockerRepo}:${tag}`, args.pathProject], {});
    logger.info(response);
}

function tagImagePerform(args: PublishArgs, tag: string) {
    logger.info(`Perform docker tag... ${args.dockerRepo}:${tag} on ${args.dockerRepo}:${tag}`);
    const response = exec('docker', ['tag', `${args.dockerRepo}:${tag}`, `${args.dockerRepo}:${tag}`], {});
    logger.info(response);
}

function pushImagePerform(args: PublishArgs) {
    logger.info(`Perform docker push... ${args.dockerRepo}`);
    const response = exec('docker', ['push', `${args.dockerRepo}`], {});
    logger.info(response);
}

function cleanImagePerform(args: PublishArgs, tag: string) {
    logger.info('Perform docker clean...');
    const response = exec('docker', ['rmi', `-f`, `${args.dockerRepo}:${tag}`], {});
    logger.info(response);
}

export default function (args: PublishArgs)  {
    main(args);
}

function main(args) {
    program
        .version('0.1.0')
        .description('Move in the folder where you have your Dockerfile and run the command:\n\n' +
            'adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)"')
        .option('--loginRepo [type]', 'URL registry')
        .option('--loginPassword [type]', ' password')
        .option('--loginUsername [type]', ' username')
        .option('--loginCheck [type]', 'perform login')
        .option('--dockerRepo [type]', 'docker repo')
        .option('--dockerTags [type]', ' tags')
        .option('--pathProject [type]', 'path ptojrct')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
    }

    if (args.loginCheck === true) {
        loginPerform(args);
    }

    if (args.dockerTags !== undefined) {
        args.dockerTags.split(',').forEach( (tag) => {
            logger.info(`Analyzing tag:${tag} ...`);
            buildImagePerform(args, tag);
            tagImagePerform(args, tag);
            pushImagePerform(args);
            cleanImagePerform(args, tag);
            logger.info(`tag:${tag} done`);
        });
    }
}
