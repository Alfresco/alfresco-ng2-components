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

function loginPerform() {
    logger.info(`Perform docker login...${options.loginRepo}`);
    const loginDockerRes = exec('docker', ['login', `-u=${options.loginUsername}`, `-p=${options.loginPassword}`, `${options.loginRepo}`], {});
    logger.info(loginDockerRes);
}

function buildImagePerform(tag: string) {
    logger.info(`Perform docker build...${options.dockerRepo}:${tag}`);
    const response = exec('docker', ['build', `-t=${options.dockerRepo}:${tag}`, `--build-arg=${options.buildArgs}`, options.pathProject], {});
    logger.info(response);
}

function tagImagePerform(tagImage: string, newTag: string) {
    logger.info(`Perform docker tag... ${options.dockerRepo}:${tagImage} on ${options.dockerRepo}:${newTag}`);
    const response = exec('docker', ['tag', `${options.dockerRepo}:${tagImage}`, `${options.dockerRepo}:${newTag}`], {});
    logger.info(response);
}

function pushImagePerform(tag: string) {
    logger.info(`Perform docker push... ${options.dockerRepo}:${tag}`);
    const response = exec('docker', ['push', `${options.dockerRepo}:${tag}`], {});
    logger.info(response);
}

function cleanImagePerform(tag: string) {
    logger.info('Perform docker clean...');
    const response = exec('docker', ['rmi', `-f`, `${options.dockerRepo}:${tag}`], {});
    logger.info(response);
}

let options;
export default async function main(_args: string[]) {
    program
        .version('0.2.0')
        .description('Move in the folder where you have your Dockerfile and run the command:\n\n' +
            'adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)"')
        .option('--loginRepo [type]', 'URL registry')
        .option('--loginPassword [type]', ' password')
        .option('--loginUsername [type]', ' username')
        .option('--loginCheck [type]', 'perform login')
        .requiredOption('--dockerRepo [type]', 'docker repo')
        .requiredOption('--dockerTags [type]', ' tags')
        .requiredOption('--buildArgs [type]', ' buildArgs')
        .requiredOption('--pathProject [type]', 'path ptojrct')
        .parse(process.argv);

    options = program.opts();

    if (options.loginCheck === true) {
        loginPerform();
    }

    let mainTag;
    if (options.dockerTags !== '') {
        options.dockerTags.split(',').forEach( (tag, index) => {
            if (tag) {
                logger.info(`Analyzing tag:${tag} ...`);
                if (index === 0) {
                    logger.info(`Build only once`);
                    mainTag = tag;
                    buildImagePerform(mainTag);
                }
                tagImagePerform(mainTag, tag);
                pushImagePerform(tag);
            }
        });
        logger.info(`Clean the image with tag:${mainTag} ...`);
        cleanImagePerform(mainTag);
    } else {
        logger.error(`dockerTags cannot be empty ...`);
    }
}
