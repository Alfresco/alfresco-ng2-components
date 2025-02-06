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

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserAccessService } from '../services/user-access.service';

export const AuthGuardSsoRoleService: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
    const userAccessService = inject(UserAccessService);
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
                if (excludedRoles?.length > 0) {
                    hasRealmRole = userAccessService.hasGlobalAccess(rolesToCheck) && !userAccessService.hasGlobalAccess(excludedRoles);
                }
                hasRealmRole = userAccessService.hasGlobalAccess(rolesToCheck);
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
        const router = inject(Router);
        router.navigate(['/' + route.data['redirectUrl']]);
    }

    if (!hasRole) {
        const dialog = inject(MatDialog);
        dialog.closeAll();
    }

    return hasRole;
};
