/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { from, of, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { GroupSearchParam, GroupModel } from '../models/group.model';

@Injectable({
    providedIn: 'root'
})
export class GroupCloudService {

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) {}

    /**
     * Finds groups filtered by name.
     * @param searchParams Object containing the name filter string
     * @returns List of group information
     */
    findGroupsByName(searchParams: GroupSearchParam): Observable<any> {
        if (searchParams.name === '') {
            return of([]);
        }
        const url = this.getGroupsApi();
        const httpMethod = 'GET', pathParams = {}, queryParams = {search: searchParams.name}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.apiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        )).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets details for a specified group.
     * @param groupId ID of the target group
     * @returns Group details
     */
    getGroupDetailsById(groupId: string) {
        const url = this.getGroupsApi() + '/' + groupId;
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.apiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        )).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Check that a group has one or more roles from the supplied list.
     * @param groupId ID of the target group
     * @param roleNames Array of role names
     * @returns True if the group has one or more of the roles, false otherwise
     */
    checkGroupHasRole(groupId: string, roleNames: string[]): Observable<boolean>  {
        return this.getGroupDetailsById(groupId).pipe(map((response: GroupModel) => {
            let availableGroupRoles = [];
            let hasRole = false;
            availableGroupRoles = response.realmRoles;
            if (availableGroupRoles && availableGroupRoles.length > 0) {
                roleNames.forEach((roleName: string) => {
                    const role = availableGroupRoles.find((availableRole) => {
                        return roleName === availableRole;
                    });
                    if (role) {
                        hasRole = true;
                        return;
                    }
                });
            }
            return hasRole;
        }));
    }

    /**
     * Gets the client ID using the app name.
     * @param applicationName Name of the app
     * @returns client ID string
     */
    getClientIdByApplicationName(applicationName: string): Observable<string> {
        const url = this.getApplicationIdApi();
        const httpMethod = 'GET', pathParams = {}, queryParams = {clientId: applicationName}, bodyParam = {}, headerParams = {}, formParams = {},
              contentTypes = ['application/json'], accepts = ['application/json'];
        return from(this.apiService.getInstance()
                        .oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams,
                                              formParams, bodyParam, contentTypes,
                                              accepts, Object, null, null)
            ).pipe(
                map((response: any[]) => {
                    const clientId = response && response.length > 0 ? response[0].id : '';
                    return clientId;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets client roles.
     * @param groupId ID of the target group
     * @param clientId ID of the client
     * @returns List of roles
     */
    getClientRoles(groupId: string, clientId: string): Observable<any[]> {
        const url = this.groupClientRoleMappingApi(groupId, clientId);
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.apiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam,
                    contentTypes, accepts, Object, null, null)
                );
    }

    /**
     * Checks if a group has a client app.
     * @param groupId ID of the target group
     * @param clientId ID of the client
     * @returns True if the group has the client app, false otherwise
     */
    checkGroupHasClientApp(groupId: string, clientId: string): Observable<boolean> {
        return this.getClientRoles(groupId, clientId).pipe(
                    map((response: any[]) => {
                        if (response && response.length > 0) {
                            return true;
                        }
                        return false;
                    }),
                    catchError((err) => this.handleError(err))
            );
    }

    /**
     * Check if a group has any of the client app roles in the supplied list.
     * @param groupId ID of the target group
     * @param clientId ID of the client
     * @param roleNames Array of role names to check
     * @returns True if the group has one or more of the roles, false otherwise
     */
    checkGroupHasAnyClientAppRole(groupId: string, clientId: string, roleNames: string[]): Observable<boolean> {
        return this.getClientRoles(groupId, clientId).pipe(
            map((clientRoles: any[]) => {
                let hasRole = false;
                if (clientRoles.length > 0) {
                    roleNames.forEach((roleName) => {
                        const role = clientRoles.find((availableRole) => {
                            return availableRole.name === roleName;
                        });

                        if (role) {
                            hasRole = true;
                            return;
                        }
                    });
                }
                return hasRole;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    private groupClientRoleMappingApi(groupId: string, clientId: string): any {
        return `${this.appConfigService.get('identityHost')}/groups/${groupId}/role-mappings/clients/${clientId}`;
    }

    private getApplicationIdApi() {
        return `${this.appConfigService.get('identityHost')}/clients`;
    }

    private getGroupsApi() {
        return `${this.appConfigService.get('identityHost')}/groups`;
    }

    /**
     * Throw the error
     * @param error
     */
    private handleError(error: Response) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
