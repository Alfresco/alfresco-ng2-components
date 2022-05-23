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
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccessHelper } from './user-access-helper/user-access-helper.interface';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class JwtHelperService implements UserAccessHelper {

    static USER_NAME = 'name';
    static FAMILY_NAME = 'family_name';
    static GIVEN_NAME = 'given_name';
    static USER_EMAIL = 'email';
    static USER_ACCESS_TOKEN = 'access_token';
    static USER_ID_TOKEN = 'id_token';
    static REALM_ACCESS = 'realm_access';
    static RESOURCE_ACCESS = 'resource_access';
    static USER_PREFERRED_USERNAME = 'preferred_username';

    constructor(private storageService: StorageService) {
    }

    private globalRolesSubject = new BehaviorSubject([]);
    private applicationRolesSubject = new BehaviorSubject([]);

    globalRoles$: Observable<any> = this.globalRolesSubject.asObservable();
    applicationRoles$: Observable<any> = this.applicationRolesSubject.asObservable();

    /**
     * Initialises the global and application roles Observables
     */
    async initialise() {
        const globalRoles = this.getValueFromLocalAccessToken<any>(JwtHelperService.REALM_ACCESS);
        this.globalRolesSubject.next(globalRoles);
        const appsAccess = this.getValueFromLocalAccessToken<any>(JwtHelperService.RESOURCE_ACCESS);
        this.applicationRolesSubject.next(appsAccess);
    }

    /**
     * Checks for client roles.
     *
     * @param appName The name of the app
     * @param roles List of roles to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasApplicationRoles(appName: string, roles: string[]): boolean {
        return this.hasRealmRolesForClientRole(appName, roles);
    }

    /**
     * Checks for global roles.
     *
     * @param roles List of roles to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasGlobalRoles(roles: string[]): boolean {
        return this.hasRealmRoles(roles);
    }

    /**
     * Decodes a JSON web token into a JS object.
     *
     * @param token Token in encoded form
     * @returns Decoded token data object
     */
    decodeToken(token): any {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    }

    private urlBase64Decode(token): string {
        let output = token.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return decodeURIComponent(escape(window.atob(output)));
    }

    /**
     * Gets a named value from the user access or id token.
     *
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
     getValueFromLocalToken<T>(key: string): T {
        return this.getValueFromToken(this.getAccessToken(), key) || this.getValueFromToken(this.getIdToken(), key);
    }

    /**
     * Gets a named value from the user access token.
     *
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    getValueFromLocalAccessToken<T>(key: string): T {
        return this.getValueFromToken(this.getAccessToken(), key);
    }

    /**
     * Gets access token
     *
     * @returns access token
     */
    getAccessToken(): string {
        return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }

    /**
     * Gets a named value from the user id token.
     *
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
     getValueFromLocalIdToken<T>(key: string): T {
        return this.getValueFromToken(this.getIdToken(), key);
    }

    /**
     * Gets id token
     *
     * @returns id token
     */
     getIdToken(): string {
        return this.storageService.getItem(JwtHelperService.USER_ID_TOKEN);
    }

    /**
     * Gets a named value from the user access token.
     *
     * @param accessToken your SSO access token where the value is encode
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    getValueFromToken<T>(token: string, key: string): T {
        let value;
        if (token) {
            const tokenPayload = this.decodeToken(token);
            value = tokenPayload[key];
        }
        return value;
    }

    /**
     * Gets realm roles.
     *
     * @returns Array of realm roles
     */
    getRealmRoles(): string[] {
        let realmRoles = [];
        this.globalRoles$
            .pipe(take(1))
            .subscribe(globalRoles => {
                realmRoles = globalRoles['roles'] || [];
            });
        return realmRoles;
    }

    /**
     * Gets Client roles.
     *
     * @returns Array of client roles
     */
    getClientRoles(clientName: string): string[] {
        let clientRoles = [];
        this.applicationRoles$
            .pipe(take(1))
            .subscribe(applicationRoles => {
                const appAccess = applicationRoles[clientName];
                clientRoles = appAccess ? appAccess['roles'] : [];
            });
        return clientRoles;
    }

    /**
     * Checks for single realm role.
     *
     * @param role Role name to check
     * @returns True if it contains given role, false otherwise
     */
    hasRealmRole(role: string): boolean {
        const realmRoles = this.getRealmRoles();
        return realmRoles.some((currentRole) => currentRole === role);
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
        const clientRoles = this.getClientRoles(clientName);
        return clientRoles.some((currentRole) => currentRole === role);
    }
}
