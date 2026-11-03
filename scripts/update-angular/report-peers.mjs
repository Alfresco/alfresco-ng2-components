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
import path from 'node:path';
import process from 'node:process';
import { main } from './lib/cli.mjs';
import { findPeerIssues, issueKey, readBaselineKeys } from './lib/peers.mjs';
import { majorVersion } from './lib/versions.mjs';

/**
 * Builds a markdown table of peer issues.
 * @param issues peer issues
 * @returns markdown lines
 */
function issuesTable(issues) {
    return [
        '| Peer | Installed | Wanted | Required by |',
        '| --- | --- | --- | --- |',
        ...issues.map((issue) => `| \`${issue.peer}\` | ${issue.installed} | \`${issue.wanted}\` | \`${issue.requiredBy}\` |`)
    ];
}

/**
 * Tells whether an upgrade moves a package to a new major.
 * @param upgrade upgrade with its `from` and `to`
 * @returns true for a major upgrade
 */
function isMajorUpgrade(upgrade) {
    return majorVersion(upgrade.to) !== majorVersion(upgrade.from);
}

/**
 * Builds the markdown about the packages upgraded, and the ones left to upgrade by hand, to satisfy their peers.
 * @param aligned upgrades made and manual upgrades, as written by align-peers
 * @returns markdown
 */
function upgradesSection(aligned) {
    const upgraded = aligned.upgrades.length
        ? [
              'Upgraded to fit their peers:',
              '',
              '| Package | From | To | Note |',
              '| --- | --- | --- | --- |',
              ...aligned.upgrades.map(
                  (upgrade) =>
                      `| \`${upgrade.name}\` | ${upgrade.from} | ${upgrade.to} | ${isMajorUpgrade(upgrade) ? '⚠️ new major, check its changelog' : ''} |`
              )
          ].join('\n')
        : 'No package needed upgrading.';
    const manual = aligned.manual.length
        ? [
              '**To upgrade by hand**: only a new major fits their peers, and a new major is not applied automatically.',
              '',
              '| Package | Current | Needs |',
              '| --- | --- | --- |',
              ...aligned.manual.map((upgrade) => `| \`${upgrade.name}\` | ${upgrade.from} | ${upgrade.to} |`)
          ].join('\n')
        : '';

    return [upgraded, manual].filter(Boolean).join('\n\n');
}

/**
 * Builds the markdown section about the peer dependencies.
 * @param aligned upgrades made and manual upgrades, as written by align-peers
 * @param newIssues issues introduced by the update
 * @param oldIssues issues that were already there
 * @returns markdown
 */
function buildSection(aligned, newIssues, oldIssues) {
    const added = newIssues.length ? `**New unmet peers (${newIssues.length})**\n\n${issuesTable(newIssues).join('\n')}` : 'No new unmet peers.';
    const existing = oldIssues.length
        ? `<details><summary>Unmet peers already present before the update (${oldIssues.length})</summary>\n\n${issuesTable(oldIssues).join('\n')}\n\n</details>\n`
        : '';

    return `### Peer dependencies\n\n${upgradesSection(aligned)}\n\n${added}\n\n${existing}`;
}

/**
 * Lists what needs a person to look at: unmet peers, upgrades to a new major and upgrades left to do by hand.
 * @param aligned upgrades made and manual upgrades, as written by align-peers
 * @param newIssues issues introduced by the update
 * @returns one line per finding
 */
function findingsLog(aligned, newIssues) {
    return [
        ...newIssues.map((issue) => `${issue.peer} ${issue.installed} does not satisfy ${issue.wanted} (required by ${issue.requiredBy})`),
        ...aligned.upgrades
            .filter(isMajorUpgrade)
            .map((upgrade) => `${upgrade.name} was moved to a new major (${upgrade.from} -> ${upgrade.to}), check its changelog`),
        ...aligned.manual.map((upgrade) => `${upgrade.name} ${upgrade.from} needs the new major ${upgrade.to} to fit its peers, upgrade it by hand`)
    ];
}

/**
 * Writes the peer dependency section of the PR report and the validation log, and prints the validation outcome.
 * The outcome is a failure, which makes the pull request a draft, whenever something needs a person to look at.
 * @param baselineFile issues saved before the update
 * @param reportDir directory receiving peers.md
 * @param logFile validation log receiving what needs attention
 * @param alignedFile JSON file written by align-peers
 */
function reportPeers(baselineFile, reportDir, logFile, alignedFile) {
    const baselineKeys = readBaselineKeys(baselineFile);
    const issues = findPeerIssues();
    const newIssues = issues.filter((issue) => !baselineKeys.has(issueKey(issue)));
    const oldIssues = issues.filter((issue) => baselineKeys.has(issueKey(issue)));
    const aligned = fs.existsSync(alignedFile) ? JSON.parse(fs.readFileSync(alignedFile, 'utf8')) : { upgrades: [], manual: [] };
    const findings = findingsLog(aligned, newIssues);

    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, 'peers.md'), buildSection(aligned, newIssues, oldIssues));
    fs.writeFileSync(logFile, findings.join('\n'));
    process.stdout.write(findings.length ? 'failure' : 'success');
}

main(reportPeers);
