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

export interface FilterCountersQuery {
    requestId: string;
    status?: string[];
    assignee?: string[];
    sort?: FilterCountersQuerySort;
    [criteria: string]: unknown;
}

export type FilterCountersRequest = {
    [entityType in FilterCounterEntityType]?: FilterCountersQuery[];
};

export interface FilterCounterCandidate {
    key?: string | null;
    showCounter?: boolean;
}

export type FilterCounters = {
    [entityType in FilterCounterEntityType]?: { [requestId: string]: number };
};

export interface FilterCountersResult {
    counters: { [filterKey: string]: number };
    batched: boolean;
}
