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

import { PersonNetworkEntry } from '../model/personNetworkEntry';
import { PersonNetworkPaging } from '../model/personNetworkPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentPagingQuery } from './types';

/**
* Networks service.
* @module NetworksApi
*/
export class NetworksApi extends BaseApi {
    /**
    * Get a network
    *
    * @param networkId The identifier of a network.
    * @param opts Optional parameters
    * @return Promise<PersonNetworkEntry>
    */
    getNetwork(networkId: string, opts?: ContentFieldsQuery): Promise<PersonNetworkEntry> {
        throwIfNotDefined(networkId, 'networkId');

        const pathParams = {
            networkId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/networks/{networkId}',
            pathParams,
            queryParams,
            returnType: PersonNetworkEntry
        });
    }
/**
    * Get network information
    *
    * You can use the -me- string in place of <personId> to specify the currently authenticated user.
    *
    * @param personId The identifier of a person.
    * @param networkId The identifier of a network.
    * @param opts Optional parameters
    * @return Promise<PersonNetworkEntry>
    */
    getNetworkForPerson(personId: string, networkId: string, opts?: ContentFieldsQuery): Promise<PersonNetworkEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(networkId, 'networkId');

        const pathParams = {
            personId,
            networkId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/networks/{networkId}',
            pathParams,
            queryParams,
            returnType: PersonNetworkEntry
        });
    }
/**
    * List network membership
    *
    * Gets a list of network memberships for person **personId**.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

    *
    * @param personId The identifier of a person.
    * @param opts Optional parameters
    * @return Promise<PersonNetworkPaging>
    */
    listNetworksForPerson(personId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<PersonNetworkPaging> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/networks',
            pathParams,
            queryParams,
            returnType: PersonNetworkPaging
        });
    }
}
