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

import process from 'node:process';
import { angularMajor, packagesBehind, parseTargetMajor } from './lib/angular.mjs';
import { main } from './lib/cli.mjs';
import { workspaceDependencies } from './lib/package-json.mjs';
import { installableReleases } from './lib/registry.mjs';

const ANGULAR_CORE = '@angular/core';

/**
 * Orders package names alphabetically, with `@angular/core` first.
 * @param a first package name
 * @param b second package name
 * @returns negative, zero or positive, as for Array.prototype.sort
 */
function coreFirst(a, b) {
    if (a === ANGULAR_CORE) {
        return -1;
    }
    return b === ANGULAR_CORE ? 1 : a.localeCompare(b);
}

/**
 * Prints one name@version line for every Angular package below the target major.
 * nx migrate only moves the packages of the group of the migrated one, so each package needs its own line.
 * @param target requested Angular major
 */
function planAngularPackages(target) {
    const targetMajor = parseTargetMajor(target);

    const lines = packagesBehind(workspaceDependencies(), targetMajor)
        .sort(coreFirst)
        .map((name) => {
            const release = installableReleases(name, (version) => angularMajor(name, version) === targetMajor).at(-1);
            if (!release) {
                throw new Error(`No ${name} release for Angular ${targetMajor} old enough to install is available`);
            }
            return `${name}@${release}`;
        });

    process.stdout.write(`${lines.join('\n')}\n`);
}

main(planAngularPackages);
