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

import { Injectable } from '@angular/core';
import { JwtHelperService } from './jwt-helper.service';
import { ApplicationAccessModel } from '../models/application-access.model';
import { AppConfigService } from '../../app-config/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class UserAccessService {
    private globalAccess: string[];
    private applicationAccess: ApplicationAccessModel[];

    constructor(private jwtHelperService: JwtHelperService, private appConfigService: AppConfigService) {}

    fetchUserAccess() {
        if (this.hasRolesInRealmAccess()) {
            this.fetchAccessFromRealmAccess();
        } else if (this.hasRolesInHxpAuthorization()) {
            this.fetchAccessFromHxpAuthorization();
        }
    }

    private fetchAccessFromRealmAccess() {
        this.globalAccess = this.jwtHelperService.getValueFromLocalToken<any>(JwtHelperService.REALM_ACCESS).roles;
        this.applicationAccess = this.jwtHelperService.getValueFromLocalToken<any>(JwtHelperService.RESOURCE_ACCESS);
    }

    private fetchAccessFromHxpAuthorization() {
        this.globalAccess = [];
        const hxpAuthorization = this.jwtHelperService.getValueFromLocalToken<any>(JwtHelperService.HXP_AUTHORIZATION);
        if (hxpAuthorization?.appkey && hxpAuthorization?.role) {
            this.applicationAccess = [
                {
                    name: hxpAuthorization.appkey,
                    roles: hxpAuthorization.role
                }
            ];
        } else {
            this.applicationAccess = [];
        }
    }

    private hasRolesInRealmAccess(): boolean {
        return !!this.jwtHelperService.getValueFromLocalToken(JwtHelperService.REALM_ACCESS);
    }

    private hasRolesInHxpAuthorization(): boolean {
        return !!this.jwtHelperService.getValueFromLocalToken(JwtHelperService.HXP_AUTHORIZATION);
    }

    /**
     * Checks for global roles access.
     * @param rolesToCheck List of the roles to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasGlobalAccess(rolesToCheck: string[]): boolean {
        if (rolesToCheck?.length > 0) {
            if (this.hasRolesInRealmAccess()) {
                return this.globalAccess ? this.globalAccess.some((role: string) => rolesToCheck.includes(role)) : false;
            } else if (this.hasRolesInHxpAuthorization()) {
                return this.isCurrentAppKeyInToken() ? this.applicationAccess[0]?.roles.some((role: string) => rolesToCheck.includes(role)) : false;
            }
        } else {
            return true;
        }
        return false;
    }

    private isCurrentAppKeyInToken(): boolean {
        const currentAppKey = this.appConfigService.get('application.key');
        return this.applicationAccess?.length ? currentAppKey === this.applicationAccess[0]?.name : false;
    }

    /**
     * Checks for global roles access.
     * @param appName The app name
     * @param rolesToCheck List of the roles to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasApplicationAccess(appName: string, rolesToCheck: string[]): boolean {
        if (rolesToCheck?.length > 0) {
            const appAccess = this.hasRolesInRealmAccess()
                ? this.applicationAccess[appName]
                : this.applicationAccess.find((app: ApplicationAccessModel) => app.name === appName);
            return appAccess ? appAccess.roles.some((appRole) => rolesToCheck.includes(appRole)) : false;
        }
        return true;
    }
}
