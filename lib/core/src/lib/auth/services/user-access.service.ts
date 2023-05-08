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
import { JwtHelperService } from './jwt-helper.service';
import { ApplicationAccessModel } from '../models/application-access.model';
import { UserAccessModel } from '../models/user-access.model';
import { AppConfigService } from '../../app-config/app-config.service';
import { OAuth2Service } from './oauth2.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const IDENTITY_MICRO_SERVICE_INGRESS = 'identity-adapter-service';

@Injectable({
    providedIn: 'root'
})
export class UserAccessService {
    private globalAccess: string[];
    private applicationAccess: ApplicationAccessModel[];

    constructor(private jwtHelperService: JwtHelperService,
                private appConfigService: AppConfigService,
                private oAuth2Service: OAuth2Service) {
    }

    async fetchUserAccess() {
        if (!this.hasFetchedAccess()) {
            if (this.hasRolesInJwt()) {
                this.fetchAccessFromJwt();
            } else if (this.isOauth()) {
                await this.fetchAccessFromApi();
            }
        }
    }

    private fetchAccessFromJwt() {
        this.globalAccess = this.jwtHelperService.getValueFromLocalToken<any>(JwtHelperService.REALM_ACCESS).roles;
        this.applicationAccess = this.jwtHelperService.getValueFromLocalToken<any>(JwtHelperService.RESOURCE_ACCESS);
    }

    private async fetchAccessFromApi() {
        const url = `${this.identityHost}/${IDENTITY_MICRO_SERVICE_INGRESS}/v1/roles`;
        const appkey = this.appConfigService.get('application.key');
        const opts = appkey ? { url, queryParams: { appkey } } : { url };

        await this.oAuth2Service.get(opts)
            .pipe(
                catchError(() => of({
                    globalAccess: {
                        roles: []
                    },
                    applicationAccess: []
                }))
            )
            .toPromise()
            .then((response: UserAccessModel) => {
                this.globalAccess = response.globalAccess.roles;
                this.applicationAccess = response.applicationAccess;
            });
    }

    private hasRolesInJwt(): boolean {
        return !!this.jwtHelperService.getValueFromLocalToken(JwtHelperService.REALM_ACCESS);
    }

    private hasFetchedAccess(): boolean {
        return !!this.globalAccess && !!this.applicationAccess;
    }

    private get identityHost(): string {
        return `${this.appConfigService.get('bpmHost')}`;
    }

    private isOauth(): boolean {
        return this.appConfigService.get('authType') === 'OAUTH';
    }

    /**
     * Checks for global roles access.
     *
     * @param rolesToCheck List of the roles to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasGlobalAccess(rolesToCheck: string[]): boolean {
        if (rolesToCheck?.length > 0) {
            return this.globalAccess ? this.globalAccess.some((role: string) => rolesToCheck.includes(role)) : false;
        }
        return true;
    }

    /**
     * Checks for global roles access.
     *
     * @param appName The app name
     * @param rolesToCheck List of the roles to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasApplicationAccess(appName: string, rolesToCheck: string[]): boolean {
        if (rolesToCheck?.length > 0) {
            const appAccess = this.hasRolesInJwt() ? this.applicationAccess[appName] : this.applicationAccess.find((app: ApplicationAccessModel) => app.name === appName);
            return appAccess ? appAccess.roles.some(appRole => rolesToCheck.includes(appRole)) : false;
        }
        return true;
    }

    /**
     * Resets the cached user access
     */
    resetAccess() {
        this.globalAccess = undefined;
        this.applicationAccess = undefined;
    }
}
