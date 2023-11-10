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

import { DiscoveryEntry } from '../model/discoveryEntry';
import { BaseApi } from './base.api';

/**
* Discovery service.
* @module DiscoveryApi
*/
export class DiscoveryApi extends BaseApi {
    /**
    * Get repository information
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Retrieves the capabilities and detailed version information from the repository.

    *
    * @return Promise<DiscoveryEntry>
    */
    getRepositoryInformation(): Promise<DiscoveryEntry> {
        return this.get({
            path: '/discovery',
            returnType: DiscoveryEntry
        });
    }
}
