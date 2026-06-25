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
import { OAuthService } from 'angular-oauth2-oidc';
import { AppConfigService } from '../../app-config/app-config.service';
import { TimeSyncService } from '../services/time-sync.service';
import { DEFAULT_SERVER_TIME_HEADER, ServerTimeHeaderInterceptor } from './server-time-header.interceptor';

describe('ServerTimeHeaderInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let timeSyncServiceSpy: jasmine.SpyObj<TimeSyncService>;
    let appConfigSpy: jasmine.SpyObj<AppConfigService>;
    let oauthServiceSpy: jasmine.SpyObj<OAuthService>;

    const issuer = 'https://keycloak.example.com/auth/realms/my-realm';
    const discoveryUrl = `${issuer}/.well-known/openid-configuration`;
    const tokenUrl = `${issuer}/protocol/openid-connect/token`;
    const nonIssuerUrl = 'https://ecm.example.com/alfresco/api/resource';

    const serverDateHeader = 'Mon, 14 Oct 2024 13:14:00 GMT';
    const serverTimeMs = new Date(serverDateHeader).getTime();

    const requestStartTime = 1728911579000;
    const responseReceivedTime = 1728911580000;

    beforeEach(() => {
        timeSyncServiceSpy = jasmine.createSpyObj('TimeSyncService', ['updateServerTime']);
        appConfigSpy = jasmine.createSpyObj('AppConfigService', ['get']);
        appConfigSpy.get.and.returnValue(DEFAULT_SERVER_TIME_HEADER);

        oauthServiceSpy = jasmine.createSpyObj('OAuthService', [], { issuer });

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                { provide: HTTP_INTERCEPTORS, useClass: ServerTimeHeaderInterceptor, multi: true },
                { provide: TimeSyncService, useValue: timeSyncServiceSpy },
                { provide: AppConfigService, useValue: appConfigSpy },
                { provide: OAuthService, useValue: oauthServiceSpy }
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('when the request targets the OIDC issuer', () => {
        it('should capture server time from a discovery-document response', () => {
            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.get(discoveryUrl).subscribe();

            httpMock.expectOne(discoveryUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledOnceWith({
                serverTimeMs,
                requestStartTimeMs: requestStartTime,
                responseReceivedTimeMs: responseReceivedTime
            });
        });

        it('should capture server time from a token endpoint response', () => {
            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.post(tokenUrl, {}).subscribe();

            httpMock.expectOne(tokenUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledOnceWith({
                serverTimeMs,
                requestStartTimeMs: requestStartTime,
                responseReceivedTimeMs: responseReceivedTime
            });
        });
    });

    describe('when the request does not target the OIDC issuer', () => {
        it('should pass the request through unchanged without capturing server time', () => {
            httpClient.get(nonIssuerUrl).subscribe();

            httpMock.expectOne(nonIssuerUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });
    });

    describe('when the OAuthService issuer is not yet configured', () => {
        it('should not capture server time before the OAuth service is initialised', () => {
            oauthServiceSpy = jasmine.createSpyObj('OAuthService', [], { issuer: '' });
            TestBed.overrideProvider(OAuthService, { useValue: oauthServiceSpy });

            httpClient.get(discoveryUrl).subscribe();

            httpMock.expectOne(discoveryUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });
    });

    describe('when the response header is absent or invalid', () => {
        it('should not call updateServerTime when the header is missing', () => {
            httpClient.get(discoveryUrl).subscribe();

            httpMock.expectOne(discoveryUrl).flush({});

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });

        it('should not call updateServerTime when the header contains an unparseable date', () => {
            httpClient.get(discoveryUrl).subscribe();

            httpMock.expectOne(discoveryUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: 'not-a-date' } });

            expect(timeSyncServiceSpy.updateServerTime).not.toHaveBeenCalled();
        });

        it('should not call updateServerTime when the header value has no timezone indicator (ambiguous local time)', () => {
            httpClient.get(discoveryUrl).subscribe();

            httpMock.expectOne(discoveryUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: '2024-10-14T13:14:00' } });

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

                httpClient.get(discoveryUrl).subscribe();

                httpMock.expectOne(discoveryUrl).flush({}, { headers: { [DEFAULT_SERVER_TIME_HEADER]: value } });

                expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('when a custom header name is configured', () => {
        it('should read the server time from the configured header', () => {
            const customHeader = 'X-Server-Time';
            appConfigSpy.get.and.returnValue(customHeader);

            spyOn(Date, 'now').and.returnValues(requestStartTime, responseReceivedTime);

            httpClient.get(discoveryUrl).subscribe();

            httpMock.expectOne(discoveryUrl).flush({}, { headers: { [customHeader]: serverDateHeader } });

            expect(timeSyncServiceSpy.updateServerTime).toHaveBeenCalledOnceWith({
                serverTimeMs,
                requestStartTimeMs: requestStartTime,
                responseReceivedTimeMs: responseReceivedTime
            });
        });
    });
});

