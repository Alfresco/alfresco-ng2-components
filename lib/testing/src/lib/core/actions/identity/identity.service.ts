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

export class IdentityService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createActivitiUserWithRole(apiService, role: string = 'ACTIVITI_USER') {
        const rolesService = new RolesService(apiService);
        const apsUser = await this.createIdentityUser();
        const apsUserRoleId = await rolesService.getRoleIdByRoleName(role);
        await this.assignRole(apsUser.idIdentityService, apsUserRoleId, role);
        return apsUser;
    }

    async createIdentityUser(user: UserModel = new UserModel()) {
        await this.createUser(user);

        const userIdentity = await this.getUserInfoByUsername(user.username);
        await this.resetPassword(userIdentity.id, user.password);
        user.idIdentityService = userIdentity.id;
        return user;
    }

    async createIdentityUserAndSyncECMBPM(user: UserModel) {
        if (this.api.config.provider === 'ECM' || this.api.config.provider === 'ALL') {
            const createUser: PersonBodyCreate = <PersonBodyCreate> {
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                email: user.email,
                id: user.email
            };
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

    async deleteIdentityUser(userId) {
        await this.deleteUser(userId);
    }

    async createUser(user: UserModel) {
        const path = '/users';
        const method = 'POST';
        const queryParams = {}, postBody = {
            'username': user.username,
            'firstName': user.firstName,
            'lastName': user.lastName,
            'enabled': true,
            'email': user.email
        };
        return await this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async deleteUser(userId) {
        const path = `/users/${userId}`;
        const method = 'DELETE';
        const queryParams = {}, postBody = {};
        return await this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async getUserInfoByUsername(username) {
        const path = `/users`;
        const method = 'GET';
        const queryParams = { 'username': username }, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0];
    }

    async resetPassword(id, password) {
        const path = `/users/${id}/reset-password`;
        const method = 'PUT';
        const queryParams = {},
            postBody = { 'type': 'password', 'value': password, 'temporary': false };

        return await this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async assignRole(userId, roleId, roleName) {
        const path = `/users/${userId}/role-mappings/realm`;
        const method = 'POST';
        const queryParams = {},
            postBody = [{ 'id': roleId, 'name': roleName }];

        return await this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async deleteClientRole(userId: string, clientId: string, roleId: string, roleName: string) {
        const path = `/users/${userId}/role-mappings/clients/${clientId}`;
        const method = 'DELETE', queryParams = {},
            postBody = [{
                'id': roleId,
                'name': roleName,
                'composite': false,
                'clientRole': true,
                'containerId': clientId
            }];
        return await this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

}
