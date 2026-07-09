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
import { AppConfigService } from '../../app-config/app-config.service';
import { TimeSyncService } from './time-sync.service';

const SERVER_NOW = Date.UTC(2025, 0, 15, 12, 0, 0);
const SERVER_TIME_URL = '/identity-adapter-service/v1/server/time';
const MAX_ALLOWED_CLOCK_SKEW_IN_SEC = 120;

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
    serverTimeUrl?: string;
    omitServerTimeUrl?: boolean;
}

interface TimeSyncResult {
    outOfSync: boolean;
    timeOffsetInSec?: number;
    localDateTimeISO: string;
    serverDateTimeISO: string;
}

describe('TimeSyncService', () => {
    let service: TimeSyncService;
    let httpMock: HttpTestingController;
    let appConfigService: AppConfigService;

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

    const configureApp = (options: AppConfigOptions = {}): void => {
        appConfigService.config = {
            oauth2: options.omitTimeSync ? {} : { timeSync: options.timeSync ?? true }
        };

        if (!options.omitServerTimeUrl) {
            appConfigService.config.serverTimeUrl = options.serverTimeUrl ?? SERVER_TIME_URL;
        }
    };

    const rawLocalInstantFor = ({ skewSeconds, direction }: Pick<ClockSkewScenario, 'skewSeconds' | 'direction'>): number =>
        direction === 'behind' ? SERVER_NOW - skewSeconds * 1000 : SERVER_NOW + skewSeconds * 1000;

    const expectedOffsetInMsFor = (localNow: number, serverNow = SERVER_NOW): number => serverNow - localNow;

    const expectServerTimeRequest = (url = SERVER_TIME_URL): TestRequest => {
        const request = httpMock.expectOne(url);

        expect(request.request.method).toBe('GET');
        expect(request.request.responseType).toBe('json');

        return request;
    };

    const expectTimeSyncResult = (result: TimeSyncResult, expected: TimeSyncResult): void => {
        expect(result).toEqual(expected);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeSyncService, provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(TimeSyncService);
        httpMock = TestBed.inject(HttpTestingController);
        appConfigService = TestBed.inject(AppConfigService);
        configureApp();
    });

    afterEach(() => {
        httpMock.verify();
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
            expectServerTimeRequest().flush(SERVER_NOW);
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should correct a fast local clock when timeSync is the string true', async () => {
            configureApp({ timeSync: 'true' });
            spyOn(Date, 'now').and.returnValue(SERVER_NOW + 238_000);

            const sync = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().flush(SERVER_NOW);
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should convert epoch seconds from the server time response', async () => {
            spyOn(Date, 'now').and.returnValue(SERVER_NOW - 60_000);

            const sync = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().flush(SERVER_NOW / 1000);
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW);
        });

        it('should keep raw local time when timeSync is true but serverTimeUrl is missing', async () => {
            configureApp({ omitServerTimeUrl: true });
            spyOn(Date, 'now').and.returnValue(SERVER_NOW + 238_000);

            await firstValueFrom(service.syncClockOffset());

            httpMock.expectNone(() => true);
            expect(service.getCorrectedNow()).toBe(SERVER_NOW + 238_000);
        });

        it('should keep raw local time when timeSync is true but the server time request fails', async () => {
            spyOn(Date, 'now').and.returnValue(SERVER_NOW - 238_000);

            const sync = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().error(new ProgressEvent('error'));
            await sync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW - 238_000);
        });

        it('should fall back to raw local time when a later sync fails after a successful sync', async () => {
            let localNow = SERVER_NOW - 238_000;
            spyOn(Date, 'now').and.callFake(() => localNow);

            const successfulSync = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().flush(SERVER_NOW);
            await successfulSync;

            localNow = SERVER_NOW + 60_000;
            const failedSync = firstValueFrom(service.syncClockOffset());
            expectServerTimeRequest().error(new ProgressEvent('error'));
            await failedSync;

            expect(service.getCorrectedNow()).toBe(SERVER_NOW + 60_000);
        });
    });

    describe('checkTimeSync', () => {
        it('should error when the server time request fails', async () => {
            spyOn(Date, 'now').and.returnValue(SERVER_NOW);

            const check = firstValueFrom(service.checkTimeSync(MAX_ALLOWED_CLOCK_SKEW_IN_SEC));
            expectServerTimeRequest().error(new ProgressEvent('error'));

            await expectAsync(check).toBeRejectedWithError('Error: Failed to get server time');
        });

        it('should use a custom serverTimeUrl', async () => {
            const serverTimeUrl = 'https://example.com/server-time';
            configureApp({ serverTimeUrl });
            spyOn(Date, 'now').and.returnValue(SERVER_NOW);

            const check = firstValueFrom(service.checkTimeSync(MAX_ALLOWED_CLOCK_SKEW_IN_SEC));
            expectServerTimeRequest(serverTimeUrl).flush(SERVER_NOW);

            expectTimeSyncResult(await check, {
                outOfSync: false,
                timeOffsetInSec: 0,
                localDateTimeISO: new Date(SERVER_NOW).toISOString(),
                serverDateTimeISO: new Date(SERVER_NOW).toISOString()
            });
        });
    });

    describe('clock skew scenario matrix', () => {
        describe('timeSync not configured', () => {
            clockSkewScenarios.forEach((scenario) => {
                it(`${scenario.id}: should keep raw local time for ${scenario.description}`, async () => {
                    configureApp({ omitTimeSync: true });
                    const rawLocalNow = rawLocalInstantFor(scenario);
                    spyOn(Date, 'now').and.returnValue(rawLocalNow);

                    await firstValueFrom(service.syncClockOffset());

                    httpMock.expectNone(() => true);
                    expect(service.getCorrectedNow()).toBe(rawLocalNow);
                });
            });
        });

        describe('timeSync false', () => {
            clockSkewScenarios.forEach((scenario) => {
                it(`${scenario.id}: should run the old raw-clock skew check for ${scenario.description}`, async () => {
                    configureApp({ timeSync: false });
                    const rawLocalNow = rawLocalInstantFor(scenario);
                    spyOn(Date, 'now').and.returnValue(rawLocalNow);

                    const check = firstValueFrom(service.checkTimeSync(MAX_ALLOWED_CLOCK_SKEW_IN_SEC));
                    expectServerTimeRequest().flush(SERVER_NOW);

                    expectTimeSyncResult(await check, {
                        outOfSync: scenario.skewSeconds > MAX_ALLOWED_CLOCK_SKEW_IN_SEC,
                        timeOffsetInSec: scenario.skewSeconds,
                        localDateTimeISO: new Date(rawLocalNow).toISOString(),
                        serverDateTimeISO: new Date(SERVER_NOW).toISOString()
                    });
                    expect(service.getCorrectedNow()).toBe(rawLocalNow);
                });
            });
        });

        describe('timeSync true but server time fails', () => {
            clockSkewScenarios.forEach((scenario) => {
                it(`${scenario.id}: should fall back to raw local time for ${scenario.description}`, async () => {
                    const rawLocalNow = rawLocalInstantFor(scenario);
                    spyOn(Date, 'now').and.returnValue(rawLocalNow);

                    const sync = firstValueFrom(service.syncClockOffset());
                    expectServerTimeRequest().error(new ProgressEvent('error'));
                    await sync;

                    expect(service.getCorrectedNow()).toBe(rawLocalNow);
                });
            });
        });

        describe('timeSync true and server time succeeds', () => {
            clockSkewScenarios.forEach((scenario) => {
                it(`${scenario.id}: should correct ${scenario.description} and report the clock as in sync`, async () => {
                    const rawLocalNow = rawLocalInstantFor(scenario);
                    spyOn(Date, 'now').and.returnValue(rawLocalNow);

                    const check = firstValueFrom(service.checkTimeSync(MAX_ALLOWED_CLOCK_SKEW_IN_SEC));
                    expectServerTimeRequest().flush(SERVER_NOW);

                    expectTimeSyncResult(await check, {
                        outOfSync: false,
                        timeOffsetInSec: 0,
                        localDateTimeISO: new Date(SERVER_NOW).toISOString(),
                        serverDateTimeISO: new Date(SERVER_NOW).toISOString()
                    });
                    expect(service.getCorrectedNow()).toBe(SERVER_NOW);
                    expect(service.getCorrectedNow()).toBe(rawLocalNow + expectedOffsetInMsFor(rawLocalNow));
                });
            });
        });
    });
});
