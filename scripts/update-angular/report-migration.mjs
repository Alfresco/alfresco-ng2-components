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
import { dependenciesAt, workspaceDependencies } from './lib/package-json.mjs';
import { run } from './lib/shell.mjs';

/**
 * Builds the table of packages whose version changed.
 * @param baseRef git ref the update started from
 * @returns markdown
 */
function packageChanges(baseRef) {
    const before = dependenciesAt(baseRef);
    const after = workspaceDependencies();
    const rows = Object.keys(after)
        .filter((name) => before[name] !== after[name])
        .sort()
        .map((name) => `| \`${name}\` | ${before[name] ?? '-'} | ${after[name]} |`);

    return ['### Package changes', '', '| Package | From | To |', '| --- | --- | --- |', ...rows].join('\n');
}

/**
 * Builds the table of migrations that were run.
 * @param migrationsFile merged migrations.json
 * @returns markdown
 */
function migrationsTable(migrationsFile) {
    const migrations = fs.existsSync(migrationsFile) ? (JSON.parse(fs.readFileSync(migrationsFile, 'utf8')).migrations ?? []) : [];
    const rows = migrations.map(
        (migration) =>
            `| \`${migration.package}\` | \`${migration.name}\` | ${migration.version} | ${(migration.description ?? '').replaceAll('|', '\\|')} |`
    );
    const table = rows.length
        ? ['| Package | Migration | Version | Description |', '| --- | --- | --- | --- |', ...rows].join('\n')
        : 'No migrations were required.';

    return `### Migrations executed (${migrations.length})\n\n${table}`;
}

/**
 * Builds the list of commits and the diff size of the update.
 * @param baseRef git ref the update started from
 * @returns markdown
 */
function commitsSummary(baseRef) {
    const commits = run('git', ['log', '--reverse', '--format=- %s', `${baseRef}..HEAD`]).trim();
    const diffSize = run('git', ['diff', '--shortstat', `${baseRef}..HEAD`]).trim();

    return `### Commits\n\n${commits}\n\n**Diff:** ${diffSize}`;
}

/**
 * Prints the migration report: package changes, migrations executed and commits.
 * @param baseRef git ref the update started from
 * @param migrationsFile merged migrations.json
 */
function reportMigration(baseRef, migrationsFile) {
    process.stdout.write(`${[packageChanges(baseRef), migrationsTable(migrationsFile), commitsSummary(baseRef)].join('\n\n')}\n`);
}

main(reportMigration);
