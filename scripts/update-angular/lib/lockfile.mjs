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
