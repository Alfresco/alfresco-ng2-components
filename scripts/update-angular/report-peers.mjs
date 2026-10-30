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
import { findPeerIssues, issueKey } from './lib/peers.mjs';

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
 * Builds the markdown section about the upgrades made for peers and the issues left.
 * @param upgradeRows table rows written by align-peers
 * @param newIssues issues introduced by the update
 * @param oldIssues issues that were already there
 * @returns markdown
 */
function buildSection(upgradeRows, newIssues, oldIssues) {
    const upgrades = upgradeRows
        ? `Upgraded to fit their peers:\n\n| Package | From | To |\n| --- | --- | --- |\n${upgradeRows.trimEnd()}`
        : 'No package needed upgrading.';
    const added = newIssues.length ? `**New unmet peers (${newIssues.length})**\n\n${issuesTable(newIssues).join('\n')}` : 'No new unmet peers.';
    const existing = oldIssues.length
        ? `<details><summary>Unmet peers already present before the update (${oldIssues.length})</summary>\n\n${issuesTable(oldIssues).join('\n')}\n\n</details>\n`
        : '';

    return `### Peer dependencies\n\n${upgrades}\n\n${added}\n\n${existing}`;
}

/**
 * Writes the peer dependency section of the PR report and the validation log, and prints the validation outcome.
 * @param baselineFile issues saved before the update
 * @param reportDir directory receiving peers.md
 * @param logFile validation log receiving the new issues
 * @param upgradesFile rows written by align-peers
 */
function reportPeers(baselineFile, reportDir, logFile, upgradesFile) {
    const baselineKeys = new Set(JSON.parse(fs.readFileSync(baselineFile, 'utf8')).map(issueKey));
    const issues = findPeerIssues();
    const newIssues = issues.filter((issue) => !baselineKeys.has(issueKey(issue)));
    const oldIssues = issues.filter((issue) => baselineKeys.has(issueKey(issue)));
    const upgradeRows = fs.existsSync(upgradesFile) ? fs.readFileSync(upgradesFile, 'utf8') : '';

    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, 'peers.md'), buildSection(upgradeRows, newIssues, oldIssues));
    fs.writeFileSync(
        logFile,
        newIssues.map((issue) => `${issue.peer} ${issue.installed} does not satisfy ${issue.wanted} (required by ${issue.requiredBy})`).join('\n')
    );
    process.stdout.write(newIssues.length ? 'failure' : 'success');
}

main(reportPeers);
