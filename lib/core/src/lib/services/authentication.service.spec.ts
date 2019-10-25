/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { AppConfigService } from '../app-config/app-config.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { UserRepresentation } from '@alfresco/js-api';

declare let jasmine: any;

describe('AuthenticationService', () => {
    let apiService: AlfrescoApiService;
    let authService: AuthenticationService;
    let appConfigService: AppConfigService;
    let cookie: CookieService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        sessionStorage.clear();
        localStorage.clear();
        apiService = TestBed.get(AlfrescoApiService);
        authService = TestBed.get(AuthenticationService);

        cookie = TestBed.get(CookieService);
        cookie.clear();

        jasmine.Ajax.install();
        appConfigService = TestBed.get(AppConfigService);
        appConfigService.config.pagination = {
            supportedPageSizes: []
        };
    });

    afterEach(() => {
        cookie.clear();
        jasmine.Ajax.uninstall();
    });

    describe('when the setting is ECM', () => {

        beforeEach(() => {
            appConfigService.config.providers = 'ECM';
            appConfigService.load();
            apiService.reset();
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
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
                expect(authService.isEcmLoggedIn()).toBe(true);
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });
        });

        it('[ECM] should login in the ECM if no provider are defined calling the login', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });
        });

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
                    'status': 204
                });
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
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
            authService.setRedirect(null);

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

        it('should not require cookie service enabled for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(false);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(authService, 'isBPMProvider').and.returnValue(true);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isBpmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).toHaveBeenCalled();
        });

        it('[BPM] should return an BPM ticket after the login done', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                // cspell: disable-next
                expect(authService.getTicketBpm()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
                expect(authService.isBpmLoggedIn()).toBe(true);
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
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
                    'status': 200
                });
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200
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
                'status': 403
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
            authService.setRedirect(null);

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

        it('[BPM] should be able to retrieve current logged in user', (done) => {
            spyOn(apiService.getInstance().activiti.profileApi, 'getProfile').and.returnValue(
                Promise.resolve((<UserRepresentation> {
                    email: 'fake-email'
                })));

            authService.getBpmLoggedUser().subscribe((fakeUser) => {
                expect(fakeUser.email).toBe('fake-email');
                done();
            });
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
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
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
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });
        });

        it('[ECM] should not save the remember me cookie after failed login', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => {},
                () => {
                    expect(cookie['ALFRESCO_REMEMBER_ME']).toBeUndefined();
                    disposableLogin.unsubscribe();
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 403,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    'error': {
                        'errorKey': 'Login failed',
                        'statusCode': 403,
                        'briefSummary': '05150009 Login failed',
                        'stackTrace': 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                        'descriptionURL': 'https://api-explorer.alfresco.com'
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

        it('[ALL] should return both ECM and BPM tickets after the login done', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
                // cspell: disable-next
                expect(authService.getTicketBpm()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
                expect(authService.isBpmLoggedIn()).toBe(true);
                expect(authService.isEcmLoggedIn()).toBe(true);
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200
            });
        });

        it('[ALL] should return login fail if only ECM call fail', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => {},
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
                'status': 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200
            });
        });

        it('[ALL] should return login fail if only BPM call fail', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => {},
                () => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 403
            });
        });

        it('[ALL] should return ticket undefined when the credentials are wrong', (done) => {
            const disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                () => {},
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
                'status': 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 403
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
            authService.setRedirect(null);

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
