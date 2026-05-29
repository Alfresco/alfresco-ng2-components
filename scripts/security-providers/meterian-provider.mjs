/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const CLI_TIMEOUT_MS = 60000;
const MAX_BUFFER_SIZE = 10 * 1024 * 1024;

function isDirectory(path) {
    try {
        return statSync(path).isDirectory();
    } catch {
        return false;
    }
}

function listDirectories(path) {
    try {
        return readdirSync(path);
    } catch {
        return [];
    }
}

function findVSCodeExtensionCli(homeDir) {
    const extensionsDir = join(homeDir, '.vscode', 'extensions');
    const extensions = listDirectories(extensionsDir)
        .filter(dir => /^meterian\.meterian-heidi-\d+\.\d+\.\d+$/.test(dir))
        .sort()
        .reverse();

    for (const extension of extensions) {
        const cliPath = join(extensionsDir, extension, 'packages', 'meterian-cli');
        if (isDirectory(cliPath)) {
            return cliPath;
        }
    }

    return null;
}

function findGlobalCli(homeDir, rootDir) {
    const possibleLocations = [
        join(rootDir, 'node_modules', '@meterian', 'cli'),
        join(homeDir, '.npm-global', 'lib', 'node_modules', '@meterian', 'cli'),
        '/usr/local/lib/node_modules/@meterian/cli'
    ];

    for (const location of possibleLocations) {
        if (isDirectory(location)) {
            return location;
        }
    }

    return null;
}

export function findCliPath(rootDir) {
    const homeDir = process.env.HOME || process.env.USERPROFILE;

    return findVSCodeExtensionCli(homeDir) || findGlobalCli(homeDir, rootDir);
}

export function isAvailable(rootDir) {
    return findCliPath(rootDir) !== null;
}

function formatDependenciesForCli(dependencies) {
    return dependencies.map(dependency => ({
        language: 'nodejs',
        name: dependency.name,
        version: dependency.version
    }));
}

function runCliCheck(cliPath, input) {
    const cliScript = join(cliPath, 'src', 'cli.js');

    return spawnSync(process.execPath, [cliScript, 'check'], {
        input: JSON.stringify(input),
        encoding: 'utf-8',
        timeout: CLI_TIMEOUT_MS,
        maxBuffer: MAX_BUFFER_SIZE
    });
}

function parseCliOutput(result) {
    if (result.error) {
        throw new Error(result.error.message);
    }

    if (result.status !== 0 && !result.stdout) {
        throw new Error(`CLI returned status ${result.status}`);
    }

    return JSON.parse(result.stdout);
}

export async function checkVulnerabilities(dependencies, rootDir) {
    const cliPath = findCliPath(rootDir);

    if (!cliPath) {
        console.log('  ⏭️  Meterian: Not installed, skipping');
        console.log('     Install VSCode extension "Meterian Security" or run: npm i -g @meterian/cli');
        return { vulnerable: [], source: 'Meterian' };
    }

    console.log('  📡 Checking with Meterian CLI...');

    try {
        const formattedInput = formatDependenciesForCli(dependencies);
        const result = runCliCheck(cliPath, formattedInput);
        const output = parseCliOutput(result);

        console.log(`     ✓ Meterian: Found ${output.vulnerable?.length || 0} vulnerable packages`);

        return {
            vulnerable: output.vulnerable || [],
            summary: output.summary,
            source: 'Meterian'
        };
    } catch (error) {
        console.log(`     ⚠ Meterian: ${error.message}`);
        return { vulnerable: [], source: 'Meterian' };
    }
}
