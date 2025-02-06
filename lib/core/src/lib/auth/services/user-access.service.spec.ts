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

import { TestBed } from '@angular/core/testing';
import { UserAccessService } from './user-access.service';
import { JwtHelperService } from './jwt-helper.service';
import { AppConfigService } from '../../app-config';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthModule, JWT_STORAGE_SERVICE } from '../oidc/auth.module';
import { StorageService } from '../../common/services/storage.service';

describe('UserAccessService', () => {
    let userAccessService: UserAccessService;
    let jwtHelperService: JwtHelperService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, AuthModule.forRoot({ useHash: true })],
            providers: [{ provide: JWT_STORAGE_SERVICE, useClass: StorageService }, UserAccessService]
        });
        userAccessService = TestBed.inject(UserAccessService);
        jwtHelperService = TestBed.inject(JwtHelperService);
        appConfigService = TestBed.inject(AppConfigService);
    });

    /**
     * spy on auth realm access
     *
     * @param realmRoles roles
     * @param resourceAccess access settings
     */
    function spyRealmAccess(realmRoles: string[], resourceAccess: any) {
        spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({
            realm_access: { roles: realmRoles },
            resource_access: resourceAccess
        });
    }

    /**
     * spy on HxP authorisation
     *
     * @param appkey app key
     * @param roles roles list
     */
    function spyHxpAuthorization(appkey: string, roles: string[]) {
        spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({
            hxp_authorization: {
                appkey,
                role: roles
            }
        });
    }

    it('should return true when no roles to check are passed in global access', () => {
        spyRealmAccess(['MOCK_USER_ROLE'], {});
        userAccessService.fetchUserAccess();
        const hasGlobalAccess = userAccessService.hasGlobalAccess([]);

        expect(hasGlobalAccess).toBe(true);
    });

    it('should return true when no roles to check are passed in application access', () => {
        spyRealmAccess([], { mockApp: { roles: ['MOCK_APP_ROLE'] } });
        userAccessService.fetchUserAccess();
        const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp', []);

        expect(hasApplicationAccess).toBe(true);
    });

    describe('Access present in realm_access', () => {
        it('should return true when the user has one of the global roles', () => {
            spyRealmAccess(['MOCK_USER_ROLE', 'MOCK_USER_ROLE_2'], {});
            userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_USER_ROLE']);

            expect(hasGlobalAccess).toEqual(true);
        });

        it('should return true when the user has one of the roles for an application', () => {
            spyRealmAccess([], { mockApp: { roles: ['MOCK_APP_ROLE', 'MOCK_APP_ROLE_2'] } });
            userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp', ['MOCK_APP_ROLE']);

            expect(hasApplicationAccess).toEqual(true);
        });

        it('should return false when the user has none of the global roles', () => {
            spyRealmAccess(['MOCK_USER_ROLE'], {});
            userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_USER_ROLE_2']);

            expect(hasGlobalAccess).toEqual(false);
        });

        it('should return false when the user has none of the roles for an application', () => {
            spyRealmAccess([], { mockApp: { roles: ['MOCK_APP_ROLE'] } });
            userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp', ['MOCK_APP_ROLE_2']);

            expect(hasApplicationAccess).toEqual(false);
        });
    });

    describe('Access present in hxp_authorization', () => {
        it('should return true when the user has one of the global roles', () => {
            spyHxpAuthorization('mockApp1', ['MOCK_GLOBAL_USER_ROLE']);
            appConfigService.config = { application: { key: 'mockApp1' } };
            userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_GLOBAL_USER_ROLE']);

            expect(hasGlobalAccess).toEqual(true);
        });

        it('should return true when the user has one of the roles for an application', () => {
            spyHxpAuthorization('mockApp1', ['MOCK_USER_ROLE_APP_1']);
            appConfigService.config = { application: { key: 'mockApp1' } };
            userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp1', ['MOCK_USER_ROLE_APP_1']);

            expect(hasApplicationAccess).toEqual(true);
        });

        it('should return false when the user has none of the global roles', () => {
            spyHxpAuthorization('mockApp1', ['MOCK_USER_ROLE_APP_1']);
            appConfigService.config = { application: { key: 'mockApp1' } };
            userAccessService.fetchUserAccess();
            const hasGlobalAccess = userAccessService.hasGlobalAccess(['MOCK_USER_ROLE_NOT_EXISTING']);

            expect(hasGlobalAccess).toEqual(false);
        });

        it('should return false when the user has none of the roles for an application', () => {
            spyHxpAuthorization('mockApp1', ['MOCK_USER_ROLE_APP_1']);
            appConfigService.config = { application: { key: 'mockApp1' } };
            userAccessService.fetchUserAccess();
            const hasApplicationAccess = userAccessService.hasApplicationAccess('mockApp1', ['MOCK_ROLE_NOT_EXISING_IN_APP']);

            expect(hasApplicationAccess).toEqual(false);
        });
    });

    it('should return false when access is neither in realm_access or hxp_authorization', () => {
        spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ mock_access: {} });
        userAccessService.fetchUserAccess();
        const hasGlobalAccess = userAccessService.hasGlobalAccess(['mock_role']);

        expect(hasGlobalAccess).toEqual(false);
    });
});
