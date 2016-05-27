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

import { it, describe, beforeEach } from 'angular2/testing';
import { provide, Injector } from 'angular2/core';
import { Http, HTTP_PROVIDERS, XHRBackend, Response, ResponseOptions } from 'angular2/http';
import { MockBackend } from 'angular2/http/testing';
import { AlfrescoAuthenticationService } from './alfresco-authentication.service';


describe('AlfrescoAuthentication', () => {
    let injector,
        backend,
        mockBackend,
        httpService,
        service;

    beforeEach(() => {
        injector = Injector.resolveAndCreate([
            HTTP_PROVIDERS,
            MockBackend,
            provide(XHRBackend, {useClass: MockBackend}),
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

        mockBackend = injector.get(MockBackend);
        backend = injector.get(XHRBackend);
        httpService = injector.get(Http);
        service = injector.get(AlfrescoAuthenticationService);
    });

    it('should return true and token if the user is logged in', () => {
        service.saveJwt('fake-local-token');
        expect(service.isLoggedIn()).toBe(true);
        expect(localStorage.getItem('token')).toBeDefined();
        expect(localStorage.getItem('token')).toEqual('fake-local-token');
    });

    it('should return false and token undefined if the user is not logged in', () => {
        expect(service.isLoggedIn()).toEqual(false);
        expect(localStorage.getItem('token')).not.toBeDefined();

    });

    it('should return true and token on sign in', () => {
        backend.connections.subscribe(connection => {
            connection.mockRespond(new Response(new ResponseOptions({body: {data: {ticket: 'fake-post-token'}}})));
        });
        service.token = '';
        service.login('POST', 'fakeUser', 'fakePassword')
            .subscribe(() => {
                    expect(service.isLoggedIn()).toBe(true);
                    expect(service.token).toEqual('fake-post-token');
                    expect(localStorage.getItem('token')).toBeDefined();
                    expect(localStorage.getItem('token')).toEqual('fake-post-token');
                }
            );
    });

    it('should return false and token undefined on log out', () => {
        service.token = 'fake-token';
        localStorage.setItem('token', 'fake-token');
        service.logout()
            .subscribe(() => {
                    expect(service.isLoggedIn()).toBe(false);
                    expect(service.token).not.toBeDefined();
                    expect(localStorage.getItem('token')).not.toBeDefined();
                }
            );
    });

    it('should return no error if method value is GET', () => {
        expect(service.login('GET', 'fakeUser', 'fakePassword').hasErrored).toBe(false);
    });

    it('should return no error if method value is POST', () => {
        expect(service.login('POST', 'fakeUser', 'fakePassword').hasErrored).toBe(false);
    });

    it('should throw an exception if method value is different from GET or POST', () => {
        expect(service.login('PUT', 'fakeUser', 'fakePassword').error).toEqual('Invalid method name the value should be GET or POST');
    });

});

