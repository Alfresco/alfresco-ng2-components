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
import { findPeerIssues, issueKey, readBaselineKeys } from './lib/peers.mjs';
import { installableReleases, peerDependenciesOf } from './lib/registry.mjs';
import { runVisibly } from './lib/shell.mjs';
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
 * Finds the newest release of a given major, newer than the current version, whose peers fit what is installed.
 * @param name package name
 * @param current current version or range
 * @param major major the release must belong to
 * @returns release, or undefined when none fits
 */
function newestFittingRelease(name, current, major) {
    const newer = installableReleases(name, (version) => majorVersion(version) === major && compareVersions(version, exactVersion(current)) > 0);

    return newer
        .reverse()
        .slice(0, MAX_CANDIDATES)
        .find((version) => fitsInstalledPackages(name, version));
}

/**
 * Chooses which direct dependencies to upgrade to satisfy the unmet peers.
 * A peer that is a direct dependency itself is upgraded to a release the packages needing it accept, even to a new major,
 * because those packages are the ones the update just moved.
 * Otherwise the direct dependency needing the peer is upgraded within its current major. A new major is never applied,
 * it is returned as manual work, because nothing here tells whether its API still fits the code.
 * @param issues unmet peers
 * @param dependencies direct dependencies
 * @param tried package names already handled, updated here so nothing is tried twice
 * @returns the `upgrades` to apply and the `manual` upgrades to leave to a person, each with the package name,
 * the current range in `from` and the release in `to`
 */
function chooseUpgrades(issues, dependencies, tried) {
    const upgrades = [];
    const manual = [];
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
            const major = majorVersion(dependencies[name]);
            const sameMajor = newestFittingRelease(name, dependencies[name], major);
            const nextMajor = sameMajor ? undefined : newestFittingRelease(name, dependencies[name], major + 1);

            if (sameMajor) {
                upgrades.push({ name, from: dependencies[name], to: sameMajor });
            } else if (nextMajor) {
                manual.push({ name, from: dependencies[name], to: nextMajor });
            }
        }
    }

    return { upgrades, manual };
}

/**
 * Upgrades direct dependencies until the peers the update broke are satisfied or nothing more can be done, installing after each round.
 * Issues that were already there before the update are left alone, they are only reported.
 * @param baselineFile issues saved before the update
 * @param reportFile JSON file listing the `upgrades` made and the `manual` upgrades that are left to a person
 */
function alignPeers(baselineFile, reportFile) {
    const baselineKeys = readBaselineKeys(baselineFile);
    const report = { upgrades: [], manual: [] };
    const tried = new Set();

    for (let round = 0; round < MAX_ROUNDS; round++) {
        const newIssues = findPeerIssues().filter((issue) => !baselineKeys.has(issueKey(issue)));
        const { upgrades, manual } = chooseUpgrades(newIssues, workspaceDependencies(), tried);

        report.manual.push(...manual);
        if (!upgrades.length) {
            break;
        }

        setDependencyVersions(upgrades);
        report.upgrades.push(...upgrades.map(({ name, from, to }) => ({ name, from, to: `${from.match(/^\D*/)[0]}${to}` })));
        runVisibly('pnpm', ['install', '--no-frozen-lockfile']);
    }

    fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
}

main(alignPeers);
