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
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { it } from 'node:test';
import { fileURLToPath } from 'node:url';

it('keeps the PR in draft when a completed alignment job reported manual work', (context) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'angular-peer-report-'));
    context.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.writeFileSync(path.join(root, 'pnpm'), "#!/bin/sh\nprintf '{}'\n", { mode: 0o755 });
    const baseline = path.join(root, 'peers-baseline.json');
    const aligned = path.join(root, 'peers-aligned.json');
    const validation = path.join(root, 'validation');
    const report = path.join(root, 'report');
    fs.mkdirSync(validation);
    fs.writeFileSync(baseline, '[]');
    fs.writeFileSync(
        aligned,
        JSON.stringify({
            upgrades: [],
            manual: [{ name: 'foo', from: '1.0.0', to: '2.0.0' }],
            skipped: [{ name: 'bar', range: 'workspace:*' }]
        })
    );
    const script = fileURLToPath(new URL('../report-peers.mjs', import.meta.url));
    const outcome = execFileSync(process.execPath, [script, baseline, report, path.join(validation, 'peers.log'), aligned], {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${root}${path.delimiter}${process.env.PATH}` }
    });
    assert.equal(outcome, 'failure');
    assert.match(fs.readFileSync(path.join(report, 'peers.md'), 'utf8'), /foo/);
    assert.match(fs.readFileSync(path.join(validation, 'peers.log'), 'utf8'), /bar.*not a plain version/);

    for (const stage of [
        'update-nx',
        'update-angular-packages',
        'align-peers',
        'run-migrations',
        'format-and-lint-fix',
        'lockfile',
        'clean-overrides',
        'build',
        'lint',
        'test-example'
    ]) {
        fs.writeFileSync(path.join(validation, `${stage}.status`), 'success');
    }
    fs.writeFileSync(path.join(validation, 'peers.status'), outcome);
    const body = path.join(root, 'body.md');
    const bodyScript = fileURLToPath(new URL('../build-pull-request-body.mjs', import.meta.url));
    const state = execFileSync(process.execPath, [bodyScript, body, validation, report, '22.0.0', 'https://example.invalid/run', 'success'], {
        encoding: 'utf8'
    });
    assert.equal(state, 'draft');
    assert.match(fs.readFileSync(body, 'utf8'), /upgrade it by hand/);
});
