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

/* eslint-disable @typescript-eslint/naming-convention */

import { ApiService } from '../../../../shared/api/api.service';
import { UserModel } from '../../models/user.model';
import { RolesService } from './roles.service';
import { Logger } from '../../utils/logger';

export class IdentityService {
    ROLES = {
        ACTIVITI_USER: 'ACTIVITI_USER',
        ACTIVITI_ADMIN: 'ACTIVITI_ADMIN',
        ACTIVITI_DEVOPS: 'ACTIVITI_DEVOPS',
        ACTIVITI_IDENTITY: 'ACTIVITI_IDENTITY'
    };

    constructor(public api: ApiService) {}

    async createIdentityUserWithRole(roles: string[]): Promise<any> {
        const rolesService = new RolesService(this.api);
        const user = await this.createIdentityUser();
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < roles.length; i++) {
            const roleId = await rolesService.getRoleIdByRoleName(roles[i]);
            await this.assignRole(user.idIdentityService, roleId, roles[i]);
        }
        return user;
    }

    async createIdentityUser(user: UserModel = new UserModel()): Promise<any> {
        Logger.log(`Create Identity User ${user.email}`);
        await this.createUser(user);

        const userIdentity = await this.getUserInfoByUsername(user.username);
        await this.resetPassword(userIdentity.id, user.password);
        user.idIdentityService = userIdentity.id;
        return user;
    }

    async deleteIdentityUser(userId: string): Promise<void> {
        await this.deleteUser(userId);
    }

    async createUser(user: UserModel): Promise<any> {
        try {
            const path = '/users';
            const method = 'POST';

            const queryParams = {};
            const postBody = {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                enabled: true,
                email: user.email
            };

            return this.api.performIdentityOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Create User - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
        }
    }

    async deleteUser(userId: string): Promise<any> {
        const path = `/users/${userId}`;
        const method = 'DELETE';
        const queryParams = {};
        const postBody = {};
        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async getUserInfoByUsername(username: string): Promise<any> {
        const path = `/users`;
        const method = 'GET';
        const queryParams = { username };
        const postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0];
    }

    async resetPassword(id: string, password: string): Promise<any> {
        const path = `/users/${id}/reset-password`;
        const method = 'PUT';
        const queryParams = {};
        const postBody = { type: 'password', value: password, temporary: false };

        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async addUserToGroup(userId: string, groupId: string): Promise<any> {
        Logger.log(`Add user to group userId ${userId} ${groupId}`);

        try {
            const path = `/users/${userId}/groups/${groupId}`;
            const method = 'PUT';
            const queryParams = {};
            const postBody = { realm: 'alfresco', userId, groupId };

            return this.api.performIdentityOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Add User To Group - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async assignRole(userId: string, roleId: string, roleName: string): Promise<any> {
        const path = `/users/${userId}/role-mappings/realm`;
        const method = 'POST';
        const queryParams = {};
        const postBody = [{ id: roleId, name: roleName }];

        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async deleteClientRole(userId: string, clientId: string, roleId: string, roleName: string): Promise<any> {
        const path = `/users/${userId}/role-mappings/clients/${clientId}`;
        const method = 'DELETE';
        const queryParams = {};
            const postBody = [{
                id: roleId,
                name: roleName,
                composite: false,
                clientRole: true,
                containerId: clientId
            }];
        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }
}
