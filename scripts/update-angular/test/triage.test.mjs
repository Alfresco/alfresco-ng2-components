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

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseLog } from '../lib/triage/parse.mjs';
import { triage } from '../lib/triage/classify.mjs';
import { createBatches } from '../lib/triage/batch.mjs';
import { buildTriageReport } from '../lib/triage/report.mjs';

const CONFIG = JSON.parse(fs.readFileSync(new URL('../triage-config.json', import.meta.url), 'utf8'));
const ROOT = '/home/runner/work/alfresco-ng2-components/alfresco-ng2-components';

const BUILD_LOG = `
> nx run core:build:production
✖ Compiling with Angular sources in Ivy partial compilation mode.
lib/core/src/lib/a.component.ts:12:10 - error TS2724: '"@angular/core"' has no exported member named 'ɵFoo'. Did you mean 'Foo'?

12 import { ɵFoo } from '@angular/core';
            ~~~~
lib/core/src/lib/b.service.ts:3:10 - error TS2305: Module '"@angular/common/http"' has no exported member 'HttpClientModule'.
lib/core/src/lib/c.module.ts:20:5 - error NG6008: Component CardComponent is standalone, and cannot be declared in an NgModule. Did you mean to import it instead?
lib/core/src/lib/d.component.html:4:1 - error NG8001: 'mat-legacy-card' is not a known element:
lib/core/src/lib/e.component.html:7:3 - error NG8001: 'adf-toolbar' is not a known element:
lib/core/src/lib/f.spec.ts:30:7 - error TS2322: Type 'string' is not assignable to type 'number'.
 NX   Running target build for 6 projects failed
Failed tasks:
- core:build:production
`;

const TEST_LOG = `
✘ [ERROR] TS2339: Property 'flush' does not exist on type 'HttpTestingController'. [plugin angular-compiler]

    lib/content-services/src/lib/g.spec.ts:44:12:
      44 │     httpMock.flush();
         ╵              ~~~~~

Chrome Headless 140.0.0.0 (Linux x86_64) UploadComponent should emit on drop FAILED
\tError: Expected spy emit to have been called.
\t    at UserContext.<anonymous> (lib/content-services/src/lib/upload.component.spec.ts:88:31)
Chrome Headless 140.0.0.0 (Linux x86_64) ViewerComponent renders FAILED
\tError: NG0100: ExpressionChangedAfterItHasBeenCheckedError
\t    at UserContext.<anonymous> (lib/core/src/lib/viewer.component.spec.ts:10:5)
Executed 120 of 300 (2 FAILED)
Something exploded in a way nobody planned: FATAL weird ERROR
`;

const LINT_LOG = `
${ROOT}/lib/core/src/lib/a.component.ts
  10:5  error  Prefer using the inject() function  @angular-eslint/prefer-inject
  12:1  error  Definition for rule '@angular-eslint/no-host-metadata-property' was not found  @angular-eslint/no-host-metadata-property

✖ 2 problems (2 errors, 0 warnings)
`;

const INSTALL_LOG = `
. prepare: > nx run eslint-angular:build
. prepare: Compiling TypeScript files for project "eslint-angular"...
. prepare: error TS5101: Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0. Specify compilerOption '"ignoreDeprecations": "6.0"' to silence this error.
. prepare:   Visit https://aka.ms/ts6 for migration information.
 NX   Running target build for project eslint-angular failed
Error: Command failed: pnpm install --no-frozen-lockfile
    at genericNodeError (node:internal/errors:985:15)
`;

/**
 * Builds the steps of a run whose update stages all passed.
 * @param overrides steps to add or replace
 * @returns steps
 */
function steps(overrides = []) {
    const base = [
        { name: 'run-migrations', outcome: 'success', log: '', isUpdateStage: true },
        { name: 'build', outcome: 'failure', log: BUILD_LOG },
        { name: 'lint', outcome: 'failure', log: LINT_LOG },
        { name: 'test-content-services', outcome: 'failure', log: TEST_LOG }
    ];
    return [...base.filter((step) => !overrides.some((override) => override.name === step.name)), ...overrides];
}

/**
 * Finds the classified record of a symbol.
 * @param result triage result
 * @param symbol symbol to look for
 * @returns record
 */
function bySymbol(result, symbol) {
    return result.records.find((record) => record.symbol === symbol);
}

describe('parseLog', () => {
    it('parses compiler errors into file, symbol, code, message and category', () => {
        const records = parseLog('build', BUILD_LOG, { config: CONFIG });
        const renamed = records.find((record) => record.code === 'TS2724');

        assert.equal(records.filter((record) => record.parser === 'compiler').length, 6);
        assert.deepEqual(
            {
                file: renamed.file,
                line: renamed.line,
                symbol: renamed.symbol,
                suggestion: renamed.suggestion,
                owner: renamed.owner,
                category: renamed.category
            },
            {
                file: 'lib/core/src/lib/a.component.ts',
                line: 12,
                symbol: 'ɵFoo',
                suggestion: 'Foo',
                owner: '@angular/core',
                category: 'renamed-removed-api'
            }
        );
        assert.equal(records.find((record) => record.code === 'TS2322').category, 'test-only');
        assert.equal(records.filter((record) => record.parser === 'unparsed').length, 0);
    });

    it('parses esbuild errors, karma failures and keeps what resists parsing as unparsed', () => {
        const records = parseLog('test-content-services', TEST_LOG, { config: CONFIG });

        assert.deepEqual(
            records.map((record) => [record.parser, record.errorClass, record.file]),
            [
                ['esbuild', 'ts-removed-member', 'lib/content-services/src/lib/g.spec.ts'],
                ['karma', 'test-assertion', 'lib/content-services/src/lib/upload.component.spec.ts'],
                ['karma', 'ng-runtime', 'lib/core/src/lib/viewer.component.spec.ts'],
                ['unparsed', 'unparsed', '']
            ]
        );
    });

    it('parses ESLint output with repository relative paths', () => {
        const records = parseLog('lint', LINT_LOG, { workspaceRoot: ROOT, config: CONFIG });

        assert.deepEqual(
            records.map((record) => [record.errorClass, record.file, record.symbol]),
            [
                ['lint-rule-violation', 'lib/core/src/lib/a.component.ts', '@angular-eslint/prefer-inject'],
                ['lint-rule-missing', 'lib/core/src/lib/a.component.ts', '@angular-eslint/no-host-metadata-property']
            ]
        );
    });

    it('parses a file-less compiler error from a pnpm install lifecycle hook without treating its wrapper as another failure', () => {
        const records = parseLog('align-peers', INSTALL_LOG, { config: CONFIG });

        assert.deepEqual(
            records.map((record) => [record.code, record.errorClass, record.file]),
            [['TS5101', 'ts-other', '']]
        );
    });
});

describe('triage', () => {
    it('classifies every failure with a rule and a rationale', () => {
        const result = triage(steps(), CONFIG, { workspaceRoot: ROOT });
        const expected = {
            ɵFoo: 'auto-fixable',
            HttpClientModule: 'escalate',
            CardComponent: 'escalate',
            'mat-legacy-card': 'escalate',
            'adf-toolbar': 'auto-fixable',
            flush: 'escalate',
            NG0100: 'escalate',
            '@angular-eslint/prefer-inject': 'auto-fixable',
            '@angular-eslint/no-host-metadata-property': 'escalate'
        };

        Object.entries(expected).forEach(([symbol, classification]) => assert.equal(bySymbol(result, symbol).classification, classification, symbol));
        assert.equal(result.records.find((record) => record.code === 'TS2322').classification, 'auto-fixable');
        assert.equal(result.records.find((record) => record.errorClass === 'test-assertion').classification, 'escalate');
        assert.equal(result.records.find((record) => record.errorClass === 'unparsed').classification, 'escalate');
        result.records.forEach((record) => {
            assert.ok(record.ruleId, record.fingerprint);
            assert.ok(record.rationale.length > 20, record.fingerprint);
        });
    });

    it('turns a known rename into an auto-fixable failure', () => {
        const config = { ...CONFIG, knownRenames: [{ module: '@angular/common/http', from: 'HttpClientModule', to: 'provideHttpClient' }] };
        const result = triage(steps(), config, { workspaceRoot: ROOT });

        assert.equal(bySymbol(result, 'HttpClientModule').classification, 'auto-fixable');
    });

    it('classifies identically whatever the order of the steps', () => {
        const first = triage(steps(), CONFIG, { workspaceRoot: ROOT });
        const second = triage([...steps()].reverse(), CONFIG, { workspaceRoot: ROOT });
        const shape = (result) => result.records.map((record) => [record.fingerprint, record.classification, record.ruleId]);

        assert.deepEqual(shape(second), shape(first));
        assert.deepEqual(
            second.escalations.map((group) => group.key),
            first.escalations.map((group) => group.key)
        );
    });

    it('blocks everything after a failed update stage, positionally', () => {
        const result = triage(
            steps([{ name: 'run-migrations', outcome: 'failure', log: 'ERR_PNPM_PEER_DEP_ISSUES Unmet peer dependencies', isUpdateStage: true }]),
            CONFIG,
            {
                workspaceRoot: ROOT
            }
        );

        assert.ok(result.records.every((record) => record.classification === 'blocked'));
        assert.equal(result.records.find((record) => record.errorClass === 'update-stage-failed').ruleId, 'positional/update-stage-failed');
        assert.equal(result.records.find((record) => record.step === 'build').ruleId, 'positional/schematics-not-clean');
    });

    it('reports the blocked install stage and classifies its TypeScript cause separately', () => {
        const result = triage(
            [
                { name: 'align-peers', outcome: 'failure', log: INSTALL_LOG, isUpdateStage: true },
                { name: 'run-migrations', outcome: 'not run', log: '', isUpdateStage: true }
            ],
            CONFIG
        );
        const stage = result.records.find((record) => record.errorClass === 'update-stage-failed');
        const cause = result.records.find((record) => record.code === 'TS5101' && record.stageCause);
        const report = buildTriageReport(result, createBatches(result, CONFIG));

        assert.equal(stage.classification, 'blocked');
        assert.equal(cause.classification, 'auto-fixable');
        assert.equal(cause.ruleId, 'typescript/deprecated-base-url');
        assert.equal(result.budget.used, 0);
        assert.match(report, /### ⛔ Blocked[\s\S]*`TS5101`[\s\S]*Option 'baseUrl' is deprecated/);
        assert.match(report, /Auto-fixable[\s\S]*TS5101[\s\S]*ignoreDeprecations/);
        assert.deepEqual(
            createBatches(result, CONFIG).dispatched.flatMap((batch) => batch.records.map((record) => record.code)),
            ['TS5101']
        );
    });

    it('escalates an unknown update-stage cause rather than guessing from the install wrapper', () => {
        const result = triage(
            [
                {
                    name: 'align-peers',
                    outcome: 'failure',
                    log: 'error TS9999: New compiler failure\nError: Command failed: pnpm install',
                    isUpdateStage: true
                }
            ],
            { ...CONFIG, maxEscalationsPerRun: 0 }
        );

        assert.equal(result.records.find((record) => record.errorClass === 'update-stage-failed').classification, 'blocked');
        assert.equal(result.records.find((record) => record.code === 'TS9999').classification, 'escalate');
        assert.equal(result.status, 'aborted');
    });

    it('does not merge a stage cause with the same error in a later validation step', () => {
        const input = [
            { name: 'align-peers', outcome: 'failure', log: INSTALL_LOG, isUpdateStage: true },
            { name: 'build', outcome: 'failure', log: INSTALL_LOG }
        ];
        const records = triage(input, CONFIG).records;
        const reversed = triage([...input].reverse(), CONFIG).records;

        assert.deepEqual(
            records.map((record) => [record.errorClass, record.step, record.classification]),
            reversed.map((record) => [record.errorClass, record.step, record.classification])
        );
        assert.equal(records.find((record) => record.stageCause).classification, 'auto-fixable');
        assert.equal(records.find((record) => record.step === 'build').classification, 'blocked');
    });

    it('reports a failed step that yields no recognised error', () => {
        const result = triage(steps([{ name: 'build', outcome: 'failure', log: 'all good here' }]), CONFIG, { workspaceRoot: ROOT });

        assert.equal(result.records.filter((record) => record.step === 'build')[0].errorClass, 'step-failed-without-errors');
    });

    it('counts one escalation per decision and aborts above the budget', () => {
        const log = ['a', 'b', 'c']
            .map((name) => `lib/core/src/${name}.ts:1:1 - error TS2305: Module '"@angular/core"' has no exported member 'Gone'.`)
            .join('\n');
        const withinBudget = triage(
            [
                { name: 'run-migrations', outcome: 'success', log: '' },
                { name: 'build', outcome: 'failure', log }
            ],
            { ...CONFIG, maxEscalationsPerRun: 1 }
        );
        const overBudget = triage(steps(), { ...CONFIG, maxEscalationsPerRun: 2 }, { workspaceRoot: ROOT });

        assert.equal(withinBudget.escalations.length, 1);
        assert.equal(withinBudget.escalations[0].records.length, 3);
        assert.equal(withinBudget.status, 'completed');
        assert.equal(overBudget.status, 'aborted');
        assert.match(buildTriageReport(overBudget, { dispatched: [], deferred: [] }), /Triage aborted: the escalation budget is exceeded/);
    });
});

describe('createBatches', () => {
    it('keeps a file together and only mixes categories within one file', () => {
        const result = triage(steps(), CONFIG, { workspaceRoot: ROOT });
        const { dispatched } = createBatches(result, CONFIG);
        const batchOf = (fingerprint) => dispatched.find((batch) => batch.records.some((record) => record.fingerprint === fingerprint)).id;

        dispatched.forEach((batch) => {
            const categories = new Set(batch.records.map((record) => record.category));
            const files = new Set(batch.records.map((record) => record.file));
            assert.ok(categories.size === 1 || files.size === 1, batch.id);
        });
        assert.equal(
            dispatched.reduce((total, batch) => total + batch.records.length, 0),
            result.records.length
        );
        const lintRecords = result.records.filter((record) => record.step === 'lint' && record.classification === 'auto-fixable');
        assert.equal(new Set(lintRecords.map((record) => batchOf(record.fingerprint))).size, 1);
        assert.ok(dispatched.some((batch) => batch.kind === 'parse-assist'));
    });

    it('raises the timeout for a coherent batch that needs longer, and splits one too large for the longest invocation', () => {
        const log = (count) =>
            Array.from(
                { length: count },
                (_, index) =>
                    `lib/core/src/f${String(index).padStart(2, '0')}.ts:1:1 - error TS2305: Module '"@angular/core"' has no exported member 'Gone'.`
            ).join('\n');
        const run = (count) =>
            createBatches(
                triage(
                    [
                        { name: 'run-migrations', outcome: 'success', log: '' },
                        { name: 'build', outcome: 'failure', log: log(count) }
                    ],
                    CONFIG
                ),
                CONFIG
            ).dispatched;

        const raised = run(8);
        assert.equal(raised.length, 1);
        assert.equal(raised[0].timeoutRaised, true);
        assert.ok(raised[0].timeoutMinutes <= CONFIG.maxAgentTimeoutMinutes);

        const split = run(20);
        assert.ok(split.length > 1);
        split.forEach((batch) => assert.ok(batch.timeoutMinutes <= CONFIG.maxAgentTimeoutMinutes));
        assert.equal(
            split.reduce((total, batch) => total + batch.records.length, 0),
            20
        );
    });
});

describe('buildTriageReport', () => {
    it('lets a human decide an escalation from the report alone', () => {
        const result = triage(steps(), CONFIG, { workspaceRoot: ROOT });
        const report = buildTriageReport(result, createBatches(result, CONFIG));
        const section = report.split('### ').find((part) => part.includes('Removed export: `HttpClientModule`'));

        [
            '**What broke**',
            '**Why it is architectural**',
            '**Options**',
            'Trade-offs',
            '**Recommendation**',
            'lib/core/src/lib/b.service.ts:3 (build)'
        ].forEach((text) => assert.ok(section.includes(text), text));
    });
});
