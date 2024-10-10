/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let oauthService: OAuthService;
    let oauthStorage: OAuthStorage;

    beforeEach(() => {
        const oauthServiceMock = {
            tokenEndpoint: 'lv-426/token',
            getIdToken: jasmine.createSpy('getIdToken').and.returnValue(null)
        };

        const oauthStorageMock = {
            setItem: jasmine.createSpy('setItem')
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: OAuthService, useValue: oauthServiceMock },
                { provide: OAuthStorage, useValue: oauthStorageMock },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: TokenInterceptor,
                    multi: true
                }
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        oauthService = TestBed.inject(OAuthService);
        oauthStorage = TestBed.inject(OAuthStorage);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should store id_token in OAuthStorage if not already set', () => {
        const mockResponse = { id_token: 'mock-id-token' };

        httpClient.post('lv-426/token', {}).subscribe((response) => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('lv-426/token');
        expect(req.request.method).toBe('POST');

        req.flush(mockResponse);

        expect(oauthService.getIdToken).toHaveBeenCalled();
        expect(oauthStorage.setItem).toHaveBeenCalledWith('id_token', 'mock-id-token');
    });

    it('should NOT store id_token if already set', () => {
        (oauthService.getIdToken as jasmine.Spy).and.returnValue('existing-id-token');

        httpClient.post('lv-426/token', {}).subscribe((response) => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('lv-426/token');
        expect(req.request.method).toBe('POST');

        req.flush({ id_token: 'new-id-token' });

        expect(oauthService.getIdToken).toHaveBeenCalled();
        expect(oauthStorage.setItem).not.toHaveBeenCalled();
    });

    it('should NOT intercept requests to other URLs', () => {
        httpClient.get('lv-426/other').subscribe((response) => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('lv-426/other');
        expect(req.request.method).toBe('GET');

        req.flush({ data: 'test' });

        expect(oauthService.getIdToken).not.toHaveBeenCalled();
        expect(oauthStorage.setItem).not.toHaveBeenCalled();
    });
});
