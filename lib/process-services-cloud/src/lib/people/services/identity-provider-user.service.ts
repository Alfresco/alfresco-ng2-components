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
import {
    AppConfigService,
    JwtHelperService,
    OAuth2Service
} from '@alfresco/adf-core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdentityProviderUserServiceInterface, SearchUsersFilters } from './identity-provider-user.service.interface';
import { IdentityUserModel } from '../../models/identity-user.model';

@Injectable({
    providedIn: 'root'
})
export class IdentityProviderUserService implements IdentityProviderUserServiceInterface {

    queryParams: { search: string; application?: string; roles?: string[]; groups?: string[] };

    constructor(
        private jwtHelperService: JwtHelperService,
        private oAuth2Service: OAuth2Service,
        private appConfigService: AppConfigService) { }

    private get identityHost(): string {
        return `${this.appConfigService.get('identityHost')}`;
    }

    /**
     * Gets the name and other basic details of the current user.
     *
     * @returns The user's details
     */
    getCurrentUserInfo(): IdentityUserModel {
        const familyName = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.FAMILY_NAME);
        const givenName = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.GIVEN_NAME);
        const email = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.USER_EMAIL);
        const username = this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.USER_PREFERRED_USERNAME);
        return { firstName: givenName, lastName: familyName, email, username };
    }

    search(name: string, filters?: SearchUsersFilters): Observable<IdentityUserModel[]> {
        if (name.trim() === '') {
            return of([]);
        } else if (filters?.withinApplication && filters?.withinApplication !== '') {
            return this.searchUsersWithinApp(name, filters.withinApplication, filters?.roles, filters?.groups);
        } else if (filters?.roles && filters?.roles.length > 0) {
            return this.searchUsersWithGlobalRoles(name, filters.roles, filters?.groups);
        } else {
            return this.searchUsersByName(name, filters?.groups);
        }
    }

    searchUsersByName(name: string, groups?: string[]): Observable<IdentityUserModel[]> {
        if (groups && groups.length > 0) {
            return this.searchUsersWithGroups(name, {groups});
        } else {
            this.buildQueryParam(name);

            return this.invokeIdentityUserApi().pipe(
                catchError((err) => this.handleError(err))
            );
        }
    }

    searchUsersWithGlobalRoles(name: string, roles: string [], groups?: string[]): Observable<IdentityUserModel[]> {
        if (groups && groups.length > 0) {
            return this.searchUsersWithGroups(name, {roles, groups});
        } else {
            this.buildQueryParam(name, {roles});

            return this.invokeIdentityUserApi().pipe(
                catchError((err) => this.handleError(err))
            );
        }
    }

    searchUsersWithinApp(name: string, withinApplication: string, roles?: string [], groups?: string[]): Observable<IdentityUserModel[]> {
        if (groups && groups.length > 0) {
            return this.searchUsersWithGroups(name, {roles, withinApplication, groups});
        } else {
            this.buildQueryParam(name, {roles, withinApplication});

            return this.invokeIdentityUserApi().pipe(
                catchError((err) => this.handleError(err))
            );
        }
    }

    searchUsersWithGroups(name: string, filters: SearchUsersFilters): Observable<IdentityUserModel[]> {
        this.buildQueryParam(name, filters);

        return this.invokeIdentityUserApi().pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private invokeIdentityUserApi(): Observable<any> {
        const url = `${this.identityHost}/rb/v1/identity/users`;
        return this.oAuth2Service.get({ url, queryParams: this.queryParams });
    }

    private buildQueryParam(name: string, filters?: SearchUsersFilters) {
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

    private handleError(error: any) {
        return throwError(error || 'Server error');
    }
}
