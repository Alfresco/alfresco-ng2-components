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

export interface CommitArgs {
    pointer: string;
    pathPackage: string;
    skipGnu: boolean;
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

function _commitPerform(args: CommitArgs, logger: logging.Logger): string {
    logger.info('Check commit sha...');
    const gitPointer = args.pointer ? args.pointer : 'HEAD';
    return _exec('git', [`rev-parse`, `${gitPointer}`], {}, logger).trim();
}

function _replacePerform(args: CommitArgs, sha: string, logger: logging.Logger) {
    logger.info(`Replace commit ${sha} in package...`);
    const sedRule = `s/\"commit\": \".*\"/\"commit\": \"${sha}\"/g`;
    if (args.skipGnu) {
        _exec('sed', [`-i`, '', `${sedRule}`, `${args.pathPackage}/package.json`], {}, logger);
    } else {
        _exec('sed', [`-i`, `${sedRule}`, `${args.pathPackage}/package.json`], {}, logger);
    }
}

export default async function (args: CommitArgs, logger: logging.Logger) {
    const sha = _commitPerform(args, logger);
    _replacePerform(args, sha, logger);
}
