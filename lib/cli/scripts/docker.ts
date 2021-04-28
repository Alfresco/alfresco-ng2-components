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
import { resolve } from 'path';

enum TARGETS {
 Publish = 'publish',
 Link = 'link'
}
export interface PublishArgs {
    tag?: string;
    loginCheck?: boolean;
    loginUsername?: string;
    loginPassword?: string;
    loginRepo?: string;
    dockerRepo?: string;
    buildArgs?: string;
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
    const response = exec('docker', ['build', `-t=${args.dockerRepo}:${tag}`, `--build-arg=${args.buildArgs}`, args.pathProject], {});
    logger.info(response);
}

function tagImagePerform(args: PublishArgs, tagImage: string, newTag: string) {
    logger.info(`Perform docker tag... ${args.dockerRepo}:${tagImage} on ${args.dockerRepo}:${newTag}`);
    const response = exec('docker', ['tag', `${args.dockerRepo}:${tagImage}`, `${args.dockerRepo}:${newTag}`], {});
    logger.info(response);
}

function pullImagePerform(dockerRepo: string,  sourceTag: string) {
    logger.info(`Perform docker pull... ${dockerRepo}:${sourceTag}`);
    const response = exec('docker', ['pull', `${dockerRepo}:${sourceTag}`], {});
    logger.info(response);
}

function pushImagePerform(args: PublishArgs, tag: string) {
    logger.info(`Perform docker push... ${args.dockerRepo}:${tag}`);
    const response = exec('docker', ['push', `${args.dockerRepo}:${tag}`], {});
    logger.info(response);
}

function cleanImagePerform(args: PublishArgs, tag: string) {
    logger.info(`Perform docker clean on tag:${tag}...`);
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
            'adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}"')
        .option('--loginRepo [type]', 'URL registry')
        .option('--loginPassword [type]', ' password')
        .option('--loginUsername [type]', ' username')
        .option('--loginCheck [type]', 'perform login')
        .option('--pathProject [type]', 'the path build context')
        .option('--sourceTag [type]', 'sourceTag')
        .option('--buildArgs [type]', 'buildArgs')
        .option('--target [type]', 'target: publish or link', TARGETS.Publish)
        .requiredOption('--dockerRepo [type]', 'docker repo')
        .requiredOption('--dockerTags [type]', ' tags')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    if (!Object.values(TARGETS).includes(program.opts().target)) {
        logger.error(`error: invalid --target value. It can be ${Object.values(TARGETS)}`);
        process.exit(1);
    }

    if (program.opts().target === TARGETS.Publish && args.buildArgs === undefined) {
        logger.error(`error: required option --buildArgs [type] in case the target is ${TARGETS.Publish}`);
        process.exit(1);
    }

    if (program.opts().target === TARGETS.Link && args.sourceTag === undefined) {
        logger.error(`error: required option --sourceTag [type] in case the target is ${TARGETS.Link}`);
        process.exit(1);
    }

    if (args.pathProject === undefined) {
        args.pathProject = resolve('./');
    }

    if (args.loginCheck === true) {
        loginPerform(args);
    }

    let mainTag;
    if (args.dockerTags !== '') {
        args.dockerTags.split(',').forEach( (tag, index) => {
            if (tag) {
                logger.info(`Analyzing tag:${tag} ... for target ${program.opts().target}`);
                if (program.opts().target === TARGETS.Publish) {
                    if (index === 0) {
                        logger.info(`Build only once`);
                        mainTag = tag;
                        buildImagePerform(args, mainTag);
                    }
                } else {
                    mainTag = args.sourceTag;
                    pullImagePerform(args.dockerRepo, mainTag);
                }
                tagImagePerform(args, mainTag, tag);
                pushImagePerform(args, tag);
            }
        });
        cleanImagePerform(args, mainTag);
    } else {
        logger.error(`dockerTags cannot be empty ...`);
    }
}
