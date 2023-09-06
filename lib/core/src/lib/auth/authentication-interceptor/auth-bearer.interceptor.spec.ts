/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AuthBearerInterceptor } from './auth-bearer.interceptor';
import { AuthenticationService } from '../services/authentication.service';

const mockNext: HttpHandler = {
    handle: () => new Observable(subscriber => {
        subscriber.complete();
    })
};

const mockRequest = (url) => new HttpRequest('GET', url);

describe('AuthBearerInterceptor', () => {
    let interceptor: AuthBearerInterceptor;
    let authService: AuthenticationService;
    let addTokenToHeaderSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpClient,
                HttpHandler,
                AuthBearerInterceptor,
                AuthenticationService
            ]
        });

        interceptor = TestBed.inject(AuthBearerInterceptor);
        authService = TestBed.inject(AuthenticationService);

        addTokenToHeaderSpy = spyOn(authService, 'addTokenToHeader').and.returnValue(of());
    });

    it('should interceptor add auth token to NOT excluded URLs', () => {
        const mockUrls = [
            'https://example.com/someotherpath',
            'https://example.com/someotherpath/anotherpath',
            'https://example.com/test/v1/applications/service/idp/rb',
            'http://localhost:4200/deployment-service/v1/applications/idp/logs/rb',
            'http://localhost:4200/path/idp/v1/applications/idp/logs/rb',
            'http://example.com/api/auth/realms/v1/applications/idp/logs/rb'
        ];

        mockUrls.forEach((url) => {
            interceptor.intercept(mockRequest(url), mockNext);
        });

        expect(addTokenToHeaderSpy).toHaveBeenCalledTimes(mockUrls.length);
    });

    it('should interceptor pass excluded URLs without add auth token', () => {
        const mockExcludedUrls = [
            'https://example.com/resources/somepath',
            'https://example.com/assets/anotherpath',
            'http://example.com/auth/realms/testpath',
            'https://example.com/idp/',
            'https://example.com/idp/v1/applications/service/test/',
            'https://example.com/auth/realms/somepath'
        ];

        mockExcludedUrls.forEach((url) => {
            interceptor.intercept(mockRequest(url), mockNext);
        });

        expect(addTokenToHeaderSpy).not.toHaveBeenCalled();
    });

    it('should interceptor add auth token to every URL if excluded URLs array is empty', () => {
        spyOn(authService, 'getBearerExcludedUrls').and.returnValue([]);

        const mockUrls = [
            'http://example.com/auth/realms/testpath',
            'https://example.com/idp/',
            'https://example.com/idp/v1/applications/service/test/',
            'http://example.com/someotherpath',
            'https://example.com/someotherpath/anotherpath',
            'https://example.com/test/v1/applications/service/idp/rb'
        ];

        mockUrls.forEach((url) => {
            interceptor.intercept(mockRequest(url), mockNext);
        });

        expect(addTokenToHeaderSpy).toHaveBeenCalledTimes(mockUrls.length);
    });
});
