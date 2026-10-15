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
import { combineLatest, firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { QueryPushedFilterCountersCloudService } from './query-pushed-filter-counters-cloud.service';
import { NotificationCloudService } from './notification-cloud.service';
import { LocalPreferenceCloudService } from './local-preference-cloud.service';
import { PROCESS_FILTERS_SERVICE_TOKEN, TASK_FILTERS_SERVICE_TOKEN } from './cloud-token.service';
import { TaskFilterCloudService } from '../task/task-filters/services/task-filter-cloud.service';
import { ProcessFilterCloudService } from '../process/process-filters/services/process-filter-cloud.service';
import { TaskFilterCloudModel } from '../task/task-filters/models/filter-cloud.model';
import { ProcessFilterCloudModel } from '../process/process-filters/models/process-filter-cloud.model';
import { FilterCounterEntityType, FilterCounters, FilterCountersRequest } from '../models/filter-counters-cloud.model';
import type { ApolloLink } from '@apollo/client/core';

interface CountEndpoint {
    post: (url: string, request: FilterCountersRequest) => Observable<FilterCounters>;
}

describe('QueryPushedFilterCountersCloudService', () => {
    let service: QueryPushedFilterCountersCloudService;
    let notificationCloudService: NotificationCloudService;
    let appConfigService: AppConfigService;
    let assignedTasks$: Subject<ApolloLink.Result<{ assignedTasks: { count: number; asOf: string } }>>;
    let queuedTasks$: Subject<ApolloLink.Result<{ queuedTasks: { count: number; asOf: string } }>>;
    let runningProcesses$: Subject<ApolloLink.Result<{ runningProcesses: { count: number; asOf: string } }>>;
    let postSpy: jasmine.Spy;
    let getTaskListFiltersSpy: jasmine.Spy;
    let getProcessFiltersSpy: jasmine.Spy;

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

    const flushBatchedCountersDebounce = () => tick(0);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, ApolloTestingModule],
            providers: [
                { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService },
                { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
            ]
        });

        service = TestBed.inject(QueryPushedFilterCountersCloudService);
        notificationCloudService = TestBed.inject(NotificationCloudService);
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config.bpmHost = 'https://fake-bpm-host.com';

        assignedTasks$ = new Subject();
        queuedTasks$ = new Subject();
        runningProcesses$ = new Subject();
        spyOn(notificationCloudService, 'makeGQLQuery').and.callFake(((_appName: string, query: string) => {
            if (query.includes('assignedTasks')) {
                return assignedTasks$.asObservable();
            }
            if (query.includes('queuedTasks')) {
                return queuedTasks$.asObservable();
            }
            return runningProcesses$.asObservable();
        }) as typeof notificationCloudService.makeGQLQuery);
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

            expect(getTaskListFiltersSpy).toHaveBeenCalledTimes(1);
        });

        it('should load the process filters of an app once for concurrent subscribers', async () => {
            await firstValueFrom(combineLatest([service.getProcessFilters('mock-app'), service.getProcessFilters('mock-app')]));

            expect(getProcessFiltersSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('getFilterCounters', () => {
        it('should return EMPTY when appName is not set', () => {
            let completed = false;
            service.getFilterCounters('', FilterCounterEntityType.TASK).subscribe({ complete: () => (completed = true) });

            expect(completed).toBeTrue();
            expect(postSpy).not.toHaveBeenCalled();
        });

        it('should resolve the initial counters with a single call to the batched count endpoint', fakeAsync(() => {
            let taskResult: { counters: { [key: string]: number } };
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => (taskResult = result));
            flushBatchedCountersDebounce();
            expect(taskResult).toEqual({ counters: { 'my-tasks': 5, 'queued-tasks': 0 } });

            let processResult: { counters: { [key: string]: number } };
            service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE).subscribe((result) => (processResult = result));
            flushBatchedCountersDebounce();
            expect(processResult).toEqual({ counters: { 'running-processes': 5 } });

            expect(postSpy).toHaveBeenCalledTimes(2);
            expect(postSpy.calls.argsFor(0)[0]).toBe('https://fake-bpm-host.com/mock-app/query/v1/count');
        }));

        it('should resolve the counters of both entity types with a single combined request when both are active at once', fakeAsync(() => {
            let taskResult: { counters: { [key: string]: number } };
            let processResult: { counters: { [key: string]: number } };
            combineLatest([
                service.getFilterCounters('mock-app', FilterCounterEntityType.TASK),
                service.getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE)
            ]).subscribe(([task, process]) => {
                taskResult = task;
                processResult = process;
            });
            flushBatchedCountersDebounce();

            expect(taskResult).toEqual({ counters: { 'my-tasks': 5, 'queued-tasks': 0 } });
            expect(processResult).toEqual({ counters: { 'running-processes': 5 } });
            expect(postSpy).toHaveBeenCalledTimes(1);
            expect(Object.keys(postSpy.calls.mostRecent().args[1] as FilterCountersRequest)).toEqual([
                FilterCounterEntityType.TASK,
                FilterCounterEntityType.PROCESS_INSTANCE
            ]);
        }));

        it('should not call the count endpoint when no filter has a counter enabled', fakeAsync(() => {
            getTaskListFiltersSpy.and.returnValue(of([]));

            let result: { counters: { [key: string]: number } };
            service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((emitted) => (result = emitted));
            flushBatchedCountersDebounce();

            expect(result).toEqual({ counters: {} });
            expect(postSpy).not.toHaveBeenCalled();
        }));

        it('should not emit when the initial count request fails, and should still apply a later pushed count', fakeAsync(() => {
            postSpy.and.returnValue(throwError(() => new Error('count endpoint failed')));
            const results: { counters: { [key: string]: number } }[] = [];

            const subscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => results.push(result));
            flushBatchedCountersDebounce();
            expect(results).toEqual([]);

            assignedTasks$.next({ data: { assignedTasks: { count: 7, asOf: '2026-10-05T08:33:07.639977701Z' } } });

            expect(results).toEqual([{ counters: { 'my-tasks': 7 } }]);
            subscription.unsubscribe();
        }));

        it('should keep a pushed count that arrived before the initial counters response resolves', fakeAsync(() => {
            const initialCountersResponse$ = new Subject<FilterCounters>();
            postSpy.and.returnValue(initialCountersResponse$.asObservable());
            const results: { counters: { [key: string]: number } }[] = [];

            const subscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => results.push(result));
            flushBatchedCountersDebounce();

            assignedTasks$.next({ data: { assignedTasks: { count: 7, asOf: '2026-10-05T08:33:07.639977701Z' } } });
            expect(results).toEqual([{ counters: { 'my-tasks': 7 } }]);

            initialCountersResponse$.next(countersMock);
            initialCountersResponse$.complete();

            expect(results).toEqual([{ counters: { 'my-tasks': 7 } }, { counters: { 'my-tasks': 7, 'queued-tasks': 0 } }]);
            subscription.unsubscribe();
        }));

        it('should ignore an out-of-order pushed count that is older than the currently applied one', fakeAsync(() => {
            const results: { counters: { [key: string]: number } }[] = [];

            const subscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => results.push(result));
            flushBatchedCountersDebounce();

            assignedTasks$.next({ data: { assignedTasks: { count: 7, asOf: '2026-10-05T08:33:07.639977701Z' } } });
            assignedTasks$.next({ data: { assignedTasks: { count: 3, asOf: '2026-10-05T08:33:05.000000000Z' } } });

            expect(results.at(-1).counters['my-tasks']).toBe(7);
            subscription.unsubscribe();
        }));

        it('should apply the count pushed over the web socket without calling the count endpoint again', fakeAsync(() => {
            const results: { counters: { [key: string]: number } }[] = [];

            const subscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => results.push(result));
            flushBatchedCountersDebounce();

            assignedTasks$.next({ data: { assignedTasks: { count: 7, asOf: '2026-10-05T08:33:07.639977701Z' } } });

            expect(results[1].counters).toEqual({ 'my-tasks': 7, 'queued-tasks': 0 });
            expect(postSpy).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();
        }));

        it('should only patch the counter of the filter the pushed count belongs to', fakeAsync(() => {
            const results: { counters: { [key: string]: number } }[] = [];

            const subscription = service.getFilterCounters('mock-app', FilterCounterEntityType.TASK).subscribe((result) => results.push(result));
            flushBatchedCountersDebounce();

            queuedTasks$.next({ data: { queuedTasks: { count: 3, asOf: '2026-10-05T08:33:07.639977701Z' } } });

            expect(results[1].counters).toEqual({ 'my-tasks': 5, 'queued-tasks': 3 });
            subscription.unsubscribe();
        }));

        it('should apply the pushed process counter for the running processes filter', fakeAsync(() => {
            const results: { counters: { [key: string]: number } }[] = [];

            const subscription = service
                .getFilterCounters('mock-app', FilterCounterEntityType.PROCESS_INSTANCE)
                .subscribe((result) => results.push(result));
            flushBatchedCountersDebounce();

            runningProcesses$.next({ data: { runningProcesses: { count: 9, asOf: '2026-10-05T08:33:07.639977701Z' } } });

            expect(results[1].counters).toEqual({ 'running-processes': 9 });
            subscription.unsubscribe();
        }));

        it('should refetch the initial counters when a refresh is requested', fakeAsync(() => {
            const myTasksCounts: number[] = [];

            const subscription = service
                .getFilterCounters('mock-app', FilterCounterEntityType.TASK)
                .subscribe((result) => myTasksCounts.push(result.counters['my-tasks']));
            flushBatchedCountersDebounce();

            postSpy.and.returnValue(of({ TASK: { 'my-tasks': 42, 'queued-tasks': 0 } } as FilterCounters));
            service.refreshFilterCounters('mock-app');
            flushBatchedCountersDebounce();

            expect(myTasksCounts).toEqual([5, 42]);
            expect(postSpy).toHaveBeenCalledTimes(2);
            subscription.unsubscribe();
        }));
    });

    describe('getEngineEvents', () => {
        it('should return an empty stream since counters are kept in sync by the pushed counts', () => {
            const events: unknown[] = [];
            let completed = false;

            service.getEngineEvents('mock-app', FilterCounterEntityType.TASK).subscribe({
                next: (event) => events.push(event),
                complete: () => (completed = true)
            });

            expect(events).toEqual([]);
            expect(completed).toBeTrue();
        });
    });
});
