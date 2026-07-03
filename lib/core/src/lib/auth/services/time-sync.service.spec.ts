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
import { firstValueFrom } from 'rxjs';

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

        it('should not update offset when it exceeds maxAllowedOffsetMs', async () => {
            const timeBeforeRequest = 1728911579000;
            const timeResponseReceived = 1728911580000;

            spyOn(Date, 'now').and.returnValues(timeBeforeRequest, timeResponseReceived);

            service.clockOffsetMs = 1000;

            const promise = firstValueFrom(service.syncClockOffset(60000));

            const req = httpMock.expectOne(() => true);
            // Server is 600 seconds ahead — exceeds cap of 60 seconds
            req.flush(null, { headers: { date: 'Mon, 14 Oct 2024 13:22:59 GMT' } });

            await promise;
            expect(service.clockOffsetMs).toBe(1000);
        });

        it('should update offset when it is within maxAllowedOffsetMs', async () => {
            const timeBeforeRequest = 1728911579000;
            const timeResponseReceived = 1728911580000;

            spyOn(Date, 'now').and.returnValues(timeBeforeRequest, timeResponseReceived);

            // Server is 30 seconds ahead (within cap of 60 seconds)
            // serverTime = 1728911610000, roundTrip = 1000ms
            // adjustedServerTime = 1728911610500, offset = 30500ms
            const promise = firstValueFrom(service.syncClockOffset(60000));

            const req = httpMock.expectOne(() => true);
            req.flush(null, { headers: { date: 'Mon, 14 Oct 2024 13:13:30 GMT' } });

            await promise;
            expect(service.clockOffsetMs).toBe(30500);
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
        it('should re-sync on visibility change', async () => {
            const timeBeforeRequest = 1728911579000;
            const timeResponseReceived = 1728911580000;

            spyOn(Date, 'now').and.returnValues(timeBeforeRequest, timeResponseReceived);

            service.startPeriodicSync(60000);

            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));

            const req = httpMock.expectOne(() => true);
            expect(req.request.method).toBe('HEAD');
            req.flush(null, { headers: { date: 'Mon, 14 Oct 2024 13:13:30 GMT' } });

            expect(service.clockOffsetMs).toBe(30500);
        });

        it('should apply maxAllowedOffsetMs cap during visibility re-sync', () => {
            const timeBeforeRequest = 1728911579000;
            const timeResponseReceived = 1728911580000;

            spyOn(Date, 'now').and.returnValues(timeBeforeRequest, timeResponseReceived);

            service.clockOffsetMs = 1000;
            service.startPeriodicSync(60000, 60000);

            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));

            const req = httpMock.expectOne(() => true);
            // Server is 600 seconds ahead — exceeds cap
            req.flush(null, { headers: { date: 'Mon, 14 Oct 2024 13:22:59 GMT' } });

            expect(service.clockOffsetMs).toBe(1000);
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
});
