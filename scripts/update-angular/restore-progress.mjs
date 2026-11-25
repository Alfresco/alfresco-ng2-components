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
import { main } from './lib/cli.mjs';
import { dependenciesAt } from './lib/package-json.mjs';
import { ALIGN_PEERS_SUBJECT, dependencyChanges, readAlignedReport } from './lib/resume.mjs';
import { run } from './lib/shell.mjs';

/** Commits of the update stages that hold the migrations.json reported in the pull request, with the file the report reads. */
const REPORTED_MIGRATIONS = [
    { subject: 'chore: update Nx to ', file: 'nx.json' },
    { subject: 'chore: update Angular to ', file: 'angular.json' }
];
const ANGULAR_UPDATE_SUBJECT = 'chore: update Angular to ';

/**
 * Finds the latest commit of the branch whose subject starts with a text.
 * @param baseSha commit the update started from
 * @param subjectPrefix start of the commit subject
 * @returns commit sha, or undefined when there is none
 */
function findCommit(baseSha, subjectPrefix) {
    return run('git', ['log', '--format=%H %s', `${baseSha}..HEAD`])
        .split('\n')
        .map((line) => ({ sha: line.slice(0, line.indexOf(' ')), subject: line.slice(line.indexOf(' ') + 1) }))
        .find((commit) => commit.subject.startsWith(subjectPrefix))?.sha;
}

/**
 * Restores, from the history of a resumed branch, what the earlier attempts of the run kept on their runner:
 * the migrations of the Nx and Angular updates, for the migration report, and the dependencies changed after the Angular update,
 * so that the peer dependency report still flags the packages moved to a new major,
 * and the report of the align-peers stage, which keeps the upgrades it left to a person.
 * @param baseSha commit the update started from
 * @param reportedDir directory receiving the migrations files
 * @param earlierChangesFile JSON file receiving the dependencies changed after the Angular update
 * The resume state saved by the latest attempt is preferred, the branch history is the fallback when the state is missing.
 * @param alignedFile JSON file receiving the report of the align-peers stage, written only when the branch has it
 * @param stateDir directory with the resume state of the latest attempt, missing when it cannot be used
 */
function restoreProgress(baseSha, reportedDir, earlierChangesFile, alignedFile, stateDir) {
    fs.mkdirSync(reportedDir, { recursive: true });
    for (const { subject, file } of REPORTED_MIGRATIONS) {
        const saved = stateDir ? path.join(stateDir, 'reported', file) : '';
        if (saved && fs.existsSync(saved)) {
            fs.copyFileSync(saved, path.join(reportedDir, file));
            console.log(`Restored the migrations of "${subject.trim()}" from the resume state`);
            continue;
        }
        const sha = findCommit(baseSha, subject);
        if (sha && run('git', ['ls-tree', '--name-only', sha, 'migrations.json']).trim()) {
            fs.writeFileSync(path.join(reportedDir, file), run('git', ['show', `${sha}:migrations.json`]));
            console.log(`Restored the migrations of "${subject.trim()}" from ${sha}`);
        }
    }

    const angularSha = findCommit(baseSha, ANGULAR_UPDATE_SUBJECT);
    const changes = angularSha ? dependencyChanges(dependenciesAt(angularSha), dependenciesAt('HEAD')) : [];
    fs.writeFileSync(earlierChangesFile, `${JSON.stringify(changes, null, 2)}\n`);
    console.log(`${changes.length} dependencies changed after the Angular update and before this attempt`);

    const savedAligned = stateDir ? path.join(stateDir, 'peers-aligned.json') : '';
    if (savedAligned && fs.existsSync(savedAligned)) {
        fs.copyFileSync(savedAligned, alignedFile);
        console.log('Restored the report of the align-peers stage from the resume state');
        return;
    }
    const alignSha = findCommit(baseSha, ALIGN_PEERS_SUBJECT);
    const aligned = alignSha ? readAlignedReport(run('git', ['log', '-1', '--format=%B', alignSha])) : undefined;
    if (aligned) {
        fs.writeFileSync(alignedFile, `${JSON.stringify(aligned, null, 2)}\n`);
        console.log(`Restored the report of the align-peers stage from ${alignSha}`);
    }
}

main(restoreProgress);
