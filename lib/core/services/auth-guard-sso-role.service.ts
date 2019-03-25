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
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardSsoRoleService implements CanActivate {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let hasRole = false;
        let hasRealmRole = false;
        let hasClientRole = true;

        if (route.data) {
            if (route.data['roles']) {
                const rolesToCheck = route.data['roles'];
                hasRealmRole = this.hasRealmRoles(rolesToCheck);
            }

            if (route.data['clientRoles']) {
                const clientRoleName = route.params[route.data['clientRoles']];
                const rolesToCheck = route.data['roles'];
                hasClientRole = this.hasRealmRolesForClientRole(clientRoleName, rolesToCheck);
            }
        }

        hasRole = hasRealmRole && hasClientRole;

        if (!hasRole && route.data && route.data['redirectUrl']) {
            this.router.navigate(['/' + route.data['redirectUrl']]);
        }

        return hasRole;
    }

    constructor(private storageService: StorageService, private jwtHelperService: JwtHelperService, private router: Router) {
    }

    getRealmRoles(): string[] {
        const access = this.getValueFromToken<any>('realm_access');
        const roles = access ? access['roles'] : [];
        return roles;
    }

    getClientRoles(client: string): string[] {
        const clientRole = this.getValueFromToken<any>('resource_access')[client];
        const roles = clientRole ? clientRole['roles'] : [];
        return roles;
    }

    getAccessToken(): string {
        return this.storageService.getItem('access_token');
    }

    hasRealmRole(role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const realmRoles = this.getRealmRoles();
            hasRole = realmRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }

    hasRealmRoles(rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => {
            return this.hasRealmRole(currentRole);
        });
    }

    hasRealmRolesForClientRole(clientRole: string, rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => {
            return this.hasClientRole(clientRole, currentRole);
        });
    }

    hasClientRole(clientRole, role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const clientRoles = this.getClientRoles(clientRole);
            hasRole = clientRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }

    getValueFromToken<T>(key: string): T {
        let value;
        const accessToken = this.getAccessToken();
        if (accessToken) {
            const tokenPayload = this.jwtHelperService.decodeToken(accessToken);
            value = tokenPayload[key];
        }
        return <T> value;
    }
}
