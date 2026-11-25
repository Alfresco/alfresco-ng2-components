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
import process from 'node:process';
import { angularMajor, isRequiredAngularPackage, packagesBehind, parseTargetMajor } from './lib/angular.mjs';
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
 * A required package without a release old enough to install fails the plan. A best-effort one is left out and listed in the missing file.
 * @param target requested Angular major
 * @param missingFile optional file receiving one line per best-effort package left out, empty when there is none
 */
function planAngularPackages(target, missingFile) {
    const targetMajor = parseTargetMajor(target);
    const dependencies = workspaceDependencies();
    const specs = [];
    const missing = [];

    for (const name of packagesBehind(dependencies, targetMajor).sort(coreFirst)) {
        const release = installableReleases(name, (version) => angularMajor(name, version) === targetMajor).at(-1);

        if (release) {
            specs.push(`${name}@${release}`);
        } else if (isRequiredAngularPackage(name)) {
            throw new Error(`No ${name} release for Angular ${targetMajor} old enough to install is available`);
        } else {
            missing.push(`${name} ${dependencies[name]}: no release for Angular ${targetMajor} old enough to install yet, left unchanged`);
        }
    }

    if (missingFile) {
        fs.writeFileSync(missingFile, missing.map((line) => `${line}\n`).join(''));
    }
    process.stdout.write(`${specs.join('\n')}\n`);
}

main(planAngularPackages);
