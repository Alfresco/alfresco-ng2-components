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

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserAccessService } from '../services/user-access.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardSsoRoleService implements CanActivate {
    constructor(private userAccessService: UserAccessService,
                private router: Router,
                private dialog: MatDialog) {
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
                    hasRealmRole = await this.validateRoles(rolesToCheck, excludedRoles);
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

    private async validateRoles(rolesToCheck: string[], excludedRoles?: string[]): Promise<boolean> {
        if (excludedRoles?.length > 0) {
            return await this.hasRoles(rolesToCheck) && !await this.hasRoles(excludedRoles);
        }
        return this.hasRoles(rolesToCheck);
    }

    private async hasRoles(roles: string[] = []): Promise<boolean> {
        return this.userAccessService.hasGlobalAccess(roles);
    }

}
