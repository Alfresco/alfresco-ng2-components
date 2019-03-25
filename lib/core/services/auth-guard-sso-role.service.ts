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

        if (route.data) {
            const rolesToCheck = route.data['roles'];
            hasRole = this.hasRoles(rolesToCheck);
        }

        if (!hasRole && route.data && route.data['redirectUrl']) {
            this.router.navigate(['/' + route.data['redirectUrl']]);
        }

        return hasRole;
    }

    constructor(private storageService: StorageService, private jwtHelperService: JwtHelperService, private router: Router) {
    }

    getRoles(): string[] {
        const access = this.getValueFromToken<any>('realm_access');
        const roles = access ? access['roles'] : [];
        return roles;
    }

    getAccessToken(): string {
        return this.storageService.getItem('access_token');
    }

    hasRole(role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const roles = this.getRoles();
            hasRole = roles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }

    hasRoles(rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => {
            return this.hasRole(currentRole);
        });
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
