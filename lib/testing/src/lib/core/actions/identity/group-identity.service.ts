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
import { StringUtil } from '../../utils/string.util';
import { browser } from 'protractor';

export class GroupIdentityService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createIdentityGroup(groupName = StringUtil.generateRandomString(5)): Promise<any> {
        await this.createGroup(groupName);
        const group = await this.getGroupInfoByGroupName(groupName);
        return group;
    }

    async deleteIdentityGroup(groupId): Promise<void> {
        await this.deleteGroup(groupId);
    }

    async createGroup(groupName: string): Promise<any> {
        const path = '/groups';
        const method = 'POST';
        const queryParams = {};
        const postBody = {
            name: `${groupName}-${browser.params.groupSuffix}`
        };
        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    async deleteGroup(groupId: string): Promise<any> {
        const path = `/groups/${groupId}`;
        const method = 'DELETE';
        const queryParams = {};
        const postBody = {};
        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data;
    }

    async getGroupInfoByGroupName(groupName: string): Promise<any> {
        const path = `/groups`;
        const method = 'GET';
        const queryParams = { search: groupName }, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0];
    }

    async assignRole(groupId: string, roleId: string, roleName: string): Promise<any> {
        const path = `/groups/${groupId}/role-mappings/realm`;
        const method = 'POST';
        const queryParams = {};
        const postBody = [{ id: roleId, name: roleName }];

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
    async addClientRole(groupId: string, clientId: string, roleId: string, roleName: string): Promise<any> {
        const path = `/groups/${groupId}/role-mappings/clients/${clientId}`;
        const method = 'POST';
        const queryParams = {};
        const postBody = [
            {
                id: roleId,
                name: roleName,
                composite: false,
                clientRole: true,
                containerId: clientId
            }
        ];
        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    /**
     * Gets the client ID using the app name.
     * @param applicationName Name of the app
     * @returns client ID string
     */
    async getClientIdByApplicationName(applicationName: string): Promise<any> {
        const path = `/clients`;
        const method = 'GET';
        const queryParams = { clientId: applicationName };
        const postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0].id;
    }

}
