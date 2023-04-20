/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { setupTestBed } from '../../testing/setup-test-bed';
import { TestBed } from '@angular/core/testing';

describe('JwtHelperService', () => {

    let jwtHelperService: JwtHelperService;

    setupTestBed({
        providers: [JwtHelperService]
    });

    beforeEach(() => {
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
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');

            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    realm_access: { roles: ['role1'] }
                });

            const result = jwtHelperService.hasRealmRole('role1');
            expect(result).toBeTruthy();
        });

        it('Should be true if the realm_access contains at least one of the roles', () => {
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');

            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    realm_access: { roles: ['role1'] }
                });

            const result = jwtHelperService.hasRealmRoles(['role1', 'role2']);
            expect(result).toBeTruthy();
        });

        it('Should be false if the realm_access does not contain the role', () => {
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    realm_access: { roles: ['role3'] }
                });
            const result = jwtHelperService.hasRealmRole('role1');
            expect(result).toBeFalsy();
        });

        it('Should be false if the realm_access does not contain at least one of the roles', () => {
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    realm_access: { roles: ['role1'] }
                });
            const result = jwtHelperService.hasRealmRoles(['role3', 'role2']);
            expect(result).toBeFalsy();
        });
   });

    describe('ClientRole ', () => {

        it('Should be true if the resource_access contains the single role', () => {
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');

            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    resource_access: { fakeapp: { roles: ['role1'] } }
                });

            const result = jwtHelperService.hasRealmRolesForClientRole('fakeapp', ['role1']);
            expect(result).toBeTruthy();
        });

        it('Should be true if the resource_access contains at least one of the roles', () => {
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');

            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    resource_access: { fakeapp: { roles: ['role1'] } }
                });

            const result = jwtHelperService.hasRealmRolesForClientRole('fakeapp', ['role1', 'role2']);
            expect(result).toBeTruthy();
        });

        it('Should be false if the resource_access does not contain the role', () => {
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    resource_access: { fakeapp: { roles: ['role3'] } }
                });
            const result = jwtHelperService.hasRealmRolesForClientRole('fakeapp', ['role1', 'role2']);
            expect(result).toBeFalsy();
        });

        it('Should be false if the resource_access does not contain the client role related to the app', () => {
            spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
            spyOn(jwtHelperService, 'decodeToken').and.returnValue(
                {
                    resource_access: { anotherfakeapp: { roles: ['role1'] } }
                });
            const result = jwtHelperService.hasRealmRolesForClientRole('fakeapp', ['role1', 'role2']);
            expect(result).toBeFalsy();
        });
   });
});
