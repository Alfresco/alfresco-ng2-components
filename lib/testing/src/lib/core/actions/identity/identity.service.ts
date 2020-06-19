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

import { ApiService } from '../api.service';
import { UserModel } from '../../models/user.model';
import { PersonBodyCreate } from '@alfresco/js-api';
import { RolesService } from './roles.service';
import { Logger } from '../../utils/logger';

export class IdentityService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    ROLES = {
        ACTIVITI_USER: 'ACTIVITI_USER',
        ACTIVITI_ADMIN: 'ACTIVITI_ADMIN',
        ACTIVITI_DEVOPS: 'ACTIVITI_DEVOPS',
        ACTIVITI_IDENTITY: 'ACTIVITI_IDENTITY'
    };

    async createIdentityUserWithRole(apiService: ApiService, roles: string[]): Promise<any> {
        const rolesService = new RolesService(apiService);
        const user = await this.createIdentityUser();
        for (let i = 0; i < roles.length; i++) {
            const roleId = await rolesService.getRoleIdByRoleName(roles[i]);
            await this.assignRole(user.idIdentityService, roleId, roles[i]);
        }
        return user;
    }

    async createIdentityUser(user: UserModel = new UserModel()): Promise<any> {
        await this.createUser(user);

        const userIdentity = await this.getUserInfoByUsername(user.username);
        await this.resetPassword(userIdentity.id, user.password);
        user.idIdentityService = userIdentity.id;
        return user;
    }

    async createIdentityUserAndSyncECMBPM(user: UserModel): Promise<void> {
        if (this.api.config.provider === 'ECM' || this.api.config.provider === 'ALL') {
            const createUser: PersonBodyCreate = {
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                email: user.email,
                id: user.email
            } as PersonBodyCreate;
            await this.api.apiService.core.peopleApi.addPerson(createUser);
        }

        if (this.api.config.provider === 'BPM' || this.api.config.provider === 'ALL') {
            await this.api.apiService.activiti.adminUsersApi.createNewUser({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                type: 'enterprise',
                tenantId: 1,
                company: null
            });
        }

        await this.createIdentityUser(user);
    }

    async deleteIdentityUser(userId: string): Promise<void> {
        await this.deleteUser(userId);
    }

    async createUser(user: UserModel): Promise<any> {
        try {
            const path = '/users';
            const method = 'POST';

            const queryParams = {}, postBody = {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                enabled: true,
                email: user.email
            };

            return this.api.performIdentityOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Create User - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async deleteUser(userId: string): Promise<any> {
        const path = `/users/${userId}`;
        const method = 'DELETE';
        const queryParams = {}, postBody = {};
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
        const queryParams = {},
            postBody = { type: 'password', value: password, temporary: false };

        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async addUserToGroup(userId: string, groupId: string): Promise<any> {
        try {
            const path = `/users/${userId}/groups/${groupId}`;
            const method = 'PUT';
            const queryParams = {};
            const postBody = { realm: 'alfresco', userId: userId, groupId: groupId };

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
        const method = 'DELETE', queryParams = {},
            postBody = [{
                id: roleId,
                name: roleName,
                composite: false,
                clientRole: true,
                containerId: clientId
            }];
        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

}
