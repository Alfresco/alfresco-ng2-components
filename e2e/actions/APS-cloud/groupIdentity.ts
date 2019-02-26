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

import { ApiService } from '../APS-cloud/apiservice';
import { Util } from '../../util/util';
import { AppConfigService } from '@alfresco/adf-core';

export class GroupIdentity {

    api: ApiService = new ApiService();

    constructor(appConfig: AppConfigService) {
    }

    async init(username, password) {
        await this.api.login(username, password);
    }

    async createIdentityGroup(groupName = Util.generateRandomString(5)) {
        await this.createGroup(groupName);
        const group = await this.getGroupInfoByGroupname(groupName);
        return group;
    }

    async deleteIdentityGroup(groupId) {
        await this.deleteGroup(groupId);
    }

    async createGroup(groupName) {
        const path = '/groups';
        const method = 'POST';
        const queryParams = {}, postBody = {
            'name': groupName + 'TestGroup'
        };
        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    async deleteGroup(groupId) {
        const path = `/groups/${groupId}`;
        const method = 'DELETE';
        const queryParams = {}, postBody = {
        };
        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    async getGroupInfoByGroupname(groupName) {
        const path = `/groups`;
        const method = 'GET';
        const queryParams = { 'search' : groupName }, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0];
    }

    async getRoleIdByRoleName(roleName) {
        const path = `/roles`;
        const method = 'GET';
        let roleId;
        const queryParams = {}, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        for (let key in data) {
            if (data[key].name === roleName) {
                roleId =  data[key].id;
            }
        }
        return roleId;
    }

    async assignRole(groupId, roleName) {
        const role = await this.getRoleIdByRoleName(roleName);
        const path = `/groups/${groupId}/role-mappings/realm`;
        const method = 'POST';
        const queryParams = {},
            postBody = [{'id': role, 'name': roleName}];

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

}
