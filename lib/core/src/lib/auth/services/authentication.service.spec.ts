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

import { TestBed, fakeAsync } from '@angular/core/testing';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from '../../common/services/cookie.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APP_INITIALIZER } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigServiceMock } from '../../common/mock/app-config.service.mock';
import { AlfrescoApiLoaderService, createAlfrescoApiInstance } from '../../api-factories/alfresco-api-v2-loader.service';
import { CookieServiceMock } from '../../mock/cookie.service.mock';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';

declare let jasmine: any;

fdescribe('AuthenticationService', () => {
    let apiService: AlfrescoApiService;
    let authService: AuthenticationService;
    let appConfigService: AppConfigService;
    let cookie: CookieService;
    let httpMock: HttpTestingController;

    const apiServiceMock: any = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve({})
        },
        contentAuth: {
            ticket: ''
        },
        isEcmLoggedIn: () => false,
        login: () => { },
        isLoggedIn: () => {},
        getTicketEcm: () => {},
        isOauthConfiguration: () => {},
        isEcmConfiguration: () => false,
        reply: jasmine.createSpy('reply')
     };


    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                { provide: CookieService, useClass: CookieServiceMock },
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                {
                    provide: APP_INITIALIZER,
                    useFactory: createAlfrescoApiInstance,
                    deps: [AlfrescoApiLoaderService],
                    multi: true
                },
                AuthenticationService
            ]
        });

        apiService = TestBed.inject(AlfrescoApiService);
        authService = TestBed.inject(AuthenticationService);
        httpMock = TestBed.inject(HttpTestingController);
        cookie = TestBed.inject(CookieService);
        appConfigService = TestBed.inject(AppConfigService);

        cookie.clear();
        sessionStorage.clear();
        localStorage.clear();

        appConfigService.config.pagination = {
            supportedPageSizes: []
        };
        jasmine.Ajax.install();
    });

    afterEach(() => {
        cookie.clear();
        httpMock.verify();
        jasmine.Ajax.uninstall();
    });

    describe('kerberos', () => {
        beforeEach(() => {
            appConfigService.config.providers = 'ALL';
            appConfigService.config.auth = { withCredentials: true };
        });

        it('should emit login event for kerberos', (done) => {
            const disposableLogin = authService.onLogin.subscribe((value) => {
                expect(value).toEqual({});
                disposableLogin.unsubscribe();
                done();
            });
            appConfigService.load();
        });
    });

    describe('when the setting is ECM', () => {

        const fakeECMLoginResponse = { type: 'ECM', ticket: 'fake-post-ticket' };

        beforeEach(() => {
            appConfigService.config.auth = { withCredentials: false };
            appConfigService.config.providers = 'ECM';
            appConfigService.load();
        });

        it('should not require cookie service enabled for ECM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(false);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isECMProvider').and.returnValue(true);
            spyOn(authService, 'isOauth').and.returnValue(false);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isEcmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).toHaveBeenCalled();
        });

        it('should check if loggedin on ECM in case the provider is ECM', () => {
            spyOn(apiService, 'getInstance').and.returnValue(apiServiceMock);
            spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
            expect(authService.isLoggedInWith('ECM')).toBe(true);
        });

        it('should require remember me set for ECM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(true);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isECMProvider').and.returnValue(true);
            spyOn(authService, 'isOauth').and.returnValue(false);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isEcmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).not.toHaveBeenCalled();
        });

        it('[ECM] should return an ECM ticket after the login done', (done) => {
            spyOn(apiService, 'getInstance').and.returnValue(apiServiceMock);
            const loginResult = { entry: { id: 'fake-post-ticket', userId: 'admin' } };
            spyOn(apiService.getInstance(), 'login').and.returnValue(Promise.resolve(loginResult));
            spyOn(apiService.getInstance(), 'isLoggedIn').and.returnValue(true);
            spyOn(apiService.getInstance(), 'getTicketEcm').and.returnValue('fake-post-ticket');
            spyOn(apiService.getInstance(), 'isEcmLoggedIn').and.returnValue(true);
            spyOn(apiService.getInstance(), 'isOauthConfiguration').and.returnValue(false);
            spyOn(apiService.getInstance(), 'isEcmConfiguration').and.returnValue(true);

            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe((response) => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
                expect(authService.isEcmLoggedIn()).toBe(true);
                expect(response.type).toBe('ECM');
                expect(response.ticket).toEqual(loginResult);
                disposableLogin.unsubscribe();
                done();
            });
        });

        it('[ECM] should login in the ECM if no provider are defined calling the login', fakeAsync(() => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe((loginResponse) => {
                expect(loginResponse).toEqual(fakeECMLoginResponse);
                disposableLogin.unsubscribe();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });
        }));

        it('[ECM] should return a ticket undefined after logout', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                const disposableLogout = authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    disposableLogout.unsubscribe();
                    done();
                });

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 204
                });
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });
        });

        it('[ECM] should return false if the user is not logged in', () => {
            expect(authService.isLoggedIn()).toBe(false);
            expect(authService.isEcmLoggedIn()).toBe(false);
        });

        it('[ECM] should set/get redirectUrl when provider is ECM', () => {
            authService.setRedirect({ provider: 'ECM', url: 'some-url' });

            expect(authService.getRedirect()).toEqual('some-url');
        });

        it('[ECM] should set/get redirectUrl when provider is BPM', () => {
            authService.setRedirect({ provider: 'BPM', url: 'some-url' });

            expect(authService.getRedirect()).toBeNull();
        });

        it('[ECM] should return null as redirectUrl when redirectUrl field is not set', () => {
            authService.setRedirect();

            expect(authService.getRedirect()).toBeNull();
        });

        it('[ECM] should return isECMProvider true', () => {
            expect(authService.isECMProvider()).toBe(true);
        });

        it('[ECM] should return isBPMProvider false', () => {
            expect(authService.isBPMProvider()).toBe(false);
        });

        it('[ECM] should return isALLProvider false', () => {
            expect(authService.isALLProvider()).toBe(false);
        });

        it('[ECM] should return isBpmLoggedIn false', () => {
            expect(authService.isBpmLoggedIn()).toBe(false);
        });
    });

    describe('when the setting is BPM', () => {

        beforeEach(() => {
            appConfigService.config.providers = 'BPM';
            appConfigService.load();
            apiService.reset();
        });

        it('should require remember me set for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(true);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isBPMProvider').and.returnValue(true);
            spyOn(authService, 'isOauth').and.returnValue(false);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isBpmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).not.toHaveBeenCalled();
        });

        it('should check if loggedin on BPM in case the provider is BPM', () => {
            spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
            expect(authService.isLoggedInWith('BPM')).toBe(true);
        });

        it('should not require cookie service enabled for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(false);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isBPMProvider').and.returnValue(true);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isBpmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).toHaveBeenCalled();
        });

        fit('[BPM] should return an BPM ticket after the login done', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketBpm()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
                expect(authService.isBpmLoggedIn()).toBe(true);
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json'
            });
        });

        it('[BPM] should return a ticket undefined after logout', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                const disposableLogout = authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketBpm()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    disposableLogout.unsubscribe();
                    disposableLogin.unsubscribe();
                    done();
                });

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200
                });
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('[BPM] should return an error when the logout return error', (done) => {
            authService.logout().subscribe(
                () => {
                },
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(authService.getTicketBpm()).toBe(undefined);
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });

        it('[BPM] should set/get redirectUrl when provider is BPM', () => {
            authService.setRedirect({ provider: 'BPM', url: 'some-url' });

            expect(authService.getRedirect()).toEqual('some-url');
        });

        it('[BPM] should set/get redirectUrl when provider is ECM', () => {
            authService.setRedirect({ provider: 'ECM', url: 'some-url' });

            expect(authService.getRedirect()).toBeNull();
        });

        it('[BPM] should return null as redirectUrl when redirectUrl field is not set', () => {
            authService.setRedirect();

            expect(authService.getRedirect()).toBeNull();
        });

        it('[BPM] should return isECMProvider false', () => {
            expect(authService.isECMProvider()).toBe(false);
        });

        it('[BPM] should return isBPMProvider true', () => {
            expect(authService.isBPMProvider()).toBe(true);
        });

        it('[BPM] should return isALLProvider false', () => {
            expect(authService.isALLProvider()).toBe(false);
        });
    });

    describe('remember me', () => {

        beforeEach(() => {
            appConfigService.config.providers = 'ECM';
            appConfigService.load();
            apiService.reset();
        });

        it('[ECM] should save the remember me cookie as a session cookie after successful login', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password', false).subscribe(() => {
                expect(cookie['ALFRESCO_REMEMBER_ME']).not.toBeUndefined();
                expect(cookie['ALFRESCO_REMEMBER_ME'].expiration).toBeNull();
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });
        });

        it('[ECM] should save the remember me cookie as a persistent cookie after successful login', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password', true).subscribe(() => {
                expect(cookie['ALFRESCO_REMEMBER_ME']).not.toBeUndefined();
                expect(cookie['ALFRESCO_REMEMBER_ME'].expiration).not.toBeNull();
                disposableLogin.unsubscribe();

                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });
        });

        it('[ECM] should not save the remember me cookie after failed login', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => { },
                () => {
                    expect(cookie['ALFRESCO_REMEMBER_ME']).toBeUndefined();
                    disposableLogin.unsubscribe();
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    error: {
                        errorKey: 'Login failed',
                        statusCode: 403,
                        briefSummary: '05150009 Login failed',
                        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                        descriptionURL: 'https://api-explorer.alfresco.com'
                    }
                })
            });
        });
    });

    describe('when the setting is both ECM and BPM ', () => {

        beforeEach(() => {
            appConfigService.config.providers = 'ALL';
            appConfigService.load();
            apiService.reset();
        });

        fit('[ALL] should return both ECM and BPM tickets after the login done', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
                expect(authService.getTicketBpm()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
                expect(authService.isBpmLoggedIn()).toBe(true);
                expect(authService.isEcmLoggedIn()).toBe(true);
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.at(0).respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 200
            });
        });

        fit('[ALL] should return login fail if only ECM call fail', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => { },
                () => {
                    expect(authService.isLoggedIn()).toBe(false, 'isLoggedIn');
                    expect(authService.getTicketEcm()).toBe(null, 'getTicketEcm');
                    // cspell: disable-next
                    expect(authService.getTicketBpm()).toBe(null, 'getTicketBpm');
                    expect(authService.isEcmLoggedIn()).toBe(false, 'isEcmLoggedIn');
                    disposableLogin.unsubscribe();
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                status: 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 200
            });
        });

        fit('[ALL] should return login fail if only BPM call fail', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => { },
                () => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 403
            });
        });

        fit('[ALL] should return ticket undefined when the credentials are wrong', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => { },
                () => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                status: 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 403
            });
        });

        it('[ALL] should set/get redirectUrl when provider is ALL', () => {
            authService.setRedirect({ provider: 'ALL', url: 'some-url' });

            expect(authService.getRedirect()).toEqual('some-url');
        });

        it('[ALL] should set/get redirectUrl when provider is BPM', () => {
            authService.setRedirect({ provider: 'BPM', url: 'some-url' });

            expect(authService.getRedirect()).toEqual('some-url');
        });

        it('[ALL] should set/get redirectUrl when provider is ECM', () => {
            authService.setRedirect({ provider: 'ECM', url: 'some-url' });

            expect(authService.getRedirect()).toEqual('some-url');
        });

        it('[ALL] should return null as redirectUrl when redirectUrl field is not set', () => {
            authService.setRedirect();

            expect(authService.getRedirect()).toBeNull();
        });

        it('[ALL] should return isECMProvider false', () => {
            expect(authService.isECMProvider()).toBe(false);
        });

        it('[ALL] should return isBPMProvider false', () => {
            expect(authService.isBPMProvider()).toBe(false);
        });

        it('[ALL] should return isALLProvider true', () => {
            expect(authService.isALLProvider()).toBe(true);
        });
    });
});
