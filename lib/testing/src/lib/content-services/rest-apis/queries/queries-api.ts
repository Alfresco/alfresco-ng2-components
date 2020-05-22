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

import { RepoApi } from '../repo-api';
import { Logger } from '../../../core/utils/logger';
import { ApiUtil } from '../../../core/structure/api.util';
import { QueriesApi as AdfQueriesApi } from '@alfresco/js-api';

export class QueriesApi extends RepoApi {
  queriesApi = new AdfQueriesApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async findSites(searchTerm: string) {
    const data = {
        term: searchTerm,
        fields: ['title']
    };

    try {
      await this.apiAuth();
      return this.queriesApi.findSites(searchTerm, data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.findSites.name}`, error);
      return null;
    }
  }

  async findNodes(searchTerm: string) {
    const data = {
      term: searchTerm,
      fields: ['name']
    };

    try {
      await this.apiAuth();
      return this.queriesApi.findNodes(searchTerm, data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.findNodes.name}`, error);
      return null;
    }
  }

  async waitForSites(searchTerm: string, data: { expect: number }) {
    try {
      const sites = async () => {
        const totalItems = (await this.findSites(searchTerm)).list.pagination.totalItems;
        if ( totalItems !== data.expect ) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await ApiUtil.retryCall(sites);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.waitForSites.name} catch: `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }

  async waitForFilesAndFolders(searchTerm: string, data: { expect: number }) {
    try {
      const nodes = async () => {
        const totalItems = (await this.findNodes(searchTerm)).list.pagination.totalItems;
        if ( totalItems !== data.expect ) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await ApiUtil.retryCall(nodes);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.waitForFilesAndFolders.name} catch: `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
