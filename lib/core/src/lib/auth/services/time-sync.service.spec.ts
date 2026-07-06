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
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TimeSyncService } from './time-sync.service';
import { LogService } from '../../common/services/log.service';
import { firstValueFrom } from 'rxjs';

// A fixed reference instant (Wed, 15 Jan 2025 12:00:00 GMT), aligned to a whole second.
const BASE = Date.UTC(2025, 0, 15, 12, 0, 0);

// Formats an epoch (ms) as an RFC 7231 GMT date string, exactly as an HTTP `Date` header.
const toHttpDate = (epochMs: number): string => new Date(epochMs).toUTCString();

describe('TimeSyncService', () => {
    let service: TimeSyncService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeSyncService, provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(TimeSyncService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        service.stopPeriodicSync();
        httpMock.verify();
    });

    // Simulates a single clock sync with zero network round-trip time so that the resulting
    // offset is simply `serverEpochMs - localNowMs`. Both timestamps are absolute UTC epochs,
    // mirroring how `Date.now()` and a parsed `Date` header behave in production.
    const syncWithDrift = async (localNowMs: number, serverEpochMs: number): Promise<void> => {
        spyOn(Date, 'now').and.returnValues(localNowMs, localNowMs); // startTime, endTime (round-trip 0)

        const promise = firstValueFrom(service.syncClockOffset());

        const req = httpMock.expectOne(() => true);
        req.flush(null, { headers: { date: toHttpDate(serverEpochMs) } });

        await promise;
    };

    // Converts a skew magnitude + direction into the server instant relative to a local clock at
    // BASE. "behind" means the local clock reads earlier than the server (client slow); "ahead"
    // means it reads later (client fast).
    const serverInstantFor = (skewSeconds: number, direction: 'behind' | 'ahead'): number =>
        direction === 'behind' ? BASE + skewSeconds * 1000 : BASE - skewSeconds * 1000;

    // Runs one sync at BASE against the given skew and returns both the stored offset and the
    // resulting corrected "now". Uses three Date.now() values: startTime, endTime, getCorrectedNow.
    const syncAndReadCorrectedNow = async (serverEpochMs: number): Promise<{ offset: number; correctedNow: number }> => {
        spyOn(Date, 'now').and.returnValues(BASE, BASE, BASE); // startTime, endTime, getCorrectedNow

        const promise = firstValueFrom(service.syncClockOffset());
        httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(serverEpochMs) } });
        await promise;

        return { offset: service.clockOffsetMs, correctedNow: service.getCorrectedNow() };
    };

    // Asserts the correction realigns the corrected clock exactly onto the server instant, which is
    // what keeps login / token refresh / the session working in the new UI for a tolerated skew.
    const expectCorrectionAlignsToServer = async (skewSeconds: number, direction: 'behind' | 'ahead'): Promise<void> => {
        const serverEpochMs = serverInstantFor(skewSeconds, direction);
        const expectedOffset = direction === 'behind' ? skewSeconds * 1000 : -skewSeconds * 1000;

        const { offset, correctedNow } = await syncAndReadCorrectedNow(serverEpochMs);

        expect(offset).toBe(expectedOffset);
        expect(correctedNow).toBe(serverEpochMs);
    };

    // Asserts the correction is rejected (implausible skew beyond the clamp): the offset is left at
    // 0 and the corrected clock falls back to the raw local clock.
    const expectCorrectionRejected = async (skewSeconds: number, direction: 'behind' | 'ahead'): Promise<void> => {
        const serverEpochMs = serverInstantFor(skewSeconds, direction);

        const { offset, correctedNow } = await syncAndReadCorrectedNow(serverEpochMs);

        expect(offset).toBe(0);
        expect(correctedNow).toBe(BASE);
    };

    describe('syncClockOffset', () => {
        it('should store a positive offset when the local clock is behind the server', async () => {
            const timeBeforeRequest = 1728911579000;
            const timeResponseReceived = 1728911580000;

            spyOn(Date, 'now').and.returnValues(timeBeforeRequest, timeResponseReceived);

            const promise = firstValueFrom(service.syncClockOffset());

            const req = httpMock.expectOne(() => true);
            expect(req.request.method).toBe('HEAD');
            // Server Date header is 60 seconds ahead: Mon, 14 Oct 2024 13:14:00 GMT = 1728911640000
            // roundTrip = 1000ms, adjustedServerTime = 1728911640000 + 500 = 1728911640500
            // offset = 1728911640500 - 1728911580000 = 60500
            req.flush(null, { headers: { date: 'Mon, 14 Oct 2024 13:14:00 GMT' } });

            await promise;
            expect(service.clockOffsetMs).toBe(60500);
        });

        it('should store 0 offset when local clock matches the server', async () => {
            const requestTime = 1728911580000;
            const responseTime = 1728911580000;

            spyOn(Date, 'now').and.returnValues(requestTime, responseTime);

            const promise = firstValueFrom(service.syncClockOffset());

            const req = httpMock.expectOne(() => true);
            // Server time matches local: Mon, 14 Oct 2024 13:13:00 GMT = 1728911580000
            // roundTrip = 0ms, adjustedServerTime = 1728911580000
            // offset = 0
            req.flush(null, { headers: { date: 'Mon, 14 Oct 2024 13:13:00 GMT' } });

            await promise;
            expect(service.clockOffsetMs).toBe(0);
        });

        it('should leave clockOffsetMs unchanged when the HEAD request fails', async () => {
            service.clockOffsetMs = 5000;

            const promise = firstValueFrom(service.syncClockOffset());

            const req = httpMock.expectOne(() => true);
            req.error(new ProgressEvent(''));

            await promise;
            expect(service.clockOffsetMs).toBe(5000);
        });

        it('should leave clockOffsetMs unchanged when the Date header is missing', async () => {
            service.clockOffsetMs = 5000;

            spyOn(Date, 'now').and.returnValues(1728911579000, 1728911580000);

            const promise = firstValueFrom(service.syncClockOffset());

            const req = httpMock.expectOne(() => true);
            req.flush(null, { headers: {} });

            await promise;
            expect(service.clockOffsetMs).toBe(5000);
        });
    });

    describe('checkTimeSync', () => {
        it('should return outOfSync as false when offset is within allowed skew', async () => {
            service.clockOffsetMs = 30000; // 30 seconds offset

            const localNow = 1728911580000;
            spyOn(Date, 'now').and.returnValue(localNow);

            const sync = await firstValueFrom(service.checkTimeSync(60));

            expect(sync.outOfSync).toBeFalse();
            expect(sync.timeOutOfSyncInSec).toBe(30);
        });

        it('should return outOfSync as true when offset exceeds allowed skew', async () => {
            service.clockOffsetMs = 70000; // 70 seconds offset

            const localNow = 1728911580000;
            spyOn(Date, 'now').and.returnValue(localNow);

            const sync = await firstValueFrom(service.checkTimeSync(60));

            expect(sync.outOfSync).toBeTrue();
            expect(sync.timeOutOfSyncInSec).toBe(70);
            expect(sync.localDateTimeISO).toEqual('2024-10-14T13:13:00.000Z');
            expect(sync.serverDateTimeISO).toEqual('2024-10-14T13:14:10.000Z');
        });
    });

    describe('isLocalTimeOutOfSync', () => {
        it('should return true when offset exceeds allowed skew', async () => {
            service.clockOffsetMs = 70000;
            spyOn(Date, 'now').and.returnValue(1728911580000);

            const isOutOfSync = await firstValueFrom(service.isLocalTimeOutOfSync(60));

            expect(isOutOfSync).toBeTrue();
        });

        it('should return false when offset is within allowed skew', async () => {
            service.clockOffsetMs = 30000;
            spyOn(Date, 'now').and.returnValue(1728911580000);

            const isOutOfSync = await firstValueFrom(service.isLocalTimeOutOfSync(60));

            expect(isOutOfSync).toBeFalse();
        });
    });

    describe('getCorrectedNow', () => {
        it('should return Date.now() when clockOffsetMs is 0', () => {
            const fixedNow = 1728911580000;
            spyOn(Date, 'now').and.returnValue(fixedNow);

            expect(service.getCorrectedNow()).toBe(fixedNow);
        });

        it('should return Date.now() plus the stored offset', () => {
            const fixedNow = 1728911580000;
            spyOn(Date, 'now').and.returnValue(fixedNow);

            service.clockOffsetMs = 60000;

            expect(service.getCorrectedNow()).toBe(fixedNow + 60000);
        });

        it('should return Date.now() minus the stored offset when local clock is ahead', () => {
            const fixedNow = 1728911640000;
            spyOn(Date, 'now').and.returnValue(fixedNow);

            service.clockOffsetMs = -60000;

            expect(service.getCorrectedNow()).toBe(fixedNow - 60000);
        });
    });

    describe('startPeriodicSync', () => {
        it('should re-sync on visibility change', () => {
            const debounceCheckTime = 1728911579000;
            const timeBeforeRequest = 1728911579000;
            const timeResponseReceived = 1728911580000;

            spyOn(Date, 'now').and.returnValues(debounceCheckTime, timeBeforeRequest, timeResponseReceived);

            service.startPeriodicSync(60000);

            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));

            const req = httpMock.expectOne(() => true);
            expect(req.request.method).toBe('HEAD');
            req.flush(null, { headers: { date: 'Mon, 14 Oct 2024 13:13:30 GMT' } });

            expect(service.clockOffsetMs).toBe(30500);
        });
    });

    describe('stopPeriodicSync', () => {
        it('should remove visibility change listener', () => {
            service.startPeriodicSync(60000);
            service.stopPeriodicSync();

            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));

            httpMock.expectNone(() => true);
        });
    });

    describe('clock drift combinations', () => {
        const driftScenarios: { description: string; driftMs: number; expectedOffsetMs: number }[] = [
            { description: 'client and server are perfectly in sync', driftMs: 0, expectedOffsetMs: 0 },
            { description: 'client is 1s behind the server (client slightly slow)', driftMs: 1_000, expectedOffsetMs: 1_000 },
            { description: 'client is 1s ahead of the server (client slightly fast)', driftMs: -1_000, expectedOffsetMs: -1_000 },
            { description: 'client is 45s behind the server (client slow)', driftMs: 45_000, expectedOffsetMs: 45_000 },
            { description: 'client is 45s ahead of the server (client fast)', driftMs: -45_000, expectedOffsetMs: -45_000 },
            { description: 'client is 5m behind the server', driftMs: 300_000, expectedOffsetMs: 300_000 },
            { description: 'client is 5m ahead of the server', driftMs: -300_000, expectedOffsetMs: -300_000 },
            { description: 'client is 9m behind the server (near the upper bound)', driftMs: 540_000, expectedOffsetMs: 540_000 },
            { description: 'client is 9m ahead of the server (near the upper bound)', driftMs: -540_000, expectedOffsetMs: -540_000 },
            { description: 'client is exactly 10m behind the server (at the bound)', driftMs: 600_000, expectedOffsetMs: 600_000 },
            { description: 'client is exactly 10m ahead of the server (at the bound)', driftMs: -600_000, expectedOffsetMs: -600_000 }
        ];

        driftScenarios.forEach(({ description, driftMs, expectedOffsetMs }) => {
            it(`should compute the correct offset when ${description}`, async () => {
                await syncWithDrift(BASE, BASE + driftMs);

                expect(service.clockOffsetMs).toBe(expectedOffsetMs);
            });
        });

        it('should make getCorrectedNow report the server instant after correcting a fast client clock', async () => {
            const localNow = BASE + 300_000; // client wall clock is 5 minutes ahead of the server

            spyOn(Date, 'now').and.returnValues(localNow, localNow, localNow); // start, end, getCorrectedNow

            const promise = firstValueFrom(service.syncClockOffset());
            httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(BASE) } });
            await promise;

            expect(service.clockOffsetMs).toBe(-300_000);
            expect(service.getCorrectedNow()).toBe(BASE);
        });

        it('should make getCorrectedNow report the server instant after correcting a slow client clock', async () => {
            const localNow = BASE - 300_000; // client wall clock is 5 minutes behind the server

            spyOn(Date, 'now').and.returnValues(localNow, localNow, localNow); // start, end, getCorrectedNow

            const promise = firstValueFrom(service.syncClockOffset());
            httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(BASE) } });
            await promise;

            expect(service.clockOffsetMs).toBe(300_000);
            expect(service.getCorrectedNow()).toBe(BASE);
        });
    });

    describe('offset bounds (security guard)', () => {
        const rejectedScenarios: { description: string; driftMs: number }[] = [
            { description: 'client is 11m behind the server', driftMs: 660_000 },
            { description: 'client is 11m ahead of the server', driftMs: -660_000 },
            { description: 'client is 5h behind the server', driftMs: 5 * 60 * 60 * 1000 },
            { description: 'client is 5h ahead of the server', driftMs: -5 * 60 * 60 * 1000 }
        ];

        rejectedScenarios.forEach(({ description, driftMs }) => {
            it(`should ignore an implausible offset and keep the previous value when ${description}`, async () => {
                service.clockOffsetMs = 1234; // a previously trusted, plausible offset

                await syncWithDrift(BASE, BASE + driftMs);

                expect(service.clockOffsetMs).toBe(1234);
            });
        });

        it('should reject an offset just beyond a custom maxAllowedOffsetMs bound', async () => {
            service.maxAllowedOffsetMs = 1000;
            service.clockOffsetMs = 0;

            await syncWithDrift(BASE, BASE + 2000);

            expect(service.clockOffsetMs).toBe(0);
        });

        it('should apply an offset within a custom maxAllowedOffsetMs bound', async () => {
            service.maxAllowedOffsetMs = 5000;

            await syncWithDrift(BASE, BASE + 4000);

            expect(service.clockOffsetMs).toBe(4000);
        });
    });

    describe('time zone independence', () => {
        it('should treat an instant expressed in GMT as in sync with an equal UTC epoch', async () => {
            spyOn(Date, 'now').and.returnValues(BASE, BASE);

            const promise = firstValueFrom(service.syncClockOffset());
            httpMock.expectOne(() => true).flush(null, { headers: { date: 'Wed, 15 Jan 2025 12:00:00 GMT' } });
            await promise;

            expect(service.clockOffsetMs).toBe(0);
        });

        it('should compare absolute instants regardless of the client machine time zone', async () => {
            // `Date.now()` and a parsed `Date` header are both absolute UTC epochs, so a client
            // whose wall clock is expressed in a different time zone still yields the same offset.
            const localNow = BASE + 120_000; // 2 minutes of genuine drift, whatever the local zone

            await syncWithDrift(localNow, BASE);

            expect(service.clockOffsetMs).toBe(-120_000);
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

        it('should log at debug level when the Date header is missing', async () => {
            spyOn(Date, 'now').and.returnValues(BASE, BASE);

            const promise = firstValueFrom(service.syncClockOffset());
            httpMock.expectOne(() => true).flush(null, { headers: {} });
            await promise;

            expect(debugSpy).toHaveBeenCalled();
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it('should log at debug level when the Date header cannot be parsed', async () => {
            spyOn(Date, 'now').and.returnValues(BASE, BASE);

            const promise = firstValueFrom(service.syncClockOffset());
            httpMock.expectOne(() => true).flush(null, { headers: { date: 'not-a-valid-date' } });
            await promise;

            expect(debugSpy).toHaveBeenCalled();
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it('should strip control characters from the Date header before logging it', async () => {
            spyOn(Date, 'now').and.returnValues(BASE, BASE);

            const promise = firstValueFrom(service.syncClockOffset());
            httpMock.expectOne(() => true).flush(null, { headers: { date: 'bogus\r\ninjected-line' } });
            await promise;

            expect(debugSpy).toHaveBeenCalled();
            const loggedMessage = debugSpy.calls.mostRecent().args[0] as string;
            expect(loggedMessage).not.toContain('\r');
            expect(loggedMessage).not.toContain('\n');
        });

        it('should log at warn level when an implausible offset is ignored', async () => {
            await syncWithDrift(BASE, BASE + 60 * 60 * 1000);

            expect(warnSpy).toHaveBeenCalled();
        });

        it('should log at debug level when the request fails', async () => {
            const promise = firstValueFrom(service.syncClockOffset());
            httpMock.expectOne(() => true).error(new ProgressEvent('error'));
            await promise;

            expect(debugSpy).toHaveBeenCalled();
            expect(warnSpy).not.toHaveBeenCalled();
        });
    });

    describe('visibility re-sync debounce', () => {
        beforeEach(() => {
            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
        });

        it('should skip a re-sync triggered again within the debounce window', () => {
            spyOn(Date, 'now').and.returnValues(
                BASE, // 1st visibility debounce check
                BASE, // syncClockOffset startTime
                BASE, // syncClockOffset endTime
                BASE + 5_000 // 2nd visibility debounce check (still within the 30s window)
            );

            service.startPeriodicSync(60000);

            document.dispatchEvent(new Event('visibilitychange'));
            httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(BASE) } });

            document.dispatchEvent(new Event('visibilitychange'));
            httpMock.expectNone(() => true);
        });

        it('should allow a re-sync once the debounce window has elapsed', () => {
            spyOn(Date, 'now').and.returnValues(
                BASE, // 1st debounce check
                BASE, // start
                BASE, // end
                BASE + 31_000, // 2nd debounce check (after the 30s window)
                BASE + 31_000, // start
                BASE + 31_000 // end
            );

            service.startPeriodicSync(60000);

            document.dispatchEvent(new Event('visibilitychange'));
            httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(BASE) } });

            document.dispatchEvent(new Event('visibilitychange'));
            httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(BASE + 31_000) } });
        });
    });

    describe('clock skew scenario matrix (TC)', () => {
        describe('login-time skew', () => {
            it('TC-01: baseline login with an accurate clock keeps the corrected clock aligned to the server', async () => {
                await expectCorrectionAlignsToServer(0, 'behind');
            });

            it('TC-02: login with a slow clock 119s behind stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(119, 'behind');
            });

            it('TC-03: login with a slow clock 120s behind stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(120, 'behind');
            });

            it('TC-04: login with a slow clock 121s behind stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(121, 'behind');
            });

            it('TC-05: login with a slow clock 3m58s behind stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(238, 'behind');
            });

            it('TC-06: login with a fast clock 119s ahead stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(119, 'ahead');
            });

            it('TC-07: login with a fast clock 120s ahead stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(120, 'ahead');
            });

            it('TC-08: login with a fast clock 121s ahead stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(121, 'ahead');
            });

            it('TC-09: login with a fast clock 3m58s ahead stays aligned to the server', async () => {
                await expectCorrectionAlignsToServer(238, 'ahead');
            });
        });

        describe('runtime drift after login', () => {
            it('TC-10: runtime drift 119s behind keeps the corrected clock aligned so refresh succeeds', async () => {
                await expectCorrectionAlignsToServer(119, 'behind');
            });

            it('TC-11: runtime drift 120s behind keeps the corrected clock aligned so refresh succeeds', async () => {
                await expectCorrectionAlignsToServer(120, 'behind');
            });

            it('TC-12: runtime drift 121s behind keeps the corrected clock aligned so refresh succeeds', async () => {
                await expectCorrectionAlignsToServer(121, 'behind');
            });

            it('TC-13: runtime drift 3m58s behind keeps the session aligned (no false logout)', async () => {
                await expectCorrectionAlignsToServer(238, 'behind');
            });

            it('TC-14: runtime drift 119s ahead keeps the corrected clock aligned so refresh succeeds', async () => {
                await expectCorrectionAlignsToServer(119, 'ahead');
            });

            it('TC-15: runtime drift 120s ahead keeps the corrected clock aligned so refresh succeeds', async () => {
                await expectCorrectionAlignsToServer(120, 'ahead');
            });

            it('TC-16: runtime drift 121s ahead keeps the corrected clock aligned so refresh succeeds', async () => {
                await expectCorrectionAlignsToServer(121, 'ahead');
            });

            it('TC-17: runtime drift 3m58s ahead keeps the session aligned (no false logout)', async () => {
                await expectCorrectionAlignsToServer(238, 'ahead');
            });
        });

        describe('reload, multi-tab, idle, API failure and relogin', () => {
            it('TC-18: browser refresh while 3m58s behind realigns the fresh instance to the server', async () => {
                expect(service.clockOffsetMs).toBe(0); // fresh instance, as after a page reload
                await expectCorrectionAlignsToServer(238, 'behind');
            });

            it('TC-19: browser refresh while 3m58s ahead realigns the fresh instance to the server', async () => {
                expect(service.clockOffsetMs).toBe(0); // fresh instance, as after a page reload
                await expectCorrectionAlignsToServer(238, 'ahead');
            });

            it('TC-20: multiple tabs 3m58s behind each read a stable, server-aligned corrected time', async () => {
                const serverEpochMs = serverInstantFor(238, 'behind');
                spyOn(Date, 'now').and.returnValues(BASE, BASE, BASE, BASE); // start, end, read #1, read #2

                const promise = firstValueFrom(service.syncClockOffset());
                httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(serverEpochMs) } });
                await promise;

                expect(service.clockOffsetMs).toBe(238_000);
                expect(service.getCorrectedNow()).toBe(serverEpochMs);
                expect(service.getCorrectedNow()).toBe(serverEpochMs);
            });

            it('TC-21: idle session 3m58s behind re-syncs and corrects when the tab becomes visible', () => {
                const serverEpochMs = serverInstantFor(238, 'behind');
                spyOn(Date, 'now').and.returnValues(BASE, BASE, BASE); // debounce check, start, end

                service.startPeriodicSync(60000);
                Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
                document.dispatchEvent(new Event('visibilitychange'));
                httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(serverEpochMs) } });

                expect(service.clockOffsetMs).toBe(238_000);
            });

            it('TC-22: idle session 3m58s ahead re-syncs and corrects when the tab becomes visible', () => {
                const serverEpochMs = serverInstantFor(238, 'ahead');
                spyOn(Date, 'now').and.returnValues(BASE, BASE, BASE); // debounce check, start, end

                service.startPeriodicSync(60000);
                Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
                document.dispatchEvent(new Event('visibilitychange'));
                httpMock.expectOne(() => true).flush(null, { headers: { date: toHttpDate(serverEpochMs) } });

                expect(service.clockOffsetMs).toBe(-238_000);
            });

            it('TC-23: time API failure while behind keeps the previous offset (session continues on skew tolerance)', async () => {
                service.clockOffsetMs = 60_000; // an existing, within-tolerance correction

                const promise = firstValueFrom(service.syncClockOffset());
                httpMock.expectOne(() => true).error(new ProgressEvent('error'));
                await promise;

                expect(service.clockOffsetMs).toBe(60_000);
            });

            it('TC-24: time API failure while ahead keeps the previous offset (session continues on skew tolerance)', async () => {
                service.clockOffsetMs = -60_000; // an existing, within-tolerance correction

                const promise = firstValueFrom(service.syncClockOffset());
                httpMock.expectOne(() => true).error(new ProgressEvent('error'));
                await promise;

                expect(service.clockOffsetMs).toBe(-60_000);
            });

            it('TC-25: relogin after logout while 3m58s behind corrects immediately on the next sync', async () => {
                service.stopPeriodicSync(); // simulate logout tearing down periodic sync
                await expectCorrectionAlignsToServer(238, 'behind');
            });

            it('TC-26: relogin after logout while 3m58s ahead corrects immediately on the next sync', async () => {
                service.stopPeriodicSync(); // simulate logout tearing down periodic sync
                await expectCorrectionAlignsToServer(238, 'ahead');
            });
        });

        describe('clamp boundary (security guard)', () => {
            it('TC-27: skew 9m59s behind (within the clamp) is corrected', async () => {
                await expectCorrectionAlignsToServer(599, 'behind');
            });

            it('TC-28: skew 9m59s ahead (within the clamp) is corrected', async () => {
                await expectCorrectionAlignsToServer(599, 'ahead');
            });

            it('TC-29: skew exactly 10m behind (at the clamp) is corrected', async () => {
                await expectCorrectionAlignsToServer(600, 'behind');
            });

            it('TC-30: skew exactly 10m ahead (at the clamp) is corrected', async () => {
                await expectCorrectionAlignsToServer(600, 'ahead');
            });

            it('TC-31: skew 10m01s behind (beyond the clamp) is rejected and falls back to the local clock', async () => {
                await expectCorrectionRejected(601, 'behind');
            });

            it('TC-32: skew 10m01s ahead (beyond the clamp) is rejected and falls back to the local clock', async () => {
                await expectCorrectionRejected(601, 'ahead');
            });
        });
    });
});
