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

import { TaskCloudEngineEvent } from './engine-event-cloud.model';

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

/**
 * A single query of the batched count request, holding the criteria of one filter.
 */
export interface FilterCountersQuery {
    status?: string[];
    assignee?: string[];
    sort?: FilterCountersQuerySort;
    [criteria: string]: any;
}

/**
 * Payload of the batched count request, one entry per counter to be resolved.
 */
export type FilterCountersRequest = {
    [entityType in FilterCounterEntityType]?: FilterCountersQuery[];
};

/**
 * Shape of a task or process filter the counters are resolved for.
 */
export interface FilterCounterCandidate {
    key: string;
    status?: string | null;
    statuses?: string[] | null;
    showCounter?: boolean;
}

/**
 * Filters of every entity type the counters are resolved for.
 */
export type FilterCountersFilters = {
    [entityType in FilterCounterEntityType]: any[];
};

/**
 * Counts returned by the batched count request, keyed by entity type and then by status.
 * e.g. `{ TASK: { ASSIGNED: 5, CREATED: 0 }, PROCESS_INSTANCE: { RUNNING: 5 } }`
 */
export type FilterCounters = {
    [entityType in FilterCounterEntityType]?: { [status: string]: number };
};

export interface FilterCountersNotification {
    /** Engine events of the debounced batch that triggered the count request. */
    events: TaskCloudEngineEvent[];
    /** Counts resolved by a single call to the batched count endpoint. */
    counters: FilterCounters;
}

/**
 * Resolves the statuses of a filter, which the counters of the count response are keyed by.
 *
 * @param filter task or process filter
 * @param filter.status Status of the filter
 * @param filter.statuses Statuses of the filter
 * @returns the statuses of the filter, empty when the filter targets every status
 */
export function resolveFilterCounterStatuses(filter: { status?: string | null; statuses?: string[] | null }): string[] {
    const statuses = filter?.statuses?.length ? filter.statuses : filter?.status ? [filter.status] : [];

    return statuses.filter((status) => !!status);
}
