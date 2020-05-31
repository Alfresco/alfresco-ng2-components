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

import { GenericApi } from './generic-api';
import { Logger } from '../../../core/utils/logger';
import { ApiUtil } from '../../../core/structure/api.util';
import { TrashcanApi as TrashcanJsApi, AlfrescoApi, NodeEntry, DeletedNodesPaging } from '@alfresco/js-api';

export class TrashcanApi extends GenericApi {
  trashcanApi: TrashcanJsApi;

  constructor(username: string, password: string, alfrescoJsApi: AlfrescoApi) {
    super(username, password, alfrescoJsApi);
    this.trashcanApi = new TrashcanJsApi(alfrescoJsApi);
  }

  async permanentlyDelete(id: string): Promise<any> {
    try {
      await this.login();
      return await this.trashcanApi.deleteDeletedNode(id);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.permanentlyDelete.name}`, error);
    }
  }

  async restore(id: string): Promise<NodeEntry> {
    try {
      await this.login();
      return await this.trashcanApi.restoreDeletedNode(id);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.restore.name}`, error);
      return null;
    }
  }

  async getDeletedNodes(): Promise<DeletedNodesPaging> {
    const opts = {
        maxItems: 1000
    };
    try {
      await this.login();
      return await this.trashcanApi.listDeletedNodes(opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getDeletedNodes.name}`, error);
      return null;
    }
  }

  async emptyTrash(): Promise<any> {
    try {
      const ids = (await this.getDeletedNodes()).list.entries.map(entries => entries.entry.id);

      return await ids.reduce(async (previous, current) => {
          await previous;
          return this.permanentlyDelete(current);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.emptyTrash.name}`, error);
    }
  }

  async waitForApi(data: { expect: number }): Promise<any> {
    try {
      const deletedFiles = async () => {
        const totalItems = (await this.getDeletedNodes()).list.pagination.totalItems;
        if ( totalItems !== data.expect) {
            return Promise.reject(totalItems);
        } else {
            return Promise.resolve(totalItems);
        }
      };

      return await ApiUtil.retryCall(deletedFiles);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.waitForApi.name} catch: `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
