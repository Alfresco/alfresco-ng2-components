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

import { PersonModel, Person } from './people-api-models';
import { Api } from './api';
import { PeopleApi as AdfPeopleApi } from '@alfresco/js-api';

export class PeopleApi extends Api {
  peopleApi = new AdfPeopleApi(this.alfrescoJsApi);

  constructor(username: string, password: string) {
    super(username, password);
  }

  async createUser(user: PersonModel) {
    try {
      const person = new Person(user);
      await this.apiLogin();
      return await this.peopleApi.createPerson(person);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createUser.name}`, error);
      return null;
    }
  }

  async getUser(username: string) {
    try {
      await this.apiLogin();
      return await this.peopleApi.getPerson(username);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getUser.name}`, error);
      return null;
    }
  }

  async updateUser(username: string, userDetails?: PersonModel) {
    try {
      await this.apiLogin();
      return this.peopleApi.updatePerson(username, userDetails);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.updateUser.name}`, error);
      return null;
    }
  }

  async disableUser(username: string) {
    try {
      return await this.updateUser(username, { enabled: false });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.disableUser.name}`, error);
      return null;
    }
  }

  async changePassword(username: string, newPassword: string) {
    try {
      return await this.updateUser(username, { password: newPassword });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.changePassword.name}`, error);
      return null;
    }
  }
}
