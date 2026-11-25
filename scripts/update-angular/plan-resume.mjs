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
import { chooseResumePlan, planResume } from './lib/resume.mjs';
import { run } from './lib/shell.mjs';

/**
 * Tells whether a commit is on a branch of the remote.
 * @param branch branch name
 * @param sha commit
 * @returns true when the commit is an ancestor of, or equal to, the remote branch
 */
function isOnBranch(branch, sha) {
    try {
        run('git', ['merge-base', '--is-ancestor', sha, `origin/${branch}`]);
        return true;
    } catch {
        return false;
    }
}

/**
 * Prints, as step outputs, whether the run resumes its branch, which stages it skips, and the version and base commit saved by the latest attempt.
 * The resume state saved by the latest attempt is preferred. When it cannot be trusted it is removed,
 * so that the later steps rebuild what they need from the branch history instead.
 * @param jobsFile jobs of the previous attempts, one JSON object per line
 * @param stateDir directory where the resume state of the latest attempt was downloaded
 */
function planResumeCommand(jobsFile, stateDir) {
    const jobs = fs
        .readFileSync(jobsFile, 'utf8')
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
    const stateFile = path.join(stateDir, 'resume.json');
    const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : undefined;
    const plan = chooseResumePlan(state, planResume(jobs), isOnBranch);

    if (plan.source !== 'state') {
        fs.rmSync(stateDir, { recursive: true, force: true });
    }
    process.stdout.write(
        `resume=${plan.resume}\ndone=${JSON.stringify(plan.done)}\nversion=${plan.version}\nbase-sha=${plan.baseSha}\nsource=${plan.source}\n`
    );
}

main(planResumeCommand);
