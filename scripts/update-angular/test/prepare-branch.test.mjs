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
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../prepare-branch.mjs', import.meta.url));

/**
 * Creates a repository with a remote, and removes it when the test ends.
 * @param context test context
 * @returns repository, base commit and helper commands
 */
function repository(context) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'angular-prepare-'));
    context.after(() => fs.rmSync(root, { recursive: true, force: true }));
    const cwd = path.join(root, 'workspace');
    fs.mkdirSync(cwd);
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    git('init', '--initial-branch=develop');
    git('config', 'user.name', 'Workflow test');
    git('config', 'user.email', 'workflow@example.invalid');
    git('config', 'commit.gpgsign', 'false');
    git('commit', '--allow-empty', '-m', 'base');
    git('init', '--bare', path.join(root, 'origin.git'));
    git('remote', 'add', 'origin', path.join(root, 'origin.git'));
    git('push', '--set-upstream', 'origin', 'develop');
    const base = git('rev-parse', 'HEAD');
    const prepare = (runId) => spawnSync(process.execPath, [script, '22.0.0', runId], { cwd, encoding: 'utf8' });

    return { cwd, git, base, prepare };
}

describe('prepare update branch', () => {
    it('can start again when preparation never published its local branch', (context) => {
        const { git, base, prepare } = repository(context);
        assert.equal(prepare('101').status, 0);
        git('checkout', '--detach', base);
        git('branch', '-D', 'chore/update-angular-22.0.0');

        const result = prepare('101');

        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /branch=chore\/update-angular-22\.0\.0/);
        assert.ok(result.stdout.includes(`base-sha=${base}`));
    });

    it('keeps published manual fixes if preparation is retried by the same run', (context) => {
        const { cwd, git, base, prepare } = repository(context);
        assert.equal(prepare('101').status, 0);
        fs.writeFileSync(path.join(cwd, 'fix.txt'), 'manual fix');
        git('add', 'fix.txt');
        git('commit', '-m', 'manual fix');
        git('push', 'origin', 'HEAD:refs/heads/chore/update-angular-22.0.0');
        const fixed = git('rev-parse', 'HEAD');
        git('checkout', '--detach', base);
        git('branch', '-D', 'chore/update-angular-22.0.0');

        const result = prepare('101');

        assert.equal(result.status, 0, result.stderr);
        assert.equal(git('rev-parse', 'HEAD'), fixed);
        assert.equal(fs.readFileSync(path.join(cwd, 'fix.txt'), 'utf8'), 'manual fix');
    });

    it('refuses another run without changing its published branch', (context) => {
        const { git, base, prepare } = repository(context);
        assert.equal(prepare('1010').status, 0);
        git('push', 'origin', 'HEAD:refs/heads/chore/update-angular-22.0.0');
        const published = git('rev-parse', 'HEAD');
        git('checkout', '--detach', base);
        git('branch', '-D', 'chore/update-angular-22.0.0');

        const result = prepare('101');

        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /already exists and belongs to another run/);
        assert.equal(git('rev-parse', 'HEAD'), base);
        assert.equal(git('rev-parse', 'origin/chore/update-angular-22.0.0'), published);
    });
});
