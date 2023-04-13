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

import program from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import * as shell from 'shelljs';

export interface UpdateArgs {
    pathPackage: string;
    latest?: boolean;
    alpha?: boolean;
    beta?: boolean;
    version: string;
    vjs: string;
}

export interface PackageInfo {
    dependencies?: string[];
    devDependencies?: string[];
}

function parseAlfrescoLibs(workingDir: string): PackageInfo {
    const packagePath = path.resolve(path.join(workingDir, 'package.json'));

    let dependencies: string[] = [];
    let devDependencies: string[] = [];

    if (fs.existsSync(packagePath)) {
        const json = require(packagePath);
        const isAlfrescoLib = (key: string) => key.startsWith('@alfresco');

        dependencies = Object.keys((json.dependencies || [])).filter(isAlfrescoLib);
        devDependencies = Object.keys((json.devDependencies || [])).filter(isAlfrescoLib);
    }

    return {
        dependencies,
        devDependencies
    };
}

function formatNpmCommand(deps: string[], tag: string): string {
    return [
        'npm i -E',
        deps.map(name => `${name}@${tag}`).join(' ')
    ].join(' ');
}

function runNpmCommand(command: string, workingDir: string) {
    if (shell.exec(command, { cwd: workingDir }).code !== 0) {
        shell.echo('Error running NPM command');
        shell.exit(1);
    }
}

function updateLibs(pkg: PackageInfo, tag: string, workingDir: string) {
    if (pkg.dependencies && pkg.dependencies.length > 0) {
        runNpmCommand(
            formatNpmCommand(pkg.dependencies, tag),
            workingDir
        );
    }

    if (pkg.devDependencies && pkg.devDependencies.length > 0) {
        runNpmCommand(
            formatNpmCommand(pkg.devDependencies, tag) + ' -D',
            workingDir
        );
    }
}

function parseTag(args: UpdateArgs): string {
    if (args.alpha) {
       return 'alpha';
    }

    if (args.beta) {
        return 'beta';
    }

    return args.version || 'latest';
}

export default function main(args: UpdateArgs, workingDir: string) {
    program
        .description('This command allows you to update the adf dependencies and js-api with different versions\n\n' +
        'Update adf libs and js-api with latest alpha\n\n' +
        'adf-cli update-version --alpha')
        .option('--pathPackage [dir]', 'Directory that contains package.json file', 'current directory')
        .option('--alpha', 'use alpha')
        .option('--beta', 'use beta')
        .option('--version [tag]', 'use specific version can be also alpha/beta/latest', 'latest')
        .option('--vjs [tag]', 'Upgrade only JS-API to a specific version')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    workingDir = args.pathPackage || workingDir;

    const tag = args.vjs || parseTag(args);
    const pkg = args.vjs
        ? { dependencies: ['@alfresco/js-api'] }
        : parseAlfrescoLibs(workingDir);

    updateLibs(pkg, tag, workingDir);
}
