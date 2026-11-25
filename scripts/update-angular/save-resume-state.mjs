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
import { completedStages } from './lib/resume.mjs';
import { run } from './lib/shell.mjs';

/**
 * Reads the outcome recorded for a stage, by the stage itself or as skipped by a resumed attempt.
 * @param validationDir directory with the validation results of the attempt
 * @param record name the stage records its result under
 * @returns recorded outcome, empty when there is none
 */
function recordedStatus(validationDir, record) {
    const files = [path.join(validationDir, record, `${record}.status`), path.join(validationDir, 'skipped-stages', `${record}.status`)];
    const file = files.find((candidate) => fs.existsSync(candidate));
    return file ? fs.readFileSync(file, 'utf8').trim() : '';
}

/**
 * Writes the resume state of the attempt: what a re-run of the job needs to continue the branch.
 * @param stateFile JSON file receiving the state
 * @param validationDir directory with the validation results of the attempt
 * @param version resolved `@angular/core` version
 * @param branch branch of the update
 * @param baseSha commit the update started from
 * @param pushed `true` when the branch was pushed, so that the state describes the remote branch
 */
function saveResumeState(stateFile, validationDir, version, branch, baseSha, pushed) {
    const state = {
        version,
        branch,
        baseSha,
        head: run('git', ['rev-parse', 'HEAD']).trim(),
        pushed: pushed === 'true',
        done: completedStages((record) => recordedStatus(validationDir, record))
    };
    fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);
    console.log(`Saved the resume state: ${JSON.stringify(state)}`);
}

main(saveResumeState);
