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

const REQUIRED_CHECKS = ['build', 'lint'];

/**
 * Reads a file, or returns an empty text when it does not exist.
 * @param file file to read
 * @returns file content
 */
function readIfExists(file) {
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

/**
 * Reads the outcome and log of every validation check recorded by the workflow.
 * @param validationDir directory with a <name>.status and a <name>.log file per check
 * @returns checks with their name, outcome and log
 */
function readChecks(validationDir) {
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
 * Lists the checks that should have run but left no result.
 * @param checks recorded checks
 * @returns names of the missing checks
 */
function findMissingChecks(checks) {
    const names = checks.map((check) => check.name);
    const missing = REQUIRED_CHECKS.filter((name) => !names.includes(name));

    if (!names.some((name) => name.startsWith('test-'))) {
        missing.push('unit tests');
    }

    return missing;
}

/**
 * Builds the table with the result of every check.
 * @param checks recorded checks
 * @param missing names of the checks without result
 * @returns markdown
 */
function resultsTable(checks, missing) {
    const rows = [
        ...checks.map((check) => `| ${check.name} | ${check.outcome === 'success' ? '✅ passed' : `❌ ${check.outcome}`} |`),
        ...missing.map((name) => `| ${name} | ❌ did not complete |`)
    ];

    return ['| Check | Result |', '| --- | --- |', ...rows].join('\n');
}

/**
 * Builds a collapsible block with the log of every failed check.
 * @param checks recorded checks
 * @returns markdown
 */
function failureDetails(checks) {
    return checks
        .filter((check) => check.outcome !== 'success')
        .map((check) => `<details><summary>${check.name}</summary>\n\n\`\`\`\n${check.log}\n\`\`\`\n\n</details>`)
        .join('\n\n');
}

/**
 * Writes the pull request body and prints whether the pull request needs manual fixes.
 * @param bodyFile file to write
 * @param validationDir directory with the recorded checks
 * @param reportDir directory with migration-report.md, peers.md and overrides.md
 * @param version Angular version the update moves to
 * @param runUrl URL of the workflow run
 * @param jobResults results of the validation jobs
 */
function buildPullRequestBody(bodyFile, validationDir, reportDir, version, runUrl, ...jobResults) {
    const checks = readChecks(validationDir);
    const missing = findMissingChecks(checks);
    const needsFixes = missing.length > 0 || checks.some((check) => check.outcome !== 'success') || jobResults.some((result) => result !== 'success');

    const sections = [
        `Automated update of Angular and Nx packages to Angular ${version}.`,
        `### Validation\n\n${resultsTable(checks, missing)}`,
        failureDetails(checks),
        `[Workflow run](${runUrl})`,
        readIfExists(path.join(reportDir, 'migration-report.md')).trim(),
        readIfExists(path.join(reportDir, 'peers.md')).trim(),
        readIfExists(path.join(reportDir, 'overrides.md')).trim()
    ];

    fs.writeFileSync(bodyFile, `${sections.filter(Boolean).join('\n\n')}\n`);
    process.stdout.write(needsFixes ? 'draft' : 'ready');
}

main(buildPullRequestBody);
