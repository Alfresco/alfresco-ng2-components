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
import { combineLatest, defer, EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, filter, finalize, map, scan, shareReplay, switchMap, take } from 'rxjs/operators';
import { BaseCloudService } from './base-cloud.service';
import { NotificationCloudService } from './notification-cloud.service';
import { FilterCountersCloudServiceInterface } from './filter-counters-cloud.service.interface';
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

interface PushedCounterValue {
    count: number;
    asOf?: string;
}

interface PushedCounterUpdate {
    filterKey: string;
    count: number;
    asOf?: string;
}

interface WebSocketCounterSubscription {
    filterKey: string;
    graphQlFieldName: string;
    subscriptionQuery: string;
}

interface EntityTypeCounters {
    [filterKey: string]: number;
}

interface ActiveFiltersByEntityType {
    [FilterCounterEntityType.TASK]: TaskFilterCloudModel[];
    [FilterCounterEntityType.PROCESS_INSTANCE]: ProcessFilterCloudModel[];
}

interface InitialCountersEvent {
    source: 'initialFetch';
    counters: EntityTypeCounters;
}

interface PushedCounterEvent {
    source: 'webSocketPush';
    filterKey: string;
    count: number;
    asOf?: string;
}

type CounterUpdateEvent = InitialCountersEvent | PushedCounterEvent;

interface CounterEntry {
    count: number;
    asOf?: string;
    source: CounterUpdateEvent['source'];
}

interface CounterEntries {
    [filterKey: string]: CounterEntry;
}

const PUSHED_COUNTER_SUBSCRIPTIONS_BY_ENTITY_TYPE: Record<FilterCounterEntityType, WebSocketCounterSubscription[]> = {
    [FilterCounterEntityType.TASK]: [
        {
            filterKey: 'my-tasks',
            graphQlFieldName: 'assignedTasks',
            subscriptionQuery: `
    subscription {
        assignedTasks {
            count
            asOf
        }
    }
`
        },
        {
            filterKey: 'queued-tasks',
            graphQlFieldName: 'queuedTasks',
            subscriptionQuery: `
    subscription {
        queuedTasks {
            count
            asOf
        }
    }
`
        }
    ],
    [FilterCounterEntityType.PROCESS_INSTANCE]: [
        {
            filterKey: 'running-processes',
            graphQlFieldName: 'runningProcesses',
            subscriptionQuery: `
    subscription {
        runningProcesses {
            count
            asOf
        }
    }
`
        }
    ]
};

@Injectable({ providedIn: 'root' })
export class QueryPushedFilterCountersCloudService extends BaseCloudService implements FilterCountersCloudServiceInterface {
    private readonly notificationCloudService = inject(NotificationCloudService);
    private readonly taskListCloudService = inject(TaskListCloudService);
    private readonly processListCloudService = inject(ProcessListCloudService);
    private readonly injector = inject(Injector);

    private readonly taskFiltersPerApp = new Map<string, Observable<TaskFilterCloudModel[]>>();
    private readonly processFiltersPerApp = new Map<string, Observable<ProcessFilterCloudModel[]>>();
    private readonly recountTriggerPerApp = new Map<string, Subject<void>>();
    private readonly entityTypeCountersPerApp = new Map<string, Observable<EntityTypeCounters>>();
    private readonly activeEntityTypesPerApp = new Map<string, Set<FilterCounterEntityType>>();
    private readonly activeSubscriberCountPerEntityType = new Map<string, number>();
    private readonly initialCountersPerApp = new Map<string, Observable<FilterCounters>>();

    getTaskFilters(appName: string): Observable<TaskFilterCloudModel[]> {
        return this.shareFilters(this.taskFiltersPerApp, appName, () => this.injector.get(TaskFilterCloudService).getTaskListFilters(appName));
    }

    getProcessFilters(appName: string): Observable<ProcessFilterCloudModel[]> {
        return this.shareFilters(this.processFiltersPerApp, appName, () => this.injector.get(ProcessFilterCloudService).getProcessFilters(appName));
    }

    getFilterCounters(appName: string, entityType: FilterCounterEntityType): Observable<FilterCountersResult> {
        if (!appName) {
            return EMPTY;
        }

        return defer(() => {
            this.activateEntityType(appName, entityType);

            return this.watchEntityTypeCounters(appName, entityType);
        }).pipe(
            map((counters: EntityTypeCounters): FilterCountersResult => ({ counters })),
            finalize(() => this.deactivateEntityType(appName, entityType))
        );
    }

    refreshFilterCounters(appName: string): void {
        this.recountTrigger(appName).next();
    }

    getEngineEvents(_appName: string, _entityType: FilterCounterEntityType): Observable<TaskCloudEngineEvent[]> {
        return EMPTY;
    }

    private watchEntityTypeCounters(appName: string, entityType: FilterCounterEntityType): Observable<EntityTypeCounters> {
        const key = this.entityTypeKey(appName, entityType);
        let entityTypeCounters$ = this.entityTypeCountersPerApp.get(key);
        if (!entityTypeCounters$) {
            const initialCountersEvents$: Observable<CounterUpdateEvent> = this.initialCounters(appName).pipe(
                map((counters: FilterCounters): InitialCountersEvent => ({
                    source: 'initialFetch',
                    counters: counters[entityType] ?? {}
                }))
            );

            const pushedCounterEvents$: Observable<CounterUpdateEvent> = this.pushedCounterUpdates(appName, entityType).pipe(
                map(({ filterKey, count, asOf }): PushedCounterEvent => ({
                    source: 'webSocketPush',
                    filterKey,
                    count,
                    asOf
                }))
            );

            entityTypeCounters$ = merge(initialCountersEvents$, pushedCounterEvents$).pipe(
                scan(this.applyCounterUpdate, {} as CounterEntries),
                map((entries: CounterEntries): EntityTypeCounters => this.toEntityTypeCounters(entries)),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.entityTypeCountersPerApp.set(key, entityTypeCounters$);
        }

        return entityTypeCounters$;
    }

    private activateEntityType(appName: string, entityType: FilterCounterEntityType): void {
        const key = this.entityTypeKey(appName, entityType);
        const activeSubscriberCount = (this.activeSubscriberCountPerEntityType.get(key) ?? 0) + 1;
        this.activeSubscriberCountPerEntityType.set(key, activeSubscriberCount);

        if (activeSubscriberCount > 1) {
            return;
        }

        const activeEntityTypes = this.activeEntityTypes(appName);
        const joinsAlreadyActiveEntityTypes = activeEntityTypes.size > 0;
        activeEntityTypes.add(entityType);

        if (joinsAlreadyActiveEntityTypes) {
            this.refreshFilterCounters(appName);
        }
    }

    private deactivateEntityType(appName: string, entityType: FilterCounterEntityType): void {
        const key = this.entityTypeKey(appName, entityType);
        const activeSubscriberCount = (this.activeSubscriberCountPerEntityType.get(key) ?? 1) - 1;

        if (activeSubscriberCount > 0) {
            this.activeSubscriberCountPerEntityType.set(key, activeSubscriberCount);
            return;
        }

        this.activeSubscriberCountPerEntityType.delete(key);
        this.activeEntityTypes(appName).delete(entityType);
    }

    private activeEntityTypes(appName: string): Set<FilterCounterEntityType> {
        let activeEntityTypes = this.activeEntityTypesPerApp.get(appName);
        if (!activeEntityTypes) {
            activeEntityTypes = new Set<FilterCounterEntityType>();
            this.activeEntityTypesPerApp.set(appName, activeEntityTypes);
        }

        return activeEntityTypes;
    }

    private initialCounters(appName: string): Observable<FilterCounters> {
        let initialCounters$ = this.initialCountersPerApp.get(appName);
        if (!initialCounters$) {
            initialCounters$ = merge(of(undefined), this.recountTrigger(appName)).pipe(
                debounceTime(0),
                switchMap(() => this.fetchActiveEntityTypesCounters(appName)),
                shareReplay({ bufferSize: 1, refCount: true })
            );
            this.initialCountersPerApp.set(appName, initialCounters$);
        }

        return initialCounters$;
    }

    private pushedCounterUpdates(appName: string, entityType: FilterCounterEntityType): Observable<PushedCounterUpdate> {
        return merge(
            ...PUSHED_COUNTER_SUBSCRIPTIONS_BY_ENTITY_TYPE[entityType].map((subscription) => this.pushedCounterUpdate(appName, subscription))
        );
    }

    private pushedCounterUpdate(appName: string, subscription: WebSocketCounterSubscription): Observable<PushedCounterUpdate> {
        return defer(() =>
            this.notificationCloudService.makeGQLQuery<{ [graphQlFieldName: string]: PushedCounterValue }>(appName, subscription.subscriptionQuery)
        ).pipe(
            map((result): PushedCounterValue | undefined => result.data?.[subscription.graphQlFieldName]),
            filter((value): value is PushedCounterValue => value?.count !== undefined),
            map((value: PushedCounterValue): PushedCounterUpdate => ({ filterKey: subscription.filterKey, count: value.count, asOf: value.asOf })),
            catchError(() => EMPTY)
        );
    }

    private readonly applyCounterUpdate = (entries: CounterEntries, event: CounterUpdateEvent): CounterEntries => {
        if (event.source === 'initialFetch') {
            const mergedEntries = { ...entries };
            Object.entries(event.counters).forEach(([filterKey, count]) => {
                if (mergedEntries[filterKey]?.source === 'webSocketPush') {
                    return;
                }
                mergedEntries[filterKey] = { count, source: 'initialFetch' };
            });

            return mergedEntries;
        }

        const existingEntry = entries[event.filterKey];
        const isOutOfOrderPush =
            existingEntry?.source === 'webSocketPush' &&
            existingEntry.asOf !== undefined &&
            event.asOf !== undefined &&
            event.asOf < existingEntry.asOf;

        if (isOutOfOrderPush) {
            return entries;
        }

        return { ...entries, [event.filterKey]: { count: event.count, asOf: event.asOf, source: 'webSocketPush' } };
    };

    private toEntityTypeCounters(entries: CounterEntries): EntityTypeCounters {
        return Object.fromEntries(Object.entries(entries).map(([filterKey, entry]) => [filterKey, entry.count]));
    }

    private fetchActiveEntityTypesCounters(appName: string): Observable<FilterCounters> {
        const activeEntityTypes = this.activeEntityTypes(appName);

        return combineLatest({
            [FilterCounterEntityType.TASK]: activeEntityTypes.has(FilterCounterEntityType.TASK)
                ? this.getTaskFilters(appName).pipe(catchError(() => of([])))
                : of([]),
            [FilterCounterEntityType.PROCESS_INSTANCE]: activeEntityTypes.has(FilterCounterEntityType.PROCESS_INSTANCE)
                ? this.getProcessFilters(appName).pipe(catchError(() => of([])))
                : of([])
        }).pipe(
            take(1),
            switchMap((filters: ActiveFiltersByEntityType) => this.fetchFilterCounters(appName, this.buildRequest(filters))),
            catchError(() => EMPTY)
        );
    }

    private buildRequest(filters: ActiveFiltersByEntityType): FilterCountersRequest {
        const request: FilterCountersRequest = {};

        const taskQueries = this.buildQueries(filters[FilterCounterEntityType.TASK], (taskFilter) =>
            this.taskListCloudService.buildQueryData(new TaskFilterCloudAdapter(taskFilter))
        );
        if (taskQueries.length) {
            request[FilterCounterEntityType.TASK] = taskQueries;
        }

        const processQueries = this.buildQueries(filters[FilterCounterEntityType.PROCESS_INSTANCE], (processFilter) =>
            this.processListCloudService.buildQueryData(new ProcessFilterCloudAdapter(processFilter))
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
            .filter((candidate) => candidate?.showCounter && !!candidate?.key)
            .map((candidate): FilterCountersQuery | undefined => {
                try {
                    return { ...buildQuery(candidate), requestId: candidate.key as string };
                } catch {
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

    private shareFilters<T>(cache: Map<string, Observable<T[]>>, appName: string, loadFilters: () => Observable<T[]>): Observable<T[]> {
        let filters$ = cache.get(appName);
        if (!filters$) {
            filters$ = defer(loadFilters).pipe(shareReplay({ bufferSize: 1, refCount: true }));
            cache.set(appName, filters$);
        }

        return filters$;
    }

    private recountTrigger(appName: string): Subject<void> {
        let recountTrigger$ = this.recountTriggerPerApp.get(appName);
        if (!recountTrigger$) {
            recountTrigger$ = new Subject<void>();
            this.recountTriggerPerApp.set(appName, recountTrigger$);
        }

        return recountTrigger$;
    }

    private entityTypeKey(appName: string, entityType: FilterCounterEntityType): string {
        return `${appName}|${entityType}`;
    }
}
