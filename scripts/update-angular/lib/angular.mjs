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

import { workspaceDependencies } from './package-json.mjs';
import { majorVersion, satisfiesRange } from './versions.mjs';

const DEVKIT_ARCHITECT = '@angular-devkit/architect';

/**
 * Tells whether a package is versioned together with Angular.
 * @param name package name
 * @returns true for Angular packages
 */
export function isAngularPackage(name) {
    return /^(@angular\/|@angular-devkit\/|@angular-eslint\/|@schematics\/angular$|ng-packagr$)/.test(name);
}

/**
 * Returns the Angular major a package version belongs to. The devkit architect package uses 0.<major><minor>.<patch>.
 * @param name package name
 * @param version version or range
 * @returns Angular major
 */
export function angularMajor(name, version) {
    const [major, minor] = version.match(/\d+/g);
    return name === DEVKIT_ARCHITECT ? Number(minor.slice(0, -2)) : Number(major);
}

/**
 * Lists the Angular packages that are still below the target major.
 * @param dependencies package names mapped to version ranges
 * @param targetMajor Angular major to reach
 * @returns package names
 */
export function packagesBehind(dependencies, targetMajor) {
    return Object.keys(dependencies).filter((name) => isAngularPackage(name) && angularMajor(name, dependencies[name]) < targetMajor);
}

/**
 * Validates the requested Angular major, which must be the one right after the installed Angular.
 * @param text requested major, as typed by the user
 * @returns the major as a number
 */
export function parseTargetMajor(text) {
    if (!/^\d+$/.test(text)) {
        throw new Error(`"${text}" is not a major version number`);
    }

    const currentMajor = majorVersion(workspaceDependencies()['@angular/core']);
    if (Number(text) !== currentMajor + 1) {
        throw new Error(`Only the next major is supported: current is ${currentMajor}, requested ${text}`);
    }

    return Number(text);
}

/**
 * Tells whether the peers of a package accept an Angular major.
 * @param peers peers with their name and range
 * @param major Angular major
 * @returns true when every Angular peer accepts the major
 */
export function peersAcceptAngular(peers, major) {
    const angularRanges = peers.filter((peer) => isAngularPackage(peer.name) && peer.name !== DEVKIT_ARCHITECT).map((peer) => peer.range);

    return angularRanges.length > 0 && angularRanges.every((range) => satisfiesRange(`${major}.0.0`, range));
}
