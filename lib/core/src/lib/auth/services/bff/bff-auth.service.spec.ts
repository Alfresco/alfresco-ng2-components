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

import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { BffAuthService, BffUserResponse } from './bff-auth.service';
import { BffUrlBuilder } from './bff-url-builder.service';
import { DOCUMENT } from '@angular/common';

describe('BffAuthService', () => {
    let service: BffAuthService;
    let httpMock: HttpTestingController;
    let urlBuilder: jasmine.SpyObj<BffUrlBuilder>;
    let mockDocument: any;

    const mockAuthenticatedUser: BffUserResponse = {
        isAuthenticated: true,
        user: {
            sub: 'user-123',
            email: 'test@example.com',
            hxp_account: 'account-456',
            name: 'Test User',
            email_verified: true,
            preferred_username: 'testuser',
            given_name: 'Test',
            family_name: 'User',
            roles: ['admin', 'user'],
            appKey: 'app-key-789'
        }
    };

    const mockUnauthenticatedUser: BffUserResponse = {
        isAuthenticated: false,
        user: {
            sub: '',
            email: '',
            hxp_account: '',
            name: '',
            email_verified: false,
            preferred_username: '',
            given_name: '',
            family_name: '',
            roles: [],
            appKey: ''
        }
    };

    // eslint-disable-next-line jsdoc/require-jsdoc
    function flushConstructorRequests() {
        httpMock.match(urlBuilder.getUserUrl()).forEach((req) => req.flush(mockAuthenticatedUser));
    }

    beforeEach(() => {
        urlBuilder = jasmine.createSpyObj<BffUrlBuilder>('BffUrlBuilder', ['getUserUrl', 'getLoginUrl', 'getLogoutUrl']);
        urlBuilder.getUserUrl.and.returnValue('http://hawkins-lab:1983/fakePath/bff/user');
        urlBuilder.getLoginUrl.and.callFake((returnUrl?: string) => {
            if (!returnUrl || returnUrl === '/') {
                return 'http://hawkins-lab:1983/fakePath/bff/login';
            }
            return `http://hawkins-lab:1983/fakePath/bff/login?returnUrl=${encodeURIComponent(returnUrl)}`;
        });
        urlBuilder.getLogoutUrl.and.returnValue('http://hawkins-lab:1983/fakePath/bff/logout');

        mockDocument = {
            location: {
                href: '',
                reload: () => {}
            }
        };

        TestBed.configureTestingModule({
            providers: [
                BffAuthService,
                { provide: BffUrlBuilder, useValue: urlBuilder },
                { provide: DOCUMENT, useValue: mockDocument },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        spyOn(mockDocument.location, 'reload');
        service = TestBed.inject(BffAuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('getUser', () => {
        it('should call urlBuilder.getUserUrl and return authenticated user', async () => {
            flushConstructorRequests();
            const resultPromise = firstValueFrom(service.getUser());
            const req = httpMock.expectOne(urlBuilder.getUserUrl.calls.mostRecent().returnValue);
            expect(req.request.method).toBe('GET');
            req.flush(mockAuthenticatedUser);
            const result = await resultPromise;
            expect(urlBuilder.getUserUrl).toHaveBeenCalled();
            expect(result).toEqual(mockAuthenticatedUser);
        });

        it('should return unauthenticated user when user is not logged in', async () => {
            httpMock.match(urlBuilder.getUserUrl()).forEach((req) => req.flush(mockUnauthenticatedUser));
            const resultPromise = firstValueFrom(service.getUser());
            const req = httpMock.expectOne(urlBuilder.getUserUrl.calls.mostRecent().returnValue);
            expect(req.request.method).toBe('GET');
            req.flush(mockUnauthenticatedUser);
            const result = await resultPromise;
            expect(result).toEqual(mockUnauthenticatedUser);
        });

        it('should handle error when getUser fails', async () => {
            flushConstructorRequests();
            try {
                const result = firstValueFrom(service.getUser());
                const req = httpMock.expectOne(urlBuilder.getUserUrl.calls.mostRecent().returnValue);
                req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
                await result;
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.status).toBe(401);
            }
        });

        it('should use custom URL from urlBuilder', async () => {
            flushConstructorRequests();
            service.getUser().subscribe();
            const req = httpMock.expectOne(urlBuilder.getUserUrl.calls.mostRecent().returnValue);
            expect(req.request.url).toBe('http://hawkins-lab:1983/fakePath/bff/user');
        });
    });

    describe('login', () => {
        it('should redirect to login url when no returnUrl is provided', () => {
            flushConstructorRequests();
            service.login();
            expect(urlBuilder.getLoginUrl).toHaveBeenCalledWith(undefined);
            expect(mockDocument.location.href).toBe(urlBuilder.getLoginUrl.calls.mostRecent().returnValue);
        });
        it('should redirect to login url when returnUrl is root', () => {
            flushConstructorRequests();
            service.login('/');
            expect(urlBuilder.getLoginUrl).toHaveBeenCalledWith('/');
            expect(mockDocument.location.href).toBe(urlBuilder.getLoginUrl.calls.mostRecent().returnValue);
        });
        it('should redirect to login url with returnUrl when currentUrl is provided', () => {
            flushConstructorRequests();
            service.login('/dashboard');
            expect(urlBuilder.getLoginUrl).toHaveBeenCalledWith('/dashboard');
            expect(mockDocument.location.href).toBe(urlBuilder.getLoginUrl.calls.mostRecent().returnValue);
        });
        it('should properly encode returnUrl parameter', () => {
            flushConstructorRequests();
            service.login('/path?query=value&other=data');
            expect(urlBuilder.getLoginUrl).toHaveBeenCalledWith('/path?query=value&other=data');
            expect(mockDocument.location.href).toBe(urlBuilder.getLoginUrl.calls.mostRecent().returnValue);
        });
    });

    describe('logout', () => {
        it('should call urlBuilder.getLogoutUrl and redirect to default location on success', () => {
            flushConstructorRequests();
            service.logout();
            const req = httpMock.expectOne(urlBuilder.getLogoutUrl.calls.mostRecent().returnValue);
            expect(req.request.method).toBe('POST');
            req.flush({});
            expect(mockDocument.location.href).toBe('/');
        });
        it('should redirect to custom redirectTo location when provided', () => {
            flushConstructorRequests();
            service.logout();
            const req = httpMock.expectOne(urlBuilder.getLogoutUrl.calls.mostRecent().returnValue);
            req.flush({ redirectTo: '/custom-logout' });
            expect(mockDocument.location.href).toBe('/custom-logout');
        });
        it('should reload page on logout error', () => {
            flushConstructorRequests();
            service.logout();
            const req = httpMock.expectOne(urlBuilder.getLogoutUrl.calls.mostRecent().returnValue);
            req.flush('Server Error', { status: 500, statusText: 'Server Error' });
            expect(mockDocument.location.reload).toHaveBeenCalled();
        });
    });

    describe('constructor', () => {
        it('should set isAuthenticated to true when user is authenticated', async () => {
            flushConstructorRequests();
            const isLoggedIn = await firstValueFrom(service.onLogin);
            expect(isLoggedIn).toBe(true);
            expect(service.isAuthenticated).toBe(true);
        });
        it('should not emit onLogin when user is not authenticated', fakeAsync(() => {
            httpMock.match(urlBuilder.getUserUrl()).forEach((req) => req.flush(mockUnauthenticatedUser));
            let emitted = false;
            service.onLogin.subscribe((val) => {
                if (val) emitted = true;
            });
            tick(100);
            expect(emitted).toBe(false);
            expect(service.isAuthenticated).toBe(false);
        }));
        it('should populate userInfo from getUser response', fakeAsync(() => {
            flushConstructorRequests();
            tick(100);
            expect(service.userInfo).toEqual(mockAuthenticatedUser);
            expect(service.userInfo.user.email).toBe('test@example.com');
        }));
    });

    describe('interface methods', () => {
        beforeEach(() => {
            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/fakePath/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));
        });

        it('should return empty string for getToken', () => {
            expect(service.getToken()).toBe('');
        });

        it('should return isAuthenticated for isLoggedIn', () => {
            service.isAuthenticated = true;
            expect(service.isLoggedIn()).toBe(true);

            service.isAuthenticated = false;
            expect(service.isLoggedIn()).toBe(false);
        });

        it('should return true for isOauth', () => {
            expect(service.isOauth()).toBe(true);
        });

        it('should return false for isECMProvider', () => {
            expect(service.isECMProvider()).toBe(false);
        });

        it('should return false for isBPMProvider', () => {
            expect(service.isBPMProvider()).toBe(false);
        });

        it('should return false for isALLProvider', () => {
            expect(service.isALLProvider()).toBe(false);
        });

        it('should return empty string for getUsername', () => {
            expect(service.getUsername()).toBe('');
        });

        it('should return header unchanged for getAuthHeaders', () => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const result = service.getAuthHeaders('/test', headers);
            expect(result).toBe(headers);
        });

        it('should return headers as observable for addTokenToHeader', async () => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const result = await firstValueFrom(service.addTokenToHeader('/test', headers));
            expect(result).toBe(headers);
        });

        it('should handle addTokenToHeader with no headers argument', async () => {
            const result = await firstValueFrom(service.addTokenToHeader('/test'));
            expect(result).toBeInstanceOf(HttpHeaders);
        });

        it('should have reset method that does nothing', () => {
            expect(() => service.reset()).not.toThrow();
        });
    });
});
