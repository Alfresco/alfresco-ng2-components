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

import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

/**
 * Returns the major number of a version or range.
 * @param version version or range, e.g. "21.2.25" or "^21.0.0"
 * @returns major number
 */
export function majorVersion(version) {
    return Number(version.match(/\d+/)[0]);
}

/**
 * Returns the x.y.z part of a version or range.
 * @param range version or range, e.g. "^21.2.25"
 * @returns exact version, e.g. "21.2.25"
 */
export function exactVersion(range) {
    return range.match(/\d+\.\d+\.\d+/)[0];
}

/**
 * Tells whether a version is a plain x.y.z release, without prerelease tag.
 * @param version version to check
 * @returns true for stable releases
 */
export function isStable(version) {
    return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Compares two x.y.z versions.
 * @param a first version
 * @param b second version
 * @returns negative, zero or positive, as for Array.prototype.sort
 */
export function compareVersions(a, b) {
    const left = a.split('.').map(Number);
    const right = b.split('.').map(Number);
    return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

/**
 * Tells whether a version satisfies a semver range.
 * @param version version to check
 * @param range semver range
 * @returns true when the version is inside the range
 */
export function satisfiesRange(version, range) {
    return loadSemver().satisfies(version, range, { includePrerelease: true });
}

/**
 * Loads the semver package that ships with the installed Nx, so the scripts need no dependency of their own.
 * @returns semver module
 */
function loadSemver() {
    const workspaceRequire = createRequire(path.join(process.cwd(), 'package.json'));
    return createRequire(workspaceRequire.resolve('nx/package.json'))('semver');
}
