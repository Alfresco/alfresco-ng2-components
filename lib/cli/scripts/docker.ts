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

import { argv, exit } from 'node:process';
import { exec } from './exec';
import program from 'commander';
import { logger } from './logger';
import { resolve } from 'path';

// eslint-disable-next-line no-shadow
enum TARGETS {
    publish = 'publish',
    link = 'link'
}

const DOCKER_FILENAME = 'Dockerfile';
export interface PublishArgs {
    tag?: string;
    dryrun?: boolean;
    verbose?: boolean;
    loginCheck?: boolean;
    loginUsername?: string;
    loginPassword?: string;
    loginRepo?: string;
    dockerRepo?: string;
    buildArgs?: string[];
    dockerTags?: string;
    pathProject: string;
    fileName: string;
    sourceTag?: string;
}

/**
 * Perform a login
 *
 * @param args arguments
 */
function login(args: PublishArgs) {
    logger.info(`Perform docker login...${args.loginRepo}`);
    const loginDockerRes = exec('docker', ['login', `-u=${args.loginUsername}`, `-p=${args.loginPassword}`, `${args.loginRepo}`]);
    logger.info(loginDockerRes);
}

/**
 * Build Docker image
 *
 * @param args command arguments
 * @param tag tag
 */
function buildImage(args: PublishArgs, tag: string) {
    logger.info(`Perform docker build...${args.dockerRepo}:${tag}`);

    const buildArgs = [];

    if (typeof args.buildArgs === 'string') {
        buildArgs.push(`--build-arg=${args.buildArgs}`);
    } else {
        args.buildArgs.forEach((envVar) => {
            buildArgs.push(`--build-arg=${envVar}`);
        });
    }
    if (args.verbose) {
        logger.info(`Dry-run Perform docker build -t=${args.dockerRepo}:${tag} ${buildArgs} -f=${args.fileName} ${args.pathProject}`);
    }
    const response = exec('docker', ['build', `-t=${args.dockerRepo}:${tag}`, ...buildArgs, `-f=${args.fileName}`, args.pathProject], {});
    logger.info(response);
}

/**
 * Tag Docker image
 *
 * @param args command arguments
 * @param imageTag image tag
 * @param newTag new image tag
 */
function tagImage(args: PublishArgs, imageTag: string, newTag: string) {
    logger.info(`Perform docker tag... ${args.dockerRepo}:${imageTag} on ${args.dockerRepo}:${newTag}`);
    const response = exec('docker', ['tag', `${args.dockerRepo}:${imageTag}`, `${args.dockerRepo}:${newTag}`], {});
    logger.info(response);
}

/**
 * Pull Docker image
 *
 * @param dockerRepo repository
 * @param sourceTag tag
 */
function pullImage(dockerRepo: string, sourceTag: string) {
    logger.info(`Perform docker pull... ${dockerRepo}:${sourceTag}`);
    const response = exec('docker', ['pull', `${dockerRepo}:${sourceTag}`], {});
    logger.info(response);
}

/**
 * Push Docker image
 *
 * @param args command arguments
 * @param tag tag
 */
function pushImage(args: PublishArgs, tag: string) {
    if (args.dryrun) {
        logger.info(`Dry-run Perform docker push... ${args.dockerRepo}:${tag}`);
    } else {
        logger.info(`Perform docker push... ${args.dockerRepo}:${tag}`);
        const response = exec('docker', ['push', `${args.dockerRepo}:${tag}`], {});
        logger.info(response);
    }
}

/**
 * Clean Docker image
 *
 * @param args command arguments
 * @param tag tag
 */
function cleanImage(args: PublishArgs, tag: string) {
    logger.info(`Perform docker clean on tag:${tag}...`);
    const response = exec('docker', ['rmi', `-f`, `${args.dockerRepo}:${tag}`], {});
    logger.info(response);
}

/**
 * Publish to Docker command
 *
 * @param args command arguments
 */
export default function main(args: PublishArgs) {
    program
        .version('0.1.0')
        .description(
            'Move in the folder where you have your Dockerfile and run the command:\n\n' +
                'adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}"'
        )
        .option('--loginRepo [type]', 'URL registry')
        .option('--loginPassword [type]', ' password')
        .option('--loginUsername [type]', ' username')
        .option('--dryrun [type]', 'dryrun')
        .option('--verbose [type]', 'verbose')
        .option('--loginCheck [type]', 'perform login')
        .option('--pathProject [type]', 'the path build context')
        .option('--sourceTag [type]', 'sourceTag')
        .option('--buildArgs [type...]', 'buildArgs')
        .option('--fileName [type...]', 'Docker file name', DOCKER_FILENAME)
        .option('--target [type]', 'target: publish or link', TARGETS.publish)
        .requiredOption('--dockerRepo [type]', 'docker repo')
        .requiredOption('--dockerTags [type]', ' tags')
        .parse(argv);

    if (argv.includes('-h') || argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    if (!Object.values(TARGETS).includes(program.opts().target)) {
        logger.error(`error: invalid --target value. It can be ${Object.values(TARGETS)}`);
        exit(1);
    }

    if (program.opts().target === TARGETS.publish && args.buildArgs === undefined) {
        logger.error(`error: required option --buildArgs [type] in case the target is ${TARGETS.publish}`);
        exit(1);
    }

    if (program.opts().target === TARGETS.link && args.sourceTag === undefined) {
        logger.error(`error: required option --sourceTag [type] in case the target is ${TARGETS.link}`);
        exit(1);
    }

    if (args.pathProject === undefined) {
        args.pathProject = resolve('./');
    }

    if (args.fileName === undefined) {
        args.fileName = DOCKER_FILENAME;
    }

    if (args.loginCheck === true) {
        login(args);
    }

    let mainTag: string;
    if (args.dockerTags !== '') {
        args.dockerTags.split(',').forEach((tag, index) => {
            if (tag) {
                logger.info(`Analyzing tag:${tag} ... for target ${program.opts().target}`);
                if (program.opts().target === TARGETS.publish) {
                    if (index === 0) {
                        logger.info(`Build only once`);
                        mainTag = tag;
                        buildImage(args, mainTag);
                    }
                } else {
                    mainTag = args.sourceTag;
                    pullImage(args.dockerRepo, mainTag);
                }
                tagImage(args, mainTag, tag);
                pushImage(args, tag);
            }
        });
        cleanImage(args, mainTag);
    } else {
        logger.error(`dockerTags cannot be empty ...`);
    }
}
