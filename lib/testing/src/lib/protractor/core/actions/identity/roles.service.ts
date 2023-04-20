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

import { ApiService } from '../../../../shared/api/api.service';

export class RolesService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createRole(roleName: string): Promise<any> {
        const path = '/roles';
        const method = 'POST';
        const queryParams = {};
        const postBody = {
            name: roleName + 'TestRole'
        };

        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async deleteRole(roleId: string): Promise<any> {
        const path = `/roles-by-id/${roleId}`;
        const method = 'DELETE';
        const queryParams = {};
        const postBody = {};

        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }

    async getRoleIdByRoleName(roleName: string): Promise<string> {
        const path = `/roles`;
        const method = 'GET';
        const queryParams = {};
        const postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        for (const key in data) {
            if (data[key].name === roleName) {
                return data[key].id;
            }
        }
        return undefined;
    }

    async getClientRoleIdByRoleName(groupId: string, clientId: string, clientRoleName: string): Promise<any> {
        const path = `/groups/${groupId}/role-mappings/clients/${clientId}/available`;
        const method = 'GET';
        const queryParams = {};
        const postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        for (const key in data) {
            if (data[key].name === clientRoleName) {
                return data[key].id;
            }
        }
        return undefined;
    }

}
