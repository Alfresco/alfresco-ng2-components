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
import process from 'node:process';
import { main } from './lib/cli.mjs';
import { run } from './lib/shell.mjs';

const NX_MIGRATION_COMMIT_PREFIX = 'chore: [nx migration] ';

/**
 * Writes the migrations that still have to run, leaving out the ones an earlier attempt already committed,
 * so that a retried job does not apply a migration twice. A migration is recognised by the commit `nx migrate --create-commits`
 * made for it after the migrations file was added. Its commit names only the migration, so a name used by several packages
 * is always kept, and so is a migration that changed nothing, as it made no commit.
 * @param migrationsFile committed migrations.json
 * @param pendingFile file to write with the migrations left to run
 */
function pendingMigrations(migrationsFile, pendingFile) {
    const migrations = JSON.parse(fs.readFileSync(migrationsFile, 'utf8')).migrations ?? [];
    const addedIn = run('git', ['log', '-1', '--format=%H', '--diff-filter=A', '--', migrationsFile]).trim();
    const subjects = addedIn ? new Set(run('git', ['log', '--format=%s', `${addedIn}..HEAD`]).split('\n')) : new Set();
    const nameCount = (name) => migrations.filter((migration) => migration.name === name).length;
    const applied = (migration) => nameCount(migration.name) === 1 && subjects.has(`${NX_MIGRATION_COMMIT_PREFIX}${migration.name}`);

    for (const migration of migrations.filter(applied)) {
        console.error(`Skipping ${migration.package}:${migration.name}, an earlier attempt already committed it`);
    }
    const pending = migrations.filter((migration) => !applied(migration));

    fs.writeFileSync(pendingFile, `${JSON.stringify({ migrations: pending }, null, 2)}\n`);
    process.stdout.write(String(pending.length));
}

main(pendingMigrations);
