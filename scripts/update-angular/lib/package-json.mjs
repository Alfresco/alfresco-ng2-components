/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import fs from 'node:fs';
import path from 'node:path';
import { run } from './shell.mjs';

/**
 * Merges the dependencies and devDependencies of a package.json.
 * @param content package.json content
 * @returns package names mapped to version ranges
 */
function readDependencies(content) {
    const manifest = JSON.parse(content);
    return { ...manifest.devDependencies, ...manifest.dependencies };
}

/**
 * Reads the dependencies of the package.json in the current directory.
 * @returns package names mapped to version ranges
 */
export function workspaceDependencies() {
    return readDependencies(fs.readFileSync('package.json', 'utf8'));
}

/**
 * Reads the dependencies the package.json had at a git ref.
 * @param gitRef commit, branch or tag
 * @returns package names mapped to version ranges
 */
export function dependenciesAt(gitRef) {
    return readDependencies(run('git', ['show', `${gitRef}:package.json`]));
}

/**
 * Reads the version of a package installed in node_modules.
 * @param name package name
 * @returns installed version, or undefined when not installed
 */
export function installedVersion(name) {
    const manifest = path.join('node_modules', name, 'package.json');
    return fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')).version : undefined;
}

/**
 * Writes new versions into package.json, keeping its formatting and the range prefix (^, ~) of each dependency.
 * @param upgrades dependencies with the new exact version in `to`
 */
export function setDependencyVersions(upgrades) {
    let content = fs.readFileSync('package.json', 'utf8');

    for (const { name, to } of upgrades) {
        const escapedName = name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
        content = content.replace(new RegExp(`("${escapedName}":\\s*"\\D*)[^"]+(")`), `$1${to}$2`);
    }

    fs.writeFileSync('package.json', content);
}
