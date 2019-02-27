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

export class Identity {

  api: ApiService = new ApiService();

  constructor(appConfig: AppConfigService) {
  }

  async init(username, password) {
    await this.api.login(username, password);
  }

  async createIdentityUser(username = Util.generateRandomString(5), password = Util.generateRandomString(5)) {
    await this.createUser(username);
    const user = await this.getUserInfoByUsername(username);
    await this.resetPassword(user.id, password);
    user.password = password;
    return user;
  }

  async deleteIdentityUser(userId) {
    await this.deleteUser(userId);
  }

  async createUser(username) {
    const path = '/users';
    const method = 'POST';
    const queryParams = {}, postBody = {
      'username': username,
      'firstName':  username,
      'lastName': 'LastName',
      'enabled': true,
      'email': username + '@alfresco.com'
    };
    const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
    return data;
  }

  async deleteUser(userId) {
    const path = `/users/${userId}`;
    const method = 'DELETE';
    const queryParams = {}, postBody = {
    };
    const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
    return data;
  }

  async getUserInfoByUsername(username) {
    const path = `/users`;
    const method = 'GET';
    const queryParams = { 'username' : username }, postBody = {};

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
