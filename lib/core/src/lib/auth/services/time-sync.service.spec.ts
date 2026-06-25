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

import { TestBed } from '@angular/core/testing';
import { TimeSyncService } from './time-sync.service';

const SERVER_NOW = Date.UTC(2025, 0, 15, 12, 0, 0);
const MAX_ALLOWED_CLOCK_SKEW_IN_SEC = 120;
const SERVER_TIME_CACHE_WINDOW_IN_MS = 2000;

type ClockDirection = 'behind' | 'ahead';

interface ClockSkewScenario {
    id: string;
    description: string;
    skewSeconds: number;
    direction: ClockDirection;
}

interface AppConfigOptions {
    timeSync?: boolean | string;
    omitTimeSync?: boolean;
    showDebugInformation?: boolean | string;
}

interface TimeSyncResult {
    outOfSync: boolean;
    timeOffsetInSec?: number;
    localDateTimeISO: string;
    serverDateTimeISO: string;
}

describe('TimeSyncService', () => {
    let service: TimeSyncService;

    // Timestamps used across tests:
    // requestStartTimeMs  = 1728911579000 → Monday, October 14, 2024 1:12:59 PM GMT
    // responseReceivedTimeMs = 1728911580000 → Monday, October 14, 2024 1:13:00 PM GMT (round trip = 1 s)
    // serverTimeMs        = 1728911640000 → Monday, October 14, 2024 1:14:00 PM GMT
    //
    // adjustedServerAtCapture = 1728911640000 + 500 = 1728911640500
    // When Date.now() returns 1728911580000 (= responseReceivedTimeMs, i.e. elapsed = 0):
    //   estimatedCurrentServer = 1728911640500
    //   offset = |1728911580000 − 1728911640500| = 60500 ms = 60.5 s

    const requestStartTimeMs = 1728911579000;
    const responseReceivedTimeMs = 1728911580000;
    const serverTimeMs = 1728911640000;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeSyncService]
        });
        service = TestBed.inject(TimeSyncService);
    });

    describe('updateServerTime', () => {
        it('should store the provided snapshot so that checkTimeSync can use it', async () => {
            service.updateServerTime({ serverTimeMs, requestStartTimeMs, responseReceivedTimeMs });

            spyOn(Date, 'now').and.returnValue(responseReceivedTimeMs);

            const sync = await firstValueFrom(service.checkTimeSync(61));
            expect(sync).toBeDefined();
        });
    });

    describe('syncClockOffset', () => {
        it('should keep raw local time and not request server time when timeSync is not configured', async () => {
            configureApp({ omitTimeSync: true });
            spyOn(Date, 'now').and.returnValue(SERVER_NOW + 238_000);

            await firstValueFrom(service.syncClockOffset());

            httpMock.expectNone(() => true);
            expect(service.getCorrectedNow()).toBe(SERVER_NOW + 238_000);
        });

        it('should keep raw local time and not request server time when timeSync is false', async () => {
            configureApp({ timeSync: false });
            spyOn(Date, 'now').and.returnValue(SERVER_NOW - 238_000);

            await firstValueFrom(service.syncClockOffset());

            httpMock.expectNone(() => true);
            expect(service.getCorrectedNow()).toBe(SERVER_NOW - 238_000);
        });

        it('should correct a slow local clock when timeSync is true', async () => {
            spyOn(Date, 'now').and.returnValue(SERVER_NOW - 238_000);

            const sync = firstValueFrom(service.syncClockOffset());
            flushDateHeader(expectAppRootTimeRequest());
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should correct a fast local clock when timeSync is the string true', async () => {
            configureApp({ timeSync: 'true' });
            spyOn(Date, 'now').and.returnValue(SERVER_NOW + 238_000);

            const sync = firstValueFrom(service.syncClockOffset());
            flushDateHeader(expectAppRootTimeRequest());
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should read server time from the app root Date header', async () => {
            spyOn(Date, 'now').and.returnValue(SERVER_NOW - 60_000);

            const sync = firstValueFrom(service.syncClockOffset());
            flushDateHeader(expectAppRootTimeRequest());
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should correct local time without requiring serverTimeUrl configuration', async () => {
            spyOn(Date, 'now').and.returnValue(SERVER_NOW + 238_000);

            const sync = firstValueFrom(service.syncClockOffset());
            flushDateHeader(expectAppRootTimeRequest());
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should keep raw local time when timeSync is true but the server time request fails', async () => {
            spyOn(Date, 'now').and.returnValue(SERVER_NOW - 238_000);

            const sync = firstValueFrom(service.syncClockOffset());
            expectAppRootTimeRequest().error(new ProgressEvent('error'));
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW - 238_000);
        });

        it('should fall back to raw local time when a later sync fails after the cached server time expires', fakeAsync(() => {
            let localNow = SERVER_NOW - 238_000;
            spyOn(Date, 'now').and.callFake(() => localNow);

            service.syncClockOffset().subscribe();
            flushDateHeader(expectAppRootTimeRequest());

            tick(SERVER_TIME_CACHE_WINDOW_IN_MS);

            localNow = SERVER_NOW + 60_000;
            service.syncClockOffset().subscribe();
            expectAppRootTimeRequest().error(new ProgressEvent('error'));

            expect(service.getCorrectedNow()).toBe(SERVER_NOW + 60_000);
        }));
    });

    describe('checkTimeSync', () => {
        it('should return outOfSync as false when offset is within the allowed skew', async () => {
            service.updateServerTime({ serverTimeMs, requestStartTimeMs, responseReceivedTimeMs });
            spyOn(Date, 'now').and.returnValue(responseReceivedTimeMs);

            // offset is 60.5 s → within 61 s limit
            const sync = await firstValueFrom(service.checkTimeSync(61));
            expect(sync.outOfSync).toBeFalse();
            expect(sync.localDateTimeISO).toEqual('2024-10-14T13:13:00.000Z');
            expect(sync.serverDateTimeISO).toEqual('2024-10-14T13:14:00.500Z');
        });

        it('should return outOfSync as true when offset exceeds the allowed skew', async () => {
            service.updateServerTime({ serverTimeMs, requestStartTimeMs, responseReceivedTimeMs });
            spyOn(Date, 'now').and.returnValue(responseReceivedTimeMs);

            // offset is 60.5 s → exceeds 60 s limit
            const sync = await firstValueFrom(service.checkTimeSync(60));
            expect(sync.outOfSync).toBeTrue();
            expect(sync.localDateTimeISO).toEqual('2024-10-14T13:13:00.000Z');
            expect(sync.serverDateTimeISO).toEqual('2024-10-14T13:14:00.500Z');
        });

        it('should account for time elapsed since the snapshot was captured', async () => {
            service.updateServerTime({ serverTimeMs, requestStartTimeMs, responseReceivedTimeMs });

            // 10 seconds have passed since the snapshot was received
            const tenSecondsLater = responseReceivedTimeMs + 10_000;
            spyOn(Date, 'now').and.returnValue(tenSecondsLater);

            // estimatedCurrentServer = 1728911640500 + 10000 = 1728911650500
            // offset = |1728911590000 − 1728911650500| = 60500 ms — unchanged by elapsed time
            const sync = await firstValueFrom(service.checkTimeSync(61));
            expect(sync.outOfSync).toBeFalse();
            expect(sync.localDateTimeISO).toEqual(new Date(tenSecondsLater).toISOString());
        });

        it('should populate timeOutOfSyncInSec with the offset in seconds', async () => {
            service.updateServerTime({ serverTimeMs, requestStartTimeMs, responseReceivedTimeMs });
            spyOn(Date, 'now').and.returnValue(responseReceivedTimeMs);

            const sync = await firstValueFrom(service.checkTimeSync(61));
            expect(sync.timeOutOfSyncInSec).toBeCloseTo(60.5);
        });

        it('should error when no server time snapshot has been provided yet', async () => {
            try {
                await firstValueFrom(service.checkTimeSync(60));
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toContain('No server time available');
            }
        });
    });

    describe('isLocalTimeOutOfSync', () => {
        it('should return true when the clock is out of sync', async () => {
            service.updateServerTime({ serverTimeMs, requestStartTimeMs, responseReceivedTimeMs });
            spyOn(Date, 'now').and.returnValue(responseReceivedTimeMs);

            // offset is 60.5 s → exceeds 60 s limit
            const isOutOfSync = await firstValueFrom(service.isLocalTimeOutOfSync(60));
            expect(isOutOfSync).toBeTrue();
        });

        it('should return false when the clock is within the allowed skew', async () => {
            service.updateServerTime({ serverTimeMs, requestStartTimeMs, responseReceivedTimeMs });
            spyOn(Date, 'now').and.returnValue(responseReceivedTimeMs);

            // offset is 60.5 s → within 61 s limit
            const isOutOfSync = await firstValueFrom(service.isLocalTimeOutOfSync(61));
            expect(isOutOfSync).toBeFalse();
        });
    });
});
