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

/* eslint-disable @typescript-eslint/naming-convention */

import * as shell from 'shelljs';
import * as path from 'path';
import program from 'commander';
import * as fs from 'fs';
import * as ejs from 'ejs';

interface Commit {
    hash: string;
    author: string;
    author_email: string;
    date: string;
    subject: string;
}

interface DiffOptions {
    /**
     * Commit range, e.g. "master..develop"
     */
    range: string;
    /**
     * Working directory
     */
    dir: string;
    /**
     * Max number of commits
     */
    max?: number;
    /**
     * Number of commits to skip from the top
     */
    skip?: number;
    /**
     * Exclude commits by the author
     */
    exclude?: string;
}

/**
 * Get the remote URL for the cloned git repository
 *
 * @param workingDir Repository directory
 * @returns URL pointing to the git remote
 */
function getRemote(workingDir: string): string {
    const command = 'git config --get remote.origin.url';
    const remote = shell.exec(command, { cwd: workingDir, silent: true }).toString();

    return remote.trim();
}

/**
 * Get the list of commits based on the configuration options
 *
 * @param options Logging options
 * @returns Collection of Commit objects
 */
function getCommits(options: DiffOptions): Array<Commit> {
    let authorFilter = (options.exclude || '')
        .split(',')
        .map(str => str.trim().replace(/\\/g, ''))
        .join('|');

    if (!authorFilter) {
        authorFilter = `bot|Alfresco Build User`;
    }


    const args = [
        `git`,
        `log`,
        options.range,
        `--no-merges`,
        `--first-parent`,
        // this format is needed to allow parsing all characters in the commit message and safely convert to JSON
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
        log = log.substring(0, log.length - 1);
    }

    return log.split('\n').map(str => JSON.parse(str) as Commit).filter(commit => commitAuthorAllowed(commit, authorFilter));
}

function commitAuthorAllowed(commit: Commit, authorFilter: string): boolean {
    const filterRegex = RegExp(authorFilter);
    return !(filterRegex.test(commit.author) || filterRegex.test(commit.author_email));
}

export default function main(_args: string[], workingDir: string) {
    program
        .description('Generate changelog report for two branches of git repository')
        .version('0.0.1', '-v, --version')
        .usage('changelog [options]')
        .option('-r, --range <range>', 'Commit range, e.g. origin/master..develop', 'origin/master..develop')
        .option('-d, --dir <dir>', 'Working directory (default: working directory)')
        .option('-m, --max <number>', 'Limit the number of commits to output')
        .option('-o, --output <dir>', 'Output directory, will use console output if not defined')
        .option('--skip <number>', 'Skip number commits before starting to show the commit output')
        .option('-f, --format <format>', 'Output format (md, html)', 'md')
        .option('-e --exclude <string>', 'Exclude authors from the output, comma-delimited list')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    const dir = path.resolve(program.dir || workingDir);
    const { range, skip, max, format, output, exclude } = program;

    const remote = getRemote(dir);

    let repo_url = remote;
    if (repo_url.endsWith('.git')) {
        repo_url = repo_url.substring(0, repo_url.length - 4);
    }

    const commits = getCommits({
        dir,
        range,
        skip,
        max,
        exclude
    });

    const packagePath = path.resolve(dir, 'package.json');
    if (!fs.existsSync(packagePath)) {
        console.error('The package.json file was not found');
        process.exit(1);
    }

    const templatePath = path.resolve(__dirname, `../templates/changelog-${format}.ejs`);
    if (!fs.existsSync(templatePath)) {
        console.error(`Cannot find the report template: ${templatePath}`);
        process.exit(1);
    }

    return new Promise((resolve, reject) => {
        const packageJson = JSON.parse(fs.readFileSync(packagePath).toString());

        ejs.renderFile(templatePath, {
            remote,
            repo_url,
            commits,
            projVersion: packageJson.version,
            projName: packageJson.name
        }, {}, (err: any, text: string) => {
            if (err) {
                console.error(err);
                reject(1);
            } else {
                if (output) {
                    const outputDir = path.resolve(output);
                    const outputFile = path.join(outputDir, `changelog-${packageJson.version}.${format}`);
                    console.log('Writing changelog to', outputFile);

                    fs.writeFileSync(outputFile, text);
                } else {
                    console.log(text);
                }
                resolve(0);
            }
        });
    });
}
