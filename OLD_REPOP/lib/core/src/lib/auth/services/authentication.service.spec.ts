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
import { AuthenticationService } from './authentication.service';
import { CookieService } from '../../common/services/cookie.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { provideCoreAuth } from '../oidc/auth.module';
import { HttpHeaders } from '@angular/common/http';
import { CookieServiceMock } from '../../mock';
import { AppConfigServiceMock } from '../../common';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';
import { OAuthEvent } from 'angular-oauth2-oidc';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { Injector } from '@angular/core';
import { ContentAuth, ProcessAuth } from '../public-api';

declare let jasmine: any;
describe('AuthenticationService', () => {
    let authService: AuthenticationService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let appConfigService: AppConfigService;
    let cookie: CookieService;
    let oidcAuthenticationService: OidcAuthenticationService;
    let headers: HttpHeaders;
    let processAuth: ProcessAuth;
    let contentAuth: ContentAuth;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideCoreAuth({ useHash: true }),
                {
                    provide: CookieService,
                    useClass: CookieServiceMock
                },
                {
                    provide: AppConfigService,
                    useClass: AppConfigServiceMock
                }
            ]
        });

        sessionStorage.clear();
        localStorage.clear();
        authService = TestBed.inject(AuthenticationService);
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
        oidcAuthenticationService = TestBed.inject(OidcAuthenticationService);
        spyOn(oidcAuthenticationService, 'logout').and.returnValue(of());
        cookie = TestBed.inject(CookieService);

        processAuth = TestBed.inject(ProcessAuth);
        spyOn(processAuth, 'login').and.returnValue(Promise.resolve());
        contentAuth = TestBed.inject(ContentAuth);
        spyOn(contentAuth, 'login').and.returnValue(Promise.resolve());

        cookie.clear();

        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config.pagination = {
            supportedPageSizes: []
        };
    });

    afterEach(() => {
        cookie.clear();
    });

    describe('kerberos', () => {
        beforeEach(() => {
            appConfigService.config.providers = 'ALL';
            appConfigService.config.auth = { withCredentials: true };
            headers = new HttpHeaders();
        });

        it('should emit login event for kerberos', (done) => {
            spyOn(basicAlfrescoAuthService, 'requireAlfTicket').and.returnValue(Promise.resolve());
            const disposableLogin = authService.onLogin.subscribe(() => {
                disposableLogin.unsubscribe();
                done();
            });
            appConfigService.load();
        });

        it('should kerberos be disabled if is oauth', () => {
            spyOn(authService, 'isOauth').and.returnValue(true);
            expect(authService.isKerberosEnabled()).toEqual(false);
        });

        it('should kerberos not enabled if is oauth is false and basic auth return false', () => {
            spyOn(authService, 'isOauth').and.returnValue(false);
            spyOn(basicAlfrescoAuthService, 'isKerberosEnabled').and.returnValue(false);
            expect(authService.isKerberosEnabled()).toEqual(false);
        });

        it('should kerberos be enabled if is oauth is false and basic auth return true', () => {
            spyOn(authService, 'isOauth').and.returnValue(false);
            spyOn(basicAlfrescoAuthService, 'isKerberosEnabled').and.returnValue(true);
            expect(authService.isKerberosEnabled()).toEqual(true);
        });

        it('should not add Authorization header if kerberos is enabled', () => {
            const url = 'some-url';
            spyOn(basicAlfrescoAuthService, 'isKerberosEnabled').and.returnValue(true);
            spyOn(basicAlfrescoAuthService, 'getTicketEcmBase64').and.returnValue('some-ticket');
            headers = basicAlfrescoAuthService.getAuthHeaders(url, headers);
            expect(headers.get('Authorization')).toBeNull();
            expect(basicAlfrescoAuthService.getTicketEcmBase64).not.toHaveBeenCalled();
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
            spyOn(basicAlfrescoAuthService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isECMProvider').and.returnValue(true);
            spyOn(authService, 'isOauth').and.returnValue(false);

            expect(authService.isLoggedIn()).toBeFalsy();
        });

        it('should require remember me set for ECM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(true);
            spyOn(basicAlfrescoAuthService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isECMProvider').and.returnValue(true);
            spyOn(authService, 'isOauth').and.returnValue(false);

            expect(authService.isLoggedIn()).toBeFalsy();
        });

        it('[ECM] should login in the ECM if no provider are defined calling the login', async () => {
            contentAuth.login = jasmine.createSpy().and.returnValue(Promise.resolve(fakeECMLoginResponse.ticket));
            const loginResponse = await firstValueFrom(basicAlfrescoAuthService.login('fake-username', 'fake-password'));

            expect(contentAuth.login).toHaveBeenCalled();
            expect(loginResponse).toEqual(fakeECMLoginResponse);
        });

        it('[ECM] should get token when provider is ECM', () => {
            spyOn(basicAlfrescoAuthService, 'getToken').and.returnValue('fake-ecm-token');
            expect(basicAlfrescoAuthService.getToken()).toEqual('fake-ecm-token');
        });

        it('[ECM] should return false if the user is not logged in', () => {
            expect(authService.isLoggedIn()).toBe(false);
        });

        it('[ECM] should set/get redirectUrl when provider is ECM', () => {
            basicAlfrescoAuthService.setRedirect({ provider: 'ECM', url: 'some-url' });

            expect(basicAlfrescoAuthService.getRedirect()).toEqual('some-url');
        });

        it('[ECM] should set/get redirectUrl when provider is BPM', () => {
            basicAlfrescoAuthService.setRedirect({ provider: 'BPM', url: 'some-url' });

            expect(basicAlfrescoAuthService.getRedirect()).toBeNull();
        });

        it('[ECM] should return null as redirectUrl when redirectUrl field is not set', () => {
            basicAlfrescoAuthService.setRedirect(null);

            expect(basicAlfrescoAuthService.getRedirect()).toBeNull();
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
    });

    describe('when the setting is BPM', () => {
        beforeEach(() => {
            appConfigService.config.providers = 'BPM';
            appConfigService.load();
        });

        it('should require remember me set for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(true);
            spyOn(basicAlfrescoAuthService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isBPMProvider').and.returnValue(true);
            spyOn(authService, 'isOauth').and.returnValue(false);

            expect(authService.isLoggedIn()).toBeFalsy();
        });

        it('should not require cookie service enabled for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(false);
            spyOn(basicAlfrescoAuthService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isBPMProvider').and.returnValue(true);

            expect(authService.isLoggedIn()).toBeFalsy();
        });

        it('[BPM] should return an error when the logout return error', async () => {
            oidcAuthenticationService.logout = jasmine.createSpy().and.returnValue(throwError(() => 'logout'));

            await firstValueFrom(authService.logout()).catch((err) => {
                expect(err).toBeDefined();
                expect(authService.getToken()).toBe(null);
            });
        });

        it('[BPM] should set/get redirectUrl when provider is BPM', () => {
            basicAlfrescoAuthService.setRedirect({ provider: 'BPM', url: 'some-url' });

            expect(basicAlfrescoAuthService.getRedirect()).toEqual('some-url');
        });

        it('[BPM] should set/get redirectUrl when provider is ECM', () => {
            basicAlfrescoAuthService.setRedirect({ provider: 'ECM', url: 'some-url' });

            expect(basicAlfrescoAuthService.getRedirect()).toBeNull();
        });

        it('[BPM] should return null as redirectUrl when redirectUrl field is not set', () => {
            basicAlfrescoAuthService.setRedirect(null);

            expect(basicAlfrescoAuthService.getRedirect()).toBeNull();
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
        });

        it('[ECM] should save the remember me cookie as a session cookie after successful login', async () => {
            await firstValueFrom(basicAlfrescoAuthService.login('fake-username', 'fake-password', false));

            expect(cookie.getItem('ALFRESCO_REMEMBER_ME')).toBe('1');
        });

        it('[ECM] should save the remember me cookie as a persistent cookie after successful login', async () => {
            await firstValueFrom(basicAlfrescoAuthService.login('fake-username', 'fake-password', true));
            expect(cookie.getItem('ALFRESCO_REMEMBER_ME')).not.toBeUndefined();
            expect(JSON.parse(cookie.getItem('ALFRESCO_REMEMBER_ME')).expiration).not.toBeNull();
        });

        it('[ECM] should not save the remember me cookie after failed login', async () => {
            contentAuth.login = jasmine.createSpy().and.returnValue(Promise.reject(new Error('Login failed')));

            await firstValueFrom(basicAlfrescoAuthService.login('fake-username', 'fake-password')).catch(() => {
                expect(cookie.getItem('ALFRESCO_REMEMBER_ME')).toBeNull();
            });
        });
    });

    describe('when the setting is both ECM and BPM ', () => {
        beforeEach(() => {
            appConfigService.config.providers = 'ALL';
            appConfigService.load();
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

    describe('getUsername', () => {
        it('should get the username of the authenticated user if isOAuth is true', () => {
            spyOn(authService, 'isOauth').and.returnValue(true);
            spyOn(oidcAuthenticationService, 'getUsername').and.returnValue('mike.portnoy');
            const username = authService.getUsername();
            expect(username).toEqual('mike.portnoy');
        });

        it('should get the username of the authenticated user if isOAuth is false', () => {
            spyOn(authService, 'isOauth').and.returnValue(false);
            spyOn(oidcAuthenticationService, 'getUsername').and.returnValue('mike.portnoy');
            spyOn(basicAlfrescoAuthService, 'getUsername').and.returnValue('john.petrucci');
            const username = authService.getUsername();
            expect(username).toEqual('john.petrucci');
        });
    });

    describe('onTokenReceived', () => {
        let redirectAuthService: RedirectAuthService;
        let authenticationService: AuthenticationService;
        const onTokenReceived$: Subject<OAuthEvent> = new Subject<OAuthEvent>();

        beforeEach(() => {
            redirectAuthService = TestBed.inject(RedirectAuthService);
            redirectAuthService.onTokenReceived = onTokenReceived$;

            const injector = TestBed.inject(Injector);
            authenticationService = new AuthenticationService(injector, redirectAuthService);
        });

        it('should emit event when RedirectAuthService onTokenReceived emits', () => {
            const onTokenReceivedSpy = jasmine.createSpy();
            authenticationService.onTokenReceived.subscribe(onTokenReceivedSpy);

            onTokenReceived$.next({ type: 'token_received' });

            expect(onTokenReceivedSpy).toHaveBeenCalled();
        });
    });
});
