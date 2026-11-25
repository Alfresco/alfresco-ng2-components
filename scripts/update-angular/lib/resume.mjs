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

/**
 * Stages of the migrate job that change the branch and cannot run twice, in execution order.
 * `step` is the step name in update-angular-nx.yml and `record` the name its result is recorded under.
 * The other stages only check the branch or fix it in place, so they run again on every attempt.
 */
export const RESUMABLE_STAGES = [
    { step: 'Update Nx', record: 'update-nx' },
    { step: 'Update Angular packages', record: 'update-angular-packages' },
    { step: 'Align peer dependencies', record: 'align-peers' },
    { step: 'Run migrations', record: 'run-migrations' }
];

/** Step that creates the update branch. A run may only resume a branch it created itself. */
export const BRANCH_STEP = 'Prepare branch';

/**
 * Decides from the jobs of the previous attempts of a run whether the run resumes its branch, and which stages it skips.
 * Only the stages that passed in an earlier attempt, up to the first one that did not, are skipped.
 * @param jobs jobs of the previous attempts, as returned by the GitHub API
 * @returns `resume`, true when an earlier attempt created the branch, and `done`, the records of the stages to skip
 */
export function planResume(jobs) {
    const migrateJobs = jobs.filter((job) => (job.steps ?? []).some((step) => step.name === BRANCH_STEP));
    const passed = new Set(migrateJobs.flatMap((job) => job.steps.filter((step) => step.conclusion === 'success').map((step) => step.name)));

    if (!passed.has(BRANCH_STEP)) {
        return { resume: false, done: [] };
    }

    const byRecord = new Map(RESUMABLE_STAGES.map((stage) => [stage.record, stage.step]));
    return { resume: true, done: completedStages((record) => (passed.has(byRecord.get(record)) ? 'success' : 'pending')) };
}

/**
 * Lists the stages that passed, in execution order, up to the first one that did not.
 * @param statusOf function returning the recorded outcome of a stage record, such as `success`
 * @returns records of the completed stages
 */
export function completedStages(statusOf) {
    const firstPending = RESUMABLE_STAGES.findIndex((stage) => statusOf(stage.record) !== 'success');
    const done = firstPending === -1 ? RESUMABLE_STAGES : RESUMABLE_STAGES.slice(0, firstPending);
    return done.map((stage) => stage.record);
}

/**
 * Chooses where the resume plan comes from. The resume state saved by the latest attempt is used when its commit is on the pushed branch,
 * so that it describes what the branch really holds. Otherwise, when the state is missing, the push failed or the branch changed history,
 * the plan built from the jobs of the earlier attempts is used.
 * @param state content of the saved resume state, or undefined when there is none
 * @param jobsPlan plan returned by planResume
 * @param isOnBranch function telling whether a commit is on the pushed branch
 * @returns `resume`, `done`, the `version` and `baseSha` saved with the state (empty when not used) and the `source` of the plan
 */
export function chooseResumePlan(state, jobsPlan, isOnBranch) {
    if (state?.pushed && state.branch && state.head && Array.isArray(state.done) && isOnBranch(state.branch, state.head)) {
        return { resume: true, done: state.done, version: state.version ?? '', baseSha: state.baseSha ?? '', source: 'state' };
    }
    return { ...jobsPlan, version: '', baseSha: '', source: 'jobs' };
}

/**
 * Lists the dependencies whose version range changed between two package.json, leaving out ranges without a version, such as `workspace:*`.
 * @param before package names mapped to version ranges
 * @param after package names mapped to version ranges
 * @returns changes with the package `name`, and its range `from` and `to`, sorted by name
 */
export function dependencyChanges(before, after) {
    const hasVersion = (range) => /\d/.test(range ?? '');

    return Object.keys(after)
        .filter((name) => hasVersion(before[name]) && hasVersion(after[name]) && before[name] !== after[name])
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({ name, from: before[name], to: after[name] }));
}

/** Subject of the commit made by the align-peers stage. */
export const ALIGN_PEERS_SUBJECT = 'chore: align peer dependencies';
const ALIGNED_PEERS_TRAILER = 'Aligned-Peers: ';

/**
 * Builds the message of the align-peers commit. The trailer keeps the decisions of the stage, such as the upgrades left to a person,
 * which are not visible in the committed files, so that a resumed run that skips the stage can still report them.
 * @param report `upgrades`, `manual` and `skipped` written by align-peers
 * @returns commit message, or undefined when the stage neither changed nor decided anything
 */
export function alignPeersCommitMessage(report) {
    const lines = [
        ...report.upgrades.map((upgrade) => `Upgraded ${upgrade.name} ${upgrade.from} -> ${upgrade.to}`),
        ...report.manual.map((upgrade) => `Left to upgrade by hand: ${upgrade.name} ${upgrade.from} -> ${upgrade.to}`),
        ...report.skipped.map((dependency) => `Not a plain version: ${dependency.name} (${dependency.range})`)
    ];
    if (!lines.length) {
        return undefined;
    }

    return `${ALIGN_PEERS_SUBJECT}\n\n${lines.join('\n')}\n\n${ALIGNED_PEERS_TRAILER}${JSON.stringify(report)}\n`;
}

/**
 * Reads back the report kept in the message of an align-peers commit.
 * @param message full commit message
 * @returns `upgrades`, `manual` and `skipped`, or undefined when the message has no report
 */
export function readAlignedReport(message) {
    const trailer = message.split('\n').find((line) => line.startsWith(ALIGNED_PEERS_TRAILER));

    return trailer ? JSON.parse(trailer.slice(ALIGNED_PEERS_TRAILER.length)) : undefined;
}
