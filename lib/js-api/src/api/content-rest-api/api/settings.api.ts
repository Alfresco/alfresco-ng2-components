/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

export class SettingsApi extends BaseApi {
    /**
     * Gets the published extension configuration from
     * the database
     * @param instanceId Unique ID for which configuration is to be fetched
     */
    getSavedExtensionState(instanceId: string): Promise<any> {
        throwIfNotDefined(instanceId, 'instanceId');

        const pathParams = {
            instanceId
        };

        return this.get({
            path: '/settings/{instanceId}',
            pathParams
        });
    }

    /**
     * Publish the extension configuration in the database
     * @param instanceId Unique ID for which configuration is to be published
     * @param extensionConfig Extension configuration that is to be saved
     */
    publishExtensionConfig(instanceId: string, extensionConfig: any): Promise<void> {
        throwIfNotDefined(instanceId, 'instanceId');
        throwIfNotDefined(extensionConfig, 'extensionConfig');

        const pathParams = {
            instanceId
        };

        return this.put({
            path: '/settings/{instanceId}',
            pathParams,
            bodyParam: extensionConfig
        });
    }
}
