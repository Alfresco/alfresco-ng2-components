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
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContentGroups, PeopleContentService } from './people-content.service';
import { UserAccessService } from './user-access.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardSsoRoleService implements CanActivate {
    constructor(private userAccessService: UserAccessService,
                private router: Router,
                private dialog: MatDialog,
                private peopleContentService: PeopleContentService) {
    }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        await this.userAccessService.fetchUserAccess();
        let hasRealmRole = false;
        let hasClientRole = true;

        if (route.data) {
            if (route.data['roles']) {
                const rolesToCheck: string[] = route.data['roles'];
                if (rolesToCheck.length === 0) {
                    hasRealmRole = true;
                } else {
                    const excludedRoles = route.data['excludedRoles'] || [];
                    hasRealmRole = this.validateRoles(rolesToCheck, excludedRoles);
                }
            }

            if (route.data['clientRoles']) {
                const clientRoleName = route.params[route.data['clientRoles']];
                const rolesToCheck = route.data['roles'];
                hasClientRole = this.userAccessService.hasApplicationAccess(clientRoleName, rolesToCheck);
            }
        }

        const hasRole = hasRealmRole && hasClientRole;

        if (!hasRole && route?.data && route.data['redirectUrl']) {
            this.router.navigate(['/' + route.data['redirectUrl']]);
        }

        if (!hasRole) {
            this.dialog.closeAll();
        }

        return hasRole;
    }

    private validateRoles(rolesToCheck: string[], excludedRoles?: string[]): boolean {
        if (excludedRoles?.length > 0) {
            return this.hasRoles(rolesToCheck) && !this.hasRoles(excludedRoles);
        }
        return this.hasRoles(rolesToCheck);
    }

    private hasRoles(roles: string[] = []): boolean {
        if (this.containsAlfrescoAdminRole(roles)) {
            return this.peopleContentService.isCurrentUserAdmin() || this.userAccessService.hasGlobalAccess(roles);
        }
        return this.userAccessService.hasGlobalAccess(roles);
    }

    private containsAlfrescoAdminRole(roles: string []): boolean {
        return roles.includes(ContentGroups.ALFRESCO_ADMINISTRATORS);
    }

}
