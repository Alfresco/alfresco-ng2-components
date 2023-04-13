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

import { Observable } from 'rxjs';
import { IdentityGroupModel } from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';
import { IdentityUserModel } from '../models/identity-user.model';
import { PaginationModel } from '../../models/pagination.model';

export interface IdentityUserQueryResponse {

    entries: IdentityUserModel[];
    pagination: PaginationModel;
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

export interface IdentityUserServiceInterface {
    getCurrentUserInfo(): IdentityUserModel;
    findUserById(id: string): Observable<any>;
    findUsersByName(search: string): Observable<IdentityUserModel[]>;
    findUserByUsername(username: string): Observable<IdentityUserModel[]>;
    findUserByEmail(email: string): Observable<IdentityUserModel[]>;
    getClientRoles(userId: string, clientId: string): Observable<any[]>;
    checkUserHasClientApp(userId: string, clientId: string): Observable<boolean>;
    checkUserHasAnyClientAppRole(userId: string, clientId: string, roleNames: string[]): Observable<boolean>;
    getClientIdByApplicationName(applicationName: string): Observable<string>;
    checkUserHasApplicationAccess(userId: string, applicationName: string): Observable<boolean>;
    checkUserHasAnyApplicationRole(userId: string, applicationName: string, roleNames: string[]): Observable<boolean>;
    getUsers(): Observable<IdentityUserModel[]>;
    getUserRoles(userId: string): Observable<IdentityRoleModel[]>;
    getUsersByRolesWithCurrentUser(roleNames: string[]): Promise<IdentityUserModel[]>;
    getUsersByRolesWithoutCurrentUser(roleNames: string[]): Promise<IdentityUserModel[]>;
    checkUserHasRole(userId: string, roleNames: string[]): Observable<boolean>;
    queryUsers(requestQuery: IdentityUserQueryCloudRequestModel): Observable<IdentityUserQueryResponse>;
    getTotalUsersCount(): Observable<number>;
    createUser(newUser: IdentityUserModel): Observable<any>;
    updateUser(userId: string, updatedUser: IdentityUserModel): Observable<any>;
    deleteUser(userId: string): Observable<any>;
    changePassword(userId: string, newPassword: IdentityUserPasswordModel): Observable<any>;
    getInvolvedGroups(userId: string): Observable<IdentityGroupModel[]>;
    joinGroup(joinGroupRequest: IdentityJoinGroupRequestModel): Observable<any>;
    leaveGroup(userId: any, groupId: string): Observable<any>;
    getAvailableRoles(userId: string): Observable<IdentityRoleModel[]>;
    getAssignedRoles(userId: string): Observable<IdentityRoleModel[]>;
    getEffectiveRoles(userId: string): Observable<IdentityRoleModel[]>;
    assignRoles(userId: string, roles: IdentityRoleModel[]): Observable<any>;
    removeRoles(userId: string, removedRoles: IdentityRoleModel[]): Observable<any>;
}
