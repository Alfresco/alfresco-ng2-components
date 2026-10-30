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
import { parseTargetMajor, peersAcceptAngular } from './lib/angular.mjs';
import { main } from './lib/cli.mjs';
import { workspaceDependencies } from './lib/package-json.mjs';
import { installableReleases, peerDependenciesOf } from './lib/registry.mjs';
import { exactVersion, majorVersion } from './lib/versions.mjs';

const NX_ANGULAR = '@nx/angular';
const MAX_CANDIDATES = 10;

/**
 * Tells whether a release of `@nx/angular` supports an Angular major.
 * @param nxVersion `@nx/angular` version
 * @param angular Angular major
 * @returns true when supported
 */
function supportsAngular(nxVersion, angular) {
    return peersAcceptAngular(peerDependenciesOf(NX_ANGULAR, nxVersion), angular);
}

/**
 * Prints the Nx release to migrate to, or nothing when the installed Nx already supports the target Angular.
 * The installed Nx major is searched first, then the next one. The release must support the current and the target Angular.
 * @param target requested Angular major
 */
function planNx(target) {
    const targetMajor = parseTargetMajor(target);
    const dependencies = workspaceDependencies();

    if (!dependencies[NX_ANGULAR]) {
        return;
    }

    const currentAngular = majorVersion(dependencies['@angular/core']);
    const installedNx = exactVersion(dependencies[NX_ANGULAR]);
    const installedNxMajor = majorVersion(installedNx);

    if (supportsAngular(installedNx, targetMajor)) {
        return;
    }

    for (const nxMajor of [installedNxMajor, installedNxMajor + 1]) {
        const newestFirst = installableReleases(NX_ANGULAR, (version) => majorVersion(version) === nxMajor)
            .reverse()
            .slice(0, MAX_CANDIDATES);
        const release = newestFirst.find((version) => supportsAngular(version, currentAngular) && supportsAngular(version, targetMajor));

        if (release) {
            process.stdout.write(`nx@${release}\n`);
            return;
        }
    }

    throw new Error(
        `No Nx ${installedNxMajor}.x or ${installedNxMajor + 1}.x release supports both Angular ${currentAngular} and ${targetMajor}; migrate Nx manually first`
    );
}

main(planNx);
