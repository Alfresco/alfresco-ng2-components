/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { LogService } from '../../common/services/log.service';
import { ClockSyncResult, TimeSyncService } from './time-sync.service';

const SERVER_NOW = Date.UTC(2025, 0, 15, 12, 0, 0);
const SERVER_TIME_URL = '/api/server-time';

type ClockDirection = 'behind' | 'ahead';

interface ClockSkewScenario {
    id: string;
    description: string;
    skewSeconds: number;
    direction: ClockDirection;
}

interface AppConfigOptions {
    timeSync?: boolean | string;
    serverTimeUrl?: unknown;
}

describe('TimeSyncService', () => {
    let service: TimeSyncService;
    let httpMock: HttpTestingController;
    let appConfigGetSpy: jasmine.Spy;

    const clockSkewScenarios: ClockSkewScenario[] = [
        { id: 'TC-01', description: 'baseline login with an accurate clock', skewSeconds: 0, direction: 'behind' },
        { id: 'TC-02', description: 'login with a slow clock 119s behind', skewSeconds: 119, direction: 'behind' },
        { id: 'TC-03', description: 'login with a slow clock 120s behind', skewSeconds: 120, direction: 'behind' },
        { id: 'TC-04', description: 'login with a slow clock 121s behind', skewSeconds: 121, direction: 'behind' },
        { id: 'TC-05', description: 'login with a slow clock 3m58s behind', skewSeconds: 238, direction: 'behind' },
        { id: 'TC-06', description: 'login with a fast clock 119s ahead', skewSeconds: 119, direction: 'ahead' },
        { id: 'TC-07', description: 'login with a fast clock 120s ahead', skewSeconds: 120, direction: 'ahead' },
        { id: 'TC-08', description: 'login with a fast clock 121s ahead', skewSeconds: 121, direction: 'ahead' },
        { id: 'TC-09', description: 'login with a fast clock 3m58s ahead', skewSeconds: 238, direction: 'ahead' },
        { id: 'TC-10', description: 'runtime drift 119s behind after login', skewSeconds: 119, direction: 'behind' },
        { id: 'TC-11', description: 'runtime drift 120s behind after login', skewSeconds: 120, direction: 'behind' },
        { id: 'TC-12', description: 'runtime drift 121s behind after login', skewSeconds: 121, direction: 'behind' },
        { id: 'TC-13', description: 'runtime drift 3m58s behind after login', skewSeconds: 238, direction: 'behind' },
        { id: 'TC-14', description: 'runtime drift 119s ahead after login', skewSeconds: 119, direction: 'ahead' },
        { id: 'TC-15', description: 'runtime drift 120s ahead after login', skewSeconds: 120, direction: 'ahead' },
        { id: 'TC-16', description: 'runtime drift 121s ahead after login', skewSeconds: 121, direction: 'ahead' },
        { id: 'TC-17', description: 'runtime drift 3m58s ahead after login', skewSeconds: 238, direction: 'ahead' },
        { id: 'TC-18', description: 'browser refresh while 3m58s behind', skewSeconds: 238, direction: 'behind' },
        { id: 'TC-19', description: 'browser refresh while 3m58s ahead', skewSeconds: 238, direction: 'ahead' },
        { id: 'TC-20', description: 'multiple tabs while 3m58s behind', skewSeconds: 238, direction: 'behind' },
        { id: 'TC-21', description: 'idle session while 3m58s behind', skewSeconds: 238, direction: 'behind' },
        { id: 'TC-22', description: 'idle session while 3m58s ahead', skewSeconds: 238, direction: 'ahead' },
        { id: 'TC-23', description: 'time API failure while up to 120s behind', skewSeconds: 120, direction: 'behind' },
        { id: 'TC-24', description: 'time API failure while up to 120s ahead', skewSeconds: 120, direction: 'ahead' },
        { id: 'TC-25', description: 'relogin after logout while 3m58s behind', skewSeconds: 238, direction: 'behind' },
        { id: 'TC-26', description: 'relogin after logout while 3m58s ahead', skewSeconds: 238, direction: 'ahead' }
    ];

    const configureApp = ({ timeSync = true, serverTimeUrl = SERVER_TIME_URL }: AppConfigOptions = {}): void => {
        appConfigGetSpy.and.callFake(<T>(key: string, defaultValue?: T): T => {
            if (key === AppConfigValues.OAUTHCONFIG) {
                return timeSync === undefined ? ({} as T) : ({ timeSync } as T);
            }

            if (key === AppConfigValues.SERVER_TIME_URL) {
                return serverTimeUrl as T;
            }

            return defaultValue as T;
        });
    };

    const rawLocalInstantFor = (skewSeconds: number, direction: ClockDirection): number =>
        direction === 'behind' ? SERVER_NOW - skewSeconds * 1000 : SERVER_NOW + skewSeconds * 1000;

    const expectedOffsetFor = (localNow: number, serverNow: number = SERVER_NOW): number => serverNow - localNow;

    const expectServerTimeRequest = (url = SERVER_TIME_URL): TestRequest => {
        const request = httpMock.expectOne(url);

        expect(request.request.method).toBe('GET');
        expect(request.request.responseType).toBe('text');

        return request;
    };

    const syncWithServerTime = async (localNow: number, serverNow: number = SERVER_NOW): Promise<ClockSyncResult> => {
        spyOn(Date, 'now').and.returnValues(localNow, localNow, localNow);

        const sync = firstValueFrom(service.syncClockOffsetResult());
        expectServerTimeRequest().flush(`${serverNow}`);

        return sync;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeSyncService, provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(TimeSyncService);
        httpMock = TestBed.inject(HttpTestingController);
        appConfigGetSpy = spyOn(TestBed.inject(AppConfigService), 'get');
        configureApp();
        spyOn(performance, 'now').and.returnValue(0);
    });

    afterEach(() => {
        service.stopPeriodicSync();
        httpMock.verify();
    });

    describe('syncClockOffset', () => {
        it('should complete as disabled and not request server time when time sync is absent', async () => {
            configureApp({ timeSync: undefined });
            service.clockOffsetMs = 60_000;

            const result = await firstValueFrom(service.syncClockOffsetResult());

            httpMock.expectNone(() => true);
            expect(result).toEqual({
                status: 'disabled',
                appliedOffsetMs: 0,
                previousOffsetMs: 60_000,
                hasSuccessfulSync: false
            });
            expect(service.clockOffsetMs).toBe(60_000);
        });

        it('should accept string true from oauth2.timeSync because AppConfigService normalizes it', async () => {
            configureApp({ timeSync: 'true' });
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().flush(`${SERVER_NOW + 60_000}`);

            expect(await result).toEqual({
                status: 'synced',
                appliedOffsetMs: 60_000,
                previousOffsetMs: 0,
                hasSuccessfulSync: true,
                lastSuccessfulSyncAtMs: SERVER_NOW
            });
        });

        it('should fail without requesting when serverTimeUrl is not configured', async () => {
            configureApp({ serverTimeUrl: undefined });

            const result = await firstValueFrom(service.syncClockOffsetResult());

            httpMock.expectNone(() => true);
            expect(result).toEqual({
                status: 'failed',
                appliedOffsetMs: 0,
                previousOffsetMs: 0,
                hasSuccessfulSync: false
            });
        });

        it('should fail without requesting when serverTimeUrl has an unsupported scheme', async () => {
            configureApp({ serverTimeUrl: 'ftp://example.com/server-time' });

            const result = await firstValueFrom(service.syncClockOffsetResult());

            httpMock.expectNone(() => true);
            expect(result).toEqual({
                status: 'failed',
                appliedOffsetMs: 0,
                previousOffsetMs: 0,
                hasSuccessfulSync: false
            });
        });

        it('should request a configured relative serverTimeUrl using GET text', async () => {
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest('/api/server-time').flush(`${SERVER_NOW - 480_000}`);

            expect(await result).toEqual({
                status: 'synced',
                appliedOffsetMs: -480_000,
                previousOffsetMs: 0,
                hasSuccessfulSync: true,
                lastSuccessfulSyncAtMs: SERVER_NOW
            });
        });

        it('should request a configured absolute serverTimeUrl using GET text', async () => {
            const serverTimeUrl = 'https://time.example.com/server-time';
            configureApp({ serverTimeUrl });
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest(serverTimeUrl).flush(`${SERVER_NOW + 60_000}`);

            expect(await result).toEqual({
                status: 'synced',
                appliedOffsetMs: 60_000,
                previousOffsetMs: 0,
                hasSuccessfulSync: true,
                lastSuccessfulSyncAtMs: SERVER_NOW
            });
        });

        it('should calculate the offset with half the measured round-trip time', async () => {
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW + 1000);
            (performance.now as jasmine.Spy).and.returnValues(0, 1000);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().flush(`${SERVER_NOW + 60_000}`);

            expect(await result).toEqual({
                status: 'synced',
                appliedOffsetMs: 59_500,
                previousOffsetMs: 0,
                hasSuccessfulSync: true,
                lastSuccessfulSyncAtMs: SERVER_NOW + 1000
            });
            expect(service.clockOffsetMs).toBe(59_500);
        });

        [
            { format: 'date string', responseBody: new Date(SERVER_NOW + 30_000).toUTCString() },
            { format: 'epoch millisecond', responseBody: `${SERVER_NOW + 30_000}` },
            { format: 'epoch second', responseBody: `${(SERVER_NOW + 30_000) / 1000}` }
        ].forEach(({ format, responseBody }) => {
            it(`should parse ${format} response bodies`, async () => {
                spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

                const result = firstValueFrom(service.syncClockOffsetResult());
                expectServerTimeRequest().flush(responseBody);

                expect(await result).toEqual({
                    status: 'synced',
                    appliedOffsetMs: 30_000,
                    previousOffsetMs: 0,
                    hasSuccessfulSync: true,
                    lastSuccessfulSyncAtMs: SERVER_NOW
                });
            });
        });

        it('should keep the current offset when the request fails', async () => {
            service.clockOffsetMs = 5000;

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().error(new ProgressEvent('error'));

            expect(await result).toEqual({
                status: 'failed',
                appliedOffsetMs: 5000,
                previousOffsetMs: 5000,
                hasSuccessfulSync: false
            });
            expect(service.clockOffsetMs).toBe(5000);
        });

        it('should report failed with a trusted previous sync when a later request fails', async () => {
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW, SERVER_NOW + 30_000);

            const synced = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().flush(`${SERVER_NOW + 60_000}`);
            await synced;

            const failed = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().error(new ProgressEvent('error'));

            expect(await failed).toEqual({
                status: 'failed',
                appliedOffsetMs: 60_000,
                previousOffsetMs: 60_000,
                hasSuccessfulSync: true,
                lastSuccessfulSyncAtMs: SERVER_NOW
            });
        });

        it('should report missing-server-time and keep the current offset for an empty body', async () => {
            service.clockOffsetMs = 5000;
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().flush('  ');

            expect(await result).toEqual({
                status: 'missing-server-time',
                appliedOffsetMs: 5000,
                previousOffsetMs: 5000,
                hasSuccessfulSync: false
            });
            expect(service.clockOffsetMs).toBe(5000);
        });

        it('should report invalid-server-time and keep the current offset for an invalid body', async () => {
            service.clockOffsetMs = 5000;
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().flush('not-a-date');

            expect(await result).toEqual({
                status: 'invalid-server-time',
                appliedOffsetMs: 5000,
                previousOffsetMs: 5000,
                hasSuccessfulSync: false
            });
            expect(service.clockOffsetMs).toBe(5000);
        });

        it('should share an in-flight sync request between overlapping callers', async () => {
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const firstSync = firstValueFrom(service.syncClockOffsetResult());
            const secondSync = firstValueFrom(service.syncClockOffsetResult());

            const requests = httpMock.match(SERVER_TIME_URL);
            expect(requests.length).toBe(1);
            requests[0].flush(`${SERVER_NOW + 60_000}`);

            const expectedResult = {
                status: 'synced' as const,
                appliedOffsetMs: 60_000,
                previousOffsetMs: 0,
                hasSuccessfulSync: true,
                lastSuccessfulSyncAtMs: SERVER_NOW
            };
            expect(await firstSync).toEqual(expectedResult);
            expect(await secondSync).toEqual(expectedResult);
        });

        it('should not treat an un-subscribed sync observable as in flight', async () => {
            service.syncClockOffsetResult();
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().flush(`${SERVER_NOW + 60_000}`);

            expect((await result).status).toBe('synced');
        });

        it('should reject an implausible offset and keep the previous value', async () => {
            const events: { measuredOffsetMs: number; maxAllowedOffsetMs: number }[] = [];
            service.clockOffsetMs = 1234;
            service.implausibleOffsetDetected$.subscribe((event) => events.push(event));
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);

            const result = firstValueFrom(service.syncClockOffsetResult());
            expectServerTimeRequest().flush(`${SERVER_NOW + 660_000}`);

            expect(await result).toEqual({
                status: 'implausible-offset',
                appliedOffsetMs: 1234,
                previousOffsetMs: 1234,
                hasSuccessfulSync: false
            });
            expect(service.clockOffsetMs).toBe(1234);
            expect(events).toEqual([{ measuredOffsetMs: 660_000, maxAllowedOffsetMs: 600_000 }]);
        });
    });

    describe('clock reads and status checks', () => {
        it('should return corrected now when enabled and an offset is stored', () => {
            service.clockOffsetMs = -60_000;
            spyOn(Date, 'now').and.returnValue(SERVER_NOW + 60_000);

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should return raw now when disabled even if an offset is stored', () => {
            configureApp({ timeSync: false });
            service.clockOffsetMs = -60_000;
            spyOn(Date, 'now').and.returnValue(SERVER_NOW + 60_000);

            expect(service.getCorrectedNow()).toBe(SERVER_NOW + 60_000);
        });

        it('should report out-of-sync from the stored offset when enabled', async () => {
            service.clockOffsetMs = 180_000;
            spyOn(Date, 'now').and.returnValue(SERVER_NOW);

            const result = await firstValueFrom(service.checkTimeSync(120));

            expect(result).toEqual({
                outOfSync: true,
                timeOutOfSyncInSec: 180,
                localDateTimeISO: new Date(SERVER_NOW).toISOString(),
                serverDateTimeISO: new Date(SERVER_NOW + 180_000).toISOString()
            });
        });

        it('should report in-sync from raw time when disabled even if an offset is stored', async () => {
            configureApp({ timeSync: false });
            service.clockOffsetMs = 180_000;
            spyOn(Date, 'now').and.returnValue(SERVER_NOW);

            const result = await firstValueFrom(service.checkTimeSync(120));

            expect(result).toEqual({
                outOfSync: false,
                timeOutOfSyncInSec: 0,
                localDateTimeISO: new Date(SERVER_NOW).toISOString(),
                serverDateTimeISO: new Date(SERVER_NOW).toISOString()
            });
        });

        it('should map checkTimeSync to a boolean in isLocalTimeOutOfSync', async () => {
            service.clockOffsetMs = 121_000;
            spyOn(Date, 'now').and.returnValue(SERVER_NOW);

            expect(await firstValueFrom(service.isLocalTimeOutOfSync(120))).toBeTrue();
        });
    });

    describe('periodic sync', () => {
        beforeEach(() => {
            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
        });

        it('should not register periodic sync when disabled', () => {
            configureApp({ timeSync: false });
            const addEventListenerSpy = spyOn(document, 'addEventListener');

            service.startPeriodicSync(1000);

            expect(addEventListenerSpy).not.toHaveBeenCalled();
            httpMock.expectNone(() => true);
        });

        it('should re-sync when the document becomes visible', () => {
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW, SERVER_NOW);

            service.startPeriodicSync(60_000);
            document.dispatchEvent(new Event('visibilitychange'));

            expectServerTimeRequest().flush(`${SERVER_NOW + 30_000}`);
            expect(service.clockOffsetMs).toBe(30_000);
        });

        it('should debounce repeated visibility-triggered syncs', () => {
            spyOn(Date, 'now').and.returnValues(
                SERVER_NOW,
                SERVER_NOW,
                SERVER_NOW,
                SERVER_NOW + 5000,
                SERVER_NOW + 31_000,
                SERVER_NOW + 31_000,
                SERVER_NOW + 31_000
            );

            service.startPeriodicSync(60_000);

            document.dispatchEvent(new Event('visibilitychange'));
            expectServerTimeRequest().flush(`${SERVER_NOW}`);

            document.dispatchEvent(new Event('visibilitychange'));
            httpMock.expectNone(() => true);

            document.dispatchEvent(new Event('visibilitychange'));
            expectServerTimeRequest().flush(`${SERVER_NOW + 31_000}`);
        });

        it('should remove the visibility listener when stopped', () => {
            service.startPeriodicSync(60_000);
            service.stopPeriodicSync();

            document.dispatchEvent(new Event('visibilitychange'));

            httpMock.expectNone(() => true);
        });
    });

    describe('observability', () => {
        let warnSpy: jasmine.Spy;
        let debugSpy: jasmine.Spy;

        beforeEach(() => {
            const logService = TestBed.inject(LogService);
            warnSpy = spyOn(logService, 'warn');
            debugSpy = spyOn(logService, 'debug');
        });

        it('should debug-log missing server time, invalid server time, and request failures', async () => {
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW, SERVER_NOW, SERVER_NOW);

            const missing = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().flush('');
            await missing;

            const invalid = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().flush('not-a-valid-date\r\ninjected-line');
            await invalid;

            const failed = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().error(new ProgressEvent('error'));
            await failed;

            expect(debugSpy).toHaveBeenCalledTimes(3);
            expect(debugSpy.calls.allArgs().some(([message]) => `${message}`.includes('\r') || `${message}`.includes('\n'))).toBeFalse();
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it('should warn-log unsupported URLs and implausible offsets', async () => {
            configureApp({ serverTimeUrl: 'javascript:alert(1)' });
            await firstValueFrom(service.syncClockOffset());

            configureApp();
            spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW);
            const result = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().flush(`${SERVER_NOW + 60 * 60 * 1000}`);
            await result;

            expect(warnSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('clock skew scenario matrix', () => {
        describe('time sync off', () => {
            clockSkewScenarios.forEach(({ id, description, skewSeconds, direction }) => {
                it(`${id}: should keep raw local time for ${description}`, async () => {
                    configureApp({ timeSync: false });
                    const rawLocalNow = rawLocalInstantFor(skewSeconds, direction);
                    spyOn(Date, 'now').and.returnValue(rawLocalNow);

                    expect(service.getCorrectedNow()).toBe(rawLocalNow);

                    const result = await firstValueFrom(service.syncClockOffsetResult());

                    httpMock.expectNone(() => true);
                    expect(result.status).toBe('disabled');
                    expect(service.clockOffsetMs).toBe(0);
                    expect(service.getCorrectedNow()).toBe(rawLocalNow);
                });
            });
        });

        describe('time sync malfunction', () => {
            clockSkewScenarios.forEach(({ id, description, skewSeconds, direction }) => {
                it(`${id}: should keep raw local time for ${description} when server time cannot be fetched`, async () => {
                    const rawLocalNow = rawLocalInstantFor(skewSeconds, direction);
                    spyOn(Date, 'now').and.returnValue(rawLocalNow);

                    const result = firstValueFrom(service.syncClockOffsetResult());
                    expectServerTimeRequest().error(new ProgressEvent('error'));

                    expect(await result).toEqual({
                        status: 'failed',
                        appliedOffsetMs: 0,
                        previousOffsetMs: 0,
                        hasSuccessfulSync: false
                    });
                    expect(service.getCorrectedNow()).toBe(rawLocalNow);
                });
            });

            it('should keep a previous trusted offset when a later sync malfunctions', async () => {
                spyOn(Date, 'now').and.returnValues(SERVER_NOW, SERVER_NOW, SERVER_NOW + 120_000, SERVER_NOW + 120_000);

                const synced = firstValueFrom(service.syncClockOffsetResult());
                expectServerTimeRequest().flush(`${SERVER_NOW + 60_000}`);
                await synced;

                const failed = firstValueFrom(service.syncClockOffsetResult());
                expectServerTimeRequest().error(new ProgressEvent('error'));

                expect(await failed).toEqual({
                    status: 'failed',
                    appliedOffsetMs: 60_000,
                    previousOffsetMs: 60_000,
                    hasSuccessfulSync: true,
                    lastSuccessfulSyncAtMs: SERVER_NOW
                });
                expect(service.getCorrectedNow()).toBe(SERVER_NOW + 180_000);
            });
        });

        describe('time sync on', () => {
            clockSkewScenarios.forEach(({ id, description, skewSeconds, direction }) => {
                it(`${id}: should correct ${description} to server time`, async () => {
                    const rawLocalNow = rawLocalInstantFor(skewSeconds, direction);
                    const expectedOffset = expectedOffsetFor(rawLocalNow);

                    const result = await syncWithServerTime(rawLocalNow);

                    expect(result).toEqual({
                        status: 'synced',
                        appliedOffsetMs: expectedOffset,
                        previousOffsetMs: 0,
                        hasSuccessfulSync: true,
                        lastSuccessfulSyncAtMs: rawLocalNow
                    });
                    expect(service.clockOffsetMs).toBe(expectedOffset);
                    expect(service.getCorrectedNow()).toBe(SERVER_NOW);
                });
            });
        });

        describe('offset clamp', () => {
            [
                { id: 'TC-27', skewSeconds: 599, direction: 'behind' as const },
                { id: 'TC-28', skewSeconds: 599, direction: 'ahead' as const },
                { id: 'TC-29', skewSeconds: 600, direction: 'behind' as const },
                { id: 'TC-30', skewSeconds: 600, direction: 'ahead' as const }
            ].forEach(({ id, skewSeconds, direction }) => {
                it(`${id}: should apply an offset at or within the trust bound`, async () => {
                    const rawLocalNow = rawLocalInstantFor(skewSeconds, direction);
                    await syncWithServerTime(rawLocalNow);

                    expect(service.clockOffsetMs).toBe(expectedOffsetFor(rawLocalNow));
                    expect(service.getCorrectedNow()).toBe(SERVER_NOW);
                });
            });

            [
                { id: 'TC-31', skewSeconds: 601, direction: 'behind' as const },
                { id: 'TC-32', skewSeconds: 601, direction: 'ahead' as const }
            ].forEach(({ id, skewSeconds, direction }) => {
                it(`${id}: should reject an offset beyond the trust bound`, async () => {
                    const rawLocalNow = rawLocalInstantFor(skewSeconds, direction);
                    spyOn(Date, 'now').and.returnValues(rawLocalNow, rawLocalNow, rawLocalNow);

                    const result = firstValueFrom(service.syncClockOffsetResult());
                    expectServerTimeRequest().flush(`${SERVER_NOW}`);

                    expect((await result).status).toBe('implausible-offset');
                    expect(service.clockOffsetMs).toBe(0);
                    expect(service.getCorrectedNow()).toBe(rawLocalNow);
                });
            });
        });
    });
});
