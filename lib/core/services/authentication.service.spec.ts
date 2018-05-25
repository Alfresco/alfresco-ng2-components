/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { StorageService } from './storage.service';
import { UserPreferencesService } from './user-preferences.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

declare let jasmine: any;

describe('AuthenticationService', () => {
    let apiService: AlfrescoApiService;
    let authService: AuthenticationService;
    let preferences: UserPreferencesService;
    let storage: StorageService;
    let cookie: CookieService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        apiService = TestBed.get(AlfrescoApiService);
        authService = TestBed.get(AuthenticationService);
        preferences = TestBed.get(UserPreferencesService);

        cookie = TestBed.get(CookieService);
        cookie.clear();

        storage = TestBed.get(StorageService);
        storage.clear();

        jasmine.Ajax.install();
    });

    afterEach(() => {
        cookie.clear();
        storage.clear();
        jasmine.Ajax.uninstall();
    });

    describe('remember me', () => {

        beforeEach(() => {
            preferences.authType = 'ECM';
        });

        it('[ECM] should save the remember me cookie as a session cookie after successful login', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password', false).subscribe(() => {
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
            let disposableLogin = authService.login('fake-username', 'fake-password', true).subscribe(() => {
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
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
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

    describe('when the setting is ECM', () => {

        beforeEach(() => {
            preferences.authType = 'ECM';
        });

        it('should require remember me set for ECM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(true);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isEcmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).not.toHaveBeenCalled();
        });

        it('should not require cookie service enabled for ECM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(false);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isEcmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).toHaveBeenCalled();
        });

        it('[ECM] should return an ECM ticket after the login done', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
                expect(authService.isEcmLoggedIn()).toBe(true);
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });
        });

        it('[ECM] should save only ECM ticket on localStorage', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketBpm()).toBeNull();
                expect(apiService.getInstance().bpmAuth.isLoggedIn()).toBeFalsy();
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });
        });

        it('[ECM] should return ticket undefined when the credentials are wrong', (done) => {
            let disposableLogin = authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.isEcmLoggedIn()).toBe(false);
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

        it('[ECM] should login in the ECM if no provider are defined calling the login', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
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
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                let disposableLogout = authService.logout().subscribe(() => {
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

        it('[ECM] ticket should be deleted only after logout request is accepted', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                let logoutPromise = authService.logout();

                expect(authService.getTicketEcm()).toBe('fake-post-ticket');

                jasmine.Ajax.requests.mostRecent().respondWith({
                    'status': 204
                });

                let disposableLogout = logoutPromise.subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    disposableLogin.unsubscribe();
                    disposableLogout.unsubscribe();
                    done();
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
            authService.setRedirect({ provider: 'ECM', navigation: ['some-url'] });

            expect(authService.getRedirect(preferences.authType)).toEqual(['some-url']);
        });

        it('[ECM] should set/get redirectUrl when provider is BPM', () => {
            authService.setRedirect({ provider: 'BPM', navigation: ['some-url'] });

            expect(authService.getRedirect(preferences.authType)).toBeNull();
        });

        it('[ECM] should return null as redirectUrl when redirectUrl field is not set', () => {
            authService.setRedirect(null);

            expect(authService.getRedirect(preferences.authType)).toBeNull();
        });
    });

    describe('when the setting is BPM', () => {

        beforeEach(() => {
            preferences.authType = 'BPM';
        });

        it('should require remember me set for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(true);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isBpmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).not.toHaveBeenCalled();
        });

        it('should not require cookie service enabled for BPM check', () => {
            spyOn(cookie, 'isEnabled').and.returnValue(false);
            spyOn(authService, 'isRememberMeSet').and.returnValue(false);
            spyOn(apiService, 'getInstance').and.callThrough();

            expect(authService.isBpmLoggedIn()).toBeFalsy();
            expect(apiService.getInstance).toHaveBeenCalled();
        });

        it('[BPM] should return an BPM ticket after the login done', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe((response) => {
                expect(authService.isLoggedIn()).toBe(true);
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

        it('[BPM] should save only BPM ticket on localStorage', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toBeNull();
                expect(apiService.getInstance().ecmAuth.isLoggedIn()).toBeFalsy();
                disposableLogin.unsubscribe();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({ 'entry': { 'id': 'fake-post-ticket', 'userId': 'admin' } })
            });
        });

        it('[BPM] should return ticket undefined when the credentials are wrong', (done) => {
            let disposableLogin = authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false, 'isLoggedIn');
                    expect(authService.getTicketBpm()).toBe(null, 'getTicketBpm');
                    expect(authService.isBpmLoggedIn()).toBe(false, 'isBpmLoggedIn');
                    disposableLogin.unsubscribe();
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 403
            });
        });

        it('[BPM] ticket should be deleted only after logout request is accepted', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                let logoutPromise = authService.logout();

                expect(authService.getTicketBpm()).toBe('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');

                jasmine.Ajax.requests.mostRecent().respondWith({
                    'status': 200
                });

                let disposableLogout = logoutPromise.subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    disposableLogout.unsubscribe();
                    disposableLogin.unsubscribe();
                    done();
                });

            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200
            });
        });

        it('[BPM] should return a ticket undefined after logout', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                let disposableLogout = authService.logout().subscribe(() => {
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
                (res) => {
                },
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(authService.getTicketBpm()).toBe(null);
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 403
            });
        });

        it('[BPM] should set/get redirectUrl when provider is BPM', () => {
            authService.setRedirect({ provider: 'BPM', navigation: ['some-url'] });

            expect(authService.getRedirect(preferences.authType)).toEqual(['some-url']);
        });

        it('[BPM] should set/get redirectUrl when provider is ECM', () => {
            authService.setRedirect({ provider: 'ECM', navigation: ['some-url'] });

            expect(authService.getRedirect(preferences.authType)).toBeNull();
        });

        it('[BPM] should return null as redirectUrl when redirectUrl field is not set', () => {
            authService.setRedirect(null);

            expect(authService.getRedirect(preferences.authType)).toBeNull();
        });
    });

    describe('when the setting is both ECM and BPM ', () => {

        beforeEach(() => {
            preferences.authType = 'ALL';
        });

        it('[ALL] should return both ECM and BPM tickets after the login done', (done) => {
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
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
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false, 'isLoggedIn');
                    expect(authService.getTicketEcm()).toBe(null, 'getTicketEcm');
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
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
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
            let disposableLogin = authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
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
            authService.setRedirect({ provider: 'ALL', navigation: ['some-url'] });

            expect(authService.getRedirect(preferences.authType)).toEqual(['some-url']);
        });

        it('[ALL] should set/get redirectUrl when provider is BPM', () => {
            authService.setRedirect({ provider: 'BPM', navigation: ['some-url'] });

            expect(authService.getRedirect(preferences.authType)).toEqual(['some-url']);
        });

        it('[ALL] should set/get redirectUrl when provider is ECM', () => {
            authService.setRedirect({ provider: 'ECM', navigation: ['some-url'] });

            expect(authService.getRedirect(preferences.authType)).toEqual(['some-url']);
        });

        it('[ALL] should return null as redirectUrl when redirectUrl field is not set', () => {
            authService.setRedirect(null);

            expect(authService.getRedirect(preferences.authType)).toBeNull();
        });
    });

});
