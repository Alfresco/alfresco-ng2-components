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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppConfigService, NoopAuthModule } from '@alfresco/adf-core';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FilterCountersCloudService } from './filter-counters-cloud.service';
import { NotificationCloudService } from './notification-cloud.service';
import { LocalPreferenceCloudService } from './local-preference-cloud.service';
import { PROCESS_FILTERS_SERVICE_TOKEN, TASK_FILTERS_SERVICE_TOKEN } from './cloud-token.service';
import { TaskFilterCloudService } from '../task/task-filters/services/task-filter-cloud.service';
import { ProcessFilterCloudService } from '../process/process-filters/services/process-filter-cloud.service';
import { TaskFilterCloudModel } from '../task/task-filters/models/filter-cloud.model';
import { ProcessFilterCloudModel } from '../process/process-filters/models/process-filter-cloud.model';
import {
    FilterCounterEntityType,
    FilterCounters,
    FilterCountersQuery,
    FilterCountersRequest,
    FilterCountersResult
} from '../models/filter-counters-cloud.model';
import { TaskCloudEngineEvent } from '../models/engine-event-cloud.model';
import { FetchResult } from '@apollo/client/core';

type EngineEventsResult = FetchResult<{ engineEvents?: TaskCloudEngineEvent[] }>;

interface CountEndpoint {
    post: (url: string, request: FilterCountersRequest) => Observable<FilterCounters>;
}

describe('FilterCountersCloudService', () => {
    let service: FilterCountersCloudService;
    let notificationCloudService: NotificationCloudService;
    let appConfigService: AppConfigService;
    let taskEvents$: Subject<EngineEventsResult>;
    let processEvents$: Subject<EngineEventsResult>;
    let makeGQLQuerySpy: jasmine.Spy;
    let postSpy: jasmine.Spy;
    let getTaskListFiltersSpy: jasmine.Spy;
    let getProcessFiltersSpy: jasmine.Spy;

    const countRequest = (): FilterCountersRequest => postSpy.calls.mostRecent().args[1];
    const countUrl = (): string => postSpy.calls.mostRecent().args[0];
    const countQueries = (entityType: FilterCounterEntityType): FilterCountersQuery[] => countRequest()[entityType] ?? [];
    const countRequestIds = (entityType: FilterCounterEntityType): string[] => countQueries(entityType).map((query) => query.requestId);

    const countersMock: FilterCounters = {
        TASK: { 'my-tasks': 5, 'queued-tasks': 0 },
        PROCESS_INSTANCE: { 'running-processes': 5 }
    };

    const taskFilter = (filter: Partial<TaskFilterCloudModel>) =>
        new TaskFilterCloudModel({ appName: 'mock-app', sort: 'createdDate', order: 'DESC', ...filter });
    const processFilter = (filter: Partial<ProcessFilterCloudModel>) =>
        new ProcessFilterCloudModel({ appName: 'mock-app', sort: 'startDate', order: 'DESC', ...filter });

    const taskFiltersMock = [
        taskFilter({ key: 'my-tasks', status: 'ASSIGNED', assignee: 'mock-user', showCounter: true }),
        taskFilter({ key: 'queued-tasks', status: 'CREATED', showCounter: true }),
        taskFilter({ key: 'completed-tasks', status: 'COMPLETED', showCounter: false })
    ];
    const processFiltersMock = [
        processFilter({ key: 'running-processes', status: 'RUNNING', showCounter: true }),
        processFilter({ key: 'all-processes', status: '', showCounter: false })
    ];

    const engineEvents = (eventType: string): EngineEventsResult => ({
        data: { engineEvents: [{ eventType, entity: {} } as TaskCloudEngineEvent] }
    });
    const emitTaskEvent = (eventType = 'TASK_CREATED') => taskEvents$.next(engineEvents(eventType));
    const emitProcessEvent = (eventType = 'PROCESS_STARTED') => processEvents$.next(engineEvents(eventType));

    const counters = (entityType: FilterCounterEntityType, appName = 'mock-app') => firstValueFrom(service.getFilterCounters(appName, entityType));
    const taskCounters = (appName = 'mock-app') => counters(FilterCounterEntityType.TASK, appName);
    const processCounters = (appName = 'mock-app') => counters(FilterCounterEntityType.PROCESS_INSTANCE, appName);
    const bothCounters = (appName = 'mock-app') =>
        firstValueFrom(
            combineLatest([
                service.getFilterCounters(appName, FilterCounterEntityType.TASK),
                service.getFilterCounters(appName, FilterCounterEntityType.PROCESS_INSTANCE)
            ])
        );

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, ApolloTestingModule],
            providers: [
                { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService },
                { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
            ]
        });

        service = TestBed.inject(FilterCountersCloudService);
        notificationCloudService = TestBed.inject(NotificationCloudService);
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config.bpmHost = 'https://fake-bpm-host.com';

        taskEvents$ = new Subject<EngineEventsResult>();
        processEvents$ = new Subject<EngineEventsResult>();
        makeGQLQuerySpy = spyOn(notificationCloudService, 'makeGQLQuery');
        makeGQLQuerySpy.and.callFake((_appName: string, query: string) =>
            (query.includes('TASK_CREATED') ? taskEvents$ : processEvents$).asObservable()
        );
        /* `post` is protected, so it is reached through the shape it is spied on. */
        postSpy = spyOn(service as unknown as CountEndpoint, 'post').and.returnValue(of(countersMock));
        getTaskListFiltersSpy = spyOn(TestBed.inject(TaskFilterCloudService), 'getTaskListFilters').and.returnValue(of(taskFiltersMock));
        getProcessFiltersSpy = spyOn(TestBed.inject(ProcessFilterCloudService), 'getProcessFilters').and.returnValue(of(processFiltersMock));
    });

    describe('getTaskFilters / getProcessFilters', () => {
        it('should load the filters of every entity type', async () => {
            expect(await firstValueFrom(service.getTaskFilters('mock-app'))).toEqual(taskFiltersMock);
            expect(await firstValueFrom(service.getProcessFilters('mock-app'))).toEqual(processFiltersMock);
        });

        it('should load the filters of an app once for concurrent subscribers', async () => {
            await firstValueFrom(combineLatest([service.getTaskFilters('mock-app'), service.getTaskFilters('mock-app')]));
            await firstValueFrom(combineLatest([service.getProcessFilters('mock-app'), service.getProcessFilters('mock-app')]));

            expect(getTaskListFiltersSpy).toHaveBeenCalledTimes(1);
            expect(getProcessFiltersSpy).toHaveBeenCalledTimes(1);
        });

        it('should load the filters of every app', async () => {
            await firstValueFrom(service.getTaskFilters('mock-app'));
            await firstValueFrom(service.getTaskFilters('other-app'));

            expect(getTaskListFiltersSpy.calls.allArgs()).toEqual([['mock-app'], ['other-app']]);
        });

        it('should share the filters with the batched count request', async () => {
            const subscription = service.getTaskFilters('mock-app').subscribe();
            await taskCounters();
            subscription.unsubscribe();

            expect(getTaskListFiltersSpy).toHaveBeenCalledTimes(1);
        });

        it('should propagate the error of the filters that fail to load', async () => {
            getTaskListFiltersSpy.and.returnValue(throwError(() => new Error('filters failed')));

            await expectAsync(firstValueFrom(service.getTaskFilters('mock-app'))).toBeRejectedWithError('filters failed');
        });
    });

    describe('getFilterCounters', () => {
        it('should return EMPTY when appName is not set', () => {
            let completed = false;
            service.getFilterCounters('', FilterCounterEntityType.TASK).subscribe({ complete: () => (completed = true) });

            expect(completed).toBeTrue();
            expect(postSpy).not.toHaveBeenCalled();
        });

        it('should resolve the counters of both entity types with a single request', async () => {
            expect(await bothCounters()).toEqual([{ 'my-tasks': 5, 'queued-tasks': 0 }, { 'running-processes': 5 }]);

            expect(postSpy).toHaveBeenCalledTimes(1);
        });

        it('should call the batched count endpoint of the app', async () => {
            await taskCounters();

            expect(countUrl()).toBe('https://fake-bpm-host.com/mock-app/query/v1/count');
        });

        it('should identify the query of every filter by the key of the filter', async () => {
            await bothCounters();

            expect(countRequestIds(FilterCounterEntityType.TASK)).toEqual(['my-tasks', 'queued-tasks']);
            expect(countRequestIds(FilterCounterEntityType.PROCESS_INSTANCE)).toEqual(['running-processes']);
        });

        it('should send the criteria of every filter along with its request id', async () => {
            await taskCounters();

            expect(countQueries(FilterCounterEntityType.TASK)[0]).toEqual({
                requestId: 'my-tasks',
                status: ['ASSIGNED'],
                assignee: ['mock-user'],
                sort: { field: 'createdDate', direction: 'desc', isProcessVariable: false }
            });
        });

        it('should not send the filters without a counter enabled', async () => {
            await taskCounters();

            expect(countRequestIds(FilterCounterEntityType.TASK)).not.toContain('completed-tasks');
        });

        it('should send the query of a filter targeting every status', async () => {
            getProcessFiltersSpy.and.returnValue(of([processFilter({ key: 'all-processes', status: '', showCounter: true })]));

            await processCounters();

            expect(countRequestIds(FilterCounterEntityType.PROCESS_INSTANCE)).toEqual(['all-processes']);
        });

        it('should omit an entity type without filters with a counter enabled', async () => {
            getProcessFiltersSpy.and.returnValue(of([]));

            await bothCounters();

            expect(countRequest().PROCESS_INSTANCE).toBeUndefined();
        });

        it('should leave out a filter the query cannot be built for', async () => {
            getTaskListFiltersSpy.and.returnValue(
                of([taskFilter({ key: 'broken', status: 'ASSIGNED', showCounter: true, sort: undefined, order: undefined }), taskFiltersMock[1]])
            );

            await taskCounters();

            expect(countRequestIds(FilterCounterEntityType.TASK)).toEqual(['queued-tasks']);
        });

        it('should resolve the counters of an entity type when the filters of the other one fail to load', async () => {
            getProcessFiltersSpy.and.returnValue(throwError(() => new Error('filters failed')));

            await bothCounters();

            expect(countRequestIds(FilterCounterEntityType.TASK)).toEqual(['my-tasks', 'queued-tasks']);
            expect(countRequest().PROCESS_INSTANCE).toBeUndefined();
        });

        it('should resolve no counter when no filter has a counter enabled', async () => {
            getTaskListFiltersSpy.and.returnValue(of([]));
            getProcessFiltersSpy.and.returnValue(of([]));

            expect(await taskCounters()).toEqual({});
            expect(postSpy).not.toHaveBeenCalled();
        });

        describe('when the count request fails', () => {
            it('should resolve no counter, rather than breaking the stream', async () => {
                postSpy.and.returnValue(throwError(() => ({ status: 500 })));

                expect(await taskCounters()).toEqual({});
            });

            it('should keep calling the endpoint afterwards', async () => {
                postSpy.and.returnValue(throwError(() => ({ status: 404 })));
                expect(await taskCounters()).toEqual({});

                postSpy.and.returnValue(of(countersMock));
                expect(await taskCounters()).toEqual({ 'my-tasks': 5, 'queued-tasks': 0 });
                expect(postSpy).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('counters scoped to the entity types on screen', () => {
        it('should send the queries of the entity type on screen alone', async () => {
            await taskCounters();

            expect(Object.keys(countRequest())).toEqual([FilterCounterEntityType.TASK]);
        });

        it('should not load the filters of an entity type that is not on screen', async () => {
            await taskCounters();

            expect(getTaskListFiltersSpy).toHaveBeenCalled();
            expect(getProcessFiltersSpy).not.toHaveBeenCalled();
        });

        it('should send the queries of both entity types when both are on screen', async () => {
            await bothCounters();

            expect(Object.keys(countRequest())).toEqual([FilterCounterEntityType.TASK, FilterCounterEntityType.PROCESS_INSTANCE]);
        });

        it('should resolve the counters again when an entity type joins the ones on screen', fakeAsync(() => {
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(0);

            expect(Object.keys(countRequest())).toEqual([FilterCounterEntityType.TASK]);

            service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();
            tick(0);

            expect(postSpy).toHaveBeenCalledTimes(2);
            expect(Object.keys(countRequest())).toEqual([FilterCounterEntityType.TASK, FilterCounterEntityType.PROCESS_INSTANCE]);
        }));

        it('should stop covering an entity type once its counters hold no subscriber', fakeAsync(() => {
            const taskSubscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();
            tick(0);

            taskSubscription.unsubscribe();
            service.refreshFilterCounters('mock-app');
            tick(0);

            expect(Object.keys(countRequest())).toEqual([FilterCounterEntityType.PROCESS_INSTANCE]);
        }));
    });

    describe('teardown', () => {
        it('should close the engine event subscription once the counters hold no subscriber', fakeAsync(() => {
            const subscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(0);
            expect(makeGQLQuerySpy).toHaveBeenCalledTimes(1);

            subscription.unsubscribe();
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(0);

            expect(makeGQLQuerySpy).toHaveBeenCalledTimes(2);
        }));

        it('should keep the engine event subscription while another subscriber holds the same entity type', fakeAsync(() => {
            const subscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(0);

            subscription.unsubscribe();
            emitTaskEvent();
            tick(3000);

            expect(makeGQLQuerySpy).toHaveBeenCalledTimes(1);
            expect(postSpy).toHaveBeenCalledTimes(2);
        }));

        it('should release the filters subscription once nothing reads them', fakeAsync(() => {
            const filters$ = new BehaviorSubject(taskFiltersMock);
            getTaskListFiltersSpy.and.returnValue(filters$.asObservable());

            const subscriptions = [
                service.getTaskFilters('mock-app').subscribe(),
                service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe()
            ];
            tick(0);
            expect(filters$.observed).toBeTrue();

            subscriptions.forEach((subscription) => subscription.unsubscribe());

            expect(filters$.observed).toBeFalse();
        }));

        it('should resolve the counters again for a subscriber that comes after a full teardown', fakeAsync(() => {
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe().unsubscribe();
            tick(0);
            postSpy.calls.reset();

            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(0);

            expect(postSpy).toHaveBeenCalledTimes(1);
        }));
    });

    describe('refreshFilterCounters', () => {
        it('should resolve the counters again with a single request', fakeAsync(() => {
            const results: FilterCountersResult[] = [];
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => results.push(result));
            service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();
            tick(0);

            service.refreshFilterCounters('mock-app');
            tick(0);

            expect(postSpy).toHaveBeenCalledTimes(2);
            expect(results.length).toBe(2);
        }));

        it('should not resolve the counters of an app without subscribers', fakeAsync(() => {
            service.refreshFilterCounters('mock-app');
            tick(0);

            expect(postSpy).not.toHaveBeenCalled();
        }));
    });

    describe('when only one of the two filter families is wired', () => {
        const configureTasksOnly = () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [NoopAuthModule, ApolloTestingModule],
                providers: [{ provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }]
            });

            const tasksOnlyService = TestBed.inject(FilterCountersCloudService);
            TestBed.inject(AppConfigService).config.bpmHost = 'https://fake-bpm-host.com';
            spyOn(TestBed.inject(NotificationCloudService), 'makeGQLQuery').and.returnValue(new Subject<EngineEventsResult>().asObservable());
            spyOn(TestBed.inject(TaskFilterCloudService), 'getTaskListFilters').and.returnValue(of(taskFiltersMock));
            postSpy = spyOn(tasksOnlyService as unknown as CountEndpoint, 'post').and.returnValue(of(countersMock));

            return tasksOnlyService;
        };

        it('should resolve the counters of the wired family', async () => {
            const tasksOnlyService = configureTasksOnly();

            const result = await firstValueFrom(tasksOnlyService.getFilterCounters('mock-app', FilterCounterEntityType.TASK));

            expect(result).toEqual({ 'my-tasks': 5, 'queued-tasks': 0 });
        });

        it('should leave the filters of the family that is not wired out of the request', async () => {
            const tasksOnlyService = configureTasksOnly();

            await firstValueFrom(tasksOnlyService.getFilterCounters('mock-app', FilterCounterEntityType.TASK));

            expect(countRequestIds(FilterCounterEntityType.TASK)).toEqual(['my-tasks', 'queued-tasks']);
            expect(countRequest().PROCESS_INSTANCE).toBeUndefined();
        });
    });

    describe('getEngineEvents', () => {
        it('should return EMPTY when appName is not set', () => {
            let completed = false;
            service.getEngineEvents('', FilterCounterEntityType.TASK).subscribe({ complete: () => (completed = true) });

            expect(completed).toBeTrue();
            expect(makeGQLQuerySpy).not.toHaveBeenCalled();
        });

        it('should subscribe to the events of the task entity type alone', () => {
            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe();

            const [appName, query] = makeGQLQuerySpy.calls.mostRecent().args;
            expect(appName).toBe('mock-app');
            expect(query).toContain('TASK_CREATED');
            expect(query).not.toContain('PROCESS_STARTED');
        });

        it('should subscribe to the events of the process entity type alone', () => {
            service.getEngineEvents('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();

            const [, query] = makeGQLQuerySpy.calls.mostRecent().args;
            expect(query).toContain('PROCESS_STARTED');
            expect(query).not.toContain('TASK_CREATED');
        });

        it('should open a single subscription for multiple subscribers of the same entity type', () => {
            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe();

            expect(makeGQLQuerySpy).toHaveBeenCalledTimes(1);
        });

        it('should open a separate subscription per entity type', () => {
            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getEngineEvents('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();

            expect(makeGQLQuerySpy).toHaveBeenCalledTimes(2);
        });

        it('should open a separate subscription per app', () => {
            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getEngineEvents('other-app', FilterCounterEntityType.TASK).subscribe();

            expect(makeGQLQuerySpy).toHaveBeenCalledTimes(2);
        });

        it('should emit the debounced batch of events', fakeAsync(() => {
            const batches: TaskCloudEngineEvent[][] = [];
            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe((events) => batches.push(events));

            emitTaskEvent('TASK_CREATED');
            emitTaskEvent('TASK_ASSIGNED');
            tick(3000);

            expect(batches.length).toBe(1);
            expect(batches[0][0].eventType).toBe('TASK_ASSIGNED');
        }));

        it('should debounce the events using the configured debounce time', fakeAsync(() => {
            spyOnProperty(service, 'notificationDebounceTime', 'get').and.returnValue(5000);
            let emitted = false;
            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe(() => (emitted = true));

            emitTaskEvent();
            tick(3000);
            expect(emitted).toBeFalse();

            tick(2000);
            expect(emitted).toBeTrue();
        }));
    });

    describe('counters driven by the engine events', () => {
        it('should make a single count request for a batch of events of both entity types', fakeAsync(() => {
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();
            tick(0);
            postSpy.calls.reset();

            emitTaskEvent();
            emitProcessEvent();
            tick(3000);

            expect(postSpy).toHaveBeenCalledTimes(1);
        }));

        it('should make a single count request for the events of both entity types arriving apart', fakeAsync(() => {
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();
            tick(0);
            postSpy.calls.reset();

            emitTaskEvent();
            tick(1000);
            emitProcessEvent();
            tick(3000);

            expect(postSpy).toHaveBeenCalledTimes(1);
        }));

        it('should emit the counters resolved for the batch of events', fakeAsync(() => {
            const results: FilterCountersResult[] = [];
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => results.push(result));
            tick(0);

            postSpy.and.returnValue(of({ TASK: { 'my-tasks': 9 } }));
            emitTaskEvent();
            tick(3000);

            expect(results.length).toBe(2);
            expect(results[1]).toEqual({ 'my-tasks': 9 });
        }));

        it('should not subscribe to the events of an entity type that is not on screen', fakeAsync(() => {
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(0);

            expect(makeGQLQuerySpy).toHaveBeenCalledTimes(1);
            expect(makeGQLQuerySpy.calls.mostRecent().args[1]).toContain('TASK_CREATED');
        }));

        it('should not resolve the counters again on the events of an entity type that is not on screen', fakeAsync(() => {
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(0);
            postSpy.calls.reset();

            emitProcessEvent();
            tick(3000);

            expect(postSpy).not.toHaveBeenCalled();
        }));

        it('should stop resolving the counters on the events of an entity type that left the screen', fakeAsync(() => {
            const taskSubscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe();
            tick(0);

            taskSubscription.unsubscribe();
            postSpy.calls.reset();
            emitTaskEvent();
            tick(3000);

            expect(postSpy).not.toHaveBeenCalled();
        }));

        it('should not subscribe to the engine events when notifications are disabled', fakeAsync(() => {
            appConfigService.config.notifications = false;

            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe();
            tick(3000);

            expect(makeGQLQuerySpy).not.toHaveBeenCalled();
            expect(postSpy).toHaveBeenCalledTimes(1);
        }));
    });
});
