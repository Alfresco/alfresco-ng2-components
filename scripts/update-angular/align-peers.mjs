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
import { main } from './lib/cli.mjs';
import { installedVersion, setDependencyVersions, workspaceDependencies } from './lib/package-json.mjs';
import { findPeerIssues } from './lib/peers.mjs';
import { installableReleases, peerDependenciesOf } from './lib/registry.mjs';
import { run } from './lib/shell.mjs';
import { compareVersions, exactVersion, majorVersion, satisfiesRange } from './lib/versions.mjs';

const MAX_ROUNDS = 3;
const MAX_CANDIDATES = 15;

/**
 * Finds the newest release of a package that satisfies all the ranges other packages want of it.
 * Releases older than the current one are never considered.
 * @param name package name
 * @param current current version or range
 * @param ranges wanted ranges
 * @returns release, or undefined when none fits
 */
function releaseSatisfyingRanges(name, current, ranges) {
    return installableReleases(
        name,
        (version) => compareVersions(version, exactVersion(current)) > 0 && ranges.every((range) => satisfiesRange(version, range))
    ).at(-1);
}

/**
 * Tells whether the required peers of a release are satisfied by what is installed.
 * @param name package name
 * @param version release to check
 * @returns true when the release fits
 */
function fitsInstalledPackages(name, version) {
    return peerDependenciesOf(name, version)
        .filter((peer) => !peer.optional)
        .every((peer) => {
            const installed = installedVersion(peer.name);
            return !installed || satisfiesRange(installed, peer.range);
        });
}

/**
 * Finds the nearest newer release of a package whose peers fit what is installed, trying the current major first.
 * @param name package name
 * @param current current version or range
 * @returns release, or undefined when none fits
 */
function releaseFittingInstalledPackages(name, current) {
    const major = majorVersion(current);
    const newer = installableReleases(name, (version) => compareVersions(version, exactVersion(current)) > 0);
    const newestFirst = (wanted) => newer.filter((version) => majorVersion(version) === wanted).reverse();

    return [...newestFirst(major), ...newestFirst(major + 1)].slice(0, MAX_CANDIDATES).find((version) => fitsInstalledPackages(name, version));
}

/**
 * Chooses which direct dependencies to upgrade to satisfy the unmet peers.
 * A peer that is a direct dependency itself is upgraded to a release the packages needing it accept.
 * Otherwise the direct dependency needing the peer is upgraded to a release that fits what is installed.
 * @param issues unmet peers
 * @param dependencies direct dependencies
 * @param tried package names already handled, updated here so nothing is tried twice
 * @returns upgrades with the package name, the current range in `from` and the new exact version in `to`
 */
function chooseUpgrades(issues, dependencies, tried) {
    const upgrades = [];
    const upgradedPeers = new Set();

    for (const peer of new Set(issues.map((issue) => issue.peer))) {
        if (dependencies[peer] && !tried.has(peer)) {
            tried.add(peer);
            const ranges = issues.filter((issue) => issue.peer === peer).map((issue) => issue.wanted);
            const to = releaseSatisfyingRanges(peer, dependencies[peer], ranges);
            if (to) {
                upgrades.push({ name: peer, from: dependencies[peer], to });
                upgradedPeers.add(peer);
            }
        }
    }

    for (const name of new Set(issues.filter((issue) => !upgradedPeers.has(issue.peer)).map((issue) => issue.topParent))) {
        if (dependencies[name] && !tried.has(name)) {
            tried.add(name);
            const to = releaseFittingInstalledPackages(name, dependencies[name]);
            if (to) {
                upgrades.push({ name, from: dependencies[name], to });
            }
        }
    }

    return upgrades;
}

/**
 * Upgrades direct dependencies until their peers are satisfied or nothing more can be done, installing after each round.
 * @param reportFile markdown table rows listing the upgrades
 */
function alignPeers(reportFile) {
    const rows = [];
    const tried = new Set();

    for (let round = 0; round < MAX_ROUNDS; round++) {
        const upgrades = chooseUpgrades(findPeerIssues(), workspaceDependencies(), tried);
        if (!upgrades.length) {
            break;
        }

        setDependencyVersions(upgrades);
        rows.push(...upgrades.map(({ name, from, to }) => `| \`${name}\` | ${from} | ${from.match(/^\D*/)[0]}${to} |\n`));
        run('pnpm', ['install', '--no-frozen-lockfile']);
    }

    fs.writeFileSync(reportFile, rows.join(''));
}

main(alignPeers);
