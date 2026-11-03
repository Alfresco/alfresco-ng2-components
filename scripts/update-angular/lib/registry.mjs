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
import { run } from './shell.mjs';
import { compareVersions, isStable } from './versions.mjs';

const MS_PER_MINUTE = 60 * 1000;
const publishTimesByPackage = new Map();
const peersByRelease = new Map();
let publishTimeLimit;

/**
 * Returns the result of a computation, running it only the first time its key is asked for.
 * Registry data does not change during a script run, so asking for it twice would only cost another pnpm process.
 * @param cache map holding the results
 * @param key what identifies the computation
 * @param compute function producing the result
 * @returns the result
 */
function remember(cache, key, compute) {
    if (!cache.has(key)) {
        cache.set(key, compute());
    }
    return cache.get(key);
}

/**
 * Returns the newest publish time pnpm accepts, based on minimumReleaseAge. It is read once per script run.
 * @returns epoch milliseconds
 */
function newestAllowedPublishTime() {
    if (publishTimeLimit === undefined) {
        const minimumAge = fs.readFileSync('pnpm-workspace.yaml', 'utf8').match(/^minimumReleaseAge:\s*(\d+)/m);
        publishTimeLimit = Date.now() - (minimumAge ? Number(minimumAge[1]) : 0) * MS_PER_MINUTE;
    }
    return publishTimeLimit;
}

/**
 * Lists the stable releases of a package that are old enough to be installed, oldest first.
 * @param name package name
 * @param accepts function telling whether a version is wanted
 * @returns versions
 */
export function installableReleases(name, accepts) {
    const publishTimes = remember(publishTimesByPackage, name, () => JSON.parse(run('pnpm', ['view', name, 'time', '--json'])));
    const newestAllowed = newestAllowedPublishTime();

    return Object.keys(publishTimes)
        .filter((version) => isStable(version) && accepts(version) && new Date(publishTimes[version]).getTime() <= newestAllowed)
        .sort(compareVersions);
}

/**
 * Reads the peer dependencies of a package release from the registry.
 * @param name package name
 * @param version package version
 * @returns peers with their name, range and whether they are optional
 */
export function peerDependenciesOf(name, version) {
    return remember(peersByRelease, `${name}@${version}`, () => {
        const output = run('pnpm', ['view', `${name}@${version}`, 'peerDependencies', 'peerDependenciesMeta', '--json']).trim();
        const { peerDependencies = {}, peerDependenciesMeta = {} } = output ? JSON.parse(output) : {};

        return Object.entries(peerDependencies).map(([peer, range]) => ({
            name: peer,
            range,
            optional: Boolean(peerDependenciesMeta[peer]?.optional)
        }));
    });
}
