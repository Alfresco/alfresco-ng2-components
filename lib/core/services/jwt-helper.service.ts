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
import { JwtHelper } from './authentication/jwt-helper.interface';
import { BaseJwtHelperService } from './authentication/base-jwt-helper.service';

@Injectable({
    providedIn: 'root'
})
export class JwtHelperService extends BaseJwtHelperService implements JwtHelper {
    static REALM_ACCESS = 'realm_access';
    static RESOURCE_ACCESS = 'resource_access';

    /**
     * Gets realm roles.
     *
     * @returns Array of realm roles
     */
    getRealmRoles(): string[] {
        const access = this.getValueFromLocalAccessToken<any>(JwtHelperService.REALM_ACCESS);
        return access ? access['roles'] : [];
    }

    /**
     * Gets Client roles.
     *
     * @returns Array of client roles
     */
    getClientRoles(clientName: string): string[] {
        const clientRole = this.getValueFromLocalAccessToken<any>(JwtHelperService.RESOURCE_ACCESS)[clientName];
        return clientRole ? clientRole['roles'] : [];
    }

    /**
     * Checks for single realm role.
     *
     * @param role Role name to check
     * @returns True if it contains given role, false otherwise
     */
    hasRealmRole(role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const realmRoles = this.getRealmRoles();
            hasRole = realmRoles.some((currentRole) => currentRole === role);
        }
        return hasRole;
    }

    /**
     * Checks for realm roles.
     *
     * @param rolesToCheck List of role names to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasRealmRoles(rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => this.hasRealmRole(currentRole));
    }

    /**
     * Checks for client roles.
     *
     * @param clientName Targeted client name
     * @param rolesToCheck List of role names to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasRealmRolesForClientRole(clientName: string, rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => this.hasClientRole(clientName, currentRole));
    }

    /**
     * Checks for client role.
     *
     * @param clientName Targeted client name
     * @param role Role name to check
     * @returns True if it contains given role, false otherwise
     */
    hasClientRole(clientName: string, role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const clientRoles = this.getClientRoles(clientName);
            hasRole = clientRoles.some((currentRole) => currentRole === role);
        }
        return hasRole;
    }
}
