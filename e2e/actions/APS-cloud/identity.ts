/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import Util = require('../../util/util');

export class Identity {

  api: ApiService = new ApiService();

  constructor() {
  }

  async init(username, password) {
    await this.api.login(username, password);
  }

  async createIdentityUser(username = Util.generateRandomString(5), password = Util.generateRandomString(5)) {
    await this.createUser(username);
    const user = await this.getUserInfoByUsername(username);
    await this.resetPassword(user[0].id, password);
    user[0].password = password;
    // todo: this will be uncomment when the get role by name will be fixed
    // const roleName = 'identity';
    // const role = await this.getRoleByName(roleName);
    // await this.assignRole(user[0].id, role.id, roleName);
    return user;
  }

  async deleteIdentityUser(userId) {
    await this.deleteUser(userId);
  }

  async createUser(username) {
    const path = '/auth/admin/realms/springboot/users';
    const method = 'POST';
    const queryParams = {}, postBody = {
      'username': username,
      'firstName':  username,
      'lastName': 'LastName',
      'enabled': true,
      'email': username + '@alfresco.com'
    };
    const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
    return data;
  }

  async deleteUser(userId) {
    const path = `/auth/admin/realms/springboot/users/${userId}`;
    const method = 'DELETE';
    const queryParams = {}, postBody = {
    };
    const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
    return data;
  }

  async getUserInfoByUsername(username) {
    const path = `/auth/admin/realms/springboot/users`;
    const method = 'GET';
    const queryParams = { 'username' : username }, postBody = {};

    const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
    return data;
  }

  async resetPassword(id, password) {
    const path = `/auth/admin/realms/springboot/users/${id}/reset-password`;
    const method = 'PUT';
    const queryParams = {},
    postBody = {'type': 'password', 'value': password, 'temporary': false};

    const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
    return data;
  }

  async getRoleByName(roleName) {
    const path = `/auth/admin/realms/springboot/roles/${roleName}`;
    const method = 'GET';
    const queryParams = {},
    postBody = {};

    const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
    return data;
  }

  async assignRole(userId, roleId, roleName) {
    const path = `/auth/admin/realms/springboot/users/${userId}/role-mappings/realm`;
    const method = 'POST';
    const queryParams = {},
    postBody = [{'id': roleId, 'name': roleName}];

    const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
    return data;
  }

}
