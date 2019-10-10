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

import { Pagination } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppConfigService } from '../app-config/app-config.service';
import { IdentityGroupModel } from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';
import { IdentityUserModel } from '../models/identity-user.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { JwtHelperService } from './jwt-helper.service';
import { LogService } from './log.service';

export interface IdentityUserQueryResponse {

    entries: IdentityUserModel[];
    pagination: Pagination;
}

export interface IdentityUserPasswordModel {
    type?: string;
    value?: string;
    temporary?: boolean;
}

export interface IdentityUserQueryCloudRequestModel {
    first: number;
    max: number;
}

export interface IdentityJoinGroupRequestModel {
    realm: string;
    userId: string;
    groupId: string;
}

@Injectable({
    providedIn: 'root'
})
export class IdentityUserService {

    constructor(
        private jwtHelperService: JwtHelperService,
        private alfrescoApiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService) { }

    /**
     * Gets the name and other basic details of the current user.
     * @returns The user's details
     */
    getCurrentUserInfo(): IdentityUserModel {
        const familyName = this.jwtHelperService.getValueFromLocalAccessToken<string>(JwtHelperService.FAMILY_NAME);
        const givenName = this.jwtHelperService.getValueFromLocalAccessToken<string>(JwtHelperService.GIVEN_NAME);
        const email = this.jwtHelperService.getValueFromLocalAccessToken<string>(JwtHelperService.USER_EMAIL);
        const username = this.jwtHelperService.getValueFromLocalAccessToken<string>(JwtHelperService.USER_PREFERRED_USERNAME);
        return { firstName: givenName, lastName: familyName, email: email, username: username };
    }

    /**
     * Find users based on search input.
     * @param search Search query string
     * @returns List of users
     */
    findUsersByName(search: string): Observable<any> {
        if (search === '') {
            return of([]);
        }
        const url = this.buildUserUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = { search: search }, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        ));
    }

    /**
     * Find users based on username input.
     * @param username Search query string
     * @returns List of users
     */
    findUserByUsername(username: string): Observable<any> {
        if (username === '') {
            return of([]);
        }
        const url = this.buildUserUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = { username: username }, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        ));
    }

    /**
     * Find users based on email input.
     * @param email Search query string
     * @returns List of users
     */
    findUserByEmail(email: string): Observable<any> {
        if (email === '') {
            return of([]);
        }
        const url = this.buildUserUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = { email: email }, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        ));
    }

    /**
     * Find users based on id input.
     * @param id Search query string
     * @returns users object
     */
    findUserById(id: string): Observable<any> {
        if (id === '') {
            return of([]);
        }
        const url = this.buildUserUrl() + '/' + id;
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        ));
    }

    /**
     * Get client roles of a user for a particular client.
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @returns List of client roles
     */
    getClientRoles(userId: string, clientId: string): Observable<any[]> {
        const url = this.buildUserClientRoleMapping(userId, clientId);
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        );
    }

    /**
     * Checks whether user has access to a client app.
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @returns True if the user has access, false otherwise
     */
    checkUserHasClientApp(userId: string, clientId: string): Observable<boolean> {
        return this.getClientRoles(userId, clientId).pipe(
            map((clientRoles: any[]) => {
                if (clientRoles.length > 0) {
                    return true;
                }
                return false;
            })
        );
    }

    /**
     * Checks whether a user has any of the client app roles.
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @param roleNames List of role names to check for
     * @returns True if the user has one or more of the roles, false otherwise
     */
    checkUserHasAnyClientAppRole(userId: string, clientId: string, roleNames: string[]): Observable<boolean> {
        return this.getClientRoles(userId, clientId).pipe(
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
            })
        );
    }

    /**
     * Gets the client ID for an application.
     * @param applicationName Name of the application
     * @returns Client ID string
     */
    getClientIdByApplicationName(applicationName: string): Observable<string> {
        const url = this.buildGetClientsUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = { clientId: applicationName }, bodyParam = {}, headerParams = {}, formParams = {},
            contentTypes = ['application/json'], accepts = ['application/json'];
        return from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams,
                formParams, bodyParam, contentTypes,
                accepts, Object, null, null)
        ).pipe(
            map((response: any[]) => {
                const clientId = response && response.length > 0 ? response[0].id : '';
                return clientId;
            })
        );
    }

    /**
     * Checks if a user has access to an application.
     * @param userId ID of the user
     * @param applicationName Name of the application
     * @returns True if the user has access, false otherwise
     */
    checkUserHasApplicationAccess(userId: string, applicationName: string): Observable<boolean> {
        return this.getClientIdByApplicationName(applicationName).pipe(
            switchMap((clientId: string) => {
                return this.checkUserHasClientApp(userId, clientId);
            })
        );
    }

    /**
     * Checks if a user has any application role.
     * @param userId ID of the target user
     * @param applicationName Name of the application
     * @param roleNames List of role names to check for
     * @returns True if the user has one or more of the roles, false otherwise
     */
    checkUserHasAnyApplicationRole(userId: string, applicationName: string, roleNames: string[]): Observable<boolean> {
        return this.getClientIdByApplicationName(applicationName).pipe(
            switchMap((clientId: string) => {
                return this.checkUserHasAnyClientAppRole(userId, clientId, roleNames);
            })
        );
    }

    /**
     * Gets details for all users.
     * @returns Array of user info objects
     */
    getUsers(): Observable<IdentityUserModel[]> {
        const url = this.buildUserUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam, authNames,
            contentTypes, accepts, null, null)
        ).pipe(
            map((response: IdentityUserModel[]) => {
                return response;
            })
        );
    }

    /**
     * Gets a list of roles for a user.
     * @param userId ID of the user
     * @returns Array of role info objects
     */
    getUserRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildRolesUrl(userId);
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
            url, httpMethod, pathParams, queryParams,
            headerParams, formParams, bodyParam,
            contentTypes, accepts, Object, null, null)
        ).pipe(
            map((response: IdentityRoleModel[]) => {
                return response;
            })
        );
    }

    /**
     * Gets an array of users (including the current user) who have any of the roles in the supplied list.
     * @param roleNames List of role names to look for
     * @returns Array of user info objects
     */
    async getUsersByRolesWithCurrentUser(roleNames: string[]): Promise<IdentityUserModel[]> {
        const filteredUsers: IdentityUserModel[] = [];
        if (roleNames && roleNames.length > 0) {
            const users = await this.getUsers().toPromise();

            for (let i = 0; i < users.length; i++) {
                const hasAnyRole = await this.userHasAnyRole(users[i].id, roleNames);
                if (hasAnyRole) {
                    filteredUsers.push(users[i]);
                }
            }
        }

        return filteredUsers;
    }

    /**
     * Gets an array of users (not including the current user) who have any of the roles in the supplied list.
     * @param roleNames List of role names to look for
     * @returns Array of user info objects
     */
    async getUsersByRolesWithoutCurrentUser(roleNames: string[]): Promise<IdentityUserModel[]> {
        const filteredUsers: IdentityUserModel[] = [];
        if (roleNames && roleNames.length > 0) {
            const currentUser = this.getCurrentUserInfo();
            let users = await this.getUsers().toPromise();

            users = users.filter((user) => { return user.username !== currentUser.username; });

            for (let i = 0; i < users.length; i++) {
                const hasAnyRole = await this.userHasAnyRole(users[i].id, roleNames);
                if (hasAnyRole) {
                    filteredUsers.push(users[i]);
                }
            }
        }

        return filteredUsers;
    }

    private async userHasAnyRole(userId: string, roleNames: string[]): Promise<boolean> {
        const userRoles = await this.getUserRoles(userId).toPromise();
        const hasAnyRole = roleNames.some((roleName) => {
            const filteredRoles = userRoles.filter((userRole) => {
                return userRole.name.toLocaleLowerCase() === roleName.toLocaleLowerCase();
            });

            return filteredRoles.length > 0;
        });

        return hasAnyRole;
    }

    /**
     * Checks if a user has one of the roles from a list.
     * @param userId ID of the target user
     * @param roleNames Array of roles to check for
     * @returns True if the user has one of the roles, false otherwise
     */
    checkUserHasRole(userId: string, roleNames: string[]): Observable<boolean> {
        return this.getUserRoles(userId).pipe(map((userRoles: IdentityRoleModel[]) => {
            let hasRole = false;
            if (userRoles && userRoles.length > 0) {
                roleNames.forEach((roleName: string) => {
                    const role = userRoles.find((userRole) => {
                        return roleName === userRole.name;
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
     * Gets details for all users.
     * @returns Array of user information objects.
     */
    queryUsers(requestQuery: IdentityUserQueryCloudRequestModel): Observable<IdentityUserQueryResponse> {
        const url = this.buildUserUrl();
        const httpMethod = 'GET', pathParams = {},
        queryParams = { first: requestQuery.first, max: requestQuery.max }, bodyParam = {}, headerParams = {},
        formParams = {}, authNames = [], contentTypes = ['application/json'];

        return this.getTotalUsersCount().pipe(
                switchMap((totalCount: any) =>
                from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, null, null, null)
                ).pipe(
                    map((response: IdentityUserModel[]) => {
                        return <IdentityUserQueryResponse> {
                            entries: response,
                            pagination: {
                              skipCount: requestQuery.first,
                              maxItems: requestQuery.max,
                              count: totalCount,
                              hasMoreItems: false,
                              totalItems: totalCount
                            }
                          };
                    }),
                    catchError((error) => this.handleError(error))
                    ))
        );
    }

    /**
     * Gets users total count.
     * @returns Number of users count.
     */
    getTotalUsersCount(): Observable<number> {
        const url = this.buildUserUrl() + `/count`;
        const contentTypes = ['application/json'], accepts = ['application/json'];
        return from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(url, 'GET',
              null, null, null,
              null, null, contentTypes,
              accepts, null, null, null
              )).pipe(
                catchError((error) => this.handleError(error))
            );
    }

    /**
     * Creates new user.
     * @param newUser Object containing the new user details.
     * @returns Empty response when the user created.
     */
    createUser(newUser: IdentityUserModel): Observable<any> {
        const url = this.buildUserUrl();
        const request = JSON.stringify(newUser);
        const httpMethod = 'POST', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {},
        formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(
            this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
                url, httpMethod, pathParams, queryParams,
                headerParams, formParams, bodyParam,
                contentTypes, accepts, null, null, null
                )
        ).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * Updates user details.
     * @param userId Id of the user.
     * @param updatedUser Object containing the user details.
     * @returns Empty response when the user updated.
     */
    updateUser(userId: string, updatedUser: IdentityUserModel): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId;
        const request = JSON.stringify(updatedUser);
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
     * Deletes User.
     * @param userId Id of the  user.
     * @returns Empty response when the user deleted.
     */
    deleteUser(userId: string): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId;
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
     * Changes user password.
     * @param userId Id of the user.
     * @param credentials Details of user Credentials.
     * @returns Empty response when the password changed.
     */
    changePassword(userId: string, newPassword: IdentityUserPasswordModel): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/reset-password';
        const request = JSON.stringify(newPassword);
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
     * Gets involved groups.
     * @param userId Id of the user.
     * @returns Array of involved groups information objects.
     */
    getInvolvedGroups(userId: string): Observable<IdentityGroupModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/groups/';
        const httpMethod = 'GET', pathParams = { id: userId},
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
     * Joins group.
     * @param joinGroupRequest Details of join group request (IdentityJoinGroupRequestModel).
     * @returns Empty response when the user joined the group.
     */
    joinGroup(joinGroupRequest: IdentityJoinGroupRequestModel): Observable<any> {
        const url = this.buildUserUrl() + '/' + joinGroupRequest.userId + '/groups/' + joinGroupRequest.groupId;
        const request = JSON.stringify(joinGroupRequest);
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
     * Leaves group.
     * @param userId Id of the user.
     * @param groupId Id of the  group.
     * @returns Empty response when the user left the group.
     */
    leaveGroup(userId: any, groupId: string): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/groups/' + groupId;
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
     * Gets available roles
     * @param userId Id of the user.
     * @returns Array of available roles information objects
     */
    getAvailableRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm/available';
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
     * Gets assigned roles.
     * @param userId Id of the user.
     * @returns Array of assigned roles information objects
     */
    getAssignedRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        const httpMethod = 'GET', pathParams = { id: userId},
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
     * Gets effective roles.
     * @param userId Id of the user.
     * @returns Array of composite roles information objects
     */
    getEffectiveRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm/composite';
        const httpMethod = 'GET', pathParams = { id: userId},
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
     * Assigns roles to the user.
     * @param userId Id of the user.
     * @param roles Array of roles.
     * @returns Empty response when the role assigned.
     */
    assignRoles(userId: string, roles: IdentityRoleModel[]): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        const request = JSON.stringify(roles);
        const httpMethod = 'POST', pathParams = {} , queryParams = {}, bodyParam = request, headerParams = {},
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
     * Removes assigned roles.
     * @param userId Id of the user.
     * @param roles Array of roles.
     * @returns Empty response when the role removed.
     */
    removeRoles(userId: string, removedRoles: IdentityRoleModel[]): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        const request = JSON.stringify(removedRoles);
        const httpMethod = 'DELETE', pathParams = {} , queryParams = {}, bodyParam = request, headerParams = {},
        formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(
        url, httpMethod, pathParams, queryParams,
        headerParams, formParams, bodyParam,
        contentTypes, accepts, null, null, null
        )).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    private buildUserUrl(): string {
        return `${this.appConfigService.get('identityHost')}/users`;
    }

    private buildUserClientRoleMapping(userId: string, clientId: string): string {
        return `${this.appConfigService.get('identityHost')}/users/${userId}/role-mappings/clients/${clientId}/composite`;
    }

    private buildRolesUrl(userId: string): string {
        return `${this.appConfigService.get('identityHost')}/users/${userId}/role-mappings/realm/composite`;
    }

    private buildGetClientsUrl(): string {
        return `${this.appConfigService.get('identityHost')}/clients`;
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
