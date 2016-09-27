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

import { ReflectiveInjector } from '@angular/core';
import { AlfrescoSettingsService } from './AlfrescoSettings.service';
import { AlfrescoAuthenticationService } from './AlfrescoAuthentication.service';
import { AlfrescoApiService } from './AlfrescoApi.service';

declare var AlfrescoApi: any;
declare let jasmine: any;

describe('AlfrescoAuthentication', () => {
    let injector;
    let authService: AlfrescoAuthenticationService;
    let settingsService: AlfrescoSettingsService;

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService
        ]);

        authService = injector.get(AlfrescoAuthenticationService);
        settingsService = injector.get(AlfrescoSettingsService);

        let store = {};

        spyOn(localStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value + '';
        });
        spyOn(localStorage, 'clear').and.callFake(function () {
            store = {};
        });
        spyOn(localStorage, 'removeItem').and.callFake(function (key) {
            delete store[key];
        });
        spyOn(localStorage, 'key').and.callFake(function (i) {
            let keys = Object.keys(store);
            return keys[i];
        });

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('when the setting is ECM', () => {

        beforeEach(() => {
            settingsService.setProviders('ECM');
        });

        it('should return an ECM ticket after the login done', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicketEcm()).toEqual('fake-post-ticket');
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
                expect(authService.getAlfrescoApi().bpmAuth.isLoggedIn()).toBeFalsy();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('should return ticket undefined when the credentials are wrong', (done) => {
            authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
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

        it('should return false if the user is not logged in', () => {
            expect(authService.isLoggedIn()).toBe(false);
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
                expect(authService.getAlfrescoApi().ecmAuth.isLoggedIn()).toBeFalsy();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 201,
                contentType: 'application/json',
                responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
            });
        });

        it('should return ticket undefined when the credentials are wrong', (done) => {
            authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketBpm()).toBe(null);
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 403
            });
        });

        it('should return a ticket undefined after logout', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(() => {
                authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketBpm()).toBe(null);
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

    describe('Setting service change should reflect in the api', () => {

        beforeEach(() => {
            settingsService.setProviders('ALL');
        });

        it('should host ecm url change be reflected in the api configuration', () => {
            settingsService.ecmHost = '127.99.99.99';

            expect(authService.getAlfrescoApi().config.hostEcm).toBe('127.99.99.99');
        });

        it('should host bpm url change be reflected in the api configuration', () => {
            settingsService.bpmHost = '127.99.99.99';

            expect(authService.getAlfrescoApi().config.hostBpm).toBe('127.99.99.99');
        });

        it('should host bpm provider change be reflected in the api configuration', () => {
            settingsService.setProviders('ECM');

            expect(authService.getAlfrescoApi().config.provider).toBe('ECM');
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

        it('should return login fail if only ECM call fail', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
                    done();
                });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 403
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200
            });
        });

        it('should return login fail if only BPM call fail', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
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

        it('should return ticket undefined when the credentials are wrong', (done) => {
            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicketEcm()).toBe(null);
                    expect(authService.getTicketBpm()).toBe(null);
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
