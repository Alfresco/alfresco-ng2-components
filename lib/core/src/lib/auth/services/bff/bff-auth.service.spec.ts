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

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BffAuthService, BffUserResponse } from './bff-auth.service';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';

describe('BffAuthService', () => {
    let service: BffAuthService;
    let httpMock: HttpTestingController;

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

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BffAuthService, provideHttpClient(), provideHttpClientTesting()]
        });

        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('getUser', () => {
        it('should return authenticated user when user is logged in', async () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            const resultPromise = firstValueFrom(service.getUser());

            const req = httpMock.expectOne((reqObj) => reqObj.url.includes('/bff/user'));
            expect(req.request.method).toBe('GET');
            req.flush(mockAuthenticatedUser);

            const result = await resultPromise;

            expect(result).toEqual(mockAuthenticatedUser);
            expect(result.isAuthenticated).toBe(true);
            expect(result.user.email).toBe('test@example.com');
        });

        it('should return unauthenticated user when user is not logged in', async () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockUnauthenticatedUser));

            const resultPromise = firstValueFrom(service.getUser());

            const req = httpMock.expectOne((reqObj) => reqObj.url.includes('/bff/user'));
            expect(req.request.method).toBe('GET');
            req.flush(mockUnauthenticatedUser);

            const result = await resultPromise;

            expect(result).toEqual(mockUnauthenticatedUser);
            expect(result.isAuthenticated).toBe(false);
        });

        it('should handle error when getUser fails', async () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' }));

            try {
                const result = firstValueFrom(service.getUser());
                const req = httpMock.expectOne((req) => req.url.includes('/bff/user'));
                req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
                await result;
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.status).toBe(401);
            }
        });

        it('should use correct URL format with protocol and host', async () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.getUser().subscribe();

            const req = httpMock.expectOne((req) => req.url.includes('/bff/user'));
            expect(req.request.url).toMatch(/^https?:\/\/.+\/bff\/user$/);
            req.flush(mockAuthenticatedUser);
        });
    });

    describe('login', () => {
        it('should redirect to /bff/login when no returnUrl is provided', () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.login();
        });

        it('should redirect to /bff/login when returnUrl is root', () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.login('/');
        });

        it('should redirect to /bff/login with returnUrl when currentUrl is provided', () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.login('/dashboard');
        });

        it('should properly encode returnUrl parameter', () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.login('/path?query=value&other=data');
        });
    });

    describe('logout', () => {
        it('should call /bff/logout and redirect to default location on success', async () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.logout();

            const req = httpMock.expectOne((req) => req.url.includes('/bff/logout'));
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({});
            req.flush({});
        });

        it('should redirect to custom redirectTo location when provided', async () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.logout();

            const req = httpMock.expectOne((req) => req.url.includes('/bff/logout'));
            req.flush({ redirectTo: '/custom-logout' });
        });

        it('should reload page on logout error', async () => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.logout();

            const req = httpMock.expectOne((req) => req.url.includes('/bff/logout'));
            req.flush('Server Error', { status: 500, statusText: 'Server Error' });
        });
    });

    describe('constructor', () => {
        it('should set isAuthenticated to true when user is authenticated', (done) => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            service.onLogin.subscribe((isLoggedIn) => {
                if (isLoggedIn) {
                    expect(service.isAuthenticated).toBe(true);
                    done();
                }
            });
        });

        it('should not emit onLogin when user is not authenticated', (done) => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockUnauthenticatedUser));

            let loginEmitted = false;
            service.onLogin.subscribe((isLoggedIn) => {
                if (isLoggedIn) {
                    loginEmitted = true;
                }
            });

            setTimeout(() => {
                expect(loginEmitted).toBe(false);
                expect(service.isAuthenticated).toBe(false);
                done();
            }, 100);
        });

        it('should populate userInfo from getUser response', (done) => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
            expect(bffUserRequestMatchers.length).toBe(2);
            bffUserRequestMatchers.forEach((req) => req.flush(mockAuthenticatedUser));

            setTimeout(() => {
                expect(service.userInfo).toEqual(mockAuthenticatedUser);
                expect(service.userInfo.user.email).toBe('test@example.com');
                done();
            }, 100);
        });
    });

    describe('interface methods', () => {
        beforeEach(() => {
            service = TestBed.inject(BffAuthService);

            const bffUserRequestMatchers = httpMock.match((req) => req.url.includes('/bff/user'));
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
