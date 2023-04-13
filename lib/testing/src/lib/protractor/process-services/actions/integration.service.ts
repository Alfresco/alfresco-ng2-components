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

import { ApiService } from '../../../shared/api/api.service';
import { E2eRequestApiHelper } from '../../../shared/api/e2e-request-api.helper';
import { Logger } from '../../core/utils/logger';

export class IntegrationService {
    api: ApiService;
    requestApiHelper: E2eRequestApiHelper;

    constructor(apiService: ApiService) {
        this.api = apiService;
        this.requestApiHelper = new E2eRequestApiHelper(apiService);
    }

    async addCSIntegration({ name, tenantId, host }): Promise<void> {
        const repository = {
            name,
            tenantId,
            alfrescoTenantId: '',
            repositoryUrl: `${host}/alfresco`,
            shareUrl: `${host}/share`,
            version: '6.1.1',
            authenticationType: 'basic'
        };

        try {
            await this.requestApiHelper.post('activiti-app/app/rest/integration/alfresco', { bodyParam: repository });
        } catch (e) {
            Logger.error(e);
        }
    }

    async authenticateRepository(id: number, body: { username: string; password: string }): Promise<any> {
        await this.requestApiHelper.post(`activiti-app/app/rest/integration/alfresco/${id}/account`, { bodyParam: body });
    }
}
