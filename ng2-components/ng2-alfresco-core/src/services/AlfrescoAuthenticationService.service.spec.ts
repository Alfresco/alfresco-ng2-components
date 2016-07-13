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

import { it, describe } from '@angular/core/testing';
import { ReflectiveInjector, provide } from '@angular/core';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';
import { AlfrescoAuthenticationService } from './AlfrescoAuthenticationService.service';
import { AlfrescoAuthenticationECM } from './AlfrescoAuthenticationECM.service';
import { AlfrescoAuthenticationBPM } from './AlfrescoAuthenticationBPM.service';
import { XHRBackend, HTTP_PROVIDERS } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

declare var AlfrescoApi: any;

describe('AlfrescoAuthentication', () => {
    let injector,
        fakePromiseECM,
        fakePromiseBPM,
        service;

    fakePromiseECM = new Promise(function (resolve, reject) {
        resolve({
            entry: {
                userId: 'fake-username',
                id: 'fake-post-token-ECM'
            }
        });
        reject({
            response: {
                error: 'fake-error'
            }
        });
    });

    fakePromiseBPM = new Promise(function (resolve, reject) {
        resolve({
            status: 'fake-post-token-BPM'
        });
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

        // service = injector.get(AlfrescoAuthenticationService);
    });

    describe('when the setting is ECM', () => {

        it('should create an AlfrescoAuthenticationECM instance', (done) => {
            let providers = ['ECM'];

            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getCreateTicketPromise').and.returnValue(fakePromiseECM);

            service.login('fake-username', 'fake-password', providers)
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(true);
                    expect(service.providersInstance).toBeDefined();
                    expect(service.providersInstance.length).toBe(1);
                    expect(service.providersInstance[0].TYPE).toEqual(providers[0]);
                    done();
                }
            );
        });

        it('should return an ECM token after the login done', (done) => {
            let providers = ['ECM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getCreateTicketPromise').and.returnValue(fakePromiseECM);

            service.login('fake-username', 'fake-password', providers)
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(true);
                    expect(service.getToken(providers[0])).toEqual('fake-post-token-ECM');
                    done();
                }
            );
        });

        it('should return token undefined when the credentials are wrong', (done) => {
            let providers = ['ECM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getCreateTicketPromise')
                .and.returnValue(Promise.reject('fake invalid credentials'));

            service.login('fake-wrong-username', 'fake-wrong-password', providers)
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(service.isLoggedIn(providers[0])).toBe(false);
                    expect(service.getToken(providers[0])).toBeUndefined();
                    done();
                }
            );
        });

        it('should return an error if no provider are defined calling the login', (done) => {
            let providers = [];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            service.login('fake-username', 'fake-password', providers)
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(err).toEqual('No providers defined');
                    done();
                }
            );
        });

        it('should return an error if an empty provider are defined calling the login', (done) => {
            let providers = [''];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            service.login('fake-username', 'fake-password', providers)
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual('Wrong provider defined');
                    done();
                }
            );
        });

        it('should return a token undefined after logout', (done) => {
            let providers = ['ECM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            localStorage.setItem('token-ECM', 'fake-post-token-ECM');
            service.createProviderInstance(providers);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getDeleteTicketPromise').and.returnValue(fakePromiseECM);

            service.logout()
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(false);
                    expect(service.getToken(providers[0])).toBeUndefined();
                    expect(localStorage.getItem('token-ECM')).toBeUndefined();
                    done();
                }
            );
        });

        it('should return an error if no provider are defined calling the logout', (done) => {
            let providers = [];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            service.logout()
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(err).toEqual('No providers defined');
                    done();
                }
            );
        });

        it('should return false if the user is not logged in', () => {
            let providers = ['ECM'];
            expect(service.isLoggedIn(providers[0])).toBe(false);
        });
    });

    describe('when the setting is BPM', () => {

        it('should create an AlfrescoAuthenticationBPM instance', (done) => {
            let providers = ['BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogin').and.returnValue(fakePromiseBPM);

            service.login('fake-username', 'fake-password', providers)
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(true);
                    expect(service.providersInstance).toBeDefined();
                    expect(service.providersInstance.length).toBe(1);
                    expect(service.providersInstance[0].TYPE).toEqual(providers[0]);
                    done();
                }
            );
        });

        it('should return an BPM token after the login done', (done) => {
            let providers = ['BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogin').and.returnValue(fakePromiseBPM);

            service.login('fake-username', 'fake-password', providers)
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(true);
                    expect(service.getToken(providers[0])).toEqual('fake-post-token-BPM');
                    done();
                }
            );
        });

        it('should return token undefined when the credentials are wrong', (done) => {
            let providers = ['BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogin').and.returnValue(Promise.reject('fake invalid credentials'));

            service.login('fake-wrong-username', 'fake-wrong-password', providers)
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(service.isLoggedIn(providers[0])).toBe(false);
                    expect(service.getToken(providers[0])).toBeUndefined();
                    done();
                }
            );
        });

        it('should return a token undefined after logout', (done) => {
            let providers = ['BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            localStorage.setItem('token-BPM', 'fake-post-token-BPM');
            service.createProviderInstance(providers);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogout').and.returnValue(fakePromiseBPM);

            service.logout()
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(false);
                    expect(service.getToken(providers[0])).toBeUndefined();
                    expect(localStorage.getItem('token-BPM')).toBeUndefined();
                    done();
                }
            );
        });

        it('should throw an error when the logout return error', (done) => {
            let providers = ['BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            localStorage.setItem('token-BPM', 'fake-post-token-BPM');
            service.createProviderInstance(providers);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogout').and.returnValue(Promise.reject('fake logout error'));

            service.logout()
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual('fake logout error');
                    expect(localStorage.getItem('token-BPM')).toEqual('fake-post-token-BPM');
                    done();
                }
            );
        });


    });

    describe('when the setting is both ECM and BPM ', () => {

        it('should create both instances', (done) => {
            let providers = ['ECM', 'BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getCreateTicketPromise').and.returnValue(fakePromiseECM);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogin').and.returnValue(fakePromiseBPM);

            service.login('fake-username', 'fake-password', providers)
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(true);
                    expect(service.isLoggedIn(providers[1])).toBe(true);
                    expect(service.providersInstance).toBeDefined();
                    expect(service.providersInstance.length).toBe(2);
                    expect(service.providersInstance[0].TYPE).toEqual(providers[0]);
                    expect(service.providersInstance[1].TYPE).toEqual(providers[1]);
                    done();
                }
            );
        });

        it('should return both ECM and BPM tokens after the login done', (done) => {
            let providers = ['ECM', 'BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getCreateTicketPromise').and.returnValue(fakePromiseECM);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogin').and.returnValue(fakePromiseBPM);

            service.login('fake-username', 'fake-password', providers)
                .subscribe(() => {
                    expect(service.isLoggedIn(providers[0])).toBe(true);
                    expect(service.isLoggedIn(providers[1])).toBe(true);
                    expect(service.getToken(providers[0])).toEqual('fake-post-token-ECM');
                    expect(service.getToken(providers[1])).toEqual('fake-post-token-BPM');
                    done();
                }
            );
        });

        it('should return token undefined when the credentials are correct for the ECM login but wrong for the BPM login', (done) => {
            let providers = ['ECM', 'BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getCreateTicketPromise').and.returnValue(fakePromiseECM);
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogin').and.returnValue(Promise.reject('fake invalid credentials'));

            service.login('fake-username', 'fake-password', providers)
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(service.isLoggedIn(providers[0])).toBe(false);
                    expect(service.getToken(providers[0])).toBeUndefined();
                    expect(service.isLoggedIn(providers[1])).toBe(false);
                    expect(service.getToken(providers[1])).toBeUndefined();
                    done();
                }
            );
        });

        it('should return token undefined when the credentials are correct for the BPM login but wrong for the ECM login', (done) => {
            let providers = ['ECM', 'BPM'];
            let alfSetting = injector.get(AlfrescoSettingsService);
            alfSetting.providers = providers;

            service = injector.get(AlfrescoAuthenticationService);
            spyOn(AlfrescoAuthenticationECM.prototype, 'getCreateTicketPromise')
                .and.returnValue(Promise.reject('fake invalid credentials'));
            spyOn(AlfrescoAuthenticationBPM.prototype, 'apiActivitiLogin').and.returnValue(fakePromiseBPM);

            service.login('fake-username', 'fake-password', providers)
                .subscribe(
                (res) => {
                    done();
                },
                (err: any) => {
                    expect(service.isLoggedIn(providers[0])).toBe(false);
                    expect(service.getToken(providers[0])).toBeUndefined();
                    expect(service.isLoggedIn(providers[1])).toBe(false);
                    expect(service.getToken(providers[1])).toBeUndefined();
                    done();
                }
            );
        });
    });
});
