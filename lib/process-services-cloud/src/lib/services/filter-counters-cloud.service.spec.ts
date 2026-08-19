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
import { Subject } from 'rxjs';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FilterCountersCloudService } from './filter-counters-cloud.service';
import { NotificationCloudService } from './notification-cloud.service';
import { FilterCounterEntityType, FilterCounters, FilterCountersNotification } from '../models/filter-counters-cloud.model';

describe('FilterCountersCloudService', () => {
    let service: FilterCountersCloudService;
    let notificationCloudService: NotificationCloudService;
    let appConfigService: AppConfigService;
    let engineEvents$: Subject<any>;
    let makeGQLQuerySpy: jasmine.Spy;
    let postSpy: jasmine.Spy;

    const countersMock: FilterCounters = {
        TASK: { ASSIGNED: 5, CREATED: 0 },
        PROCESS_INSTANCE: { RUNNING: 5 }
    };

    const emitEvent = (eventType = 'TASK_CREATED') => engineEvents$.next({ data: { engineEvents: [{ eventType, entity: {} }] } });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, ApolloTestingModule]
        });

        service = TestBed.inject(FilterCountersCloudService);
        notificationCloudService = TestBed.inject(NotificationCloudService);
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config.bpmHost = 'https://fake-bpm-host.com';

        engineEvents$ = new Subject<any>();
        makeGQLQuerySpy = spyOn(notificationCloudService, 'makeGQLQuery').and.returnValue(engineEvents$.asObservable() as any);
        postSpy = spyOn<any>(service, 'post').and.returnValue(new Subject<FilterCounters>().asObservable());

        service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'], assignee: ['mock-user'] }, { status: ['CREATED'] }]);
        service.registerFilters(FilterCounterEntityType.PROCESS_INSTANCE, [{ status: ['RUNNING'] }]);
    });

    it('should return EMPTY when appName is not set', () => {
        let completed = false;
        service.getFilterCountersNotifications('').subscribe({ complete: () => (completed = true) });

        expect(completed).toBeTrue();
        expect(makeGQLQuerySpy).not.toHaveBeenCalled();
    });

    it('should open a single subscription for multiple subscribers of the same app', () => {
        service.getFilterCountersNotifications('mock-app').subscribe();
        service.getFilterCountersNotifications('mock-app').subscribe();

        expect(makeGQLQuerySpy).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to both the task and the process engine events', () => {
        service.getFilterCountersNotifications('mock-app').subscribe();

        const [appName, query] = makeGQLQuerySpy.calls.mostRecent().args;
        expect(appName).toBe('mock-app');
        expect(query).toContain('TASK_CREATED');
        expect(query).toContain('PROCESS_STARTED');
    });

    it('should open a separate subscription per app', () => {
        service.getFilterCountersNotifications('mock-app').subscribe();
        service.getFilterCountersNotifications('other-app').subscribe();

        expect(makeGQLQuerySpy).toHaveBeenCalledTimes(2);
    });

    it('should make a single count request for a batch of events received by multiple subscribers', fakeAsync(() => {
        postSpy.and.returnValue(new Subject<FilterCounters>().asObservable());
        service.getFilterCountersNotifications('mock-app').subscribe();
        service.getFilterCountersNotifications('mock-app').subscribe();

        emitEvent('TASK_CREATED');
        emitEvent('PROCESS_STARTED');
        tick(3000);

        expect(postSpy).toHaveBeenCalledTimes(1);
    }));

    it('should call the batched count endpoint with the queries of the registered filters', fakeAsync(() => {
        service.getFilterCountersNotifications('mock-app').subscribe();

        emitEvent();
        tick(3000);

        const [url, body] = postSpy.calls.mostRecent().args;
        expect(url).toBe('https://fake-bpm-host.com/mock-app/query/v1/count');
        expect(body).toEqual({
            TASK: [{ status: ['ASSIGNED'], assignee: ['mock-user'] }, { status: ['CREATED'] }],
            PROCESS_INSTANCE: [{ status: ['RUNNING'] }]
        });
    }));

    it('should send the full criteria of every registered filter', fakeAsync(() => {
        service.registerFilters(FilterCounterEntityType.TASK, [
            { status: ['ASSIGNED'], assignee: ['mock-user'] },
            { status: ['ASSIGNED'], priority: ['4'], dueDateFrom: '2026-01-01' },
            { status: ['SUSPENDED', 'CREATED'], processVariableFilters: [{ name: 'amount', value: '10' }] }
        ]);
        service.getFilterCountersNotifications('mock-app').subscribe();

        emitEvent();
        tick(3000);

        const [, body] = postSpy.calls.mostRecent().args;
        expect(body.TASK.length).toBe(3);
        expect(body.TASK[1]).toEqual({ status: ['ASSIGNED'], priority: ['4'], dueDateFrom: '2026-01-01' });
        expect(body.TASK[2]).toEqual({ status: ['SUSPENDED', 'CREATED'], processVariableFilters: [{ name: 'amount', value: '10' }] });
    }));

    it('should replace the previously registered queries of an entity type', fakeAsync(() => {
        service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['COMPLETED'] }]);
        service.getFilterCountersNotifications('mock-app').subscribe();

        emitEvent();
        tick(3000);

        const [, body] = postSpy.calls.mostRecent().args;
        expect(body.TASK).toEqual([{ status: ['COMPLETED'] }]);
    }));

    it('should not call the batched count endpoint when no filter is registered', fakeAsync(() => {
        service.registerFilters(FilterCounterEntityType.TASK, []);
        service.registerFilters(FilterCounterEntityType.PROCESS_INSTANCE, []);
        let notification: FilterCountersNotification;
        service.getFilterCountersNotifications('mock-app').subscribe((result) => (notification = result));

        emitEvent();
        tick(3000);

        expect(postSpy).not.toHaveBeenCalled();
        expect(notification.counters).toEqual({});
    }));

    it('should omit the entity type of an entity without registered filters', fakeAsync(() => {
        service.registerFilters(FilterCounterEntityType.PROCESS_INSTANCE, []);
        service.getFilterCountersNotifications('mock-app').subscribe();

        emitEvent();
        tick(3000);

        const [, body] = postSpy.calls.mostRecent().args;
        expect(body.PROCESS_INSTANCE).toBeUndefined();
        expect(body.TASK.length).toBe(2);
    }));

    it('should debounce the events using the configured debounce time', fakeAsync(() => {
        spyOn(appConfigService, 'get').and.callFake((key: string, defaultValue: any) => (key === 'notificationDebounceTime' ? 5000 : defaultValue));
        service.getFilterCountersNotifications('mock-app').subscribe();

        emitEvent();
        tick(3000);
        expect(postSpy).not.toHaveBeenCalled();

        tick(2000);
        expect(postSpy).toHaveBeenCalledTimes(1);
    }));

    it('should emit the events along with the resolved counters', fakeAsync(() => {
        const counters$ = new Subject<FilterCounters>();
        postSpy.and.returnValue(counters$.asObservable());
        let notification: FilterCountersNotification;
        service.getFilterCountersNotifications('mock-app').subscribe((result) => (notification = result));

        emitEvent('TASK_ASSIGNED');
        tick(3000);
        counters$.next(countersMock);

        expect(notification.counters).toEqual(countersMock);
        expect(notification.events.length).toBe(1);
        expect(notification.events[0].eventType).toBe('TASK_ASSIGNED');
    }));

    it('should emit the events with empty counters when the count request fails', fakeAsync(() => {
        const counters$ = new Subject<FilterCounters>();
        postSpy.and.returnValue(counters$.asObservable());
        let notification: FilterCountersNotification;
        service.getFilterCountersNotifications('mock-app').subscribe((result) => (notification = result));

        emitEvent();
        tick(3000);
        counters$.error(new Error('count failed'));

        expect(notification.counters).toEqual({});
        expect(notification.events.length).toBe(1);
    }));

    it('should keep emitting after a failed count request', fakeAsync(() => {
        const notifications: FilterCountersNotification[] = [];
        service.getFilterCountersNotifications('mock-app').subscribe((result) => notifications.push(result));

        postSpy.and.callFake(() => {
            const counters$ = new Subject<FilterCounters>();
            setTimeout(() => counters$.error(new Error('count failed')));
            return counters$.asObservable();
        });
        emitEvent();
        tick(3000);
        tick(0);

        postSpy.and.callFake(() => {
            const counters$ = new Subject<FilterCounters>();
            setTimeout(() => counters$.next(countersMock));
            return counters$.asObservable();
        });
        emitEvent();
        tick(3000);
        tick(0);

        expect(notifications.length).toBe(2);
        expect(notifications[1].counters).toEqual(countersMock);
    }));

    describe('loadFilterCounters', () => {
        beforeEach(() => {
            postSpy.and.returnValue(of(countersMock));
        });

        it('should resolve the counters of both entity types with a single request', fakeAsync(() => {
            service.expectFilters(FilterCounterEntityType.TASK);
            service.expectFilters(FilterCounterEntityType.PROCESS_INSTANCE);
            const taskCounters: FilterCounters[] = [];
            const processCounters: FilterCounters[] = [];

            // both components load their filter lists independently and subscribe before registering
            service.loadFilterCounters('mock-app').subscribe((counters) => taskCounters.push(counters));
            service.loadFilterCounters('mock-app').subscribe((counters) => processCounters.push(counters));
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'] }]);
            service.registerFilters(FilterCounterEntityType.PROCESS_INSTANCE, [{ status: ['RUNNING'] }]);
            tick(1000);

            expect(postSpy).toHaveBeenCalledTimes(1);
            expect(taskCounters).toEqual([countersMock]);
            expect(processCounters).toEqual([countersMock]);
        }));

        it('should send the queries of every entity type in one request', fakeAsync(() => {
            service.expectFilters(FilterCounterEntityType.TASK);
            service.expectFilters(FilterCounterEntityType.PROCESS_INSTANCE);

            service.loadFilterCounters('mock-app').subscribe();
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'] }, { status: ['CREATED'] }]);
            service.registerFilters(FilterCounterEntityType.PROCESS_INSTANCE, [{ status: ['RUNNING'] }]);
            tick(1000);

            const [url, body] = postSpy.calls.mostRecent().args;
            expect(url).toBe('https://fake-bpm-host.com/mock-app/query/v1/count');
            expect(body).toEqual({
                TASK: [{ status: ['ASSIGNED'] }, { status: ['CREATED'] }],
                PROCESS_INSTANCE: [{ status: ['RUNNING'] }]
            });
        }));

        it('should wait for every expected entity type before sending the request', fakeAsync(() => {
            service.expectFilters(FilterCounterEntityType.TASK);
            service.expectFilters(FilterCounterEntityType.PROCESS_INSTANCE);

            service.loadFilterCounters('mock-app').subscribe();
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'] }]);

            expect(postSpy).not.toHaveBeenCalled();

            service.registerFilters(FilterCounterEntityType.PROCESS_INSTANCE, [{ status: ['RUNNING'] }]);

            expect(postSpy).toHaveBeenCalledTimes(1);
            tick(1000);
        }));

        it('should send the request once the only expected entity type registers', fakeAsync(() => {
            service.expectFilters(FilterCounterEntityType.TASK);

            service.loadFilterCounters('mock-app').subscribe();
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'] }]);

            expect(postSpy).toHaveBeenCalledTimes(1);
            const [, body] = postSpy.calls.mostRecent().args;
            expect(body.PROCESS_INSTANCE).toBeUndefined();
            tick(1000);
        }));

        it('should not wait longer than the max wait for a missing registration', fakeAsync(() => {
            service.expectFilters(FilterCounterEntityType.TASK);
            service.expectFilters(FilterCounterEntityType.PROCESS_INSTANCE);
            let counters: FilterCounters;

            // the process filters fail to load, so they never register
            service.loadFilterCounters('mock-app').subscribe((result) => (counters = result));
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'] }]);

            expect(postSpy).not.toHaveBeenCalled();

            tick(1000);

            expect(postSpy).toHaveBeenCalledTimes(1);
            expect(counters).toEqual(countersMock);
        }));

        it('should use the max wait from the app config', fakeAsync(() => {
            spyOn(appConfigService, 'get').and.callFake((key: string, defaultValue: any) =>
                key === 'filterCounterBatchMaxWait' ? 5000 : defaultValue
            );
            service.expectFilters(FilterCounterEntityType.TASK);
            service.expectFilters(FilterCounterEntityType.PROCESS_INSTANCE);

            service.loadFilterCounters('mock-app').subscribe();
            tick(1000);
            expect(postSpy).not.toHaveBeenCalled();

            tick(4000);
            expect(postSpy).toHaveBeenCalledTimes(1);
        }));

        it('should emit empty counters when the request fails', fakeAsync(() => {
            postSpy.and.returnValue(throwError(() => new Error('count failed')));
            service.expectFilters(FilterCounterEntityType.TASK);
            let counters: FilterCounters;

            service.loadFilterCounters('mock-app').subscribe((result) => (counters = result));
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'] }]);
            tick(1000);

            expect(counters).toEqual({});
        }));

        it('should start a new batch for a subsequent load of another app', fakeAsync(() => {
            service.expectFilters(FilterCounterEntityType.TASK);

            service.loadFilterCounters('mock-app').subscribe();
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['ASSIGNED'] }]);
            tick(1000);

            service.loadFilterCounters('other-app').subscribe();
            service.registerFilters(FilterCounterEntityType.TASK, [{ status: ['CREATED'] }]);
            tick(1000);

            expect(postSpy).toHaveBeenCalledTimes(2);
            expect(postSpy.calls.allArgs().map(([url]) => url)).toEqual([
                'https://fake-bpm-host.com/mock-app/query/v1/count',
                'https://fake-bpm-host.com/other-app/query/v1/count'
            ]);
        }));
    });

    describe('resolveFilterCounter', () => {
        it('should resolve the counter of a filter by its status', () => {
            expect(service.resolveFilterCounter(countersMock, FilterCounterEntityType.TASK, { key: 'my-tasks', status: 'ASSIGNED' })).toBe(5);
            expect(service.resolveFilterCounter(countersMock, FilterCounterEntityType.TASK, { key: 'queued', statuses: ['CREATED'] })).toBe(0);
            expect(service.resolveFilterCounter(countersMock, FilterCounterEntityType.PROCESS_INSTANCE, { key: 'running', status: 'RUNNING' })).toBe(
                5
            );
        });

        it('should sum the counters of a filter targeting more than one status', () => {
            expect(service.resolveFilterCounter(countersMock, FilterCounterEntityType.TASK, { key: 'mine', statuses: ['ASSIGNED', 'CREATED'] })).toBe(
                5
            );
            expect(
                service.resolveFilterCounter({ TASK: { ASSIGNED: 5, CREATED: 2, SUSPENDED: 3 } }, FilterCounterEntityType.TASK, {
                    key: 'mine',
                    statuses: ['ASSIGNED', 'SUSPENDED']
                })
            ).toBe(8);
        });

        it('should resolve the counter from the statuses held by the response', () => {
            expect(
                service.resolveFilterCounter(countersMock, FilterCounterEntityType.TASK, { key: 'mine', statuses: ['ASSIGNED', 'COMPLETED'] })
            ).toBe(5);
        });

        it('should not resolve the counter of a filter not held by the response', () => {
            expect(service.resolveFilterCounter(countersMock, FilterCounterEntityType.TASK, { key: 'done', status: 'COMPLETED' })).toBeUndefined();
            expect(service.resolveFilterCounter({}, FilterCounterEntityType.TASK, { key: 'my-tasks', status: 'ASSIGNED' })).toBeUndefined();
        });

        it('should not resolve the counter of a filter targeting every status', () => {
            expect(service.resolveFilterCounter(countersMock, FilterCounterEntityType.TASK, { key: 'all', status: '' })).toBeUndefined();
            expect(service.resolveFilterCounter(countersMock, FilterCounterEntityType.TASK, { key: 'all', statuses: [] })).toBeUndefined();
        });
    });

    describe('isCounterBatched', () => {
        it('should batch the counter of a filter targeting one or more statuses', () => {
            expect(service.isCounterBatched({ key: 'my-tasks', status: 'ASSIGNED' })).toBeTrue();
            expect(service.isCounterBatched({ key: 'mine', statuses: ['ASSIGNED', 'SUSPENDED'] })).toBeTrue();
        });

        it('should not batch the counter of a filter targeting every status', () => {
            expect(service.isCounterBatched({ key: 'all', status: '' })).toBeFalse();
            expect(service.isCounterBatched({ key: 'all', statuses: [] })).toBeFalse();
            expect(service.isCounterBatched({ key: 'all' })).toBeFalse();
        });
    });
});
