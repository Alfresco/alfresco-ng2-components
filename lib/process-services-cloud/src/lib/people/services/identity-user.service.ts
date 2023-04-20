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
import {
    AppConfigService,
    JwtHelperService,
    OAuth2Service
} from '@alfresco/adf-core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdentityUserServiceInterface } from './identity-user.service.interface';
import { IdentityUserModel } from '../models/identity-user.model';
import { IdentityUserFilterInterface } from './identity-user-filter.interface';

const IDENTITY_MICRO_SERVICE_INGRESS = 'identity-adapter-service';

@Injectable({
    providedIn: 'root'
})
export class IdentityUserService implements IdentityUserServiceInterface {

    queryParams: { search: string; application?: string; roles?: string[]; groups?: string[] };

    constructor(
        private jwtHelperService: JwtHelperService,
        private oAuth2Service: OAuth2Service,
        private appConfigService: AppConfigService) {

    }

    /**
     * Gets the name and other basic details of the current user.
     *
     * @returns The user's details
     */
    public getCurrentUserInfo(): IdentityUserModel {
        const familyName = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.FAMILY_NAME);
        const givenName = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.GIVEN_NAME);
        const email = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.USER_EMAIL);
        const username = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.USER_PREFERRED_USERNAME);
        return { firstName: givenName, lastName: familyName, email, username };
    }

    /**
     * Search users based on name input and filters.
     *
     * @param name Search query string
     * @param [filters] Search query filters
     * @returns List of users
     */
    public search(name: string, filters?: IdentityUserFilterInterface): Observable<IdentityUserModel[]> {
        if (name.trim() === '') {
            return EMPTY;
        } else if (filters?.groups?.length > 0) {
            return this.searchUsersWithGroups(name, filters);
        } else if (filters?.withinApplication) {
            return this.searchUsersWithinApp(name, filters.withinApplication, filters?.roles);
        } else if (filters?.roles?.length > 0) {
            return this.searchUsersWithGlobalRoles(name, filters.roles);
        } else {
            return this.searchUsersByName(name);
        }
    }

    private searchUsersByName(name: string): Observable<IdentityUserModel[]> {
        this.buildQueryParam(name);

        return this.invokeIdentityUserApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private searchUsersWithGlobalRoles(name: string, roles: string []): Observable<IdentityUserModel[]> {
        this.buildQueryParam(name, {roles});

        return this.invokeIdentityUserApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private searchUsersWithinApp(name: string, withinApplication: string, roles?: string []): Observable<IdentityUserModel[]> {
        this.buildQueryParam(name, {roles, withinApplication});

        return this.invokeIdentityUserApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private searchUsersWithGroups(name: string, filters: IdentityUserFilterInterface): Observable<IdentityUserModel[]> {
        this.buildQueryParam(name, filters);

        return this.invokeIdentityUserApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private invokeIdentityUserApi(): Observable<any> {
        const url = `${this.identityHost}/${IDENTITY_MICRO_SERVICE_INGRESS}/v1/users`;
        return this.oAuth2Service.get({ url, queryParams: this.queryParams });
    }

    private buildQueryParam(name: string, filters?: IdentityUserFilterInterface) {
        this.queryParams = { search: name };
        this.addOptionalValueToQueryParam('application', filters?.withinApplication);
        this.addOptionalCommaValueToQueryParam('role', filters?.roles);
        this.addOptionalCommaValueToQueryParam('group', filters?.groups);
    }

    private addOptionalCommaValueToQueryParam(key: string, values: string []) {
        if (values?.length > 0) {
            const valuesNotEmpty = this.filterOutEmptyValue(values);
            if (valuesNotEmpty?.length > 0) {
                this.queryParams[key] = valuesNotEmpty.join(',');
            }
        }
    }

    private addOptionalValueToQueryParam(key: string, value: string) {
        if (value?.trim()) {
            this.queryParams[key] = value;
        }
    }

    private filterOutEmptyValue(values: string []): string [] {
        return values.filter( value => value.trim() ? true : false);
    }

    private get identityHost(): string {
        return `${this.appConfigService.get('bpmHost')}`;
    }

    private handleError(error: any) {
        return throwError(error || 'Server error');
    }
}
