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

import { TestBed, async } from '@angular/core/testing';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AlfrescoAuthenticationService } from './alfresco-authentication.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { StorageService } from './storage.service';
import { CookieService } from './cookie.service';
import { CookieServiceMock } from './../assets/cookie.service.mock';
import { LogService } from './log.service';
import { AppConfigModule } from './app-config.service';

declare let jasmine: any;

describe('AlfrescoAuthenticationService', () => {
    let apiService: AlfrescoApiService;
    let authService: AlfrescoAuthenticationService;
    let settingsService: AlfrescoSettingsService;
    let storage: StorageService;
    let cookie: CookieService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule
            ],
            providers: [
                AlfrescoSettingsService,
                AlfrescoApiService,
                AlfrescoAuthenticationService,
                StorageService,
                { provide: CookieService, useClass: CookieServiceMock },
                LogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        apiService = TestBed.get(AlfrescoApiService);
        authService = TestBed.get(AlfrescoAuthenticationService);
        settingsService = TestBed.get(AlfrescoSettingsService);
        cookie = TestBed.get(CookieService);
        storage = TestBed.get(StorageService);
        storage.clear();

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('remembe me', () => {

        beforeEach(() => {
            settingsService.setProviders('ECM');
        });

        it('should save the remember me cookie as a session cookie after successful login', (done) => {
            authService.login('fake-username', 'fake-password', false).subscribe(() => {
                expect(cookie['ALFRESCO_REMEMBER_ME']).not.toBeUndefined();
                expect(cookie['ALFRESCO_REMEMBER_ME'].expiration).toBeNull();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('should save the remember me cookie as a persistent cookie after successful login', (done) => {
            authService.login('fake-username', 'fake-password', true).subscribe(() => {
                expect(cookie['ALFRESCO_REMEMBER_ME']).not.toBeUndefined();
                expect(cookie['ALFRESCO_REMEMBER_ME'].expiration).not.toBeNull();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('should not save the remember me cookie after failed login', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {},
                (err: any) => {
                    expect(cookie['ALFRESCO_REMEMBER_ME']).toBeUndefined();
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
            settingsService.setProviders('ECM');
        });

        it('should return an ECM ticket after the login done', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
                expect(authService.isEcmLoggedIn()).toBe(true);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('should save only ECM ticket on localStorage', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketBpm()).toBeNull();
                expect(authService.alfrescoApi.getInstance().bpmAuth.isLoggedIn()).toBeFalsy();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        xit('should return ticket undefined when the credentials are wrong', (done) => {
            authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.isEcmLoggedIn()).toBe(false);
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

        it('should login in the ECM if no provider are defined calling the login', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('should return a ticket undefined after logout', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    done();
                });

                jasmine.Ajax.requests.mostRecent().respondWith({
                    'status': 204
                });
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('ticket should be deleted only after logout request is accepted', (done) => {

            authService.login('fake-username', 'fake-password').subscribe(() => {
                let logoutPromise = authService.logout();

                expect(authService.getTicketEcm()).toBe('fake-post-ticket');

                jasmine.Ajax.requests.mostRecent().respondWith({
                    'status': 204
                });

                logoutPromise.subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    done();
                });

            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('should return false if the user is not logged in', () => {
            expect(authService.isLoggedIn()).toBe(false);
            expect(authService.isEcmLoggedIn()).toBe(false);
        });
    });

    describe('when the setting is BPM', () => {

        beforeEach(() => {
            settingsService.setProviders('BPM');
        });

        it('should return an BPM ticket after the login done', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketBpm()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
                expect(authService.isBpmLoggedIn()).toBe(true);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200
            });
        });

        it('should save only BPM ticket on localStorage', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toBeNull();
                expect(authService.alfrescoApi.getInstance().ecmAuth.isLoggedIn()).toBeFalsy();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        xit('should return ticket undefined when the credentials are wrong', (done) => {
            authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false, 'isLoggedIn');
                    expect(authService.getTicketBpm()).toBe(null, 'getTicketBpm');
                    expect(authService.isBpmLoggedIn()).toBe(false, 'isBpmLoggedIn');
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 403
            });
        });

        it('ticket should be deleted only after logout request is accepted', (done) => {

            authService.login('fake-username', 'fake-password').subscribe(() => {
                let logoutPromise = authService.logout();

                expect(authService.getTicketBpm()).toBe('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');

                jasmine.Ajax.requests.mostRecent().respondWith({
                    'status': 200
                });

                logoutPromise.subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    done();
                });

            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200
            });
        });

        it('should return a ticket undefined after logout', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketBpm()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
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

        it('should return an error when the logout return error', (done) => {
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
    });

    describe('when the setting is both ECM and BPM ', () => {

        beforeEach(() => {
            settingsService.setProviders('ALL');
        });

        it('should return both ECM and BPM tickets after the login done', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
                expect(authService.getTicketBpm()).toEqual('Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk');
                expect(authService.isBpmLoggedIn()).toBe(true);
                expect(authService.isEcmLoggedIn()).toBe(true);
                done();
            });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200
            });
        });

        xit('should return login fail if only ECM call fail', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false, 'isLoggedIn');
                    expect(authService.getTicketEcm()).toBe(null, 'getTicketEcm');
                    expect(authService.getTicketBpm()).toBe(null, 'getTicketBpm');
                    expect(authService.isEcmLoggedIn()).toBe(false, 'isEcmLoggedIn');
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200
            });
        });

        xit('should return login fail if only BPM call fail', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 403
            });
        });

        xit('should return ticket undefined when the credentials are wrong', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
                    expect(authService.isBpmLoggedIn()).toBe(false);
                    expect(authService.isEcmLoggedIn()).toBe(false);
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 403
            });
        });
    });
});
