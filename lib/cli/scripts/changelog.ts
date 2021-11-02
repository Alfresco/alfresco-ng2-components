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

import * as shell from 'shelljs';
import * as path from 'path';
import * as program from 'commander';

interface Commit {
    hash: string;
    author: string;
    author_email: string;
    date: string;
    subject: string;
}

interface DiffOptions {
    range: string;
    dir: string;
    max?: number;
    skip?: number;
}

function getRemote(workingDir: string): string {
    const command = 'git config --get remote.origin.url';

    let remote = shell.exec(command, { cwd: workingDir, silent: true }).toString();
    remote = remote.trim();

    return remote;
}

function getDiff(options: DiffOptions): Array<Commit> {
    const args = [
        `git`,
        `log`,
        options.range,
        `--no-merges`,
        `--first-parent`,
        `--invert-grep`,
        `--author="bot\|Alfresco Build User"`,
        `--format="{ ^@^hash^@^: ^@^%h^@^, ^@^author^@^: ^@^%an^@^, ^@^author_email^@^: ^@^%ae^@^, ^@^date^@^: ^@^%ad^@^, ^@^subject^@^: ^@^%s^@^ }"`
    ];

    if (options.max !== undefined) {
        args.push(`--max-count=${options.max}`);
    }

    if (options.skip !== undefined) {
        args.push(`--skip=${options.skip}`);
    }

    const command = args.join(' ');

    let log = shell.exec(command, { cwd: options.dir, silent: true }).toString();

    // https://stackoverflow.com/a/13928240/14644447
    log = log.trim().replace(/"/gm, '\\"').replace(/\^@\^/gm, '"');
    if (log.endsWith(',')) {
        log = log.substring (0, log.length - 1);
    }

    return log.split('\n').map(str => JSON.parse(str) as Commit);
}

export default function main(_args: string[], workingDir: string) {
    program
        .description('Generate changelog report for two branches of git repository')
        .version('0.0.1', '-v, --version')
        .usage('changelog [options]')
        .option('-r, --range <range>', 'Commit range, e.g. master..develop', 'master..develop')
        .option('-d, --dir <dir>', 'Working directory (default: working directory)')
        .option('-m, --max <number>', 'Limit the number of commits to output')
        .option('-o, --output <output>', 'Output file, will use console output if not defined')
        .option('--skip <number>', 'Skip number commits before starting to show the commit output')
        .option('-t, --template <template>', 'Path to the custom output template', 'md.hbs')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    const dir = path.resolve(program.dir || workingDir);
    const range = program.range;
    // const remote = getRemote(dir);
    // const template = program.template;
    const skip = program.skip;
    const max = program.max;

    const diff = getDiff({
        dir,
        range,
        skip,
        max
    });

    console.log(diff);
}
