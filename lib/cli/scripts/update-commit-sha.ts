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

import { exec } from './exec';
import program from 'commander';
import { logger } from './logger';

export interface CommitArgs {
    pointer: string;
    pathPackage: string;
    skipGnu: boolean;
}

function getSha(args: CommitArgs): string {
    logger.info('Check commit sha...');

    const gitPointer = args.pointer ? args.pointer : 'HEAD';

    return exec('git', [`rev-parse`, `${gitPointer}`], {}).trim();
}

function replacePerform(args: CommitArgs, sha: string) {
    logger.info(`Replace commit ${sha} in package...`);

    const sedRule = `s/\"commit\": \".*\"/\"commit\": \"${sha}\"/g`;

    if (args.skipGnu) {
        exec('sed', [`-i`, '', `${sedRule}`, `${args.pathPackage}/package.json`], {});
    } else {
        exec('sed', [`-i`, `${sedRule}`, `${args.pathPackage}/package.json`], {});
    }
}

export default function(args: CommitArgs) {
    main(args);
}

function main(args) {

    program
        .version('0.1.0')
        .description('This command allows you to update the commit sha as part of the package.json.\n' +
            'Your package.json must to have an existing property called "commit.\n\n' +
            'adf-cli update-commit-sha --pointer "HEAD~1" --pathProject "$(pwd)"\n\n' +
            'adf-cli update-commit-sha --pathProject "$(pwd)" --skipGnu')
        .option('--pointer [type]', 'pointer')
        .option('--pathPackage [type]', 'pathPackage')
        .option('--skipGnu [type]', 'skipGnu')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    const sha = getSha(args);

    replacePerform(args, sha);
}
