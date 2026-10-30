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
import { parseTargetMajor } from './lib/angular.mjs';
import { main } from './lib/cli.mjs';
import { installableReleases } from './lib/registry.mjs';
import { majorVersion } from './lib/versions.mjs';

/**
 * Prints the newest `@angular/core` release of the target major that is old enough to be installed.
 * @param target requested Angular major
 */
function resolveAngularVersion(target) {
    const targetMajor = parseTargetMajor(target);
    const release = installableReleases('@angular/core', (version) => majorVersion(version) === targetMajor).at(-1);

    if (!release) {
        throw new Error(`No @angular/core ${targetMajor}.x release old enough to install is available`);
    }

    process.stdout.write(release);
}

main(resolveAngularVersion);
