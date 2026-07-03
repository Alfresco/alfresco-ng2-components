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
import { TimeSyncService } from '../services/time-sync.service';
import { DateHeaderTimeSyncInterceptor } from './date-header-time-sync.interceptor';
import { AppConfigService } from '../../app-config/app-config.service';

describe('DateHeaderTimeSyncInterceptor', () => {
    let httpMock: HttpTestingController;
    let timeSyncServiceSpy: jasmine.SpyObj<TimeSyncService>;
    let httpClient: HttpClient;
    let appConfigServiceMock: jasmine.SpyObj<AppConfigService>;

    const IAM_HOST = 'https://iam.example.com/auth/realms/alfresco';

    beforeEach(() => {
        timeSyncServiceSpy = jasmine.createSpyObj('TimeSyncService', ['updateClockOffsetFromDateHeader']);
        appConfigServiceMock = jasmine.createSpyObj('AppConfigService', ['get'], {
            oauth2: { host: IAM_HOST }
        });

        TestBed.configureTestingModule({
            providers: [
                DateHeaderTimeSyncInterceptor,
                { provide: TimeSyncService, useValue: timeSyncServiceSpy },
                { provide: AppConfigService, useValue: appConfigServiceMock },
                { provide: HTTP_INTERCEPTORS, useClass: DateHeaderTimeSyncInterceptor, multi: true },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should call updateClockOffsetFromDateHeader when IAM response contains a Date header', () => {
        const requestStartTime = 1728911579000;
        spyOn(Date, 'now').and.returnValue(requestStartTime);

        const iamUrl = `${IAM_HOST}/protocol/openid-connect/token`;
        httpClient.get(iamUrl).subscribe();

        const req = httpMock.expectOne(iamUrl);
        req.flush({}, { headers: { date: 'Mon, 14 Oct 2024 13:12:59 GMT' } });

        expect(timeSyncServiceSpy.updateClockOffsetFromDateHeader).toHaveBeenCalledWith('Mon, 14 Oct 2024 13:12:59 GMT', requestStartTime);
    });

    it('should not call updateClockOffsetFromDateHeader for non-IAM URLs', () => {
        httpClient.get('/api/content/nodes').subscribe();

        const req = httpMock.expectOne('/api/content/nodes');
        req.flush({}, { headers: { date: 'Mon, 14 Oct 2024 13:12:59 GMT' } });

        expect(timeSyncServiceSpy.updateClockOffsetFromDateHeader).not.toHaveBeenCalled();
    });

    it('should not call updateClockOffsetFromDateHeader when IAM response has no Date header', () => {
        const iamUrl = `${IAM_HOST}/protocol/openid-connect/token`;
        httpClient.get(iamUrl).subscribe();

        const req = httpMock.expectOne(iamUrl);
        req.flush({});

        expect(timeSyncServiceSpy.updateClockOffsetFromDateHeader).not.toHaveBeenCalled();
    });

    it('should not call updateClockOffsetFromDateHeader when oauth2 host is not configured', () => {
        (Object.getOwnPropertyDescriptor(appConfigServiceMock, 'oauth2')?.get as jasmine.Spy).and.returnValue({ host: '' });

        httpClient.get('/test').subscribe();

        const req = httpMock.expectOne('/test');
        req.flush({}, { headers: { date: 'Mon, 14 Oct 2024 13:12:59 GMT' } });

        expect(timeSyncServiceSpy.updateClockOffsetFromDateHeader).not.toHaveBeenCalled();
    });

    it('should pass through the request unchanged', () => {
        const iamUrl = `${IAM_HOST}/protocol/openid-connect/token`;
        httpClient.get(iamUrl).subscribe();

        const req = httpMock.expectOne(iamUrl);
        expect(req.request.method).toBe('GET');
        expect(req.request.url).toBe(iamUrl);
        req.flush({ data: 'value' });
    });
});
