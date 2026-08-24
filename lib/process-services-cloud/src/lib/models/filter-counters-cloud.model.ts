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

/**
 * Entity types accepted by the `POST /query/v1/count` endpoint.
 */
export const FilterCounterEntityType = {
    TASK: 'TASK',
    PROCESS_INSTANCE: 'PROCESS_INSTANCE'
} as const;

export type FilterCounterEntityType = (typeof FilterCounterEntityType)[keyof typeof FilterCounterEntityType];

export interface FilterCountersQuerySort {
    field: string;
    direction: string;
    isProcessVariable: boolean;
}

/** A single query of the batched count request, holding the criteria of one filter. */
export interface FilterCountersQuery {
    /** Identifies the query, so its counter can be read back from the response. */
    requestId: string;
    status?: string[];
    assignee?: string[];
    sort?: FilterCountersQuerySort;
    [criteria: string]: unknown;
}

/**
 * Payload of the batched count request, one entry per counter to be resolved.
 */
export type FilterCountersRequest = {
    [entityType in FilterCounterEntityType]?: FilterCountersQuery[];
};

/** Shape of a task or process filter the counters are resolved for. Its key is the `requestId`. */
export interface FilterCounterCandidate {
    key?: string | null;
    showCounter?: boolean;
}

/**
 * Counts returned by the batched count request, keyed by entity type and then by `requestId`.
 * e.g. `{ TASK: { 'my-tasks': 5 }, PROCESS_INSTANCE: { 'running-processes': 5 } }`
 */
export type FilterCounters = {
    [entityType in FilterCounterEntityType]?: { [requestId: string]: number };
};

export interface FilterCountersResult {
    /** Counters keyed by filter key. Empty when the batched count endpoint is not available. */
    counters: { [filterKey: string]: number };
    /** When `false`, the backend holds no batched count endpoint: count one filter at a time. */
    batched: boolean;
}
