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

import { JwtHelperService } from './jwt-helper.service';
import { mockToken } from './../mock/jwt-token.mock';
import { setupTestBed } from '../testing/setup-test-bed';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

describe('JwtHelperService', () => {

    let jwtHelperService: JwtHelperService;

    setupTestBed({
        providers: [JwtHelperService]
    });

    beforeEach(() => {
        jwtHelperService = TestBed.inject(JwtHelperService);
    });

    async function spyRoles(realmRoles: string[], resourceAccess: any) {
        spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ realm_access: { roles: realmRoles }, resource_access: resourceAccess });
        await jwtHelperService.initialise();
    }

    it('Should decode the Jwt token', () => {
        const result = jwtHelperService.decodeToken(mockToken);
        expect(result).toBeDefined();
        expect(result).not.toBeNull('');
        expect(result['name']).toBe('John Doe');
        expect(result['email']).toBe('johnDoe@gmail.com');
    });

    describe('Global roles', () => {

        it('Should be true when the user has at least one of the global roles', async () => {
            await spyRoles(['role1'], {});

            const result = jwtHelperService.hasGlobalRoles(['role1', 'role2']);
            expect(result).toBeTruthy();
        });

        it('Should be false when the user does not have at least one of the global roles', async () => {
            await spyRoles(['role1'], {});
            const result = jwtHelperService.hasGlobalRoles(['role2', 'role3']);
            expect(result).toBeFalsy();
        });
   });

    describe('Application roles', () => {

        it('Should be true when the user has at least one of the requested roles for an application', async () => {
            await spyRoles([], { fakeapp: { roles: ['role1'] } });

            const result = jwtHelperService.hasApplicationRoles('fakeapp', ['role1', 'role2']);
            expect(result).toBeTruthy();
        });

        it('Should be false when the user does not have the requested roles for an application', async () => {
            await spyRoles(['role1'], { fakeapp: { roles: ['role3'] } });
            const result = jwtHelperService.hasRealmRolesForClientRole('fakeapp', ['role1', 'role2']);
            expect(result).toBeFalsy();
        });

        it('Should be false when the app does not exist in the apps of a user', async () => {
            await spyRoles([], { anotherfakeapp: { roles: ['role1'] } });
            const result = jwtHelperService.hasRealmRolesForClientRole('fakeapp', ['role1', 'role2']);

            expect(result).toBeFalsy();
        });
   });

    describe('Roles streams', () => {

        it('should emit the global roles when initialising', async () => {
            await spyRoles(['role1', 'role2'], {});

            const globalRoles = await jwtHelperService.globalRoles$.pipe(take(1)).toPromise();
            expect(globalRoles).toEqual({ roles: ['role1', 'role2'] });
        });

        it('should emit the application roles when initialising', async () => {
            await spyRoles([], { fakeapp: { roles: ['role1'] } });

            const applicationRoles = await jwtHelperService.applicationRoles$.pipe(take(1)).toPromise();
            expect(applicationRoles).toEqual({ fakeapp: { roles: ['role1'] } });
        });
    });
});
