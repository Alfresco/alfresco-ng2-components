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
import { Injector } from 'angular2/core';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';
import { AlfrescoAuthenticationService } from './AlfrescoAuthenticationService.service';
import { AlfrescoApiMock } from '../assets/AlfrescoApi.mock';

declare var AlfrescoApi: any;


describe('AlfrescoAuthentication', () => {
    let injector,
        service;

    beforeEach(() => {
        injector = Injector.resolveAndCreate([
            AlfrescoAuthenticationService,
            AlfrescoSettingsService
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

        window['AlfrescoApi'] = AlfrescoApiMock;
        service = injector.get(AlfrescoAuthenticationService);
    });

    it('should return true and token if the user is logged in', () => {
        service.saveToken('fake-local-token');
        expect(service.isLoggedIn()).toBe(true);
        expect(localStorage.getItem('token')).toBeDefined();
        expect(localStorage.getItem('token')).toEqual('fake-local-token');
    });

    it('should return false and token undefined if the user is not logged in', () => {
        expect(service.isLoggedIn()).toEqual(false);
        expect(localStorage.getItem('token')).not.toBeDefined();

    });

    it('should return true and token on sign in', () => {
        service.token = '';
        service.login('fake-username', 'fake-password')
            .subscribe(() => {
                    expect(service.isLoggedIn()).toBe(true);
                    expect(service.getToken()).toEqual('fake-post-token');
                    expect(localStorage.getItem('token')).toBeDefined();
                    expect(localStorage.getItem('token')).toEqual('fake-post-token');
                }
            );
    });

    it('should return false and token undefined on log out', () => {
        localStorage.setItem('token', 'fake-token');
        service.logout()
            .subscribe(() => {
                    expect(service.isLoggedIn()).toBe(false);
                    expect(service.getToken()).toBe(null);
                    expect(localStorage.getItem('token')).toBe(null);
                }
            );
    });

});
