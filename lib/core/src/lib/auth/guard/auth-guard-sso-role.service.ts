/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserAccessService } from '../services/user-access.service';

const userAccessService = inject(UserAccessService);
const router = inject(Router);
const dialog = inject(MatDialog);

/**
 * Function to validate if the current user has/does not have the provided set of roles
 * @param rolesToCheck list of roles that the user needs to be checked
 * @param excludedRoles list of roles that the user should not have
 * @returns boolean flag corresponding to whether the user has/does not have the provided set of roles/excluded roles
 */
function validateRoles(rolesToCheck: string[], excludedRoles?: string[]): boolean {
    if (excludedRoles?.length > 0) {
        return hasRoles(rolesToCheck) && !hasRoles(excludedRoles);
    }
    return hasRoles(rolesToCheck);
}

/**
 * Function to check if the current user has access to a provided set of roles
 * @param roles list of roles to check
 * @returns boolean flag corresponding to whether the user has roles or not
 */
function hasRoles(roles: string[] = []): boolean {
    return userAccessService.hasGlobalAccess(roles);
}

export const AuthGuardSsoRoleService = (route: ActivatedRouteSnapshot): boolean => {
    userAccessService.fetchUserAccess();
    let hasRealmRole = false;
    let hasClientRole = true;
    if (route.data) {
        if (route.data['roles']) {
            const rolesToCheck: string[] = route.data['roles'];
            if (rolesToCheck.length === 0) {
                hasRealmRole = true;
            } else {
                const excludedRoles = route.data['excludedRoles'] || [];
                hasRealmRole = validateRoles(rolesToCheck, excludedRoles);
            }
        }

        if (route.data['clientRoles']) {
            const clientRoleName = route.params[route.data['clientRoles']];
            const rolesToCheck = route.data['roles'];
            hasClientRole = userAccessService.hasApplicationAccess(clientRoleName, rolesToCheck);
        }
    }
    const hasRole = hasRealmRole && hasClientRole;

    if (!hasRole && route?.data && route.data['redirectUrl']) {
        router.navigate(['/' + route.data['redirectUrl']]);
    }

    if (!hasRole) {
        dialog.closeAll();
    }

    return hasRole;
};
