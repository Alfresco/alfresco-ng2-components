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

import { inject, Injectable, Injector } from '@angular/core';
import { asapScheduler, combineLatest, defer, EMPTY, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, finalize, map, shareReplay, switchMap, take } from 'rxjs/operators';
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

const BATCHED_COUNTERS_UNAVAILABLE_STATUSES = [404, 501];

interface FilterCountersFilters {
    [FilterCounterEntityType.TASK]: TaskFilterCloudModel[];
    [FilterCounterEntityType.PROCESS_INSTANCE]: ProcessFilterCloudModel[];
}

interface EngineEventsData {
    engineEvents?: TaskCloudEngineEvent[];
}

/** One subscription per entity type, so an app showing one of them is not notified of the other. */
const ENGINE_EVENTS_SUBSCRIPTION_QUERIES: Record<FilterCounterEntityType, string> = {
    [FilterCounterEntityType.TASK]: `
    subscription {
        engineEvents(eventType: [
            TASK_COMPLETED
            TASK_ASSIGNED
            TASK_ACTIVATED
            TASK_SUSPENDED
            TASK_CANCELLED
            TASK_CREATED
        ]) {
            eventType
            entity
        }
    }
`,
    [FilterCounterEntityType.PROCESS_INSTANCE]: `
    subscription {
        engineEvents(eventType: [
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
`
};

/**
 * Resolves the counters of the task and the process filters with one batched count request, covering
 * the entity types whose counters are subscribed.
 */
@Injectable({ providedIn: 'root' })
export class FilterCountersCloudService extends BaseCloudService {
    private readonly notificationCloudService = inject(NotificationCloudService);
    private readonly taskListCloudService = inject(TaskListCloudService);
    private readonly processListCloudService = inject(ProcessListCloudService);
    /** The filter services are resolved on demand: an app showing one family must not wire the other. */
    private readonly injector = inject(Injector);

    private readonly eventsPerEntityType = new Map<string, Observable<TaskCloudEngineEvent[]>>();
    private readonly rawEventsPerEntityType = new Map<string, Observable<TaskCloudEngineEvent[]>>();
    private readonly recountPerApp = new Map<string, Subject<void>>();
    private readonly eventRecountPerApp = new Map<string, Subject<void>>();
    private readonly activeEntityTypesPerApp = new Map<string, Set<FilterCounterEntityType>>();
    private readonly subscribersPerEntityType = new Map<string, number>();
    private readonly eventSubscriptionsPerEntityType = new Map<string, Subscription>();
    private readonly appsWithoutBatchedCounters = new Set<string>();
    private readonly taskFiltersPerApp = new Map<string, Observable<TaskFilterCloudModel[]>>();
    private readonly processFiltersPerApp = new Map<string, Observable<ProcessFilterCloudModel[]>>();
    private readonly countersPerApp = new Map<string, Observable<{ counters: FilterCounters; batched: boolean }>>();

    get notificationDebounceTime(): number {
        return this.appConfigService.get('notificationDebounceTime', 3000);
    }

    /**
     * Task filters of the app, loaded once and shared with the batched count request.
     *
     * @param appName Name of the target app
     * @returns Task filters of the app
     */
    getTaskFilters(appName: string): Observable<TaskFilterCloudModel[]> {
        return this.shareFilters(this.taskFiltersPerApp, appName, () => this.injector.get(TaskFilterCloudService).getTaskListFilters(appName));
    }

    /**
     * Process filters of the app, loaded once and shared with the batched count request.
     *
     * @param appName Name of the target app
     * @returns Process filters of the app
     */
    getProcessFilters(appName: string): Observable<ProcessFilterCloudModel[]> {
        return this.shareFilters(this.processFiltersPerApp, appName, () => this.injector.get(ProcessFilterCloudService).getProcessFilters(appName));
    }

    /**
     * Counters of the filters of an entity type, resolved on subscription and kept in sync with the
     * engine events of the app. Subscribers of both entity types share one request.
     *
     * @param appName Name of the target app
     * @param entityType Entity type the counters are read for
     * @returns Counters keyed by filter key
     */
    getFilterCounters(appName: string, entityType: FilterCounterEntityType): Observable<FilterCountersResult> {
        if (!appName) {
            return EMPTY;
        }

        return defer(() => {
            this.activateEntityType(appName, entityType);

            return this.getCounters(appName);
        }).pipe(
            map(({ counters, batched }) => ({ counters: counters[entityType] ?? {}, batched })),
            finalize(() => this.deactivateEntityType(appName, entityType))
        );
    }

    /**
     * Resolves the counters of the app again, with one request.
     *
     * @param appName Name of the target app
     */
    refreshFilterCounters(appName: string): void {
        this.recount(appName);
    }

    /**
     * Debounced batches of the engine events of an entity type, shared between its subscribers.
     *
     * @param appName Name of the target app
     * @param entityType Entity type the events are read for
     * @returns Debounced batches of engine events
     */
    getEngineEvents(appName: string, entityType: FilterCounterEntityType): Observable<TaskCloudEngineEvent[]> {
        if (!appName) {
            return EMPTY;
        }

        const key = this.entityTypeKey(appName, entityType);
        let events$ = this.eventsPerEntityType.get(key);
        if (!events$) {
            events$ = this.rawEngineEvents(appName, entityType).pipe(
                debounceTime(this.notificationDebounceTime),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.eventsPerEntityType.set(key, events$);
        }

        return events$;
    }

    private rawEngineEvents(appName: string, entityType: FilterCounterEntityType): Observable<TaskCloudEngineEvent[]> {
        const key = this.entityTypeKey(appName, entityType);
        let events$ = this.rawEventsPerEntityType.get(key);
        if (!events$) {
            events$ = defer(() =>
                this.notificationCloudService.makeGQLQuery<EngineEventsData>(appName, ENGINE_EVENTS_SUBSCRIPTION_QUERIES[entityType])
            ).pipe(
                map((result) => result.data?.engineEvents ?? []),
                catchError(() => EMPTY),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.rawEventsPerEntityType.set(key, events$);
        }

        return events$;
    }

    private get notificationsEnabled(): boolean {
        return this.appConfigService.get('notifications', true);
    }

    private activateEntityType(appName: string, entityType: FilterCounterEntityType): void {
        const key = this.entityTypeKey(appName, entityType);
        const subscribers = (this.subscribersPerEntityType.get(key) ?? 0) + 1;
        this.subscribersPerEntityType.set(key, subscribers);

        if (subscribers > 1) {
            return;
        }

        const activeEntityTypes = this.activeEntityTypes(appName);
        const joinsResolvedCounters = activeEntityTypes.size > 0;
        activeEntityTypes.add(entityType);

        if (this.notificationsEnabled) {
            this.eventSubscriptionsPerEntityType.set(
                key,
                this.rawEngineEvents(appName, entityType).subscribe(() => this.eventRecountTrigger(appName).next())
            );
        }

        if (joinsResolvedCounters) {
            this.recount(appName);
        }
    }

    private deactivateEntityType(appName: string, entityType: FilterCounterEntityType): void {
        const key = this.entityTypeKey(appName, entityType);
        const subscribers = (this.subscribersPerEntityType.get(key) ?? 1) - 1;

        if (subscribers > 0) {
            this.subscribersPerEntityType.set(key, subscribers);
            return;
        }

        this.subscribersPerEntityType.delete(key);
        this.activeEntityTypes(appName).delete(entityType);
        this.eventSubscriptionsPerEntityType.get(key)?.unsubscribe();
        this.eventSubscriptionsPerEntityType.delete(key);
    }

    private activeEntityTypes(appName: string): Set<FilterCounterEntityType> {
        let activeEntityTypes = this.activeEntityTypesPerApp.get(appName);
        if (!activeEntityTypes) {
            activeEntityTypes = new Set<FilterCounterEntityType>();
            this.activeEntityTypesPerApp.set(appName, activeEntityTypes);
        }

        return activeEntityTypes;
    }

    private entityTypeKey(appName: string, entityType: FilterCounterEntityType): string {
        return `${appName}|${entityType}`;
    }

    private recount(appName: string): void {
        this.recountTrigger(appName).next();
    }

    // The filters of an entity type that fails to load are left out, so the other one is still counted.
    private getFiltersForCounters(appName: string): Observable<FilterCountersFilters> {
        const activeEntityTypes = this.activeEntityTypes(appName);

        return combineLatest({
            [FilterCounterEntityType.TASK]: activeEntityTypes.has(FilterCounterEntityType.TASK)
                ? this.getTaskFilters(appName).pipe(catchError(() => of([])))
                : of([]),
            [FilterCounterEntityType.PROCESS_INSTANCE]: activeEntityTypes.has(FilterCounterEntityType.PROCESS_INSTANCE)
                ? this.getProcessFilters(appName).pipe(catchError(() => of([])))
                : of([])
        });
    }

    private shareFilters<T>(cache: Map<string, Observable<T[]>>, appName: string, loadFilters: () => Observable<T[]>): Observable<T[]> {
        let filters$ = cache.get(appName);
        if (!filters$) {
            filters$ = defer(loadFilters).pipe(shareReplay({ bufferSize: 1, refCount: true }));
            cache.set(appName, filters$);
        }

        return filters$;
    }

    private getCounters(appName: string): Observable<{ counters: FilterCounters; batched: boolean }> {
        let counters$ = this.countersPerApp.get(appName);
        if (!counters$) {
            counters$ = this.recounts(appName).pipe(
                switchMap(() => this.resolveCounters(appName)),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.countersPerApp.set(appName, counters$);
        }

        return counters$;
    }

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
                    this.appsWithoutBatchedCounters.add(appName);
                }

                return of({ counters: {}, batched: false });
            })
        );
    }

    private recounts(appName: string): Observable<unknown> {
        return merge(
            /* Reads landing in the same task are merged, so both filter components share one request. */
            merge(of(undefined), this.recountTrigger(appName)).pipe(debounceTime(0, asapScheduler)),
            /* One debounce over every entity type, so a batch of events also results in one request. */
            this.eventRecountTrigger(appName).pipe(debounceTime(this.notificationDebounceTime))
        );
    }

    private recountTrigger(appName: string): Subject<void> {
        let recount$ = this.recountPerApp.get(appName);
        if (!recount$) {
            recount$ = new Subject<void>();
            this.recountPerApp.set(appName, recount$);
        }

        return recount$;
    }

    private eventRecountTrigger(appName: string): Subject<void> {
        let eventRecount$ = this.eventRecountPerApp.get(appName);
        if (!eventRecount$) {
            eventRecount$ = new Subject<void>();
            this.eventRecountPerApp.set(appName, eventRecount$);
        }

        return eventRecount$;
    }

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
                    return { ...buildQuery(filter), requestId: filter.key as string };
                } catch {
                    /* Left out of the batch and counted on its own. */
                    return undefined;
                }
            })
            .filter((query): query is FilterCountersQuery => !!query);
    }

    private fetchFilterCounters(appName: string, request: FilterCountersRequest): Observable<FilterCounters> {
        if (!Object.keys(request).length) {
            return of({});
        }

        const queryUrl = `${this.getBasePath(appName)}/query/v1/count`;

        return this.post<FilterCountersRequest, FilterCounters>(queryUrl, request).pipe(map((counters) => counters || {}));
    }

    // A filter without a key holds no `requestId` its counter could be keyed by.
    private isCounterBatched(filter: FilterCounterCandidate): boolean {
        return !!filter?.key;
    }
}
