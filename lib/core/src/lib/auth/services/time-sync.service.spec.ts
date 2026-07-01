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
import { AppConfigService } from '../../app-config/app-config.service';
import { TimeSyncService } from './time-sync.service';
import { firstValueFrom } from 'rxjs';

describe('TimeSyncService', () => {
    let service: TimeSyncService;
    let httpMock: HttpTestingController;
    let appConfigSpy: jasmine.SpyObj<AppConfigService>;

    beforeEach(() => {
        appConfigSpy = jasmine.createSpyObj('AppConfigService', ['get']);

        TestBed.configureTestingModule({
            providers: [TimeSyncService, { provide: AppConfigService, useValue: appConfigSpy }, provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(TimeSyncService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('checkTimeSync', () => {
        it('should check time sync and return outOfSync as false when time is within allowed skew', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            const expectedServerTimeUrl = 'http://fake-server-time-url';

            const timeBeforeCallingServerTimeEndpoint = 1728911579000; // (GMT): Monday, October 14, 2024 1:12:59 PM
            const timeResponseReceivedFromServerTimeEndpoint = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const localCurrentTime = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const serverTime = 1728911640000; // (GMT): Monday, October 14, 2024 1:14:00 PM

            spyOn(Date, 'now').and.returnValues(timeBeforeCallingServerTimeEndpoint, timeResponseReceivedFromServerTimeEndpoint, localCurrentTime);

            // difference between localCurrentTime and serverTime is 60 seconds plus the round trip time of 1 second
            const allowedClockSkewInSec = 61;
            service.checkTimeSync(allowedClockSkewInSec).subscribe((sync) => {
                expect(sync.outOfSync).toBeFalse();
                expect(sync.localDateTimeISO).toEqual('2024-10-14T13:13:00.000Z');
                expect(sync.serverDateTimeISO).toEqual('2024-10-14T13:14:00.500Z');
            });

            const req = httpMock.expectOne(expectedServerTimeUrl);
            expect(req.request.method).toBe('GET');
            req.flush(serverTime);
        });

        it('should check time sync and return outOfSync as true when time is outside allowed skew', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            const expectedServerTimeUrl = 'http://fake-server-time-url';

            const timeBeforeCallingServerTimeEndpoint = 1728911579000; // (GMT): Monday, October 14, 2024 1:12:59 PM
            const timeResponseReceivedFromServerTimeEndpoint = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const localCurrentTime = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const serverTime = 1728911640000; // (GMT): Monday, October 14, 2024 1:14:00 PM

            spyOn(Date, 'now').and.returnValues(timeBeforeCallingServerTimeEndpoint, timeResponseReceivedFromServerTimeEndpoint, localCurrentTime);

            // difference between localCurrentTime and serverTime is 60 seconds plus the round trip time of 1 second
            // setting allowedClockSkewInSec to 60 seconds will make the local time out of sync
            const allowedClockSkewInSec = 60;
            service.checkTimeSync(allowedClockSkewInSec).subscribe((sync) => {
                expect(sync.outOfSync).toBeTrue();
                expect(sync.localDateTimeISO).toEqual('2024-10-14T13:13:00.000Z');
                expect(sync.serverDateTimeISO).toEqual('2024-10-14T13:14:00.500Z');
            });

            const req = httpMock.expectOne(expectedServerTimeUrl);
            expect(req.request.method).toBe('GET');
            req.flush(serverTime);
        });

        it('should throw an error if serverTimeUrl is not configured', async () => {
            appConfigSpy.get.and.returnValue('');

            try {
                await firstValueFrom(service.checkTimeSync(60));
                fail('Expected to throw an error');
            } catch (error) {
                expect(error.message).toBe('serverTimeUrl is not configured.');
            }
        });

        it('should throw an error if the server time endpoint returns an error', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            const expectedServerTimeUrl = 'http://fake-server-time-url';

            service.checkTimeSync(60).subscribe({
                next: () => {
                    fail('Expected to throw an error');
                },
                error: (error) => {
                    expect(error.message).toBe('Error: Failed to get server time');
                }
            });

            const req = httpMock.expectOne(expectedServerTimeUrl);
            expect(req.request.method).toBe('GET');
            req.error(new ProgressEvent(''));
        });
    });

    describe('isLocalTimeOutOfSync', () => {
        it('should return clock is out of sync', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            const expectedServerTimeUrl = 'http://fake-server-time-url';

            const timeBeforeCallingServerTimeEndpoint = 1728911579000; // (GMT): Monday, October 14, 2024 1:12:59 PM
            const timeResponseReceivedFromServerTimeEndpoint = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const localCurrentTime = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const serverTime = 1728911640000; // (GMT): Monday, October 14, 2024 1:14:00 PM

            spyOn(Date, 'now').and.returnValues(timeBeforeCallingServerTimeEndpoint, timeResponseReceivedFromServerTimeEndpoint, localCurrentTime);

            // difference between localCurrentTime and serverTime is 60 seconds plus the round trip time of 1 second
            // setting allowedClockSkewInSec to 60 seconds will make the local time out of sync
            const allowedClockSkewInSec = 60;
            service.isLocalTimeOutOfSync(allowedClockSkewInSec).subscribe((isOutOfSync) => {
                expect(isOutOfSync).toBeTrue();
            });

            const req = httpMock.expectOne(expectedServerTimeUrl);
            expect(req.request.method).toBe('GET');
            req.flush(serverTime);
        });

        it('should check time sync and return outOfSync as false when time is within allowed skew', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            const expectedServerTimeUrl = 'http://fake-server-time-url';

            const timeBeforeCallingServerTimeEndpoint = 1728911579000; // (GMT): Monday, October 14, 2024 1:12:59 PM
            const timeResponseReceivedFromServerTimeEndpoint = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const localCurrentTime = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM

            const serverTime = 1728911640000; // (GMT): Monday, October 14, 2024 1:14:00 PM

            spyOn(Date, 'now').and.returnValues(timeBeforeCallingServerTimeEndpoint, timeResponseReceivedFromServerTimeEndpoint, localCurrentTime);

            // difference between localCurrentTime and serverTime is 60 seconds plus the round trip time of 1 second
            const allowedClockSkewInSec = 61;
            service.isLocalTimeOutOfSync(allowedClockSkewInSec).subscribe((isOutOfSync) => {
                expect(isOutOfSync).toBeFalse();
            });

            const req = httpMock.expectOne(expectedServerTimeUrl);
            expect(req.request.method).toBe('GET');
            req.flush(serverTime);
        });
    });

    describe('syncClockOffset', () => {
        it('should store a positive offset when the local clock is behind the server', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            const timeBeforeRequest = 1728911579000; // (GMT): Monday, October 14, 2024 1:12:59 PM
            const timeResponseReceived = 1728911580000; // (GMT): Monday, October 14, 2024 1:13:00 PM
            const timeAfterOffsetCalc = 1728911580000;

            // Server is 60 seconds ahead of the client
            const serverTime = 1728911640000; // (GMT): Monday, October 14, 2024 1:14:00 PM
            // adjustedServerTime = 1728911640000 + 1000/2 = 1728911640500
            // expectedOffset = 1728911640500 - 1728911580000 = 60500 ms

            spyOn(Date, 'now').and.returnValues(timeBeforeRequest, timeResponseReceived, timeAfterOffsetCalc);

            service.syncClockOffset().subscribe(() => {
                expect(service.clockOffsetMs).toBe(60500);
            });

            const req = httpMock.expectOne('http://fake-server-time-url');
            req.flush(serverTime);
        });

        it('should store 0 offset when local clock matches the server', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            const requestTime = 1728911580000;
            const responseTime = 1728911580000;
            const afterCalcTime = 1728911580000;
            const serverTime = 1728911580000; // same as local

            spyOn(Date, 'now').and.returnValues(requestTime, responseTime, afterCalcTime);

            service.syncClockOffset().subscribe(() => {
                // adjustedServerTime = 1728911580000 + 0/2 = 1728911580000
                // offset = 1728911580000 - 1728911580000 = 0
                expect(service.clockOffsetMs).toBe(0);
            });

            const req = httpMock.expectOne('http://fake-server-time-url');
            req.flush(serverTime);
        });

        it('should leave clockOffsetMs at 0 when serverTimeUrl is not configured', () => {
            appConfigSpy.get.and.returnValue('');

            service.syncClockOffset().subscribe(() => {
                expect(service.clockOffsetMs).toBe(0);
            });

            httpMock.expectNone('http://fake-server-time-url');
        });

        it('should leave clockOffsetMs at 0 when the server time endpoint fails', () => {
            appConfigSpy.get.and.returnValue('http://fake-server-time-url');

            service.syncClockOffset().subscribe(() => {
                expect(service.clockOffsetMs).toBe(0);
            });

            const req = httpMock.expectOne('http://fake-server-time-url');
            req.error(new ProgressEvent(''));
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
});
