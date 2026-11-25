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
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { after, before, describe, it } from 'node:test';
import { parseTargetMajor } from '../lib/angular.mjs';

describe('parseTargetMajor', () => {
    const initialDir = process.cwd();
    let workspace;

    before(() => {
        workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'update-angular-'));
        fs.writeFileSync(path.join(workspace, 'package.json'), JSON.stringify({ dependencies: { '@angular/core': '~22.0.0' } }));
        process.chdir(workspace);
    });

    after(() => {
        process.chdir(initialDir);
        fs.rmSync(workspace, { recursive: true, force: true });
    });

    it('accepts only the next major by default', () => {
        assert.equal(parseTargetMajor('23'), 23);
        assert.throws(() => parseTargetMajor('22'), /Only the next major is supported: current is 22, requested 22/);
    });

    it('also accepts the installed major for a branch a previous attempt already moved to the target', () => {
        assert.equal(parseTargetMajor('22', { allowReached: true }), 22);
        assert.equal(parseTargetMajor('23', { allowReached: true }), 23);
        assert.throws(() => parseTargetMajor('24', { allowReached: true }), /Only the next major is supported/);
        assert.throws(() => parseTargetMajor('21', { allowReached: true }), /Only the next major is supported/);
    });
});
