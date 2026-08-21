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
import { combineLatest, defer, EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { BaseCloudService } from './base-cloud.service';
import { NotificationCloudService } from './notification-cloud.service';
import { TaskCloudEngineEvent } from '../models/engine-event-cloud.model';
import { TaskFilterCloudService } from '../task/task-filters/services/task-filter-cloud.service';
import { ProcessFilterCloudService } from '../process/process-filters/services/process-filter-cloud.service';
import { TaskListCloudService } from '../task/task-list/services/task-list-cloud.service';
import { ProcessListCloudService } from '../process/process-list/services/process-list-cloud.service';
import { TaskFilterCloudAdapter } from '../models/filter-cloud-model';
import { TaskFilterCloudModel } from '../task/task-filters/models/filter-cloud.model';
import { ProcessFilterCloudModel } from '../process/process-filters/models/process-filter-cloud.model';
import { ProcessFilterCloudAdapter } from '../process/process-list/models/process-cloud-query-request.model';
import {
    FilterCounterCandidate,
    FilterCounterEntityType,
    FilterCounters,
    FilterCountersQuery,
    FilterCountersRequest,
    FilterCountersResult
} from '../models/filter-counters-cloud.model';
import { FetchResult } from '@apollo/client/core';

/**
 * Single subscription covering both the task and the process engine events, so that a batch of
 * events results in one call to the batched count endpoint.
 */
const BATCHED_COUNTERS_UNAVAILABLE_STATUSES = [404, 501];

/** Filters of both entity types, to resolve the counters of both filter components with one request. */
interface FilterCountersFilters {
    [FilterCounterEntityType.TASK]: TaskFilterCloudModel[];
    [FilterCounterEntityType.PROCESS_INSTANCE]: ProcessFilterCloudModel[];
}

/** Payload of the engine event subscription. */
type EngineEventsResult = FetchResult<{ engineEvents?: TaskCloudEngineEvent[] }>;

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
 * Central place handling the filter counters of the task and the process filter components: it owns
 * the filters of both components and a single engine event subscription, debounced into one batched
 * count request.
 *
 * Loading the filters here is what keeps the counters of both components resolved by one request,
 * both on load and on every batch of engine events.
 */
@Injectable({ providedIn: 'root' })
export class FilterCountersCloudService extends BaseCloudService {
    private readonly notificationCloudService = inject(NotificationCloudService);

    private readonly taskFilterCloudService = inject(TaskFilterCloudService);
    private readonly processFilterCloudService = inject(ProcessFilterCloudService);
    private readonly taskListCloudService = inject(TaskListCloudService);
    private readonly processListCloudService = inject(ProcessListCloudService);

    private readonly eventsPerApp = new Map<string, Observable<TaskCloudEngineEvent[]>>();
    private readonly refreshPerApp = new Map<string, Subject<void>>();
    private readonly appsWithoutBatchedCounters = new Set<string>();
    private readonly taskFiltersPerApp = new Map<string, Observable<TaskFilterCloudModel[]>>();
    private readonly processFiltersPerApp = new Map<string, Observable<ProcessFilterCloudModel[]>>();
    private readonly countersPerApp = new Map<string, Observable<{ counters: FilterCounters; batched: boolean }>>();

    get notificationDebounceTime(): number {
        return this.appConfigService.get('notificationDebounceTime', 3000);
    }

    /**
     * Task filters of the app, loaded once and shared between the task filter component and the
     * batched count request, so that one place owns the filters the counters are resolved for.
     *
     * @param appName Name of the target app
     * @returns Task filters of the app
     */
    getTaskFilters(appName: string): Observable<TaskFilterCloudModel[]> {
        return this.shareFilters(this.taskFiltersPerApp, appName, () => this.taskFilterCloudService.getTaskListFilters(appName));
    }

    /**
     * Process filters of the app, loaded once and shared between the process filter component and
     * the batched count request.
     *
     * @param appName Name of the target app
     * @returns Process filters of the app
     */
    getProcessFilters(appName: string): Observable<ProcessFilterCloudModel[]> {
        return this.shareFilters(this.processFiltersPerApp, appName, () => this.processFilterCloudService.getProcessFilters(appName));
    }

    /**
     * Counters of the filters of an entity type, resolved by the request shared with the filters of
     * the other entity type: once on subscription, then on every debounced batch of engine events
     * and on every `refreshFilterCounters` call.
     *
     * @param appName Name of the target app
     * @param entityType Entity type the counters are read for
     * @returns Counters of the filters of the entity type, keyed by filter key
     */
    getFilterCounters(appName: string, entityType: FilterCounterEntityType): Observable<FilterCountersResult> {
        if (!appName) {
            return EMPTY;
        }

        return this.getCounters(appName).pipe(map(({ counters, batched }) => ({ counters: counters[entityType] ?? {}, batched })));
    }

    /**
     * Resolves the counters of the filters of the app again, for both entity types with one request.
     *
     * @param appName Name of the target app
     */
    refreshFilterCounters(appName: string): void {
        this.getRefreshTrigger(appName).next();
    }

    /**
     * Debounced batches of engine events of the app, shared between all the subscribers of the app.
     *
     * @param appName Name of the target app
     * @returns Debounced batches of engine events
     */
    getEngineEvents(appName: string): Observable<TaskCloudEngineEvent[]> {
        if (!appName) {
            return EMPTY;
        }

        let events$ = this.eventsPerApp.get(appName);
        if (!events$) {
            events$ = defer(() => this.notificationCloudService.makeGQLQuery(appName, FILTER_COUNTERS_EVENT_SUBSCRIPTION_QUERY)).pipe(
                map((result: EngineEventsResult) => result.data?.engineEvents ?? []),
                debounceTime(this.notificationDebounceTime),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.eventsPerApp.set(appName, events$);
        }

        return events$;
    }

    private get notificationsEnabled(): boolean {
        return this.appConfigService.get('notifications', true);
    }

    /**
     * Filters of both entity types, to resolve the counters of both filter components with one
     * request. The filters of an entity type that fails to load are left out, so that the counters
     * of the other entity type are still resolved.
     *
     * @param appName Name of the target app
     * @returns Task and process filters of the app
     */
    private getFiltersForCounters(appName: string): Observable<FilterCountersFilters> {
        return combineLatest({
            [FilterCounterEntityType.TASK]: this.getTaskFilters(appName).pipe(catchError(() => of([]))),
            [FilterCounterEntityType.PROCESS_INSTANCE]: this.getProcessFilters(appName).pipe(catchError(() => of([])))
        });
    }

    private shareFilters<T>(cache: Map<string, Observable<T[]>>, appName: string, loadFilters: () => Observable<T[]>): Observable<T[]> {
        let filters$ = cache.get(appName);
        if (!filters$) {
            filters$ = defer(loadFilters).pipe(shareReplay({ bufferSize: 1, refCount: false }));
            cache.set(appName, filters$);
        }

        return filters$;
    }

    /**
     * Counters of both entity types, resolved by one request shared between the filter components.
     * The request is sent on subscription and on every trigger of the app: a batch of engine events,
     * or a refresh.
     *
     * @param appName Name of the target app
     * @returns Counters of both entity types
     */
    private getCounters(appName: string): Observable<{ counters: FilterCounters; batched: boolean }> {
        let counters$ = this.countersPerApp.get(appName);
        if (!counters$) {
            const triggers: Observable<unknown>[] = [of(undefined), this.getRefreshTrigger(appName)];
            if (this.notificationsEnabled) {
                triggers.push(this.getEngineEvents(appName));
            }

            counters$ = merge(...triggers).pipe(
                switchMap(() => this.resolveCounters(appName)),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.countersPerApp.set(appName, counters$);
        }

        return counters$;
    }

    /**
     * Sends one count request for the filters of both entity types. A backend without the batched
     * count endpoint resolves no counter, so that the filter components fall back to the counters
     * resolved one filter at a time.
     *
     * @param appName Name of the target app
     * @returns Counters of both entity types
     */
    private resolveCounters(appName: string): Observable<{ counters: FilterCounters; batched: boolean }> {
        if (this.appsWithoutBatchedCounters.has(appName)) {
            return of({ counters: {}, batched: false });
        }

        return this.getFiltersForCounters(appName).pipe(
            take(1),
            switchMap((filters) => this.fetchFilterCounters(appName, this.buildRequest(filters))),
            map((counters) => ({ counters, batched: true })),
            catchError((error) => {
                if (BATCHED_COUNTERS_UNAVAILABLE_STATUSES.includes(error?.status)) {
                    /* The backend of the app holds no batched count endpoint, so it is not asked again. */
                    this.appsWithoutBatchedCounters.add(appName);
                }

                return of({ counters: {}, batched: false });
            })
        );
    }

    private getRefreshTrigger(appName: string): Subject<void> {
        let refresh$ = this.refreshPerApp.get(appName);
        if (!refresh$) {
            refresh$ = new Subject<void>();
            this.refreshPerApp.set(appName, refresh$);
        }

        return refresh$;
    }

    /**
     * Builds the payload of the batched count request from the filters with a counter enabled.
     *
     * @param filters Task and process filters of the app
     * @returns Payload of the count request
     */
    private buildRequest(filters: FilterCountersFilters): FilterCountersRequest {
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

    private buildQueries<T extends FilterCounterCandidate>(
        filters: T[],
        buildQuery: (filter: T) => Omit<FilterCountersQuery, 'requestId'>
    ): FilterCountersQuery[] {
        return (filters ?? [])
            .filter((filter) => filter?.showCounter && this.isCounterBatched(filter))
            .map((filter) => {
                try {
                    /* Only the filters holding a key reach this point, so every query is identified by one. */
                    return { ...buildQuery(filter), requestId: filter.key as string };
                } catch {
                    /* A filter the query cannot be built for is left out of the batch and counted on its own. */
                    return undefined;
                }
            })
            .filter((query): query is FilterCountersQuery => !!query);
    }

    /**
     * Resolves the counters of the given queries with a single request.
     *
     * @param appName Name of the target app
     * @param request Payload of the count request
     * @returns Counters keyed by entity type and status
     */
    private fetchFilterCounters(appName: string, request: FilterCountersRequest): Observable<FilterCounters> {
        if (!Object.keys(request).length) {
            return of({});
        }

        const queryUrl = `${this.getBasePath(appName)}/query/v1/count`;

        return this.post<FilterCountersRequest, FilterCounters>(queryUrl, request).pipe(map((counters) => counters || {}));
    }

    /**
     * Whether the counter of a filter is resolved by the batched count request. A filter without a
     * key holds no `requestId` its counter could be keyed by, so it is left to be fetched on its own.
     *
     * @param filter Filter with a counter enabled
     * @returns `true` when the counter of the filter is resolved by the batched request, otherwise `false`
     */
    private isCounterBatched(filter: FilterCounterCandidate): boolean {
        return !!filter?.key;
    }
}
