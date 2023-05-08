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

import { CoreTestingModule, setupTestBed } from '../../testing';
import { TestBed } from '@angular/core/testing';
import { UserAccessService } from './user-access.service';
import { JwtHelperService } from './jwt-helper.service';
import { OAuth2Service } from './oauth2.service';
import { of, throwError } from 'rxjs';
import { userAccessMock } from '../../mock/user-access.mock';
import { AppConfigService } from '../../app-config';

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

    it('should return true when no roles to check are passed in global access', async () => {
        spyUserAccess(['MOCK_USER_ROLE'], {});
        await userAccessService.fetchUserAccess();
        const hasGlobalAccess = userAccessService.hasGlobalAccess([]);

        expect(hasGlobalAccess).toBe(true);
    });

    it('should return true when no roles to check are passed in application access', async () => {
        spyUserAccess([], { mockApp: { roles: ['MOCK_APP_ROLE'] } });
        await userAccessService.fetchUserAccess();
        const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp', []);

        expect(hasApplicationAccess).toBe(true);
    });

    describe('Access from JWT token', () => {

        it('should return true when the user has one of the global roles', async () => {
            spyUserAccess(['MOCK_USER_ROLE', 'MOCK_USER_ROLE_2'], {});
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_USER_ROLE']);

            expect(hasGlobalAccess).toEqual(true);
        });

        it('should return true when the user has one of the roles for an application', async () => {
            spyUserAccess([], { mockApp: { roles: ['MOCK_APP_ROLE', 'MOCK_APP_ROLE_2'] } });
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp', ['MOCK_APP_ROLE']);

            expect(hasApplicationAccess).toEqual(true);
        });

        it('should return false when the user has none of the global roles', async () => {
            spyUserAccess(['MOCK_USER_ROLE'], {});
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_USER_ROLE_2']);

            expect(hasGlobalAccess).toEqual(false);
        });

        it('should return false when the user has none of the roles for an application', async () => {
            spyUserAccess([], { mockApp: { roles: ['MOCK_APP_ROLE'] } });
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp', ['MOCK_APP_ROLE_2']);

            expect(hasApplicationAccess).toEqual(false);
        });
    });

    describe('Access from the API', () => {
        let getAccessFromApiSpy: jasmine.Spy;

        beforeEach(() => {
            spyOn(jwtHelperService, 'getValueFromLocalToken').and.returnValue(undefined);
            getAccessFromApiSpy = spyOn(oauth2Service, 'get').and.returnValue(of(userAccessMock));
            appConfigService.config.authType = 'OAUTH';
        });

        it('should return true when the user has one of the global roles', async () => {
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_GLOBAL_USER_ROLE']);

            expect(hasGlobalAccess).toEqual(true);
        });

        it('should return true when the user has one of the roles for an application', async () => {
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp1', ['MOCK_USER_ROLE_APP_1']);

            expect(hasApplicationAccess).toEqual(true);
        });

        it('should return false when the user has none of the global roles', async () => {
            await userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_USER_ROLE_NOT_EXISTING']);

            expect(hasGlobalAccess).toEqual(false);
        });

        it('should return false when the user has none of the roles for an application', async () => {
            await userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp1', ['MOCK_ROLE_NOT_EXISING_IN_APP']);

            expect(hasApplicationAccess).toEqual(false);
        });

        it('should not call more than once the api to fetch the user access', async () => {
            await userAccessService.fetchUserAccess();
            await userAccessService.fetchUserAccess();
            await userAccessService.fetchUserAccess();

            expect(getAccessFromApiSpy.calls.count()).toEqual(1);
        });

        it('should the url be composed from bpm host of app.config', async () => {
            const fakeIdentityHost = 'https://fake-identity-host.fake.com';
            appConfigService.config.bpmHost = fakeIdentityHost;
            await userAccessService.fetchUserAccess();

            expect(getAccessFromApiSpy).toHaveBeenCalledWith({ url: `${fakeIdentityHost}/identity-adapter-service/v1/roles` });
        });

        it('should the url contain appkey if its present in app config', async () => {
            const fakeIdentityHost = 'https://fake-identity-host.fake.com';
            appConfigService.config.bpmHost = fakeIdentityHost;
            appConfigService.config.application.key = 'fake-app-key';
            await userAccessService.fetchUserAccess();

            expect(getAccessFromApiSpy).toHaveBeenCalledWith({ url: `${fakeIdentityHost}/identity-adapter-service/v1/roles` , queryParams: { appkey: 'fake-app-key' } });
        });

        it('should not fetch the access from the API if is not configured with OAUTH', async () => {
            appConfigService.config.authType = 'BASIC';
            await userAccessService.fetchUserAccess();

            expect(getAccessFromApiSpy).not.toHaveBeenCalled();
        });

        it('should set empty access list on fething roles error', async () => {
            getAccessFromApiSpy.and.returnValue(throwError({ status: 503 }));
            await userAccessService.fetchUserAccess();

            expect(userAccessService.hasGlobalAccess(['MOCKED_ROLES'])).toBe(false);
        });
    });
});
