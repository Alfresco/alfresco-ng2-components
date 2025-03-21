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
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppConfigService } from '../../app-config/app-config.service';
import { IdentityGroupModel } from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';
import { IdentityUserModel } from '../models/identity-user.model';
import {
    IdentityJoinGroupRequestModel,
    IdentityUserServiceInterface,
    IdentityUserPasswordModel,
    IdentityUserQueryCloudRequestModel,
    IdentityUserQueryResponse
} from '../interfaces/identity-user.service.interface';
import { JwtHelperService } from './jwt-helper.service';
import { OAuth2Service } from './oauth2.service';

@Injectable({
    providedIn: 'root'
})
export class IdentityUserService implements IdentityUserServiceInterface {
    constructor(private jwtHelperService: JwtHelperService, private oAuth2Service: OAuth2Service, private appConfigService: AppConfigService) {}

    private get identityHost(): string {
        return `${this.appConfigService.get('identityHost')}`;
    }

    private buildUserUrl(): string {
        return `${this.identityHost}/users`;
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

    /**
     * Find users based on search input.
     *
     * @param search Search query string
     * @returns List of users
     */
    findUsersByName(search: string): Observable<IdentityUserModel[]> {
        if (search === '') {
            return of([]);
        }
        const url = this.buildUserUrl();
        const queryParams = { search };

        return this.oAuth2Service.get({ url, queryParams });
    }

    /**
     * Find users based on username input.
     *
     * @param username Search query string
     * @returns List of users
     */
    findUserByUsername(username: string): Observable<IdentityUserModel[]> {
        if (username === '') {
            return of([]);
        }
        const url = this.buildUserUrl();
        const queryParams = { username };

        return this.oAuth2Service.get({ url, queryParams });
    }

    /**
     * Find users based on email input.
     *
     * @param email Search query string
     * @returns List of users
     */
    findUserByEmail(email: string): Observable<IdentityUserModel[]> {
        if (email === '') {
            return of([]);
        }
        const url = this.buildUserUrl();
        const queryParams = { email };

        return this.oAuth2Service.get({ url, queryParams });
    }

    /**
     * Find users based on id input.
     *
     * @param id Search query string
     * @returns users object
     */
    findUserById(id: string): Observable<any> {
        if (id === '') {
            return of([]);
        }
        const url = this.buildUserUrl() + '/' + id;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Get client roles of a user for a particular client.
     *
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @returns List of client roles
     */
    getClientRoles(userId: string, clientId: string): Observable<any[]> {
        const url = `${this.identityHost}/users/${userId}/role-mappings/clients/${clientId}/composite`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Checks whether user has access to a client app.
     *
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @returns True if the user has access, false otherwise
     */
    checkUserHasClientApp(userId: string, clientId: string): Observable<boolean> {
        return this.getClientRoles(userId, clientId).pipe(map((clientRoles) => clientRoles.length > 0));
    }

    /**
     * Checks whether a user has any of the client app roles.
     *
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
                        const role = clientRoles.find(({ name }) => name === roleName);

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
     *
     * @param applicationName Name of the application
     * @returns Client ID string
     */
    getClientIdByApplicationName(applicationName: string): Observable<string> {
        const url = `${this.identityHost}/clients`;
        const queryParams = { clientId: applicationName };

        return this.oAuth2Service.get<any[]>({ url, queryParams }).pipe(map((response) => (response && response.length > 0 ? response[0].id : '')));
    }

    /**
     * Checks if a user has access to an application.
     *
     * @param userId ID of the user
     * @param applicationName Name of the application
     * @returns True if the user has access, false otherwise
     */
    checkUserHasApplicationAccess(userId: string, applicationName: string): Observable<boolean> {
        return this.getClientIdByApplicationName(applicationName).pipe(switchMap((clientId: string) => this.checkUserHasClientApp(userId, clientId)));
    }

    /**
     * Checks if a user has any application role.
     *
     * @param userId ID of the target user
     * @param applicationName Name of the application
     * @param roleNames List of role names to check for
     * @returns True if the user has one or more of the roles, false otherwise
     */
    checkUserHasAnyApplicationRole(userId: string, applicationName: string, roleNames: string[]): Observable<boolean> {
        return this.getClientIdByApplicationName(applicationName).pipe(
            switchMap((clientId: string) => this.checkUserHasAnyClientAppRole(userId, clientId, roleNames))
        );
    }

    /**
     * Gets details for all users.
     *
     * @returns Array of user info objects
     */
    getUsers(): Observable<IdentityUserModel[]> {
        const url = this.buildUserUrl();
        return this.oAuth2Service.get({ url });
    }

    /**
     * Gets a list of roles for a user.
     *
     * @param userId ID of the user
     * @returns Array of role info objects
     */
    getUserRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = `${this.identityHost}/users/${userId}/role-mappings/realm/composite`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Gets an array of users (including the current user) who have any of the roles in the supplied list.
     *
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
     *
     * @param roleNames List of role names to look for
     * @returns Array of user info objects
     */
    async getUsersByRolesWithoutCurrentUser(roleNames: string[]): Promise<IdentityUserModel[]> {
        const filteredUsers: IdentityUserModel[] = [];
        if (roleNames && roleNames.length > 0) {
            const currentUser = this.getCurrentUserInfo();
            let users = await this.getUsers().toPromise();

            users = users.filter(({ username }) => username !== currentUser.username);

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
            const filteredRoles = userRoles.filter((userRole) => userRole.name.toLocaleLowerCase() === roleName.toLocaleLowerCase());

            return filteredRoles.length > 0;
        });

        return hasAnyRole;
    }

    /**
     * Checks if a user has one of the roles from a list.
     *
     * @param userId ID of the target user
     * @param roleNames Array of roles to check for
     * @returns True if the user has one of the roles, false otherwise
     */
    checkUserHasRole(userId: string, roleNames: string[]): Observable<boolean> {
        return this.getUserRoles(userId).pipe(
            map((userRoles: IdentityRoleModel[]) => {
                let hasRole = false;
                if (userRoles && userRoles.length > 0) {
                    roleNames.forEach((roleName: string) => {
                        const role = userRoles.find(({ name }) => roleName === name);
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
     * Gets details for all users.
     *
     * @param requestQuery query model
     * @returns Array of user information objects.
     */
    queryUsers(requestQuery: IdentityUserQueryCloudRequestModel): Observable<IdentityUserQueryResponse> {
        const url = this.buildUserUrl();
        const queryParams = { first: requestQuery.first, max: requestQuery.max };

        return this.getTotalUsersCount().pipe(
            switchMap((totalCount) =>
                this.oAuth2Service.get<IdentityUserModel[]>({ url, queryParams }).pipe(
                    map(
                        (response) =>
                            ({
                                entries: response,
                                pagination: {
                                    skipCount: requestQuery.first,
                                    maxItems: requestQuery.max,
                                    count: totalCount,
                                    hasMoreItems: false,
                                    totalItems: totalCount
                                }
                            } as IdentityUserQueryResponse)
                    )
                )
            )
        );
    }

    /**
     * Gets users total count.
     *
     * @returns Number of users count.
     */
    getTotalUsersCount(): Observable<number> {
        const url = this.buildUserUrl() + `/count`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Creates new user.
     *
     * @param newUser Object containing the new user details.
     * @returns Empty response when the user created.
     */
    createUser(newUser: IdentityUserModel): Observable<any> {
        const url = this.buildUserUrl();
        const bodyParam = JSON.stringify(newUser);

        return this.oAuth2Service.post({ url, bodyParam });
    }

    /**
     * Updates user details.
     *
     * @param userId Id of the user.
     * @param updatedUser Object containing the user details.
     * @returns Empty response when the user updated.
     */
    updateUser(userId: string, updatedUser: IdentityUserModel): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId;
        const bodyParam = JSON.stringify(updatedUser);

        return this.oAuth2Service.put({ url, bodyParam });
    }

    /**
     * Deletes User.
     *
     * @param userId Id of the  user.
     * @returns Empty response when the user deleted.
     */
    deleteUser(userId: string): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId;
        return this.oAuth2Service.delete({ url });
    }

    /**
     * Changes user password.
     *
     * @param userId Id of the user.
     * @param newPassword Details of user Credentials.
     * @returns Empty response when the password changed.
     */
    changePassword(userId: string, newPassword: IdentityUserPasswordModel): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/reset-password';
        const bodyParam = JSON.stringify(newPassword);

        return this.oAuth2Service.put({ url, bodyParam });
    }

    /**
     * Gets involved groups.
     *
     * @param userId Id of the user.
     * @returns Array of involved groups information objects.
     */
    getInvolvedGroups(userId: string): Observable<IdentityGroupModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/groups/';
        const pathParams = { id: userId };

        return this.oAuth2Service.get({ url, pathParams });
    }

    /**
     * Joins group.
     *
     * @param joinGroupRequest Details of join group request (IdentityJoinGroupRequestModel).
     * @returns Empty response when the user joined the group.
     */
    joinGroup(joinGroupRequest: IdentityJoinGroupRequestModel): Observable<any> {
        const url = this.buildUserUrl() + '/' + joinGroupRequest.userId + '/groups/' + joinGroupRequest.groupId;
        const bodyParam = JSON.stringify(joinGroupRequest);

        return this.oAuth2Service.put({ url, bodyParam });
    }

    /**
     * Leaves group.
     *
     * @param userId Id of the user.
     * @param groupId Id of the  group.
     * @returns Empty response when the user left the group.
     */
    leaveGroup(userId: any, groupId: string): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/groups/' + groupId;
        return this.oAuth2Service.delete({ url });
    }

    /**
     * Gets available roles
     *
     * @param userId Id of the user.
     * @returns Array of available roles information objects
     */
    getAvailableRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm/available';
        return this.oAuth2Service.get({ url });
    }

    /**
     * Gets assigned roles.
     *
     * @param userId Id of the user.
     * @returns Array of assigned roles information objects
     */
    getAssignedRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        const pathParams = { id: userId };

        return this.oAuth2Service.get({ url, pathParams });
    }

    /**
     * Gets effective roles.
     *
     * @param userId Id of the user.
     * @returns Array of composite roles information objects
     */
    getEffectiveRoles(userId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm/composite';
        const pathParams = { id: userId };

        return this.oAuth2Service.get({ url, pathParams });
    }

    /**
     * Assigns roles to the user.
     *
     * @param userId Id of the user.
     * @param roles Array of roles.
     * @returns Empty response when the role assigned.
     */
    assignRoles(userId: string, roles: IdentityRoleModel[]): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        const bodyParam = JSON.stringify(roles);

        return this.oAuth2Service.post({ url, bodyParam });
    }

    /**
     * Removes assigned roles.
     *
     * @param userId Id of the user.
     * @param removedRoles Array of roles.
     * @returns Empty response when the role removed.
     */
    removeRoles(userId: string, removedRoles: IdentityRoleModel[]): Observable<any> {
        const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        const bodyParam = JSON.stringify(removedRoles);

        return this.oAuth2Service.delete({ url, bodyParam });
    }
}
