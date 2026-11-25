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

const PACKAGE_KEY = /^ {2}'?(@?[^@'\s]+)@([^':\s]+)'?:$/;
const SNAPSHOT_KEY = /^ {2}'?(@?[^@'\s]+)@([^'(:\s]+)\S*:$/;
const SNAPSHOT_SECTION = /^ {4}(\w+):$/;
const SNAPSHOT_DEPENDENCY = /^ {6}'?(@?[^':\s]+)'?: '?([^'(\s]+)/;
const DEPENDENCY_SECTIONS = ['dependencies', 'optionalDependencies'];

/**
 * Reads the versions the lockfile resolved for every package.
 * @param file path of pnpm-lock.yaml
 * @returns package names mapped to their resolved versions
 */
export function readResolvedVersions(file) {
    const resolved = new Map();
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const start = lines.indexOf('packages:');
    const end = lines.indexOf('snapshots:');

    for (const line of lines.slice(start + 1, end === -1 ? undefined : end)) {
        const match = line.match(PACKAGE_KEY);
        if (match) {
            resolved.set(match[1], [...(resolved.get(match[1]) ?? []), match[2]]);
        }
    }

    return resolved;
}

/**
 * Reads which version of every direct dependency each resolved package uses.
 * @param file path of pnpm-lock.yaml
 * @returns edges with the parent name and version and the dependency name and version, or undefined when the lockfile has no snapshots
 */
export function readDependencyEdges(file) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const start = lines.indexOf('snapshots:');
    if (start === -1) {
        return undefined;
    }

    const edges = [];
    let parent;
    let section;
    for (const line of lines.slice(start + 1)) {
        if (/^\S/.test(line)) {
            break;
        }
        const key = line.match(SNAPSHOT_KEY);
        if (key) {
            parent = { name: key[1], version: key[2] };
            section = undefined;
            continue;
        }
        const header = line.match(SNAPSHOT_SECTION);
        if (header) {
            section = header[1];
            continue;
        }
        const dependency = line.match(SNAPSHOT_DEPENDENCY);
        if (dependency && parent && DEPENDENCY_SECTIONS.includes(section)) {
            edges.push({ parent: parent.name, parentVersion: parent.version, name: dependency[1], version: dependency[2] });
        }
    }

    return edges;
}
