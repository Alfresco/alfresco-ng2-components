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
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuardSsoRoleService } from './auth-guard-sso-role.service';
import { JwtHelperService } from '../services/jwt-helper.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopTranslateModule } from '../../testing/noop-translate.module';
import { AuthModule } from '../oidc/auth.module';

describe('Auth Guard SSO role service', () => {
    let jwtHelperService: JwtHelperService;
    let routerService: Router;
    const state: RouterStateSnapshot = {} as RouterStateSnapshot;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, MatDialogModule, AuthModule.forRoot({ useHash: true })]
        });
        localStorage.clear();
        jwtHelperService = TestBed.inject(JwtHelperService);
        routerService = TestBed.inject(Router);
    });

    /**
     * Spy on user access
     * @param realmRoles roles
     * @param resourceAccess resource access values
     */
    function spyUserAccess(realmRoles: string[], resourceAccess: any) {
        spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({
            realm_access: { roles: realmRoles },
            resource_access: resourceAccess
        });
    }

    it('Should canActivate be true if the Role is present int the JWT token', async () => {
        spyUserAccess(['MOCK_USER_ROLE'], {});
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        route.data = { roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };
        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeTruthy();
    });

    it('Should canActivate be true if case of empty roles to check', async () => {
        spyUserAccess([], {});
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        route.data = { roles: [] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeTruthy();
    });

    it('Should canActivate be false if the Role is not present int the JWT token', async () => {
        spyUserAccess(['MOCK_ROOT_USER_ROLE'], {});
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        route.data = { roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
    });

    it('Should not redirect if canActivate is', async () => {
        spyUserAccess(['MOCK_USER_ROLE'], {});
        spyOn(routerService, 'navigate').and.stub();

        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        route.data = { roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeTruthy();
        expect(routerService.navigate).not.toHaveBeenCalled();
    });

    it('Should canActivate return false if the data Role to check is empty', async () => {
        spyUserAccess(['MOCK_USER_ROLE', 'MOCK_ROOT_USER_ROLE'], {});
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
    });

    it('Should redirect to the redirectURL if canActivate is false and redirectUrl is in data', async () => {
        spyUserAccess([], {});
        spyOn(routerService, 'navigate').and.stub();

        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        route.data = { roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'], redirectUrl: 'no-role-url' };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
        expect(routerService.navigate).toHaveBeenCalledWith(['/no-role-url']);
    });

    it('Should not redirect if canActivate is false and redirectUrl is not in  data', async () => {
        spyUserAccess([], {});
        spyOn(routerService, 'navigate').and.stub();

        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        route.data = { roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
        expect(routerService.navigate).not.toHaveBeenCalled();
    });

    it('Should canActivate be false hasRealm is true and hasClientRole is false', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyUserAccess([''], {});

        route.params = { appName: 'mockApp' };
        route.data = { clientRoles: ['appName'], roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
    });

    it('Should canActivate be false if hasRealm is false and hasClientRole is true', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyUserAccess([], {});

        route.params = { appName: 'mockApp' };
        route.data = { clientRoles: ['mockApp'], roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
    });

    it('Should canActivate be true if both Real Role and Client Role are present int the JWT token', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyUserAccess(['MOCK_USER_ROLE'], { mockApp: { roles: ['MOCK_ADMIN_ROLE'] } });

        route.params = { appName: 'mockApp' };
        route.data = { clientRoles: ['appName'], roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeTruthy();
    });

    it('Should canActivate be false if the Client Role is not present int the JWT token with the correct role', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyUserAccess(['MOCK_USER_ROLE'], { mockApp: { roles: ['MOCK_ROOT_USER_ROLE'] } });

        route.params = { appName: 'mockApp' };
        route.data = { clientRoles: ['appName'], roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
    });

    it('Should canActivate be false hasRealm is true and hasClientRole is false', async () => {
        const materialDialog = TestBed.inject(MatDialog);

        spyOn(materialDialog, 'closeAll');

        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyUserAccess([], {});

        route.params = { appName: 'mockApp' };
        route.data = { clientRoles: ['appName'], roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'] };

        const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

        expect(authGuard).toBeFalsy();
        expect(materialDialog.closeAll).toHaveBeenCalled();
    });

    describe('Excluded Roles', () => {
        it('Should canActivate be false when the user has one of the excluded roles', async () => {
            spyUserAccess(['MOCK_USER_ROLE'], {});

            const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            route.data = { roles: ['MOCK_ANOTHER_ROLE'], excludedRoles: ['MOCK_USER_ROLE'] };

            const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

            expect(authGuard).toBe(false);
        });

        it('Should canActivate be true when the user has none of the excluded roles', async () => {
            spyUserAccess(['MOCK_ADMIN_ROLE'], {});

            const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            route.data = { roles: ['MOCK_USER_ROLE', 'MOCK_ADMIN_ROLE'], excludedRoles: ['MOCK_ROOT_USER_ROLE'] };

            const authGuard = TestBed.runInInjectionContext(() => AuthGuardSsoRoleService(route, state));

            expect(authGuard).toBeTruthy();
        });
    });
});
