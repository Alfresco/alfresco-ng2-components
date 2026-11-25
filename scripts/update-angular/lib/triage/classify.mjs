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

import { AUTO_FIXABLE, BLOCKED, CATEGORIES, ESCALATE, ERROR_CLASSES } from './taxonomy.mjs';
import { createRecord, parseLog } from './parse.mjs';

export const SCHEMATICS_STAGE = 'run-migrations';
export const VALIDATION_STEPS = /^(?:build|lint|test-.+|format-and-lint-fix)$/;
const CLASSIFICATION_ORDER = [ESCALATE, BLOCKED, AUTO_FIXABLE];
const TAIL_LINES = 15;

/**
 * Rules from the most to the least specific. The first rule that matches decides; the category default applies when none does.
 * Rules only look at where the failure happened and at its shape, never at what an agent thinks of it.
 */
const RULES = [
    {
        id: 'positional/update-stage-failed',
        when: (record) => record.errorClass === 'update-stage-failed',
        classification: BLOCKED,
        rationale: (record) =>
            `The update stopped at \`${record.step}\`, before the validation. The schematics did not run to completion, so this is not a residual migration error: the stage has to succeed first.`
    },
    {
        id: 'positional/schematics-not-clean',
        when: (record, context) => !context.schematicsClean && VALIDATION_STEPS.test(record.step),
        classification: BLOCKED,
        rationale: () =>
            `\`${SCHEMATICS_STAGE}\` did not succeed, so this failure cannot be attributed to the migration: it may disappear once the schematics run cleanly.`
    },
    {
        id: 'typescript/deprecated-base-url',
        when: (record) =>
            record.code === 'TS5101' && /Option 'baseUrl' is deprecated/.test(record.message) && /"ignoreDeprecations": "6\.0"/.test(record.message),
        classification: AUTO_FIXABLE,
        rationale: () =>
            'TypeScript gives a direct temporary fix: set `ignoreDeprecations` to `6.0` in the affected compiler options. Removing `baseUrl` can be done separately.'
    },
    {
        id: 'infrastructure',
        when: (record) => record.category === 'infrastructure',
        classification: BLOCKED,
        rationale: (record) =>
            `${ERROR_CLASSES[record.errorClass].title}: the check could not run to the end, so its result says nothing about the migration. Re-run or fix the environment first.`
    },
    {
        id: 'api/renamed-with-compiler-suggestion',
        when: (record) => ['ts-renamed-export', 'ts-renamed-member'].includes(record.errorClass) && record.suggestion,
        classification: AUTO_FIXABLE,
        rationale: (record) =>
            `The compiler names the replacement: \`${record.symbol}\` → \`${record.suggestion}\`. A rename with a known target is mechanical.`
    },
    {
        id: 'api/renamed-or-moved-known',
        when: (record) => ['ts-renamed-export', 'ts-renamed-member', 'ts-moved-module'].includes(record.errorClass),
        classification: AUTO_FIXABLE,
        rationale: (record) =>
            record.code === 'TS2614'
                ? 'Only the import style changed (default versus named import). The fix is mechanical.'
                : `\`${record.symbol}\` is listed in the curated renames or moved modules of \`triage-config.json\`. The fix is mechanical.`
    },
    {
        id: 'api/removed',
        when: (record) => ['ts-removed-export', 'ts-removed-option'].includes(record.errorClass),
        classification: ESCALATE,
        playbook: 'removed-api',
        rationale: (record) =>
            `\`${record.symbol}\` is no longer provided by \`${record.owner || 'its module'}\` and the compiler suggests no equivalent. A removed API without a direct replacement is an architectural decision.`
    },
    {
        id: 'api/unknown-member-or-module',
        when: (record) => ['ts-removed-member', 'ts-missing-module'].includes(record.errorClass),
        classification: ESCALATE,
        playbook: 'removed-api',
        ambiguous: true,
        rationale: (record) =>
            `\`${record.symbol}\` cannot be found and the compiler suggests no equivalent. It is either removed upstream (architectural) or a mechanical change the rules cannot prove, so it is escalated.`
    },
    {
        id: 'default/changed',
        when: (record) => record.category === 'schematic-default',
        classification: ESCALATE,
        playbook: 'changed-default',
        rationale: (record) =>
            `${ERROR_CLASSES[record.errorClass].title}${record.symbol ? ` (\`${record.symbol}\`)` : ''}: keeping the previous behaviour or adopting the new default is an opt-in decision.`
    },
    {
        id: 'template/external',
        when: (record) => ['ng-unknown-element-external', 'ng-unknown-property-external'].includes(record.errorClass),
        classification: ESCALATE,
        playbook: 'external-template',
        ambiguous: true,
        rationale: (record) =>
            `\`${record.symbol}\` comes from a library and is not known any more. It may only need an import, or the library may have removed it, and the template error cannot tell which.`
    },
    {
        id: 'template/mechanical',
        when: (record) =>
            ['ng-unknown-element-local', 'ng-unknown-property-local', 'ng-missing-pipe', 'ng-template-syntax'].includes(record.errorClass),
        classification: AUTO_FIXABLE,
        rationale: (record) =>
            `${ERROR_CLASSES[record.errorClass].title}${record.symbol ? ` (\`${record.symbol}\`)` : ''}: the missing import or syntax update has a single fix.`
    },
    {
        id: 'type/mechanical',
        when: (record) => ['ts-type-mismatch', 'ts-signature-change'].includes(record.errorClass),
        classification: AUTO_FIXABLE,
        rationale: (record) =>
            `${record.code} (${ERROR_CLASSES[record.errorClass].title.toLowerCase()})${record.category === 'test-only' ? ' in test code only' : ''}: the code is adapted to the stricter or changed signature, without a design choice.`
    },
    {
        id: 'behaviour/changed',
        when: (record) => record.category === 'behavioural-runtime',
        classification: ESCALATE,
        playbook: 'behavioural',
        rationale: (record) =>
            `The code compiles but ${record.errorClass === 'ng-runtime' ? `Angular raises ${record.code} at runtime` : 'a test expectation fails'}. A behaviour change has several valid resolutions.`
    },
    {
        id: 'lint/violation',
        when: (record) => record.errorClass === 'lint-rule-violation',
        classification: AUTO_FIXABLE,
        rationale: (record) => `Violation of \`${record.symbol || 'a lint rule'}\`: following the rule is mechanical.`
    },
    {
        id: 'lint/rule-missing',
        when: (record) => record.errorClass === 'lint-rule-missing',
        classification: ESCALATE,
        playbook: 'lint-config',
        rationale: (record) =>
            `The lint configuration references \`${record.symbol}\`, which no longer exists. Replacing or dropping it is a policy decision.`
    },
    {
        id: 'uncertain/escalate',
        when: (record) => ['unparsed', 'step-failed-without-errors', 'ts-other', 'ng-template-other'].includes(record.errorClass),
        classification: ESCALATE,
        playbook: 'uncertain',
        ambiguous: true,
        rationale: (record) =>
            record.errorClass === 'unparsed' || record.errorClass === 'step-failed-without-errors'
                ? 'The output could not be parsed into a known failure shape. A misparsed failure is misclassified, so it is escalated rather than guessed.'
                : `${record.code} is not in the rule table, so the pipeline cannot tell whether it is mechanical and escalates.`
    }
];

/**
 * Classifies a failure record with the first matching rule.
 * @param record failure record
 * @param context whether the schematics ran cleanly
 * @returns the record with its classification, the rule that decided and the rationale
 */
export function classifyRecord(record, context) {
    const rule = RULES.find((candidate) => candidate.when(record, context));

    if (!rule) {
        const category = CATEGORIES[record.category] ?? CATEGORIES.unclassified;
        return {
            ...record,
            classification: category.defaultClassification,
            ruleId: `default/${record.category}`,
            rationale: `Default of the "${category.title}" category: ${category.why}`,
            ambiguous: false,
            playbook: category.defaultClassification === ESCALATE ? 'uncertain' : ''
        };
    }

    return {
        ...record,
        classification: rule.classification,
        ruleId: rule.id,
        rationale: rule.rationale(record),
        ambiguous: Boolean(rule.ambiguous),
        playbook: rule.playbook ?? ''
    };
}

/**
 * Turns the steps of the workflow into failure records: a blocked record for an update stage that failed, its parsed causes,
 * and the parsed errors of every failed validation step. A failed step that yields no record still gets one.
 * @param steps steps with their name, outcome, log, and whether they are update stages
 * @param options workspace root and triage configuration
 * @returns failure records, with the same failure seen by several steps merged into one record with several occurrences
 */
export function collectRecords(steps, options = {}) {
    const records = [];

    steps
        .filter((step) => step.outcome !== 'success' && step.outcome !== 'not run' && step.outcome !== 'skipped')
        .forEach((step) => {
            const parsed = parseLog(step.name, step.log, options);
            const tail = (step.log ?? '').split(/\r?\n/).filter(Boolean).slice(-TAIL_LINES);

            if (step.outcome === 'cancelled') {
                records.push(
                    createRecord({
                        step: step.name,
                        parser: 'step',
                        code: 'cancelled',
                        message: `\`${step.name}\` was cancelled or timed out.`,
                        errorClass: 'infra-cancelled',
                        excerpt: tail
                    })
                );
            } else if (step.isUpdateStage) {
                const cause = parsed.find((record) => record.errorClass !== 'unparsed') ?? parsed[0];
                records.push(
                    createRecord({
                        step: step.name,
                        parser: 'step',
                        code: cause?.code ?? 'stage',
                        symbol: cause?.symbol,
                        message: cause ? `\`${step.name}\` failed: ${cause.message}` : `\`${step.name}\` failed.`,
                        errorClass: 'update-stage-failed',
                        excerpt: cause?.excerpt ?? tail
                    })
                );
                records.push(...parsed.map((record) => ({ ...record, stageCause: true })));
            } else if (parsed.length) {
                records.push(...parsed);
            } else {
                records.push(
                    createRecord({
                        step: step.name,
                        parser: 'step',
                        code: 'no-errors',
                        message: `\`${step.name}\` failed without a recognised error.`,
                        errorClass: 'step-failed-without-errors',
                        excerpt: tail
                    })
                );
            }
        });

    return mergeDuplicates(records);
}

/**
 * Merges the records with the same fingerprint, keeping where each was seen.
 * @param records failure records
 * @returns unique records with their occurrences
 */
function mergeDuplicates(records) {
    const byFingerprint = new Map();

    records.forEach((record) => {
        const occurrence = { step: record.step, file: record.file, line: record.line };
        const key = record.stageCause ? `${record.fingerprint}:${record.step}:stage-cause` : record.fingerprint;
        const existing = byFingerprint.get(key);
        if (existing) {
            const seen = existing.occurrences.some(
                (known) => known.step === occurrence.step && known.file === occurrence.file && known.line === occurrence.line
            );
            if (!seen) {
                existing.occurrences.push(occurrence);
            }
        } else {
            byFingerprint.set(key, { ...record, occurrences: [occurrence] });
        }
    });

    return [...byFingerprint.values()];
}

/**
 * Sorts records so that the same failures always come out in the same order, whatever the order of the logs.
 * @param records classified records
 * @returns sorted copy
 */
export function sortRecords(records) {
    const key = (record) =>
        [
            CLASSIFICATION_ORDER.indexOf(record.classification),
            record.category,
            record.errorClass,
            record.file,
            String(record.line).padStart(8, '0'),
            record.fingerprint,
            record.stageCause ? 'stage-cause' : 'validation',
            record.step
        ].join('\u0000');

    return [...records].sort((first, second) => key(first).localeCompare(key(second)));
}

/**
 * Groups escalated records into decisions: the same error class on the same symbol is one question for a human,
 * however many files it appears in. The escalation budget counts decisions, not records.
 * @param records classified records
 * @returns escalation groups, sorted by key
 */
export function groupEscalations(records) {
    const groups = new Map();

    records
        .filter((record) => record.classification === ESCALATE)
        .forEach((record) => {
            const key = `${record.errorClass}|${record.symbol || record.file || record.fingerprint}`;
            if (!groups.has(key)) {
                groups.set(key, {
                    key,
                    errorClass: record.errorClass,
                    category: record.category,
                    symbol: record.symbol,
                    playbook: record.playbook,
                    ambiguous: record.ambiguous,
                    rationale: record.rationale,
                    records: []
                });
            }
            groups.get(key).records.push(record);
        });

    return [...groups.values()]
        .sort((first, second) => first.key.localeCompare(second.key))
        .map((group, index) => ({ id: `E${String(index + 1).padStart(2, '0')}`, ...group }));
}

/**
 * Classifies every failure of the run and applies the escalation budget.
 * @param steps steps of the workflow
 * @param config triage configuration
 * @param options workspace root
 * @returns triage result: status, classified records, escalation groups and budget
 */
export function triage(steps, config, options = {}) {
    const schematicsStep = steps.find((step) => step.name === SCHEMATICS_STAGE);
    const context = { schematicsClean: schematicsStep?.outcome === 'success' };
    const records = sortRecords(
        collectRecords(steps, { ...options, config }).map((record) => {
            const classified = classifyRecord(record, context);
            return record.stageCause
                ? {
                      ...classified,
                      rationale: `${classified.rationale} This is the cause of the blocked \`${record.step}\` stage, not a completed migration validation.`
                  }
                : classified;
        })
    );
    const escalations = groupEscalations(records);
    const budget = { limit: config.maxEscalationsPerRun, used: escalations.length };
    const autoFixedSteps = context.schematicsClean
        ? steps.filter((step) => VALIDATION_STEPS.test(step.name) && step.outcome === 'success').map((step) => step.name)
        : [];

    return {
        status: budget.used > budget.limit ? 'aborted' : 'completed',
        schematicsClean: context.schematicsClean,
        autoFixedSteps,
        budget,
        records,
        escalations
    };
}
