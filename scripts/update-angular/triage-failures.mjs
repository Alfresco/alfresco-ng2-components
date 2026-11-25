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
import { fileURLToPath } from 'node:url';
import { main } from './lib/cli.mjs';
import { triage } from './lib/triage/classify.mjs';
import { createBatches } from './lib/triage/batch.mjs';
import { buildTriageReport } from './lib/triage/report.mjs';
import { PLAYBOOKS } from './lib/triage/taxonomy.mjs';

const UPDATE_STAGES = [
    'update-nx',
    'update-angular-packages',
    'align-peers',
    'run-migrations',
    'lockfile',
    'peers',
    'available-releases',
    'clean-overrides'
];
const CONFIG_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'triage-config.json');
const SOURCE_CONTEXT_LINES = 2;

/**
 * Reads a file, or returns an empty text when it does not exist.
 * @param file file to read
 * @returns file content
 */
function readIfExists(file) {
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

/**
 * Reads the full log of a step, falling back to the excerpt recorded with its status.
 * @param name name of the step
 * @param validationDir directory with the statuses and log excerpts
 * @param fullLogsDir directory with one `full-log-<name>` folder per failed step
 * @returns log text
 */
function readLog(name, validationDir, fullLogsDir) {
    const fullLogDir = path.join(fullLogsDir, `full-log-${name}`);
    const fullLog = fs.existsSync(fullLogDir)
        ? fs
              .readdirSync(fullLogDir)
              .filter((file) => file.endsWith('.log'))
              .sort()
              .map((file) => readIfExists(path.join(fullLogDir, file)))
              .join('\n')
        : '';

    return fullLog || readIfExists(path.join(validationDir, `${name}.log`));
}

/**
 * Reads every step recorded by the workflow.
 * @param validationDir directory with a <name>.status file per step
 * @param fullLogsDir directory with the full logs of the failed steps
 * @returns steps with their name, outcome, log and whether they are update stages
 */
function readSteps(validationDir, fullLogsDir) {
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
                log: readLog(name, validationDir, fullLogsDir),
                isUpdateStage: UPDATE_STAGES.includes(name)
            };
        });
}

/**
 * Reads the triage configuration, with the escalation budget optionally overridden for this run.
 * @param budgetOverride escalation budget given to the workflow, empty to keep the configured one
 * @returns configuration
 */
function readConfig(budgetOverride) {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    if (budgetOverride !== undefined && budgetOverride !== '') {
        const budget = Number(budgetOverride);
        if (!Number.isInteger(budget) || budget < 0) {
            throw new Error(`The escalation budget must be a non-negative integer, got "${budgetOverride}".`);
        }
        config.maxEscalationsPerRun = budget;
    }
    return config;
}

/**
 * Adds the source lines around the first failure of each escalation, so that the report shows the code without a checkout.
 * @param result triage result
 * @param workspaceRoot directory of the checkout
 */
function attachSource(result, workspaceRoot) {
    result.escalations.forEach((group) => {
        const first = group.records[0];
        const file = first.file && path.resolve(workspaceRoot, first.file);
        if (!first.line || !file?.startsWith(path.resolve(workspaceRoot)) || !fs.existsSync(file)) {
            return;
        }
        const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
        const start = Math.max(0, first.line - 1 - SOURCE_CONTEXT_LINES);
        first.source = lines
            .slice(start, first.line + SOURCE_CONTEXT_LINES)
            .map((line, index) => `${String(start + index + 1).padStart(5)} | ${line}`);
    });
}

/**
 * Writes the batch files the agent invocations read: the records of the batch, its escalations and their playbooks.
 * @param outDir output directory
 * @param result triage result
 * @param batches dispatched batches
 */
function writeBatches(outDir, result, batches) {
    const batchDir = path.join(outDir, 'batches');
    fs.mkdirSync(batchDir, { recursive: true });

    batches.forEach((batch) => {
        const escalations = result.escalations
            .filter((group) => batch.escalationIds.includes(group.id))
            .map(({ records, ...group }) => ({
                ...group,
                fingerprints: records.map((record) => record.fingerprint),
                playbookDetails: PLAYBOOKS[group.playbook]
            }));
        fs.writeFileSync(path.join(batchDir, `${batch.id}.json`), `${JSON.stringify({ ...batch, escalations }, null, 2)}\n`);
    });
}

/**
 * Parses and classifies every failure of the run, applies the escalation budget, batches the failures for the agent and writes the report.
 * Prints `completed` or `aborted`.
 * @param validationDir directory with the recorded steps
 * @param fullLogsDir directory with the full logs of the failed steps
 * @param outDir directory to write triage.json, triage-report.md, matrix.json and batches/
 * @param budgetOverride escalation budget for this run, empty to keep the configured one
 */
function triageFailures(validationDir, fullLogsDir, outDir, budgetOverride) {
    const workspaceRoot = process.env.GITHUB_WORKSPACE ?? process.cwd();
    const config = readConfig(budgetOverride);
    const result = triage(readSteps(validationDir, fullLogsDir), config, { workspaceRoot });
    const batches = result.status === 'aborted' ? { dispatched: [], deferred: [] } : createBatches(result, config);

    attachSource(result, workspaceRoot);
    fs.mkdirSync(outDir, { recursive: true });
    writeBatches(outDir, result, batches.dispatched);
    fs.writeFileSync(
        path.join(outDir, 'triage.json'),
        `${JSON.stringify({ ...result, config, batches: batches.dispatched.map(({ records, ...batch }) => ({ ...batch, fingerprints: records.map((record) => record.fingerprint) })), deferredBatches: batches.deferred.map((batch) => batch.id) }, null, 2)}\n`
    );
    fs.writeFileSync(path.join(outDir, 'triage-report.md'), buildTriageReport(result, batches));
    fs.writeFileSync(
        path.join(outDir, 'matrix.json'),
        JSON.stringify(batches.dispatched.map((batch) => ({ batch: batch.id, kind: batch.kind, timeout: batch.timeoutMinutes })))
    );
    process.stdout.write(result.status);
}

main(triageFailures);
