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
import { main } from './lib/cli.mjs';
import { run } from './lib/shell.mjs';

/**
 * Creates the update branch, or checks it out again if this run already published it before preparation was interrupted.
 * A different workflow run must never reuse the branch.
 * @param version resolved Angular version
 * @param runId workflow run ID, unchanged across attempts
 */
function prepareBranch(version, runId) {
    if (!/^\d+\.\d+\.\d+$/.test(version) || !/^\d+$/.test(runId)) {
        throw new Error('Expected an Angular release version and a numeric workflow run ID');
    }

    const branch = `chore/update-angular-${version}`;
    const baseSha = run('git', ['rev-parse', 'HEAD']).trim();
    const remoteRef = `refs/remotes/origin/${branch}`;
    const exists = run('git', ['for-each-ref', '--format=%(refname)', remoteRef]).trim();

    if (exists) {
        const owner = run('git', ['log', '--format=%H', `--grep=^Update-Angular-Run: ${runId}$`, `${baseSha}..${remoteRef}`]).trim();
        if (!owner) {
            throw new Error(`Branch ${branch} already exists and belongs to another run. Push fixes and re-run the run that created it instead.`);
        }
        run('git', ['checkout', '-b', branch, remoteRef]);
    } else {
        run('git', ['checkout', '-b', branch]);
        run('git', ['commit', '--allow-empty', '-m', `chore: start Angular update to ${version}`, '-m', `Update-Angular-Run: ${runId}`]);
    }

    process.stdout.write(`branch=${branch}\nbase-sha=${baseSha}\n`);
}

main(prepareBranch);
