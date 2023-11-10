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

import { BaseApi } from './base.api';
import { AuthorityClearanceGroupPaging, NodeSecurityMarkBody, SecurityMarkEntry, SecurityMarkPaging } from '../model';
import { GsPagingQuery } from './types';

/**
 * AuthorityClearanceApi service.
 * @module AuthorityClearanceApi
 */
export class AuthorityClearanceApi extends BaseApi {
    /**
     * Get the authority clearances for a single user/group
     *
     * @param authorityId The name for the authority for which the clearance is to be fetched. Can be left blank in which case it will fetch it for all users with pagination
     * @param opts
     * @return Promise<AuthorityClearanceGroupPaging>
     */
    getAuthorityClearanceForAuthority(authorityId: string, opts?: GsPagingQuery): Promise<AuthorityClearanceGroupPaging> {
        const pathParams = {
            authorityId
        };

        return this.get({
            path: '/cleared-authorities/{authorityId}/clearing-marks',
            pathParams,
            queryParams: opts,
            returnType: AuthorityClearanceGroupPaging
        });
    }

    /**
     * Updates the authority clearance.
     *
     * @param authorityId The name for the authority for which the clearance is to be updated
     * @param authorityClearance AuthorityClearanceBody
     * @return Promise<SecurityMarkEntry | SecurityMarkPaging>
     */
    updateAuthorityClearance(authorityId: string, authorityClearance: NodeSecurityMarkBody[]): Promise<SecurityMarkEntry | SecurityMarkPaging> {
        const pathParams = {
            authorityId
        };
        const returnType = authorityClearance.length > 1 ? SecurityMarkPaging : SecurityMarkEntry;

        return this.post({
            path: '/cleared-authorities/{authorityId}/clearing-marks',
            pathParams,
            bodyParam: authorityClearance,
            returnType
        });
    }
}
