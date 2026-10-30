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

const NOT_RUN = 'not run';

const UPDATE_STAGES = [
    { name: 'update-nx', todo: 'Move Nx to a release that supports the target Angular, then run `pnpm install`.' },
    { name: 'update-angular-packages', todo: 'Bump the Angular packages with `pnpm nx migrate <package>@<version>`, then run `pnpm install`.' },
    { name: 'align-peers', todo: 'Run `pnpm peers check`, upgrade the packages with unmet peers, then run `pnpm install`.' },
    { name: 'run-migrations', todo: 'Run `pnpm nx migrate --run-migrations --create-commits`, delete `migrations.json`, then run `pnpm install`.' },
    { name: 'lockfile', todo: 'Run `pnpm install` and commit `pnpm-lock.yaml`.' },
    { name: 'peers', todo: 'Fix the unmet peer dependencies listed in the peer dependencies section.' }
];
const VALIDATION_STAGES = [
    { name: 'clean-overrides', todo: 'Compare the overrides in `pnpm-workspace.yaml` with a lockfile resolved without them.' },
    { name: 'build', todo: 'Fix the build errors shown in the log.' },
    { name: 'lint', todo: 'Fix the lint errors shown in the log.' }
];
const TEST_TODO = 'Fix the failing unit tests shown in the log.';

/**
 * Reads a file, or returns an empty text when it does not exist.
 * @param file file to read
 * @returns file content
 */
function readIfExists(file) {
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

/**
 * Reads the outcome and log of every step recorded by the workflow.
 * @param validationDir directory with a <name>.status and a <name>.log file per step
 * @returns recorded steps with their name, outcome and log
 */
function readRecordedSteps(validationDir) {
    if (!fs.existsSync(validationDir)) {
        return [];
    }

    return fs
        .readdirSync(validationDir)
        .filter((file) => file.endsWith('.status'))
        .sort()
        .map((file) => {
            const name = path.basename(file, '.status');
            return {
                name,
                outcome: readIfExists(path.join(validationDir, file)).trim(),
                log: readIfExists(path.join(validationDir, `${name}.log`)).trimEnd()
            };
        });
}

/**
 * Lists every step of the workflow in execution order, marking the ones that left no result as not run.
 * @param recorded steps recorded by the workflow
 * @returns steps with their name, outcome, log and what to do when they did not succeed
 */
function listSteps(recorded) {
    const find = (name) => recorded.find((step) => step.name === name);
    const known = [...UPDATE_STAGES, ...VALIDATION_STAGES].map((stage) => ({ log: '', outcome: NOT_RUN, ...find(stage.name), ...stage }));
    const tests = recorded.filter((step) => step.name.startsWith('test-')).map((step) => ({ ...step, todo: TEST_TODO }));

    return [...known, ...(tests.length ? tests : [{ name: 'unit tests', outcome: NOT_RUN, log: '', todo: TEST_TODO }])];
}

/**
 * Builds the table with the result of every step.
 * @param steps all steps
 * @returns markdown
 */
function resultsTable(steps) {
    const icons = (step) => {
        if (step.outcome === 'success') {
            return '✅ passed';
        }
        return step.outcome === NOT_RUN ? '⏭ not run' : `❌ ${step.outcome}`;
    };

    return ['| Step | Result |', '| --- | --- |', ...steps.map((step) => `| ${step.name} | ${icons(step)} |`)].join('\n');
}

/**
 * Builds a collapsible block with the log of every failed step.
 * @param steps all steps
 * @returns markdown
 */
function failureDetails(steps) {
    return steps
        .filter((step) => step.log && step.outcome !== 'success')
        .map((step) => `<details><summary>${step.name}</summary>\n\n\`\`\`\n${step.log}\n\`\`\`\n\n</details>`)
        .join('\n\n');
}

/**
 * Builds the list of what a reviewer has to do for every step that failed or did not run.
 * @param steps all steps
 * @returns markdown, empty when everything succeeded
 */
function nextSteps(steps) {
    const pending = steps.filter((step) => step.outcome !== 'success');
    const items = pending.map((step) =>
        step.outcome === NOT_RUN ? `- **${step.name}** (${NOT_RUN}): ${step.todo}` : `- **${step.name}** (failed, see its log below): ${step.todo}`
    );

    return pending.length ? `### What needs to be done\n\nWork on this branch, in this order:\n\n${items.join('\n')}` : '';
}

/**
 * Builds the warning shown when the update itself stopped before the validation.
 * @param steps all steps
 * @returns markdown, empty when the update completed
 */
function stoppedWarning(steps) {
    const stopped = steps.find((step) => UPDATE_STAGES.some((stage) => stage.name === step.name) && step.outcome !== 'success');

    return stopped
        ? `> ⚠️ **The automated update did not complete.** It stopped at \`${stopped.name}\`. This branch holds the work done up to that point, and the steps after it were not run.`
        : '';
}

/**
 * Writes the pull request body and prints whether the pull request needs manual fixes.
 * @param bodyFile file to write
 * @param validationDir directory with the recorded steps
 * @param reportDir directory with migration-report.md, peers.md and overrides.md
 * @param version Angular version the update moves to
 * @param runUrl URL of the workflow run
 * @param jobResults results of the workflow jobs
 */
function buildPullRequestBody(bodyFile, validationDir, reportDir, version, runUrl, ...jobResults) {
    const steps = listSteps(readRecordedSteps(validationDir));
    const needsFixes = steps.some((step) => step.outcome !== 'success') || jobResults.some((result) => result !== 'success');

    const sections = [
        `Automated update of Angular and Nx packages to Angular ${version}.`,
        stoppedWarning(steps),
        `### Steps\n\n${resultsTable(steps)}`,
        nextSteps(steps),
        failureDetails(steps),
        `[Workflow run](${runUrl})`,
        readIfExists(path.join(reportDir, 'migration-report.md')).trim(),
        readIfExists(path.join(reportDir, 'peers.md')).trim(),
        readIfExists(path.join(reportDir, 'overrides.md')).trim()
    ];

    fs.writeFileSync(bodyFile, `${sections.filter(Boolean).join('\n\n')}\n`);
    process.stdout.write(needsFixes ? 'draft' : 'ready');
}

main(buildPullRequestBody);
