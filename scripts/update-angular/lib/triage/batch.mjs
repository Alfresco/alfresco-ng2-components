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

import { AUTO_FIXABLE, BLOCKED, ESCALATE } from './taxonomy.mjs';

export const ANALYSIS = 'analysis';
export const PARSE_ASSIST = 'parse-assist';
const PARSE_ASSIST_CLASSES = ['unparsed', 'step-failed-without-errors'];
const UNIT_PRIORITY = [ESCALATE, BLOCKED, AUTO_FIXABLE];

/**
 * Estimates the agent minutes a set of records needs.
 * @param records records
 * @param kind kind of batch
 * @param config triage configuration
 * @returns estimated minutes, without the batch overhead
 */
function estimate(records, kind, config) {
    const perRecord = config.minutesPerRecord;
    return records.reduce((total, record) => total + (kind === PARSE_ASSIST ? perRecord[PARSE_ASSIST] : perRecord[record.classification]), 0);
}

/**
 * Builds the coherent units that are never split unless they cannot fit in the longest allowed invocation:
 * an escalation decision with all its records, the unparsed output of a step, or the remaining failures of a file.
 * @param result triage result
 * @param config triage configuration
 * @returns units, in a stable order that keeps the same category, error class and symbol next to each other
 */
function buildUnits(result, config) {
    const units = [];
    const inEscalation = new Set();
    const unit = (kind, key, records) => ({
        kind,
        key,
        records,
        classification: records[0].classification,
        category: records[0].category,
        errorClass: records[0].errorClass,
        symbol: records[0].symbol,
        cost: estimate(records, kind, config)
    });

    result.escalations
        .filter((group) => !PARSE_ASSIST_CLASSES.includes(group.errorClass))
        .forEach((group) => {
            group.records.forEach((record) => inEscalation.add(record));
            units.push({ ...unit(ANALYSIS, group.key, group.records), escalationId: group.id });
        });

    const byKey = new Map();
    result.records
        .filter(
            (record) =>
                !inEscalation.has(record) &&
                (record.errorClass !== 'update-stage-failed' || !result.records.some((cause) => cause.stageCause && cause.step === record.step))
        )
        .forEach((record) => {
            const kind = PARSE_ASSIST_CLASSES.includes(record.errorClass) ? PARSE_ASSIST : ANALYSIS;
            const key = `${kind}|${kind === PARSE_ASSIST ? record.step : `${record.classification}|${record.file || record.step}`}`;
            if (!byKey.has(key)) {
                byKey.set(key, { kind, records: [] });
            }
            byKey.get(key).records.push(record);
        });
    byKey.forEach((value, key) => units.push(unit(value.kind, key, value.records)));

    const order = (item) =>
        [item.kind === ANALYSIS ? 0 : 1, UNIT_PRIORITY.indexOf(item.classification), item.category, item.errorClass, item.symbol, item.key].join(
            '\u0000'
        );

    return units.sort((first, second) => order(first).localeCompare(order(second)));
}

/**
 * Splits a unit too large for the longest allowed invocation into consecutive parts, keeping records of a file together.
 * @param unit oversized unit
 * @param capacity minutes available in the longest invocation
 * @param config triage configuration
 * @returns parts of the unit
 */
function splitUnit(unit, capacity, config) {
    const sorted = [...unit.records].sort((first, second) =>
        `${first.file}\u0000${String(first.line).padStart(8, '0')}`.localeCompare(`${second.file}\u0000${String(second.line).padStart(8, '0')}`)
    );
    const parts = [];
    let current = [];

    sorted.forEach((record) => {
        const next = [...current, record];
        if (current.length && (estimate(next, unit.kind, config) > capacity || next.length > config.maxRecordsPerBatch)) {
            parts.push(current);
            current = [record];
        } else {
            current = next;
        }
    });
    parts.push(current);

    return parts.map((records, index) => ({ ...unit, records, cost: estimate(records, unit.kind, config), part: `${index + 1}/${parts.length}` }));
}

/**
 * Computes the timeout an invocation needs: the configured one, raised for a coherent batch that genuinely needs longer.
 * @param cost estimated minutes of the records
 * @param config triage configuration
 * @returns timeout in minutes
 */
function timeoutFor(cost, config) {
    const needed = Math.ceil((cost + config.batchOverheadMinutes) / config.timeoutUtilisation);
    return Math.min(config.maxAgentTimeoutMinutes, Math.max(config.agentTimeoutMinutes, needed));
}

/**
 * Groups the classified failures into batches that each fit inside one bounded agent invocation. Related failures stay together:
 * the same escalation decision, the same file, then the same category, error class and symbol. Units of different categories never share a batch.
 * @param result triage result
 * @param config triage configuration
 * @returns batches to dispatch, and the ones left out because of the invocation cap
 */
export function createBatches(result, config) {
    const capacity = config.agentTimeoutMinutes * config.timeoutUtilisation - config.batchOverheadMinutes;
    const maxCapacity = config.maxAgentTimeoutMinutes * config.timeoutUtilisation - config.batchOverheadMinutes;
    const batches = [];
    let current = null;

    const close = () => {
        if (current) {
            batches.push(current);
            current = null;
        }
    };
    const open = (unit) => {
        current = { kind: unit.kind, category: unit.category, units: [], records: [], cost: 0 };
    };

    buildUnits(result, config).forEach((unit) => {
        const fitsAlone = unit.cost <= capacity && unit.records.length <= config.maxRecordsPerBatch;

        if (!fitsAlone) {
            close();
            const parts =
                unit.cost <= maxCapacity && unit.records.length <= config.maxRecordsPerBatch ? [unit] : splitUnit(unit, maxCapacity, config);
            parts.forEach((part) =>
                batches.push({ kind: part.kind, category: part.category, units: [part], records: part.records, cost: part.cost })
            );
            return;
        }

        const fits =
            current &&
            current.kind === unit.kind &&
            current.category === unit.category &&
            current.cost + unit.cost <= capacity &&
            current.records.length + unit.records.length <= config.maxRecordsPerBatch;
        if (!fits) {
            close();
            open(unit);
        }
        current.units.push(unit);
        current.records.push(...unit.records);
        current.cost += unit.cost;
    });
    close();

    const described = batches.map((batch, index) => {
        const timeoutMinutes = timeoutFor(batch.cost, config);
        return {
            id: `batch-${String(index + 1).padStart(3, '0')}`,
            kind: batch.kind,
            category: batch.category,
            estimatedMinutes: Math.ceil(batch.cost + config.batchOverheadMinutes),
            timeoutMinutes,
            timeoutRaised: timeoutMinutes > config.agentTimeoutMinutes,
            parts: batch.units.filter((unit) => unit.part).map((unit) => `${unit.key} (part ${unit.part})`),
            escalationIds: [...new Set(batch.units.map((unit) => unit.escalationId).filter(Boolean))],
            files: [...new Set(batch.records.map((record) => record.file).filter(Boolean))].sort(),
            records: batch.records
        };
    });

    return {
        dispatched: described.slice(0, config.maxAgentInvocations),
        deferred: described.slice(config.maxAgentInvocations)
    };
}
