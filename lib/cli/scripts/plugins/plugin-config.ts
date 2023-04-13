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

import { PluginInterface } from './plugin-model';
import { logger } from '../logger';

export class PluginConfiguration {
    constructor(
        private plugInInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {}

    async getAppConfig(url: string) {
        return this.callCustomApi(url);
    }

    async callCustomApi(url: string) {
        const pathParams = {};
        const headerParams = {};
        const formParams = {};
        const bodyParam = {};
        const queryParams = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        try {
            const response = await this.alfrescoJsApi.oauth2Auth.callCustomApi(
                url,
                'GET',
                pathParams,
                queryParams,
                headerParams,
                formParams,
                bodyParam,
                contentTypes,
                accepts
            );

            return response;
        } catch (error) {
            logger.error(
                `${this.plugInInfo.host} is not reachable error: `,
                error
            );
            return {};
        }
    }
}
