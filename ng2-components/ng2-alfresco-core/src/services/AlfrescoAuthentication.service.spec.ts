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

import {it, describe} from '@angular/core/testing';
import {ReflectiveInjector, provide} from '@angular/core';
import {AlfrescoSettingsService} from './AlfrescoSettings.service';
import {AlfrescoAuthenticationService} from './AlfrescoAuthentication.service';
import {XHRBackend, HTTP_PROVIDERS} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

declare var AlfrescoApi: any;

describe('AlfrescoAuthentication', () => {
    let injector, fakePromiseECM, fakePromiseBPM, authService, fakePromiseBPMECM;

    fakePromiseECM = new Promise(function (resolve, reject) {
        resolve(
            'fake-post-ticket-ECM'
        );
        reject({
            response: {
                error: 'fake-error'
            }
        });
    });

    fakePromiseBPM = new Promise(function (resolve, reject) {
        resolve(
            'fake-post-ticket-BPM'
        );
        reject({
            response: {
                error: 'fake-error'
            }
        });
    });

    fakePromiseBPMECM = new Promise(function (resolve, reject) {
        resolve(['fake-post-ticket-ECM', 'fake-post-ticket-BPM']);
        reject({
            response: {
                error: 'fake-error'
            }
        });
    });

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            HTTP_PROVIDERS,
            provide(XHRBackend, {useClass: MockBackend}),
            provide(AlfrescoSettingsService, {useClass: AlfrescoSettingsService}),
            AlfrescoAuthenticationService
        ]);

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
            return keys[i] || null;
        });

    });

    describe('when the setting is ECM', () => {

        beforeEach(() => {
            authService = injector.get(AlfrescoAuthenticationService);
        });

        it('should return an ECM ticket after the login done', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin').and.returnValue(fakePromiseECM);

            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicket()).toEqual('fake-post-ticket-ECM');
                done();
            });
        });

        it('should return ticket undefined when the credentials are wrong', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin')
                .and.returnValue(Promise.reject('fake invalid credentials'));

            authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicket()).toBeUndefined();
                    done();
                });
        });

        it('should login in the ECM if no provider are defined calling the login', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin').and.returnValue(fakePromiseECM);

            authService.login('fake-username', 'fake-password').subscribe(() => {
                done();
            });
        });

        it('should return a ticket undefined after logout', (done) => {
            localStorage.setItem('ticket-ECM', 'fake-post-ticket-ECM');
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogout').and.returnValue(fakePromiseECM);

            authService.logout().subscribe(() => {
                expect(authService.isLoggedIn()).toBe(false);
                expect(authService.getTicket()).toBeUndefined();
                expect(localStorage.getItem('ticket-ECM')).toBeUndefined();
                done();
            });
        });

        it('should logout only if the provider is already logged in', (done) => {
            localStorage.setItem('ticket-ECM', 'fake-post-ticket-ECM');

            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogout').and.returnValue(fakePromiseECM);

            authService.saveTicket('fake-ticket-ECM');

            authService.logout().subscribe(() => {
                expect(authService.isLoggedIn()).toBe(false);
                expect(authService.getTicket()).toBeUndefined();
                expect(localStorage.getItem('ticket-ECM')).toBeUndefined();
                done();
            });
        });

        it('should return false if the user is not logged in', () => {
            expect(authService.isLoggedIn()).toBe(false);
        });
    });

    describe('when the setting is BPM', () => {

        beforeEach(() => {
            authService = injector.get(AlfrescoAuthenticationService);
            authService.providers = 'BPM';
        });


        it('should return an BPM ticket after the login done', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin').and.returnValue(fakePromiseBPM);

            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicket()).toEqual('fake-post-ticket-BPM');
                done();
            });
        });

        it('should return ticket undefined when the credentials are wrong', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin').and.returnValue(Promise.reject('fake invalid credentials'));

            authService.login('fake-wrong-username', 'fake-wrong-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicket()).toBeUndefined();
                    done();
                });
        });

        it('should return a ticket undefined after logout', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin').and.returnValue(fakePromiseBPM);

            authService.login('fake-username', 'fake-password').subscribe(() => {
                spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogout').and.returnValue(fakePromiseBPM);

                authService.logout().subscribe(() => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicket()).toBeUndefined();
                    expect(localStorage.getItem('ticket-BPM')).toBeUndefined();
                    done();
                });
            });
        });

        it('should return an error when the logout return error', (done) => {
            localStorage.setItem('ticket-BPM', 'fake-post-ticket-BPM');
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogout').and.returnValue(Promise.reject('fake logout error'));

            authService.logout().subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(localStorage.getItem('ticket-BPM')).toEqual('fake-post-ticket-BPM');
                    done();
                });
        });
    });

    describe('when the setting is both ECM and BPM ', () => {

        beforeEach(() => {
            authService = injector.get(AlfrescoAuthenticationService);
            authService.providers = 'ALL';
        });

        it('should return both ECM and BPM tickets after the login done', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin').and.returnValue(fakePromiseBPMECM);

            authService.login('fake-username', 'fake-password').subscribe(() => {
                expect(authService.isLoggedIn()).toBe(true);
                expect(authService.getTicket()).toEqual('fake-post-ticket-ECM,fake-post-ticket-BPM');
                done();
            });
        });

        it('should return ticket undefined when the credentials are wrong', (done) => {
            spyOn(AlfrescoAuthenticationService.prototype, 'callApiLogin').and.returnValue(Promise.reject('fake invalid credentials'));

            authService.login('fake-username', 'fake-password').subscribe(
                (res) => {
                },
                (err: any) => {
                    expect(authService.isLoggedIn()).toBe(false);
                    expect(authService.getTicket()).toBeUndefined();
                    done();
                });
        });
    });
});
