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

import { E2eRequestApiHelper } from './e2e-request-api.helper';
import { Api } from './api';
import { Logger } from '../utils/logger';
import { ResultSetPaging } from '@alfresco/js-api';

export class Application {

  requestApiHelper: E2eRequestApiHelper;
  endPoint = `/v1/applications/`;

  constructor(api: Api) {
    this.requestApiHelper = new E2eRequestApiHelper(api);
  }

  async deploy(model: any): Promise<any> {
      await this.requestApiHelper.post(`${this.endPoint}`, { bodyParam: model});
      Logger.info(`[Application] Application '${model.name}' was deployed successfully.`);
  }

  async delete(applicationId: string): Promise<void> {
    await this.requestApiHelper.delete(`${this.endPoint}${applicationId}`);
    Logger.info(`[Application] Application: '${applicationId}' was deleted successfully.`);
  }

  async deleteDescriptor(name: string): Promise<void> {
    await this.requestApiHelper.delete(`v1/descriptors/${name}`);
    Logger.info(`[Descriptor] Descriptor: '${name}' was deleted successfully.`);
  }

  async getDescriptors(): Promise<ResultSetPaging> {
    Logger.info(`[Descriptor] Return descriptors`);
    return this.requestApiHelper.get<ResultSetPaging>(`v1/descriptors`, {});
  }

  async getApplicationsByStatus(status: string): Promise<ResultSetPaging> {
    Logger.info(`[Application] Return application by status: ${status}`);
    return this.requestApiHelper.get<ResultSetPaging>(this.endPoint, {
      queryParams: { status: status }
    });
  }
}
