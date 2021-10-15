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
import { IdentityGroupModel, IdentityRoleModel, IdentityUserModel, mockIdentityGroups } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { cloudMockUser, mockRoles, mockUsers } from './user-cloud.mock';

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
export class IdentityUserServiceMock {

    getCurrentUserInfo(): IdentityUserModel {
        return cloudMockUser;
    }

    findUsersByName(search: string): Observable<IdentityUserModel[]> {
        if (search === '') {
            return of([]);
        }

        return of(mockUsers);
    }

    findUserByUsername(username: string): Observable<IdentityUserModel[]> {
        if (username === '') {
            return of([]);
        }

        return of(mockUsers);
    }

    findUserByEmail(email: string): Observable<IdentityUserModel[]> {
        if (email === '') {
            return of([]);
        }

        return of(mockUsers);
    }

    findUserById(id: string): Observable<any> {
        if (id === '') {
            return of([]);
        }

        return of(cloudMockUser);
    }

    getClientRoles(_userId: string, _clientId: string): Observable<any[]> {
        return of(mockRoles);
    }

    checkUserHasClientApp(userId: string, clientId: string): Observable<boolean> {
        return this.getClientRoles(userId, clientId).pipe(
            map((clientRoles) => clientRoles.length > 0)
        );
    }

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

    getClientIdByApplicationName(_applicationName: string): Observable<string> {

        return of('fake-id-1');
    }

    checkUserHasApplicationAccess(userId: string, applicationName: string): Observable<boolean> {
        return this.getClientIdByApplicationName(applicationName).pipe(
            switchMap((clientId: string) => {
                return this.checkUserHasClientApp(userId, clientId);
            })
        );
    }

    checkUserHasAnyApplicationRole(userId: string, applicationName: string, roleNames: string[]): Observable<boolean> {
        return this.getClientIdByApplicationName(applicationName).pipe(
            switchMap((clientId: string) => {
                return this.checkUserHasAnyClientAppRole(userId, clientId, roleNames);
            })
        );
    }

    getUsers(): Observable<IdentityUserModel[]> {
        return of(mockUsers);
    }

    getUserRoles(_userId: string): Observable<IdentityRoleModel[]> {

        return of(mockRoles);
    }

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
            const filteredRoles = userRoles.filter((userRole) => {
                return userRole.name.toLocaleLowerCase() === roleName.toLocaleLowerCase();
            });

            return filteredRoles.length > 0;
        });

        return hasAnyRole;
    }

    checkUserHasRole(userId: string, roleNames: string[]): Observable<boolean> {
        return this.getUserRoles(userId).pipe(map((userRoles: IdentityRoleModel[]) => {
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
        }));
    }

    queryUsers(_requestQuery: IdentityUserQueryCloudRequestModel): Observable<IdentityUserQueryResponse> {
        /*
        return {
            entries: mockUsers,
            pagination: {
              skipCount: requestQuery.first,
              maxItems: requestQuery.max,
              count: this.getTotalUsersCount(),
              hasMoreItems: false,
              totalItems: this.getTotalUsersCount()
            }
        };
        */
       return of();
    }

    getTotalUsersCount(): Observable<number> {
        return of(mockUsers.length);
    }

    createUser(newUser: IdentityUserModel): Observable<any> {
        window.alert(`Create new user: ${newUser}`);
        return of([]);
    }

    updateUser(userId: string, updatedUser: IdentityUserModel): Observable<any> {
        window.alert(`Update user: ${updatedUser} with ID: ${userId}`);
        return of([]);
    }

    deleteUser(userId: string): Observable<any> {
        window.alert(`Delete user with ID: ${userId}`);
        return of([]);
    }

    changePassword(userId: string, newPassword: IdentityUserPasswordModel): Observable<any> {
        window.alert(`New password: ${newPassword} for user with ID: ${userId}`);
        return of([]);
    }

    getInvolvedGroups(_userId: string): Observable<IdentityGroupModel[]> {
        return of(mockIdentityGroups);
    }

    joinGroup(joinGroupRequest: IdentityJoinGroupRequestModel): Observable<any> {
        window.alert(`Join group request: ${joinGroupRequest}`);
        return of([]);
    }

    leaveGroup(userId: any, groupId: string): Observable<any> {
        window.alert(`Leave group: ${groupId} for user with ID: ${userId}`);
        return of([]);
    }

    getAvailableRoles(_userId: string): Observable<IdentityRoleModel[]> {
        return of(mockRoles);
    }

    /**
     * Gets assigned roles.
     * @param userId Id of the user.
     * @returns Array of assigned roles information objects
     */
    getAssignedRoles(_userId: string): Observable<IdentityRoleModel[]> {
        return of(mockRoles);
    }

    getEffectiveRoles(_userId: string): Observable<IdentityRoleModel[]> {
        return of(mockRoles);
    }

    /**
     * Assigns roles to the user.
     * @param userId Id of the user.
     * @param roles Array of roles.
     * @returns Empty response when the role assigned.
     */
    assignRoles(userId: string, roles: IdentityRoleModel[]): Observable<any> {
        window.alert(`Assign roles: ${roles} for user with ID: ${userId}`);
        return of([]);
    }

    /**
     * Removes assigned roles.
     * @param userId Id of the user.
     * @param roles Array of roles.
     * @returns Empty response when the role removed.
     */
    removeRoles(userId: string, removedRoles: IdentityRoleModel[]): Observable<any> {
        window.alert(`Remove roles: ${removedRoles} for user with ID: ${userId}`);
        return of([]);
    }
}
