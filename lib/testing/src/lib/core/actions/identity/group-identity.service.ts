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
import { StringUtil } from '../../string.util';

export class GroupIdentityService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createIdentityGroup(groupName = StringUtil.generateRandomString(5)) {
        await this.createGroup(groupName);
        const group = await this.getGroupInfoByGroupName(groupName);
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

    async getGroupInfoByGroupName(groupName) {
        const path = `/groups`;
        const method = 'GET';
        const queryParams = { 'search' : groupName }, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0];
    }

    async assignRole(groupId, roleId, roleName) {
        const path = `/groups/${groupId}/role-mappings/realm`;
        const method = 'POST';
        const queryParams = {},
            postBody = [{'id': roleId, 'name': roleName}];

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    /**
     * Add client roles.
     * @param groupId ID of the target group
     * @param clientId ID of the client
     * @param roleId ID of the clientRole
     * @param roleName of the clientRole
     */
    async addClientRole(groupId: string, clientId: string, roleId: string, roleName: string) {
        const path = `/groups/${groupId}/role-mappings/clients/${clientId}`;
        const method = 'POST', queryParams = {},
            postBody = [{
                'id': roleId,
                'name': roleName,
                'composite': false,
                'clientRole': true,
                'containerId': clientId
            }];
        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    /**
     * Gets the client ID using the app name.
     * @param applicationName Name of the app
     * @returns client ID string
     */
    async getClientIdByApplicationName(applicationName: string) {
        const path = `/clients`;
        const method = 'GET', queryParams = {clientId: applicationName}, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0].id;
    }

}
