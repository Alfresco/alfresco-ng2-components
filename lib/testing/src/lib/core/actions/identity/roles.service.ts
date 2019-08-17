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

export class RolesService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getRoleIdByRoleName(roleName): Promise<any> {
        const path = `/roles`;
        const method = 'GET';
        let roleId;
        const queryParams = {}, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        for (const key in data) {
            if (data[key].name === roleName) {
                roleId = data[key].id;
            }
        }
        return roleId;
    }

    async getClientRoleIdByRoleName(groupId, clientId, clientRoleName): Promise<any> {
        const path = `/groups/${groupId}/role-mappings/clients/${clientId}/available`;
        const method = 'GET';
        let clientRoleId;
        const queryParams = {}, postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        for (const key in data) {
            if (data[key].name === clientRoleName) {
                clientRoleId = data[key].id;
            }
        }
        return clientRoleId;
    }

}
