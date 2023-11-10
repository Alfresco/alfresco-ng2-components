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

import { ProbeEntry } from '../model/probeEntry';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
* Probes service.
* @module ProbesApi
*/
export class ProbesApi extends BaseApi {
    /**
    * Check readiness and liveness of the repository
    *
    * **Note:** this endpoint is available in Alfresco 6.0 and newer versions.

Returns a status of 200 to indicate success and 503 for failure.

The readiness probe is normally only used to check repository startup.

The liveness probe should then be used to check the repository is still responding to requests.

**Note:** No authentication is required to call this endpoint.

    *
    * @param probeId The name of the probe:
* -ready-
* -live-

    * @return Promise<ProbeEntry>
    */
    getProbe(probeId: string): Promise<ProbeEntry> {
        throwIfNotDefined(probeId, 'probeId');

        const pathParams = {
            probeId
        };

        return this.get({
            path: '/probes/{probeId}',
            pathParams,
            returnType: ProbeEntry
        });
    }
}
