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

import { NodeEntry } from '@alfresco/js-api';
import { E2eRequestApiHelper } from './e2e-request-api.helper';
import { Api } from './api';
import { UtilApi } from './utilapi';
import { Logger } from '../utils/logger';

export class Descriptor {
  requestApiHelper: E2eRequestApiHelper;
  endPoint = `/v1/descriptors/`;

  constructor(api: Api) {
    this.requestApiHelper = new E2eRequestApiHelper(api);
  }

  async create(model: any): Promise<void> {
    try {
      await this.requestApiHelper.post<NodeEntry>(this.endPoint, {
        bodyParam: model
      });
      Logger.info(`[Descriptor] Descriptor has been created with name: ${model.name}.`);
    } catch (error) {
      Logger.error(`[Descriptor] Create descriptor ${model.name} failed with message: ${error.message}`);
      throw error;
    }
  }

  async delete(name: string): Promise<void> {
    try {
      await this.retryUntilDescriptorIsInStatus(name, `DescriptorCreated`);
      await this.requestApiHelper.delete(`${this.endPoint}${name}`);
      Logger.info(`[Descriptor] Descriptor '${name}' was deleted successfully.`);
    } catch (error) {
      Logger.error(`[Descriptor] Delete descriptor ${name} failed with message: ${error.message}`);
    }
  }

  async get(name: string): Promise<any> {
    Logger.info(`[Descriptor] Get descriptor ${name} details.`);
    try {
      return this.requestApiHelper.get<any>(`${this.endPoint}${name}`);
    } catch (error) {
      Logger.error(`[Descriptor] Get descriptor ${name} details failed with message: ${error.message}`);
    }
  }

  async retryUntilDescriptorIsInStatus(name: string, expectedStatus: string): Promise<any> {
    const predicate = (result: { status: string }) => {
      return result.status === expectedStatus;
    };
    const apiCall = async () => this.get(name);

    return UtilApi.waitForApi(apiCall, predicate);
  }
}
