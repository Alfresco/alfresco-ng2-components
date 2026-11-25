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

import { escapeTableCell, fenced } from '../markdown.mjs';
import { AUTO_FIXABLE, BLOCKED, CATEGORIES, ERROR_CLASSES, ESCALATE, PLAYBOOKS } from './taxonomy.mjs';
import { SCHEMATICS_STAGE } from './classify.mjs';

const MAX_LOCATIONS = 10;
const ICONS = { [AUTO_FIXABLE]: '🔧', [ESCALATE]: '🙋', [BLOCKED]: '⛔' };

/**
 * Formats where a record was seen.
 * @param record classified record
 * @returns `file:line (step)` for every occurrence
 */
function locations(record) {
    return record.occurrences.map(
        (occurrence) => `${occurrence.file || '(no file)'}${occurrence.line ? `:${occurrence.line}` : ''} (${occurrence.step})`
    );
}

/**
 * Wraps a value in inline code, or returns a dash when it is empty.
 * @param value value to show
 * @returns markdown
 */
function code(value) {
    return value ? `\`${String(value).replaceAll('`', "'")}\`` : '—';
}

/**
 * Builds the summary of the run: status, budget and counts per category and classification.
 * @param result triage result
 * @returns markdown
 */
function summary(result) {
    const count = (category, classification) =>
        result.records.filter((record) => record.category === category && record.classification === classification).length;
    const usedCategories = Object.keys(CATEGORIES).filter((category) => result.records.some((record) => record.category === category));
    const status =
        result.status === 'aborted'
            ? `> ⛔ **Triage aborted: the escalation budget is exceeded** (${result.budget.used} decisions needed, the budget is ${result.budget.limit}). No agent was asked anything. Every failure found is reported below; decide whether the update is worth continuing before resolving them.`
            : `Escalations: **${result.budget.used}** of a budget of ${result.budget.limit}.`;
    const positional = result.schematicsClean
        ? `\`${SCHEMATICS_STAGE}\` ran cleanly. ${result.autoFixedSteps.length ? `Checks passing after the schematics, so auto-fixed: ${result.autoFixedSteps.map(code).join(', ')}.` : 'No check passed after the schematics.'} The failures below persisted after the schematics.`
        : `\`${SCHEMATICS_STAGE}\` did not run cleanly, so later failures are blocked until it does.`;
    const table = [
        `| Category | ${ICONS[ESCALATE]} escalate | ${ICONS[BLOCKED]} blocked | ${ICONS[AUTO_FIXABLE]} auto-fixable |`,
        '| --- | --- | --- | --- |',
        ...usedCategories.map(
            (category) =>
                `| ${CATEGORIES[category].title} | ${count(category, ESCALATE)} | ${count(category, BLOCKED)} | ${count(category, AUTO_FIXABLE)} |`
        )
    ].join('\n');

    return [status, positional, result.records.length ? table : 'No failure to classify.'].join('\n\n');
}

/**
 * Builds the section a human decides one escalation from, without reading the build log.
 * @param group escalation group
 * @returns markdown
 */
function escalationSection(group) {
    const first = group.records[0];
    const playbook = PLAYBOOKS[group.playbook] ?? PLAYBOOKS.uncertain;
    const allLocations = group.records.flatMap(locations);
    const shown = allLocations.slice(0, MAX_LOCATIONS).map((location) => `- ${location}`);
    const more = allLocations.length > MAX_LOCATIONS ? [`- …and ${allLocations.length - MAX_LOCATIONS} more`] : [];
    const source = first.source?.length ? `\n\nSource at ${code(`${first.file}:${first.line}`)}:\n\n${fenced(first.source.join('\n'))}` : '';
    const options = playbook.options.map(
        (option, index) =>
            `| ${index + 1}${index === playbook.recommendation ? ' ⭐' : ''} | ${escapeTableCell(option.name)} | ${escapeTableCell(option.tradeOffs)} |`
    );
    const uncertainty = group.ambiguous
        ? '\n\n_The failure shape is ambiguous, so the rules escalate it. The agent analysis of its batch may suggest it is mechanical; a human confirms that._'
        : '';

    return [
        `### ${group.id} · ${ERROR_CLASSES[group.errorClass].title}${group.symbol ? `: ${code(group.symbol)}` : ''}`,
        `**What broke** · ${code(first.code)} in ${group.records.length} distinct failure(s), ${allLocations.length} location(s)\n\n> ${first.message.replaceAll('\n', ' ')}\n\n${[...shown, ...more].join('\n')}${source}\n\n<details><summary>Log excerpt</summary>\n\n${fenced(first.excerpt.join('\n'))}\n\n</details>`,
        `**Why it is architectural** · ${group.rationale} ${playbook.why}`,
        `**Options**\n\n| # | Option | Trade-offs |\n| --- | --- | --- |\n${options.join('\n')}`,
        `**Recommendation** · Option ${playbook.recommendation + 1}: ${playbook.options[playbook.recommendation].name}.${uncertainty}`
    ].join('\n\n');
}

/**
 * Builds the table of the records with a classification, grouped by error class, symbol and rationale.
 * @param records classified records with the same classification
 * @returns markdown
 */
function recordTable(records) {
    const groups = new Map();
    records.forEach((record) => {
        const key = [record.errorClass, record.symbol, record.message, record.rationale].join('\u0000');
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record);
    });
    const rows = [...groups.values()].map((group) => {
        const where = group.flatMap(locations);
        const shown = where.slice(0, 3).join('<br>') + (where.length > 3 ? `<br>…and ${where.length - 3} more` : '');
        const first = group[0];
        return `| ${escapeTableCell(ERROR_CLASSES[first.errorClass].title)} | ${code(first.code)} | ${escapeTableCell(code(first.symbol))} | ${escapeTableCell(first.message)} | ${escapeTableCell(shown)} | ${escapeTableCell(first.rationale)} \`${first.ruleId}\` |`;
    });

    return ['| Error class | Code | Symbol | Error | Where | Rationale (rule) |', '| --- | --- | --- | --- | --- | --- |', ...rows].join('\n');
}

/**
 * Builds the list of agent invocations.
 * @param result triage result
 * @param batches dispatched and deferred batches
 * @returns markdown
 */
function agentSection(result, batches) {
    if (result.status === 'aborted') {
        return '### Agent analysis\n\nNot dispatched: the run was aborted by the escalation budget.';
    }
    if (!batches.dispatched.length) {
        return '';
    }
    const rows = batches.dispatched.map(
        (batch) =>
            `| ${batch.id} | ${batch.kind} | ${CATEGORIES[batch.category]?.title ?? batch.category} | ${batch.records.length} | ${batch.timeoutMinutes} min${batch.timeoutRaised ? ' (raised)' : ''} | ${batch.escalationIds.join(', ') || '—'} |`
    );
    const deferred = batches.deferred.length
        ? `\n\n${batches.deferred.length} batch(es) (${batches.deferred.map((batch) => batch.id).join(', ')}) were not dispatched because of the \`maxAgentInvocations\` cap.`
        : '';

    return `### Agent analysis\n\nEach batch below is analysed by one bounded agent invocation, which comments on this pull request with concrete fixes and options. The agent never changes a classification.\n\n| Batch | Kind | Category | Failures | Timeout | Escalations |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}${deferred}`;
}

/**
 * Builds the triage report: summary, escalations a human decides from directly, then the auto-fixable and blocked failures.
 * @param result triage result
 * @param batches dispatched and deferred batches
 * @returns markdown
 */
export function buildTriageReport(result, batches) {
    const of = (classification) => result.records.filter((record) => record.classification === classification);
    const escalations = result.escalations.length
        ? `### ${ICONS[ESCALATE]} Escalations: decisions needed\n\n${result.escalations.map(escalationSection).join('\n\n---\n\n')}`
        : '';
    const blocked = of(BLOCKED).length ? `### ${ICONS[BLOCKED]} Blocked\n\n${recordTable(of(BLOCKED))}` : '';
    const autoFixable = of(AUTO_FIXABLE).length
        ? `<details><summary>${ICONS[AUTO_FIXABLE]} Auto-fixable (${of(AUTO_FIXABLE).length})</summary>\n\n${recordTable(of(AUTO_FIXABLE))}\n\n</details>`
        : '';
    const taxonomy = `<details><summary>Taxonomy and default classifications</summary>\n\n| Category | Default | Why |\n| --- | --- | --- |\n${Object.values(
        CATEGORIES
    )
        .map((category) => `| ${category.title} | ${category.defaultClassification} | ${escapeTableCell(category.why)} |`)
        .join('\n')}\n\n</details>`;

    return `${['## Failure triage', summary(result), escalations, blocked, autoFixable, agentSection(result, batches), taxonomy].filter(Boolean).join('\n\n')}\n`;
}
