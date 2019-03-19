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

export class IdentityService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createIdentityUser(user: UserModel = new UserModel()) {
        await this.createUser(user);

        let userIdentity = await this.getUserInfoByUsername(user.email);
        await this.resetPassword(userIdentity.id, user.password);

        return user;
    }

    async createIdentityUserAndSyncECMBPM(user: UserModel) {
        if (this.api.config.provider === 'ECM' || this.api.config.provider === 'ALL') {
            await this.api.apiService.core.peopleApi.addPerson(user);
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
            'username': user.email,
            'firstName': user.firstName,
            'lastName': user.lastName,
            'enabled': true,
            'email': user.email
        };
        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    async deleteUser(userId) {
        const path = `/users/${userId}`;
        const method = 'DELETE';
        const queryParams = {}, postBody = {};
        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    async getUserInfoByUsername(username) {
        const path = `/users`;
        const method = 'GET';
        const queryParams = {'username': username}, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0];
    }

    async resetPassword(id, password) {
        const path = `/users/${id}/reset-password`;
        const method = 'PUT';
        const queryParams = {},
            postBody = {'type': 'password', 'value': password, 'temporary': false};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    async assignRole(userId, roleId, roleName) {
        const path = `/users/${userId}/role-mappings/realm`;
        const method = 'POST';
        const queryParams = {},
            postBody = [{'id': roleId, 'name': roleName}];

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

}
