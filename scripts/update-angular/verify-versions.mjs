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
import { isAngularPackage, packagesBehind } from './lib/angular.mjs';
import { main } from './lib/cli.mjs';
import { installedVersion, workspaceDependencies } from './lib/package-json.mjs';
import { satisfiesRange } from './lib/versions.mjs';

/**
 * Lists the Angular packages that the installed `@nx/angular` does not accept.
 * @returns problem descriptions
 */
function findNxPeerProblems() {
    const manifest = JSON.parse(fs.readFileSync('node_modules/@nx/angular/package.json', 'utf8'));
    const problems = [];

    for (const [name, range] of Object.entries(manifest.peerDependencies ?? {})) {
        const installed = installedVersion(name);
        if (isAngularPackage(name) && installed && !satisfiesRange(installed, range)) {
            problems.push(`@nx/angular requires ${name} ${range}, installed ${installed}`);
        }
    }

    return problems;
}

/**
 * Fails when an Angular package is below the target major or the installed `@nx/angular` does not accept the installed Angular.
 * Run it after the packages are bumped and installed.
 * @param target Angular major that was requested
 */
function verifyVersions(target) {
    const targetMajor = Number(target);
    const dependencies = workspaceDependencies();
    const problems = packagesBehind(dependencies, targetMajor).map((name) => `${name} is ${dependencies[name]}, expected Angular ${targetMajor}`);

    if (dependencies['@nx/angular']) {
        problems.push(...findNxPeerProblems());
    }

    if (problems.length) {
        throw new Error(problems.join('\n'));
    }
}

main(verifyVersions);
