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
import { throwIfNotDefined } from '../../../assert';
import { SecurityMarkEntry } from '../model/securityMarkEntry';
import { SecurityMarkBody } from '../model/securityMarkBody';
import { SecurityMarkPaging } from '../model/securityMarkPaging';
import { GsPagingQuery } from './types';

/**
 * Security Marks API.
 * @module SecurityMarksApi
 */
export class SecurityMarksApi extends BaseApi {
    /**
     * Get security mark value
     *
     * @param securityGroupId The key for the security group id.
     * @param opts Options
     * @return Promise<SecurityMarkPaging>
     */
    getSecurityMarks(securityGroupId: string, opts?: GsPagingQuery): Promise<SecurityMarkPaging> {
        throwIfNotDefined(securityGroupId, 'securityGroupId');

        const pathParams = {
            securityGroupId
        };

        return this.get({
            path: '/security-groups/{securityGroupId}/security-marks',
            pathParams,
            queryParams: opts,
            returnType: SecurityMarkPaging
        });
    }

    /**
     * Create security marks
     *
     * @param securityGroupId The key for the security group id.
     * @param securityMarkBody securityMarkBody[].
     * @return Promise<SecurityMarkEntry|SecurityMarkPaging>
     */
    createSecurityMarks(securityGroupId: string, securityMarkBody: SecurityMarkBody[]): Promise<SecurityMarkPaging | SecurityMarkEntry> {
        throwIfNotDefined(securityGroupId, 'securityGroupId');
        throwIfNotDefined(securityMarkBody, 'securityMarkBody');

        const pathParams = { securityGroupId };
        const returnType = securityMarkBody.length > 1 ? SecurityMarkPaging : SecurityMarkEntry;

        return this.post({
            path: '/security-groups/{securityGroupId}/security-marks',
            pathParams,
            bodyParam: securityMarkBody,
            returnType
        });
    }

    /**
     * Get security mark value information
     *
     * @param securityGroupId The key for the security group id.
     * @param securityMarkId The key for the security mark id
     * @return Promise<SecurityMarkEntry>
     */
    getSecurityMark(securityGroupId: string, securityMarkId: string): Promise<SecurityMarkEntry> {
        throwIfNotDefined(securityGroupId, 'securityGroupId');
        throwIfNotDefined(securityMarkId, 'securityMarkId');

        const pathParams = {
            securityGroupId,
            securityMarkId
        };

        return this.get({
            path: '/security-groups/{securityGroupId}/security-marks/{securityMarkId}',
            pathParams,
            returnType: SecurityMarkEntry
        });
    }

    /**
     * Updates Security Mark value
     *
     * @param securityGroupId The key for the security group id.
     * @param securityMarkId The key for the security mark is in use or not.
     * @param securityMarkBody securityMarkBody.
     * @return Promise<SecurityMarkEntry>
     */
    updateSecurityMark(securityGroupId: string, securityMarkId: string, securityMarkBody: SecurityMarkBody): Promise<SecurityMarkEntry> {
        throwIfNotDefined(securityGroupId, 'securityGroupId');
        throwIfNotDefined(securityMarkId, 'securityMarkId');
        throwIfNotDefined(securityMarkBody, 'securityMarkBody');

        const pathParams = {
            securityGroupId,
            securityMarkId
        };

        return this.put({
            path: '/security-groups/{securityGroupId}/security-marks/{securityMarkId}',
            pathParams,
            bodyParam: securityMarkBody,
            returnType: SecurityMarkEntry
        });
    }

    /**
     * Delete security mark
     *
     * @param securityGroupId The key for the security group id.
     * @param securityMarkId The key for the security mark id.
     * @return Promise<any>
     */
    deleteSecurityMark(securityGroupId: string, securityMarkId: string): Promise<SecurityMarkEntry> {
        throwIfNotDefined(securityGroupId, 'securityGroupId');
        throwIfNotDefined(securityMarkId, 'securityMarkId');

        const pathParams = {
            securityGroupId,
            securityMarkId
        };

        return this.delete({
            path: '/security-groups/{securityGroupId}/security-marks/{securityMarkId}',
            pathParams
        });
    }
}
