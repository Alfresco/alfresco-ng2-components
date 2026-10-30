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

import { spawnSync } from 'node:child_process';

const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

/**
 * Lists the unmet and missing peer dependencies reported by `pnpm peers check`, ignoring optional ones.
 * @returns issues with the project, the peer, its wanted range, the installed version,
 * the direct dependency (`topParent`) and the package (`requiredBy`) that need it
 */
export function findPeerIssues() {
    const result = spawnSync('pnpm', ['peers', 'check', '--json'], { encoding: 'utf8', maxBuffer: MAX_OUTPUT_BYTES });
    const issues = new Map();

    for (const [project, groups] of Object.entries(JSON.parse(result.stdout))) {
        for (const group of [groups.bad, groups.missing]) {
            for (const [peer, entries] of Object.entries(group ?? {})) {
                for (const entry of entries.filter(({ optional }) => !optional)) {
                    const issue = {
                        project,
                        peer,
                        wanted: entry.wantedRange,
                        installed: entry.foundVersion ?? '-',
                        topParent: entry.parents[0].name,
                        requiredBy: entry.parents.at(-1).name
                    };
                    issues.set(`${project}|${peer}|${issue.wanted}|${issue.topParent}`, issue);
                }
            }
        }
    }

    return [...issues.values()];
}

/**
 * Identifies an issue independently of the versions involved, so issues can be compared before and after an update.
 * @param issue peer issue
 * @returns key
 */
export function issueKey(issue) {
    return `${issue.project}|${issue.peer}|${issue.topParent}`;
}
