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
import { Observable, of, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppConfigService } from '../app-config/app-config.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import {
    IdentityGroupSearchParam,
    IdentityGroupQueryCloudRequestModel,
    IdentityGroupModel,
    IdentityGroupQueryResponse,
    IdentityGroupCountModel
} from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';

@Injectable({
  providedIn: 'root'
})
export class IdentityGroupService {

    constructor(
        private alfrescoApiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) {}

    /**
     * Gets all groups.
     * @returns Array of group information objects
     */
    getGroups(): Observable<IdentityGroupModel[]> {
        const url = this.getGroupsApi();
        const httpMethod = 'GET', pathParams = {},
        queryParams = {}, bodyParam = {}, headerParams = {},
        formParams = {}, authNames = [], contentTypes = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, null, null, null
                    )).pipe(
                        catchError((error) => this.handleError(error))
                    );
    }

    /**
     * Queries groups.
     * @returns Array of user information objects
     */
    queryGroups(requestQuery: IdentityGroupQueryCloudRequestModel): Observable<IdentityGroupQueryResponse> {
        const url = this.getGroupsApi();
        const httpMethod = 'GET', pathParams = {},
        queryParams = { first: requestQuery.first || 0, max: requestQuery.max || 5 }, bodyParam = {}, headerParams = {},
        formParams = {}, authNames = [], contentTypes = ['application/json'];
        return this.getTotalGroupsCount().pipe(
            switchMap((totalCount: IdentityGroupCountModel) =>
            from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
                url, httpMethod, pathParams, queryParams,
                headerParams, formParams, bodyParam, authNames,
                contentTypes, null, null, null)
            ).pipe(
                map((response: any[]) => {
                    return <IdentityGroupQueryResponse> {
                        entries: response,
                        pagination: {
                            skipCount: requestQuery.first,
                            maxItems: requestQuery.max,
                            count: totalCount.count,
                            hasMoreItems: false,
                            totalItems: totalCount.count
                        }
                        };
                    }),
                catchError((error) => this.handleError(error))
                ))
            );
    }

    /**
     * Gets groups total count.
     * @returns Number of groups count.
     */
    getTotalGroupsCount(): Observable<IdentityGroupCountModel> {
        const url = this.getGroupsApi() + `/count`;
        const contentTypes = ['application/json'], accepts = ['application/json'];
        return from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(url, 'GET',
              null, null, null,
              null, null, contentTypes,
              accepts, null, null, null)).pipe(
                catchError((error) => this.handleError(error))
            );
    }

    /**
     * Creates new group.
     * @param newGroup Object of containing the new group details.
     * @returns Empty response when the group created.
     */
    createGroup(newGroup: IdentityGroupModel): Observable<any> {
        const url = this.getGroupsApi();
        const httpMethod = 'POST', pathParams = {}, queryParams = {}, bodyParam = newGroup, headerParams = {},
        formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
        url, httpMethod, pathParams, queryParams,
        headerParams, formParams, bodyParam,
        contentTypes, accepts, null, null, null
        )).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Updates group details.
     * @param groupId Id of the targeted group.
     * @param updatedGroup Object of containing the group details
     * @returns Empty response when the group updated.
     */
    updateGroup(groupId: string, updatedGroup: IdentityGroupModel): Observable<any> {
        const url = this.getGroupsApi() + `/${groupId}`;
        const request = JSON.stringify(updatedGroup);
        const httpMethod = 'PUT', pathParams = {} , queryParams = {}, bodyParam = request, headerParams = {},
        formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
        url, httpMethod, pathParams, queryParams,
        headerParams, formParams, bodyParam,
        contentTypes, accepts, null, null, null
        )).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Deletes Group.
     * @param groupId Id of the group.
     * @returns Empty response when the group deleted.
     */
    deleteGroup(groupId: string): Observable<any> {
        const url = this.getGroupsApi() + `/${groupId}`;
        const httpMethod = 'DELETE', pathParams = {} , queryParams = {}, bodyParam = {}, headerParams = {},
        formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
        url, httpMethod, pathParams, queryParams,
        headerParams, formParams, bodyParam,
        contentTypes, accepts, null, null, null
        )).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Finds groups filtered by name.
     * @param searchParams Object containing the name filter string
     * @returns List of group information
     */
    findGroupsByName(searchParams: IdentityGroupSearchParam): Observable<any> {
        if (searchParams.name === '') {
            return of([]);
        }
        const url = this.getGroupsApi();
        const httpMethod = 'GET', pathParams = {}, queryParams = {search: searchParams.name}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        )).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Gets details for a specified group.
     * @param groupId Id of the target group
     * @returns Group details
     */
    getGroupRoles(groupId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildRolesUrl(groupId);
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        )).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Check that a group has one or more roles from the supplied list.
     * @param groupId Id of the target group
     * @param roleNames Array of role names
     * @returns True if the group has one or more of the roles, false otherwise
     */
    checkGroupHasRole(groupId: string, roleNames: string[]): Observable<boolean>  {
        return this.getGroupRoles(groupId).pipe(map((groupRoles: IdentityRoleModel[]) => {
            let hasRole = false;
            if (groupRoles && groupRoles.length > 0) {
                roleNames.forEach((roleName: string) => {
                    const role = groupRoles.find((groupRole) => {
                        return roleName === groupRole.name;
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
     * Gets the client Id using the app name.
     * @param applicationName Name of the app
     * @returns client Id string
     */
    getClientIdByApplicationName(applicationName: string): Observable<string> {
        const url = this.getApplicationIdApi();
        const httpMethod = 'GET', pathParams = {}, queryParams = {clientId: applicationName}, bodyParam = {}, headerParams = {}, formParams = {},
              contentTypes = ['application/json'], accepts = ['application/json'];
        return from(this.alfrescoApiService.getInstance()
                        .oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams,
                                              formParams, bodyParam, contentTypes,
                                              accepts, Object, null, null)
            ).pipe(
                map((response: any[]) => {
                    const clientId = response && response.length > 0 ? response[0].id : '';
                    return clientId;
                }),
                catchError((error) => this.handleError(error))
            );
    }

    /**
     * Gets client roles.
     * @param groupId Id of the target group
     * @param clientId Id of the client
     * @returns List of roles
     */
    getClientRoles(groupId: string, clientId: string): Observable<IdentityRoleModel[]> {
        const url = this.groupClientRoleMappingApi(groupId, clientId);
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam,
                    contentTypes, accepts, Object, null, null)
                );
    }

    /**
     * Checks if a group has a client app.
     * @param groupId Id of the target group
     * @param clientId Id of the client
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
                    catchError((error) => this.handleError(error))
            );
    }

    /**
     * Check if a group has any of the client app roles in the supplied list.
     * @param groupId Id of the target group
     * @param clientId Id of the client
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
            catchError((error) => this.handleError(error))
        );
    }

    private groupClientRoleMappingApi(groupId: string, clientId: string): string {
        return `${this.appConfigService.get('identityHost')}/groups/${groupId}/role-mappings/clients/${clientId}`;
    }

    private getApplicationIdApi(): string {
        return `${this.appConfigService.get('identityHost')}/clients`;
    }

    private getGroupsApi(): string {
        return `${this.appConfigService.get('identityHost')}/groups`;
    }

    private buildRolesUrl(groupId: string): string {
        return `${this.appConfigService.get('identityHost')}/groups/${groupId}/role-mappings/realm/composite`;
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
