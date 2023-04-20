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

import { NodeEntry } from '@alfresco/js-api';
import { E2eRequestApiHelper } from '../../../shared/api/e2e-request-api.helper';
import { ApplicationRepresentation } from '../../core/models/application-model';
import { Logger } from '../../core/utils/logger';
import { ApiUtil } from '../../../shared/api/api.util';
import { ApiService } from '../../../shared/api/api.service';

export class Descriptor {

    requestApiHelper: E2eRequestApiHelper;
    endPoint = `deployment-service/v1/descriptors/`;

    constructor(api: ApiService) {
        this.requestApiHelper = new E2eRequestApiHelper(api);
    }

    async create(model: ApplicationRepresentation): Promise<void> {
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
        const isDescriptorDeleted = (response: any) => {
            if (JSON.stringify(response) === '{}') {
                Logger.info(`[Descriptor] Descriptor was deleted successfully`);
                return true;
            } else {
                Logger.warn(`[Descriptor] Descriptor was not deleted`);
                return false;
            }
        };

        const apiCall = async () => {
            try {
                await this.retryUntilDescriptorIsInStatus(name, `DescriptorCreated`);
                Logger.info(`[Descriptor] Deleting descriptor ${name} ...`);
                return this.requestApiHelper.delete(`${this.endPoint}${name}`);
            } catch (error) {
                Logger.error(`[Descriptor] Delete descriptor ${name} failed with error: ${error.message}`);
            }
        };
        return ApiUtil.waitForApi(apiCall, isDescriptorDeleted, 10, 15000);
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
            Logger.info(`[Descriptor] Descriptor ${name} status is: ${result.status}`);
            return result.status === expectedStatus;
        };

        const apiCall = async () => this.get(name);

        return ApiUtil.waitForApi(apiCall, predicate);
    }
}
