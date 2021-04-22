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

import { Injectable } from '@angular/core';
import { JwtHelperService } from './jwt-helper.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PeopleContentService } from './people-content.service';
import { PersonEntry } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardSsoRoleService implements CanActivate {
    acsAdminRole = 'ACS_ADMIN';
    hasAcsAdminRole: boolean;

    constructor(private jwtHelperService: JwtHelperService,
                private router: Router,
                private dialog: MatDialog,
                private peopleContentService: PeopleContentService) {
    }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        let hasRole;
        let hasRealmRole = false;
        let hasClientRole = true;

        if (route.data) {
            if (route.data['roles']) {
                const rolesToCheck: string[] = route.data['roles'];
                if (this.hasAcsAdminRole === undefined && rolesToCheck.includes(this.acsAdminRole)) {
                    this.hasAcsAdminRole = await this.isAcsAdmin();
                }
                hasRealmRole = this.jwtHelperService.hasRealmRoles(rolesToCheck) || this.hasAcsAdminRole;
            }

            if (route.data['clientRoles']) {
                const clientRoleName = route.params[route.data['clientRoles']];
                const rolesToCheck = route.data['roles'];
                hasClientRole = this.jwtHelperService.hasRealmRolesForClientRole(clientRoleName, rolesToCheck);
            }
        }

        hasRole = hasRealmRole && hasClientRole;

        if (!hasRole && route.data && route.data['redirectUrl']) {
            this.router.navigate(['/' + route.data['redirectUrl']]);
        }

        if (!hasRole) {
            this.dialog.closeAll();
        }

        return hasRole;
    }

    async isAcsAdmin(): Promise<boolean> {
        const user: PersonEntry = await this.peopleContentService.getCurrentPerson().toPromise();
        return user?.entry?.capabilities?.isAdmin;
    }
}
