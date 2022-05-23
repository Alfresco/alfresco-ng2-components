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

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { AuthGuardSsoRoleService } from './auth-guard-sso-role.service';
import { JwtHelperService } from './jwt-helper.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { PeopleContentService } from './people-content.service';
import { of } from 'rxjs';
import { getFakeUserWithContentAdminCapability, getFakeUserWithContentUserCapability } from '../mock/ecm-user.service.mock';
import { USER_ACCESS_HELPER_SERVICE_TOKEN } from './user-access-helper/user-access-helper-service.token';

describe('Auth Guard SSO role service', () => {

    let authGuard: AuthGuardSsoRoleService;
    let jwtHelperService: JwtHelperService;
    let routerService: Router;
    let peopleContentService: PeopleContentService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        providers: [
            {
                provide: USER_ACCESS_HELPER_SERVICE_TOKEN,
                useExisting: JwtHelperService
            }
        ]
    });

    beforeEach(() => {
        localStorage.clear();
        authGuard = TestBed.inject(AuthGuardSsoRoleService);
        jwtHelperService = TestBed.inject(JwtHelperService);
        routerService = TestBed.inject(Router);
        peopleContentService = TestBed.inject(PeopleContentService);
    });

    function spyRoles(realmRoles: string[], resourceAccess: any) {
        spyOn(jwtHelperService, 'getAccessToken').and.returnValue('my-access_token');
        spyOn(jwtHelperService, 'decodeToken').and.returnValue({ realm_access: { roles: realmRoles }, resource_access: resourceAccess });
    }

    it('Should canActivate be true if the Role is present int the JWT token', async () => {
        spyRoles(['role1'], {});

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(router)).toBeTruthy();
    });

    it('Should canActivate be true if case of empty roles to check', async () => {
        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { roles: [] };

        expect(await authGuard.canActivate(router)).toBeTruthy();
    });

    it('Should canActivate be false if the Role is not present int the JWT token', async () => {
        spyRoles(['role3'], {});

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(router)).toBeFalsy();
    });

    it('Should not redirect if canActivate is', async () => {
        spyRoles(['role1'], {});
        spyOn(routerService, 'navigate').and.stub();

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(router)).toBeTruthy();
        expect(routerService.navigate).not.toHaveBeenCalled();
    });

    it('Should canActivate return false if the data Role to check is empty', async () => {
        spyRoles(['role1', 'role3'], {});

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

        expect(await authGuard.canActivate(router)).toBeFalsy();
    });

    it('Should canActivate return false if the realm_access is not present', async () => {
        spyRoles([], {});

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

        expect(await authGuard.canActivate(router)).toBeFalsy();
    });

    it('Should redirect to the redirectURL if canActivate is false and redirectUrl is in data', async () => {
        spyRoles([], {});
        spyOn(routerService, 'navigate').and.stub();

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { roles: ['role1', 'role2'], redirectUrl: 'no-role-url' };

        expect(await authGuard.canActivate(router)).toBeFalsy();
        expect(routerService.navigate).toHaveBeenCalledWith(['/no-role-url']);
    });

    it('Should not redirect if canActivate is false and redirectUrl is not in data', async () => {
        spyRoles([], {});
        spyOn(routerService, 'navigate').and.stub();

        const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        router.data = { roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(router)).toBeFalsy();
        expect(routerService.navigate).not.toHaveBeenCalled();
    });

    it('Should canActivate be false hasRealm is true and hasClientRole is false', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyRoles([], {});
        spyOn(jwtHelperService, 'hasRealmRoles').and.returnValue(true);
        spyOn(jwtHelperService, 'hasRealmRolesForClientRole').and.returnValue(false);

        route.params = { appName: 'fakeapp' };
        route.data = { clientRoles: ['appName'], roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(route)).toBeFalsy();
    });

    it('Should canActivate be false if hasRealm is false and hasClientRole is true', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyRoles([], {});
        spyOn(jwtHelperService, 'hasRealmRoles').and.returnValue(false);
        spyOn(jwtHelperService, 'hasRealmRolesForClientRole').and.returnValue(true);

        route.params = { appName: 'fakeapp' };
        route.data = { clientRoles: ['fakeapp'], roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(route)).toBeFalsy();
    });

    it('Should canActivate be true if both Real Role and Client Role are present int the JWT token', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyRoles(['role1'], { fakeapp: { roles: ['role2'] } });

        route.params = { appName: 'fakeapp' };
        route.data = { clientRoles: ['appName'], roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(route)).toBeTruthy();
    });

    it('Should canActivate be false if the Client Role is not present int the JWT token with the correct role', async () => {
        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyRoles(['role1'], { fakeapp: { roles: ['role3'] } });

        route.params = { appName: 'fakeapp' };
        route.data = { clientRoles: ['appName'], roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(route)).toBeFalsy();
    });

    it('Should canActivate be false hasRealm is true and hasClientRole is false', async () => {
        const materialDialog = TestBed.inject(MatDialog);

        spyOn(materialDialog, 'closeAll');
        spyRoles([], {});

        const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
        spyOn(jwtHelperService, 'hasRealmRoles').and.returnValue(true);
        spyOn(jwtHelperService, 'hasRealmRolesForClientRole').and.returnValue(false);

        route.params = { appName: 'fakeapp' };
        route.data = { clientRoles: ['appName'], roles: ['role1', 'role2'] };

        expect(await authGuard.canActivate(route)).toBeFalsy();
        expect(materialDialog.closeAll).toHaveBeenCalled();
    });

    describe('Content Admin', () => {

        afterEach(() => {
           peopleContentService.hasCheckedIsContentAdmin = false;
        });

        it('Should give access to a content section (ALFRESCO_ADMINISTRATORS) when the user has content admin capability', async () => {
            spyOn(peopleContentService, 'getCurrentPerson').and.returnValue(of(getFakeUserWithContentAdminCapability()));
            spyRoles([], {});
            const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            router.data = { roles: ['ALFRESCO_ADMINISTRATORS'] };

            expect(await authGuard.canActivate(router)).toBeTruthy();
        });

        it('Should not give access to a content section (ALFRESCO_ADMINISTRATORS) when the user does not have content admin capability', async () => {
            spyOn(peopleContentService, 'getCurrentPerson').and.returnValue(of(getFakeUserWithContentUserCapability()));
            spyRoles([], {});
            const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            router.data = { roles: ['ALFRESCO_ADMINISTRATORS'] };

            expect(await authGuard.canActivate(router)).toBeFalsy();
        });

        it('Should not call the service to check if the user has content admin capability when the roles do not contain ALFRESCO_ADMINISTRATORS', async () => {
            const getCurrentPersonSpy = spyOn(peopleContentService, 'getCurrentPerson').and.returnValue(of(getFakeUserWithContentAdminCapability()));
            spyRoles([], {});
            const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            router.data = { roles: ['fakeRole'] };

            await authGuard.canActivate(router);

            expect(getCurrentPersonSpy).not.toHaveBeenCalled();
        });
    });

    describe('Excluded Roles', () => {
        it('Should canActivate be false when the user has one of the excluded roles', async () => {
            spyOn(peopleContentService, 'getCurrentPerson').and.returnValue(of(getFakeUserWithContentAdminCapability()));
            spyRoles(['role1'], {});

            const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            router.data = { roles: ['ALFRESCO_ADMINISTRATORS'], excludedRoles: ['role1'] };

            expect(await authGuard.canActivate(router)).toBeFalsy();
        });

        it('Should canActivate be true when the user has none of the excluded roles', async () => {
            spyRoles(['role2'], {});
            const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            router.data = { roles: ['role1', 'role2'], excludedRoles: ['role3'] };

            expect(await authGuard.canActivate(router)).toBeTruthy();
        });

        it('Should canActivate be false when the user is a content admin and the ALFRESCO_ADMINISTRATORS role is excluded', async () => {
            spyOn(peopleContentService, 'getCurrentPerson').and.returnValue(of(getFakeUserWithContentAdminCapability()));
            spyRoles(['role1'], {});

            const router: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
            router.data = { roles: ['role1'], excludedRoles: ['ALFRESCO_ADMINISTRATORS'] };

            expect(await authGuard.canActivate(router)).toBeFalsy();
        });
    });
});
