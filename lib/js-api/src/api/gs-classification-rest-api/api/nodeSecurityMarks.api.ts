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
import { NodeSecurityMarkBody } from '../model/nodeSecurityMarkBody';
import { SecurityMarkPaging } from '../model/securityMarkPaging';
import { GsPagingQuery } from './types';

/**
 * @module NodeSecurityMarksApi
 */
export class NodeSecurityMarksApi extends BaseApi {
    /**
     * Add/Remove security mark on a node
     *
     * @param nodeId The key for the node id.
     * @param dataBody Array of NodeSecurityMarkBody.
     * @return Promise<SecurityMarkPaging>
     */
    manageSecurityMarksOnNode(nodeId: string, dataBody: Array<NodeSecurityMarkBody>): Promise<SecurityMarkPaging> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(dataBody, 'dataBody');

        const pathParams = {
            nodeId
        };

        return this.post({
            path: '/secured-nodes/{nodeId}/securing-marks',
            pathParams,
            bodyParam: dataBody,
            returnType: SecurityMarkPaging
        });
    }

    /**
     * Get security marks on a node
     *
     * @param nodeId The key for the node id.
     * @param opts Optional parameters
     * @return Promise<SecurityMarkPaging>
     */
    getSecurityMarksOnNode(nodeId: string, opts?: GsPagingQuery): Promise<SecurityMarkPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        return this.get({
            path: '/secured-nodes/{nodeId}/securing-marks',
            pathParams,
            queryParams: opts,
            returnType: SecurityMarkPaging
        });
    }
}
