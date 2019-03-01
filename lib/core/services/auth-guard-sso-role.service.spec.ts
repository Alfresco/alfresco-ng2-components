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

import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { AuthGuardSsoRoleService } from './auth-guard-sso-role.service';
import { JwtHelperService } from './jwt-helper.service';
import { StorageService } from './storage.service';

describe('Auth Guard SSO role service', () => {

    let authGuard: AuthGuardSsoRoleService;
    let storageService: StorageService;
    let jwtHelperService: JwtHelperService;
    let routerService: Router;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        localStorage.clear();
        storageService = TestBed.get(StorageService);
        authGuard = TestBed.get(AuthGuardSsoRoleService);
        jwtHelperService = TestBed.get(JwtHelperService);
        routerService = TestBed.get(Router);
    });

    it('Should canActivate be true if the Role is present int the JWT token', async(() => {
        spyOn(storageService, 'getItem').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ 'realm_access': { roles: ['role1'] } });

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { 'roles': ['role1', 'role2'] };

        expect(authGuard.canActivate(router, null)).toBeTruthy();
    }));

    it('Should canActivate be false if the Role is not present int the JWT token', async(() => {
        spyOn(storageService, 'getItem').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ 'realm_access': { roles: ['role3'] } });

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { 'roles': ['role1', 'role2'] };

        expect(authGuard.canActivate(router, null)).toBeFalsy();
    }));

    it('Should not redirect if canActivate is', async(() => {
        spyOn(storageService, 'getItem').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ 'realm_access': { roles: ['role1'] } });
        spyOn(routerService, 'navigate').and.stub();

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { 'roles': ['role1', 'role2']};

        expect(authGuard.canActivate(router, null)).toBeTruthy();
        expect(routerService.navigate).not.toHaveBeenCalled();
    }));

    it('Should canActivate return false if the data Role to check is empty', async(() => {
        spyOn(storageService, 'getItem').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ 'realm_access': { roles: ['role1', 'role3'] } });

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

        expect(authGuard.canActivate(router, null)).toBeFalsy();
    }));

    it('Should canActivate return false if the realm_access is not present', async(() => {
        spyOn(storageService, 'getItem').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ });

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

        expect(authGuard.canActivate(router, null)).toBeFalsy();
    }));

    it('Should redirect to the redirectURL if canActivate is false and redirectUrl is in data', async(() => {
        spyOn(storageService, 'getItem').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ });
        spyOn(routerService, 'navigate').and.stub();

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { 'roles': ['role1', 'role2'],  'redirectUrl': 'no-role-url'};

        expect(authGuard.canActivate(router, null)).toBeFalsy();
        expect(routerService.navigate).toHaveBeenCalledWith(['/no-role-url']);
    }));

    it('Should not redirect if canActivate is false and redirectUrl is not in  data', async(() => {
        spyOn(storageService, 'getItem').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ });
        spyOn(routerService, 'navigate').and.stub();

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { 'roles': ['role1', 'role2']};

        expect(authGuard.canActivate(router, null)).toBeFalsy();
        expect(routerService.navigate).not.toHaveBeenCalled();
    }));

});
