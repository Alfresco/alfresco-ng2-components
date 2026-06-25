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

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { TimeSyncService } from '../services/time-sync.service';
import { DEFAULT_SERVER_TIME_HEADER, ServerTimeHeaderInterceptor } from './server-time-header.interceptor';

describe('ServerTimeHeaderInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let timeSyncServiceSpy: jasmine.SpyObj<TimeSyncService>;
    let appConfigSpy: jasmine.SpyObj<AppConfigService>;

    const ecmHost = 'http://ecm.example.com';
    const bpmHost = 'http://bpm.example.com';
    const ecmApiUrl = `${ecmHost}/alfresco/api/some-resource`;
    const bpmApiUrl = `${bpmHost}/activiti-app/api/some-resource`;
    const thirdPartyUrl = 'https://idp.external.com/token';

    const serverDateHeader = 'Mon, 14 Oct 2024 13:14:00 GMT';
    const serverTimeMs = new Date(serverDateHeader).getTime(); // 1728911640000

    const requestStartTime = 1728911579000;
    const responseReceivedTime = 1728911580000;

    beforeEach(() => {
        timeSyncServiceSpy = jasmine.createSpyObj('TimeSyncService', ['updateServerTime']);
        appConfigSpy = jasmine.createSpyObj('AppConfigService', ['get']);

        // Default config: ecmHost + bpmHost set, no explicit allowlist, default header
        appConfigSpy.get.and.callFake((key: string, defaultValue?: unknown) => {
            if (key === 'serverTimeAllowedOrigins') { return []; }
            if (key === AppConfigValues.ECMHOST) { return ecmHost; }
            if (key === AppConfigValues.BPMHOST) { return bpmHost; }
            if (key === 'serverTimeHeader') { return DEFAULT_SERVER_TIME_HEADER; }
            return defaultValue;
        });

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                { provide: HTTP_INTERCEPTORS, useClass: ServerTimeHeaderInterceptor, multi: true },
                { provide: TimeSyncService, useValue: timeSyncServiceSpy },
                { provide: AppConfigService, useValue: appConfigSpy }
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('when the response comes from an allowed backend origin', () => {
        it('should call updateServerTime for a response from ecmHost', () => {
            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.get(ecmApiUrl).subscribe();

            httpMock.expectOne(ecmApiUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledOnceWith({
                serverTimeMs,
                requestStartTimeMs: requestStartTime,
                responseReceivedTimeMs: responseReceivedTime
            });
        });

        it('should call updateServerTime for a response from bpmHost', () => {
            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.get(bpmApiUrl).subscribe();

            httpMock.expectOne(bpmApiUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledOnceWith({
                serverTimeMs,
                requestStartTimeMs: requestStartTime,
                responseReceivedTimeMs: responseReceivedTime
            });
        });
    });

    describe('when the response comes from a non-backend origin', () => {
        it('should not call updateServerTime for third-party URLs (e.g. IdP)', () => {
            httpClient.get(thirdPartyUrl).subscribe();

            httpMock.expectOne(thirdPartyUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });
    });

    describe('when serverTimeAllowedOrigins is explicitly configured', () => {
        it('should only capture from the explicitly listed origins', () => {
            const customOrigin = 'https://my-custom-backend.example.com';
            appConfigSpy.get.and.callFake((key: string, defaultValue?: unknown) => {
                if (key === 'serverTimeAllowedOrigins') { return [customOrigin]; }
                if (key === 'serverTimeHeader') { return DEFAULT_SERVER_TIME_HEADER; }
                return defaultValue;
            });

            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.get(`${customOrigin}/api/resource`).subscribe();
            httpMock.expectOne(`${customOrigin}/api/resource`).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledTimes(1);
        });

        it('should not capture from ecmHost or bpmHost when an explicit allowlist is set', () => {
            const customOrigin = 'https://my-custom-backend.example.com';
            appConfigSpy.get.and.callFake((key: string, defaultValue?: unknown) => {
                if (key === 'serverTimeAllowedOrigins') { return [customOrigin]; }
                if (key === 'serverTimeHeader') { return DEFAULT_SERVER_TIME_HEADER; }
                return defaultValue;
            });

            httpClient.get(ecmApiUrl).subscribe();
            httpMock.expectOne(ecmApiUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });
    });

    describe('when no backend origins are configured at all', () => {
        it('should accept responses from any origin as a fallback', () => {
            appConfigSpy.get.and.callFake((key: string, defaultValue?: unknown) => {
                if (key === 'serverTimeAllowedOrigins') { return []; }
                if (key === AppConfigValues.ECMHOST) { return ''; }
                if (key === AppConfigValues.BPMHOST) { return ''; }
                if (key === 'serverTimeHeader') { return DEFAULT_SERVER_TIME_HEADER; }
                return defaultValue;
            });

            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.get(thirdPartyUrl).subscribe();
            httpMock.expectOne(thirdPartyUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the response header is absent or invalid', () => {
        it('should not call updateServerTime when the header is missing', () => {
            httpClient.get(ecmApiUrl).subscribe();

            httpMock.expectOne(ecmApiUrl).flush({});

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });

        it('should not call updateServerTime when the header contains an unparseable date', () => {
            httpClient.get(ecmApiUrl).subscribe();

            httpMock.expectOne(ecmApiUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: 'not-a-date' } });

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });

        it('should not call updateServerTime when the header value has no timezone indicator (ambiguous local time)', () => {
            // A custom backend might send "2024-10-14T13:14:00" without a timezone.
            // new Date() would treat this as local time — silently wrong. We must reject it.
            httpClient.get(ecmApiUrl).subscribe();

            httpMock.expectOne(ecmApiUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: '2024-10-14T13:14:00' } });

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });
    });

    describe('UTC timezone indicator acceptance', () => {
        const utcFormats: Array<{ label: string; value: string }> = [
            { label: 'RFC 7231 GMT suffix', value: 'Mon, 14 Oct 2024 13:14:00 GMT' },
            { label: 'ISO-8601 Z suffix', value: '2024-10-14T13:14:00Z' },
            { label: 'ISO-8601 UTC suffix', value: '2024-10-14T13:14:00 UTC' },
            { label: 'ISO-8601 positive offset', value: '2024-10-14T13:14:00+00:00' },
            { label: 'ISO-8601 negative offset', value: '2024-10-14T08:14:00-05:00' }
        ];

        utcFormats.forEach(({ label, value }) => {
            it(`should call updateServerTime for a value with ${label}`, () => {
                spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

                httpClient.get(ecmApiUrl).subscribe();

                httpMock.expectOne(ecmApiUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: value } });

                expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('when a custom header name is configured', () => {
        it('should read the server time from the configured header', () => {
            const customHeader = 'X-Server-Time';
            appConfigSpy.get.and.callFake((key: string, defaultValue?: unknown) => {
                if (key === 'serverTimeAllowedOrigins') { return []; }
                if (key === AppConfigValues.ECMHOST) { return ecmHost; }
                if (key === AppConfigValues.BPMHOST) { return bpmHost; }
                if (key === 'serverTimeHeader') { return customHeader; }
                return defaultValue;
            });

            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.get(ecmApiUrl).subscribe();
            httpMock.expectOne(ecmApiUrl).flush({}, { headers: { [customHeader]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledOnceWith({
                serverTimeMs,
                requestStartTimeMs: requestStartTime,
                responseReceivedTimeMs: responseReceivedTime
            });
        });
    });
});

