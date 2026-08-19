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

import { inject, Injectable } from '@angular/core';
import { combineLatest, defer, EMPTY, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { BaseCloudService } from './base-cloud.service';
import { NotificationCloudService } from './notification-cloud.service';
import { TaskCloudEngineEvent } from '../models/engine-event-cloud.model';
import { TaskFilterCloudService } from '../task/task-filters/services/task-filter-cloud.service';
import { ProcessFilterCloudService } from '../process/process-filters/services/process-filter-cloud.service';
import { TaskListCloudService } from '../task/task-list/services/task-list-cloud.service';
import { ProcessListCloudService } from '../process/process-list/services/process-list-cloud.service';
import { TaskFilterCloudAdapter } from '../models/filter-cloud-model';
import { ProcessFilterCloudAdapter } from '../process/process-list/models/process-cloud-query-request.model';
import {
    FilterCounterCandidate,
    FilterCounterEntityType,
    FilterCounters,
    FilterCountersFilters,
    FilterCountersNotification,
    FilterCountersQuery,
    FilterCountersRequest,
    resolveFilterCounterStatuses
} from '../models/filter-counters-cloud.model';

/**
 * Single subscription covering both the task and the process engine events, so that a batch of
 * events results in one call to the batched count endpoint.
 */
const FILTER_COUNTERS_EVENT_SUBSCRIPTION_QUERY = `
    subscription {
        engineEvents(eventType: [
            TASK_COMPLETED
            TASK_ASSIGNED
            TASK_ACTIVATED
            TASK_SUSPENDED
            TASK_CANCELLED
            TASK_CREATED
            PROCESS_CANCELLED
            PROCESS_COMPLETED
            PROCESS_CREATED
            PROCESS_RESUMED
            PROCESS_SUSPENDED
            PROCESS_STARTED
        ]) {
            eventType
            entity
        }
    }
`;

/**
 * Central place handling the filter counters of the task and the process filter components:
 * a single engine event subscription, debounced into a single batched count request.
 *
 * Every filter with a counter enabled is registered by its component through `registerFilters`,
 * so that the counters of both the task and the process filters are resolved by one request.
 */
@Injectable({ providedIn: 'root' })
export class FilterCountersCloudService extends BaseCloudService {
    private readonly notificationCloudService = inject(NotificationCloudService);

    private readonly taskFilterCloudService = inject(TaskFilterCloudService);
    private readonly processFilterCloudService = inject(ProcessFilterCloudService);
    private readonly taskListCloudService = inject(TaskListCloudService);
    private readonly processListCloudService = inject(ProcessListCloudService);

    private readonly notificationsPerApp = new Map<string, Observable<FilterCountersNotification>>();
    private readonly filtersPerApp = new Map<string, Observable<FilterCountersFilters>>();
    private readonly countersPerApp = new Map<string, Observable<FilterCounters>>();

    get notificationDebounceTime(): number {
        return this.appConfigService.get('notificationDebounceTime', 3000);
    }

    /**
     * Task and process filters of the app, loaded once and shared between the filter components,
     * so that a single place owns the filters the counters are resolved for.
     *
     * @param appName Name of the target app
     * @returns Task and process filters of the app
     */
    getFilters(appName: string): Observable<FilterCountersFilters> {
        let filters$ = this.filtersPerApp.get(appName);
        if (!filters$) {
            filters$ = combineLatest({
                [FilterCounterEntityType.TASK]: this.taskFilterCloudService.getTaskListFilters(appName).pipe(catchError(() => of([]))),
                [FilterCounterEntityType.PROCESS_INSTANCE]: this.processFilterCloudService.getProcessFilters(appName).pipe(catchError(() => of([])))
            }).pipe(shareReplay({ bufferSize: 1, refCount: false }));

            this.filtersPerApp.set(appName, filters$);
        }

        return filters$;
    }

    /**
     * Counters of every filter of the app with a counter enabled, resolved by a single request
     * shared between the filter components. Both the task and the process filters are loaded
     * before the request is built, so that one call resolves the counters of both components.
     *
     * @param appName Name of the target app
     * @returns Counters keyed by entity type and status
     */
    loadFilterCounters(appName: string): Observable<FilterCounters> {
        let counters$ = this.countersPerApp.get(appName);
        if (!counters$) {
            counters$ = this.getFilters(appName).pipe(
                take(1),
                switchMap((filters) => this.fetchFilterCounters(appName, this.buildRequest(filters))),
                catchError(() => of({} as FilterCounters)),
                shareReplay({ bufferSize: 1, refCount: false })
            );

            this.countersPerApp.set(appName, counters$);
        }

        return counters$;
    }

    /**
     * Builds the payload of the batched count request from the filters with a counter enabled.
     *
     * @param filters Task and process filters of the app
     * @returns Payload of the count request
     */
    buildRequest(filters: FilterCountersFilters): FilterCountersRequest {
        const request: FilterCountersRequest = {};

        const taskQueries = this.buildQueries(filters[FilterCounterEntityType.TASK], (filter) =>
            this.taskListCloudService.buildQueryData(new TaskFilterCloudAdapter(filter))
        );
        if (taskQueries.length) {
            request[FilterCounterEntityType.TASK] = taskQueries;
        }

        const processQueries = this.buildQueries(filters[FilterCounterEntityType.PROCESS_INSTANCE], (filter) =>
            this.processListCloudService.buildQueryData(new ProcessFilterCloudAdapter(filter))
        );
        if (processQueries.length) {
            request[FilterCounterEntityType.PROCESS_INSTANCE] = processQueries;
        }

        return request;
    }

    private buildQueries<T extends FilterCounterCandidate>(filters: T[], buildQuery: (filter: T) => FilterCountersQuery): FilterCountersQuery[] {
        return (filters ?? [])
            .filter((filter) => filter?.showCounter && this.isCounterBatched(filter))
            .map((filter) => {
                try {
                    return buildQuery(filter);
                } catch {
                    /* A filter the query cannot be built for is left out of the batch and counted on its own. */
                    return undefined;
                }
            })
            .filter((query) => !!query);
    }

    /**
     * Engine events of the app, debounced and enriched with the counters resolved by a single
     * call to the batched count endpoint. The underlying subscription and count request are
     * shared between all the subscribers of the same app.
     *
     * @param appName Name of the target app
     * @returns Debounced engine events along with the resolved counters
     */
    getFilterCountersNotifications(appName: string): Observable<FilterCountersNotification> {
        if (!appName) {
            return EMPTY;
        }

        let notifications$ = this.notificationsPerApp.get(appName);
        if (!notifications$) {
            notifications$ = defer(() => this.notificationCloudService.makeGQLQuery(appName, FILTER_COUNTERS_EVENT_SUBSCRIPTION_QUERY)).pipe(
                map((events: any) => (events?.data?.engineEvents ?? []) as TaskCloudEngineEvent[]),
                debounceTime(this.notificationDebounceTime),
                switchMap((events) =>
                    this.getFilters(appName).pipe(
                        take(1),
                        switchMap((filters) => this.fetchFilterCounters(appName, this.buildRequest(filters))),
                        map((counters) => ({ events, counters })),
                        catchError(() => of({ events, counters: {} as FilterCounters }))
                    )
                ),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.notificationsPerApp.set(appName, notifications$);
        }

        return notifications$;
    }

    /**
     * Resolves the counters of the given queries with a single request.
     *
     * @param appName Name of the target app
     * @param request Payload of the count request
     * @returns Counters keyed by entity type and status
     */
    fetchFilterCounters(appName: string, request: FilterCountersRequest): Observable<FilterCounters> {
        if (!Object.keys(request).length) {
            return of({});
        }

        const queryUrl = `${this.getBasePath(appName)}/query/v1/count`;

        return this.post<FilterCountersRequest, FilterCounters>(queryUrl, request).pipe(map((counters) => counters || {}));
    }

    /**
     * Reads the counter of a filter from a count response. The counters are keyed by status, so
     * the counter of a filter targeting more than one status is the sum of the counters of its statuses.
     * A filter targeting every status holds no status to be keyed by, so its counter is not resolved
     * by the batched request and is left to be fetched on its own.
     *
     * @param counters Counters resolved by the batched count endpoint
     * @param entityType Entity type of the filter
     * @param filter Filter the counter is read for
     * @returns The counter of the filter, or `undefined` when the response holds no counter for it
     */
    resolveFilterCounter(counters: FilterCounters, entityType: FilterCounterEntityType, filter: FilterCounterCandidate): number | undefined {
        const entityCounters = counters?.[entityType];
        const statuses = resolveFilterCounterStatuses(filter);

        if (!entityCounters || !statuses.length) {
            return undefined;
        }

        const countedStatuses = statuses.filter((status) => entityCounters[status] !== undefined);

        return countedStatuses.length ? countedStatuses.reduce((total, status) => total + entityCounters[status], 0) : undefined;
    }

    /**
     * Whether the counter of a filter is resolved by the batched count request. A filter targeting
     * every status is not, since the counters of the response are keyed by status.
     *
     * @param filter Filter with a counter enabled
     * @returns `true` when the counter of the filter is resolved by the batched request, otherwise `false`
     */
    isCounterBatched(filter: FilterCounterCandidate): boolean {
        return resolveFilterCounterStatuses(filter).length > 0;
    }
}
