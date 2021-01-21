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

function getSha(): string {
    logger.info('Check commit sha...');

    const gitPointer = options.pointer ? options.pointer : 'HEAD';

    return exec('git', [`rev-parse`, `${gitPointer}`], {}).trim();
}

function replacePerform(sha: string) {
    logger.info(`Replace commit ${sha} in package...`);

    const sedRule = `s/\"commit\": \".*\"/\"commit\": \"${sha}\"/g`;

    if (options.skipGnu) {
        exec('sed', [`-i`, '', `${sedRule}`, `${options.pathPackage}/package.json`], {});
    } else {
        exec('sed', [`-i`, `${sedRule}`, `${options.pathPackage}/package.json`], {});
    }
}

let options;

export default async function main(_args: string[]) {

    program
        .version('0.2.0')
        .description('This command allows you to update the commit sha as part of the package.json.\n' +
            'Your package.json must to have an existing property called "commit.\n\n' +
            'adf-cli update-commit-sha --pointer "HEAD~1" --pathProject "$(pwd)"\n\n' +
            'adf-cli update-commit-sha --pathProject "$(pwd)" --skipGnu')
        .requiredOption('--pointer [type]', 'pointer')
        .requiredOption('--pathPackage [type]', 'pathPackage')
        .option('--skipGnu [type]', 'skipGnu')
        .parse(process.argv);

    options = program.opts();
    const sha = getSha();

    replacePerform(sha);
}
