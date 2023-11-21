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

import { fakeAsync, TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { CookieService } from '../../common/services/cookie.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';
import { OAuthEvent } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { Injector } from '@angular/core';

declare let jasmine: any;
// eslint-disable-next-line
xdescribe('AuthenticationService', () => {
    let authService: AuthenticationService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let appConfigService: AppConfigService;
    let cookie: CookieService;
    let oidcAuthenticationService: OidcAuthenticationService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        sessionStorage.clear();
        localStorage.clear();
        authService = TestBed.inject(AuthenticationService);
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
        oidcAuthenticationService = TestBed.inject(OidcAuthenticationService);

        cookie = TestBed.inject(CookieService);
        cookie.clear();

        jasmine.Ajax.install();
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config.pagination = {
            supportedPageSizes: []
        };
    });

    afterEach(() => {
        cookie.clear();
        jasmine.Ajax.uninstall();
    });

    describe('kerberos', () => {
        beforeEach(() => {
            appConfigService.config.providers = 'ALL';
            appConfigService.config.auth = { withCredentials: true };
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

            expect(authService.isEcmLoggedIn()).toBeFalsy();
        });

        it('should require remember me set for ECM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(true);
            spyOn(basicAlfrescoAuthService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isECMProvider').and.returnValue(true);
            spyOn(authService, 'isOauth').and.returnValue(false);

            expect(authService.isEcmLoggedIn()).toBeFalsy();
        });

        it('[ECM] should return an ECM ticket after the login done', (done) => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getToken()).toEqual('fake-post-ticket');
                expect(authService.isEcmLoggedIn()).toBe(true);
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });
        });

        it('[ECM] should login in the ECM if no provider are defined calling the login', fakeAsync(() => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe((loginResponse) => {
                expect(loginResponse).toEqual(fakeECMLoginResponse);
                disposableLogin.unsubscribe();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });
        }));

        it('[ECM] should return a ticket undefined after logout', fakeAsync(() => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(() => {
                const disposableLogout = authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getToken()).toBe(null);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    disposableLogout.unsubscribe();
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
        }));

        it('[ECM] should return false if the user is not logged in', () => {
            expect(authService.isLoggedIn()).toBe(false);
            expect(authService.isEcmLoggedIn()).toBe(false);
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

        it('[ECM] should return isBpmLoggedIn false', () => {
            expect(authService.isBpmLoggedIn()).toBe(false);
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

            expect(authService.isBpmLoggedIn()).toBeFalsy();
        });

        it('should not require cookie service enabled for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(false);
            spyOn(basicAlfrescoAuthService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isBPMProvider').and.returnValue(true);

            expect(authService.isBpmLoggedIn()).toBeFalsy();
        });

        it('[BPM] should return an BPM ticket after the login done', (done) => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                // cspell: disable-next
                expect(authService.getToken()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
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
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(() => {
                const disposableLogout = authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getToken()).toBe(null);
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
                () => {},
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(authService.getToken()).toBe(null);
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
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

        it('[ECM] should save the remember me cookie as a session cookie after successful login', (done) => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password', false).subscribe(() => {
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
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password', true).subscribe(() => {
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
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(
                () => {},
                () => {
                    expect(cookie['ALFRESCO_REMEMBER_ME']).toBeUndefined();
                    disposableLogin.unsubscribe();
                    done();
                }
            );

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
        });

        it('[ALL] should return both ECM and BPM tickets after the login done', (done) => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(basicAlfrescoAuthService.getTicketEcm()).toEqual('fake-post-ticket');
                // cspell: disable-next
                expect(basicAlfrescoAuthService.getTicketBpm()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
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

        it('[ALL] should return login fail if only ECM call fail', (done) => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(
                () => {},
                () => {
                    expect(authService.isLoggedIn()).toBe(false, 'isLoggedIn');
                    expect(authService.getToken()).toBe(null, 'getTicketEcm');
                    // cspell: disable-next
                    expect(authService.getToken()).toBe(null, 'getTicketBpm');
                    expect(authService.isEcmLoggedIn()).toBe(false, 'isEcmLoggedIn');
                    disposableLogin.unsubscribe();
                    done();
                }
            );

            jasmine.Ajax.requests.at(0).respondWith({
                status: 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 200
            });
        });

        it('[ALL] should return login fail if only BPM call fail', (done) => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(
                () => {},
                () => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getToken()).toBe(null);
                    expect(authService.getToken()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    done();
                }
            );

            jasmine.Ajax.requests.at(0).respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 403
            });
        });

        it('[ALL] should return ticket undefined when the credentials are wrong', (done) => {
            const disposableLogin = basicAlfrescoAuthService.login('fake-username', 'fake-password').subscribe(
                () => {},
                () => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getToken()).toBe(null);
                    expect(authService.getToken()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    done();
                }
            );

            jasmine.Ajax.requests.at(0).respondWith({
                status: 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 403
            });
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

            onTokenReceived$.next();

            expect(onTokenReceivedSpy).toHaveBeenCalled();
        });
    });
});
