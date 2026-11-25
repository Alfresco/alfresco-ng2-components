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

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { alignPeersCommitMessage, chooseResumePlan, completedStages, dependencyChanges, planResume, readAlignedReport } from '../lib/resume.mjs';

/**
 * Builds a migrate job as returned by the GitHub API.
 * @param conclusions step names mapped to their conclusion
 * @returns job
 */
function migrateJob(conclusions) {
    return { name: '🔄 Migrate', steps: Object.entries(conclusions).map(([name, conclusion]) => ({ name, conclusion })) };
}

describe('planResume', () => {
    it('does not resume a run whose earlier attempts did not create the branch', () => {
        const jobs = [migrateJob({ 'Prepare branch': 'failure', 'Update Nx': 'skipped' }), { name: '🏗️ Build', steps: [] }];

        assert.deepEqual(planResume(jobs), { resume: false, done: [] });
        assert.deepEqual(planResume([]), { resume: false, done: [] });
    });

    it('skips the stages that passed before the one that failed', () => {
        const jobs = [
            migrateJob({
                'Prepare branch': 'success',
                'Update Nx': 'success',
                'Update Angular packages': 'success',
                'Align peer dependencies': 'failure'
            })
        ];

        assert.deepEqual(planResume(jobs), { resume: true, done: ['update-nx', 'update-angular-packages'] });
    });

    it('adds up the stages passed across attempts, where skipped stages count as not passed', () => {
        const jobs = [
            migrateJob({ 'Prepare branch': 'success', 'Update Nx': 'success', 'Update Angular packages': 'failure' }),
            migrateJob({
                'Prepare branch': 'success',
                'Update Nx': 'skipped',
                'Update Angular packages': 'success',
                'Align peer dependencies': 'failure'
            })
        ];

        assert.deepEqual(planResume(jobs).done, ['update-nx', 'update-angular-packages']);
    });

    it('never skips a stage that comes after one that did not pass', () => {
        const jobs = [migrateJob({ 'Prepare branch': 'success', 'Update Nx': 'failure', 'Run migrations': 'success' })];

        assert.deepEqual(planResume(jobs), { resume: true, done: [] });
    });
});

describe('dependencyChanges', () => {
    it('lists the versioned dependencies whose range changed, sorted by name', () => {
        const before = { zone: '^1.0.0', alpha: '~2.1.0', same: '1.0.0', local: 'workspace:*', removed: '1.0.0' };
        const after = { zone: '^2.0.0', alpha: '~2.2.0', same: '1.0.0', local: 'workspace:^', added: '1.0.0' };

        assert.deepEqual(dependencyChanges(before, after), [
            { name: 'alpha', from: '~2.1.0', to: '~2.2.0' },
            { name: 'zone', from: '^1.0.0', to: '^2.0.0' }
        ]);
    });
});

describe('alignPeersCommitMessage', () => {
    it('keeps the decisions of the stage in a message that reads back to the same report', () => {
        const report = {
            upgrades: [{ name: 'a', from: '^1.0.0', to: '^1.2.0' }],
            manual: [{ name: 'foo', from: '1.0.0', to: '2.0.0' }],
            skipped: [{ name: 'bar', range: 'github:org/bar' }]
        };
        const message = alignPeersCommitMessage(report);

        assert.ok(message.startsWith('chore: align peer dependencies\n\n'));
        assert.match(message, /Left to upgrade by hand: foo 1\.0\.0 -> 2\.0\.0/);
        assert.deepEqual(readAlignedReport(message), report);
    });

    it('has no message when the stage neither changed nor decided anything', () => {
        assert.equal(alignPeersCommitMessage({ upgrades: [], manual: [], skipped: [] }), undefined);
        assert.equal(readAlignedReport('chore: align peer dependencies\n'), undefined);
    });
});

describe('completedStages', () => {
    it('lists the stages that passed up to the first one that did not', () => {
        const statuses = { 'update-nx': 'success', 'update-angular-packages': 'success', 'align-peers': 'failure', 'run-migrations': 'success' };

        assert.deepEqual(
            completedStages((record) => statuses[record]),
            ['update-nx', 'update-angular-packages']
        );
    });
});

describe('chooseResumePlan', () => {
    const jobsPlan = { resume: true, done: ['update-nx'] };
    const state = {
        version: '22.0.0',
        branch: 'chore/update-angular-22.0.0',
        baseSha: 'base',
        head: 'head',
        pushed: true,
        done: ['update-nx', 'align-peers']
    };

    it('uses the saved state when its commit is on the pushed branch', () => {
        assert.deepEqual(
            chooseResumePlan(state, jobsPlan, (branch, sha) => branch === state.branch && sha === 'head'),
            { resume: true, done: ['update-nx', 'align-peers'], version: '22.0.0', baseSha: 'base', source: 'state' }
        );
    });

    it('falls back to the jobs when the state is missing, was not pushed or is not on the branch', () => {
        const fallback = { ...jobsPlan, version: '', baseSha: '', source: 'jobs' };

        assert.deepEqual(
            chooseResumePlan(undefined, jobsPlan, () => true),
            fallback
        );
        assert.deepEqual(
            chooseResumePlan({ ...state, pushed: false }, jobsPlan, () => true),
            fallback
        );
        assert.deepEqual(
            chooseResumePlan(state, jobsPlan, () => false),
            fallback
        );
    });
});
