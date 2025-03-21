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

import { JwtHelperService } from './jwt-helper.service';
import { mockToken } from '../mock/jwt-helper.service.spec';
import { TestBed } from '@angular/core/testing';
import { StorageService } from '../../common';
import { OAuthStorage } from 'angular-oauth2-oidc';

const mockStorage = {
    access_token: 'my-access_token',
    id_token: 'my-id_token',
    getItem(key: string) {
        return this[key];
    }
};

const mockCustomStorage = {
    access_token: 'my-custom-access_token',
    id_token: 'my-custom-id_token',
    getItem(key: string) {
        return this[key];
    }
};

describe('JwtHelperService', () => {
    let jwtHelperService: JwtHelperService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JwtHelperService, { provide: OAuthStorage, useValue: mockStorage }]
        });
        jwtHelperService = TestBed.inject(JwtHelperService);
    });

    it('should be able to create the service', () => {
        expect(jwtHelperService).not.toBeNull();
        expect(jwtHelperService).toBeDefined();
    });

    it('Should decode the Jwt token', () => {
        const result = jwtHelperService.decodeToken(mockToken);
        expect(result).toBeDefined();
        expect(result).not.toBeNull('');
        expect(result['name']).toBe('John Doe');
        expect(result['email']).toBe('johnDoe@gmail.com');
    });

    describe('RealmRole ', () => {
        it('Should be true if the realm_access contains the single role', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                realm_access: { roles: ['role1'] }
            });

            const result = jwtHelperService.hasRealmRole('role1');
            expect(result).toBeTruthy();
        });

        it('Should be true if the realm_access contains at least one of the roles', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                realm_access: { roles: ['role1'] }
            });

            const result = jwtHelperService.hasRealmRoles(['role1', 'role2']);
            expect(result).toBeTruthy();
        });

        it('Should be false if the realm_access does not contain the role', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                realm_access: { roles: ['role3'] }
            });
            const result = jwtHelperService.hasRealmRole('role1');
            expect(result).toBeFalsy();
        });

        it('Should be false if the realm_access does not contain at least one of the roles', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                realm_access: { roles: ['role1'] }
            });
            const result = jwtHelperService.hasRealmRoles(['role3', 'role2']);
            expect(result).toBeFalsy();
        });
    });

    describe('ClientRole ', () => {
        it('Should be true if the resource_access contains the single role', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                resource_access: { fakeApp: { roles: ['role1'] } }
            });

            const result = jwtHelperService.hasRealmRolesForClientRole('fakeApp', ['role1']);
            expect(result).toBeTruthy();
        });

        it('Should be true if the resource_access contains at least one of the roles', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                resource_access: { fakeApp: { roles: ['role1'] } }
            });

            const result = jwtHelperService.hasRealmRolesForClientRole('fakeApp', ['role1', 'role2']);
            expect(result).toBeTruthy();
        });

        it('Should be false if the resource_access does not contain the role', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                resource_access: { fakeApp: { roles: ['role3'] } }
            });
            const result = jwtHelperService.hasRealmRolesForClientRole('fakeApp', ['role1', 'role2']);
            expect(result).toBeFalsy();
        });

        it('Should be false if the resource_access does not contain the client role related to the app', () => {
            spyOn(jwtHelperService, 'decodeToken').and.returnValue({
                resource_access: { anotherFakeApp: { roles: ['role1'] } }
            });
            const result = jwtHelperService.hasRealmRolesForClientRole('fakeApp', ['role1', 'role2']);
            expect(result).toBeFalsy();
        });
    });
});

describe('JwtHelperService with custom storage service', () => {
    let jwtHelperService: JwtHelperService;
    let defaultStorage: StorageService;
    let customStorage: OAuthStorage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JwtHelperService, { provide: StorageService, useValue: mockStorage }, { provide: OAuthStorage, useValue: mockCustomStorage }]
        });
        jwtHelperService = TestBed.inject(JwtHelperService);
        defaultStorage = TestBed.inject(StorageService);
        customStorage = TestBed.inject(OAuthStorage);
    });

    it('should use the custom storage service', () => {
        const customStorageGetItemSpy = spyOn(customStorage, 'getItem').and.callThrough();
        const defaultStorageGetItemSpy = spyOn(defaultStorage, 'getItem').and.callThrough();
        const result = jwtHelperService.getIdToken();

        expect(customStorage).toBeDefined();
        expect(customStorageGetItemSpy).toHaveBeenCalled();
        expect(defaultStorageGetItemSpy).not.toHaveBeenCalled();
        expect(result).toBe('my-custom-id_token');
    });
});
