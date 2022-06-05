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

import { CoreTestingModule, setupTestBed } from '../testing';
import { TestBed } from '@angular/core/testing';
import { UserAccessService } from './user-access.service';
import { JwtHelperService } from './jwt-helper.service';
import { OAuth2Service } from './oauth2.service';
import { of } from 'rxjs';
import { userAccessMock } from '../mock/user-access.mock';
import { AppConfigService } from '../app-config';

describe('UserAccessService', () => {
    let userAccessService: UserAccessService;
    let jwtHelperService: JwtHelperService;
    let oauth2Service: OAuth2Service;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [CoreTestingModule],
        providers: [UserAccessService]
    });

    beforeEach(() => {
        userAccessService = TestBed.inject(UserAccessService);
        userAccessService.resetAccess();
        jwtHelperService = TestBed.inject(JwtHelperService);
        oauth2Service = TestBed.inject(OAuth2Service);
        appConfigService = TestBed.inject(AppConfigService);
    });

    function spyUserAccess(realmRoles: string[], resourceAccess: any) {
        spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({
            realm_access: { roles: realmRoles },
            resource_access: resourceAccess
        });
    }

    describe('Access from JWT token', () => {

        it('should return true when the user has one of the global roles', async () => {
            spyUserAccess(['role1', 'role2'], {});
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['role1']);

            expect(hasGlobalAccess).toEqual(true);
        });

        it('should return true when the user has one of the roles for an application', async () => {
            spyUserAccess([], { app1: { roles: ['app-role', 'app-role-2'] } });
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('app1', ['app-role']);

            expect(hasApplicationAccess).toEqual(true);
        });

        it('should return false when the user has none of the global roles', async () => {
            spyUserAccess(['role1'], {});
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['role2']);

            expect(hasGlobalAccess).toEqual(false);
        });

        it('should return false when the user has none of the roles for an application', async () => {
            spyUserAccess([], { app1: { roles: ['app-role'] } });
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('app1', ['app-role-2']);

            expect(hasApplicationAccess).toEqual(false);
        });
    });

    describe('Access from the API', () => {
        let getAccessFromApiSpy: jasmine.Spy;

        beforeEach(() => {
            spyOn(jwtHelperService, 'getValueFromLocalToken').and.returnValue(undefined);
            getAccessFromApiSpy = spyOn(oauth2Service, 'get').and.returnValue(of(userAccessMock));
        });

        it('should return true when the user has one of the global roles', async () => {
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['ACTIVITI_USER']);

            expect(hasGlobalAccess).toEqual(true);
        });

        it('should return true when the user has one of the roles for an application', async () => {
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('simpleapp', ['ACTIVITI_USER']);

            expect(hasApplicationAccess).toEqual(true);
        });

        it('should return false when the user has none of the global roles', async () => {
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['FAKE_ROLE']);

            expect(hasGlobalAccess).toEqual(false);
        });

        it('should return true when the user has one of the roles for an application', async () => {
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('fake-app', ['FAKE_ROLE']);

            expect(hasApplicationAccess).toEqual(false);
        });

        it('should not call more than once the api to fetch the user access', async () => {
            await userAccessService.fetchUserAccess();
            await userAccessService.fetchUserAccess();
            await userAccessService.fetchUserAccess();

            expect(getAccessFromApiSpy.calls.count()).toEqual(1);
        });

        it('should the url be composed from identity host of app.config', async () => {
            const fakeIdentityHost = 'https://fake-identity-host.fake.com';
            appConfigService.config.identityHost = fakeIdentityHost;
            await userAccessService.fetchUserAccess();

            expect(getAccessFromApiSpy).toHaveBeenCalledWith({ url: `${ fakeIdentityHost }/v1/identity/roles` });
        });
    });
});
