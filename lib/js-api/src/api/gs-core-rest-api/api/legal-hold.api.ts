/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ContentPagingQuery } from '../../content-rest-api';
import { HoldBody, HoldEntry, HoldPaging } from './../model';
import { BulkAssignHoldResponse } from '../model/bulkAssignHoldResponse';
import { RequestQuery } from '../../search-rest-api';

/**
 * Legal Holds service.
 *
 * @module LegalHoldApi
 */
export class LegalHoldApi extends BaseApi {
    /**
     * List of legal holds
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param options Optional parameters
     * @returns Promise<HoldPaging>
     */
    getHolds(filePlanId = '-filePlan-', options?: ContentPagingQuery): Promise<HoldPaging> {
        throwIfNotDefined(filePlanId, 'filePlanId');

        const pathParams = {
            filePlanId
        };

        const queryParams = {
            skipCount: options?.skipCount,
            maxItems: options?.maxItems
        };

        return this.get({
            path: '/file-plans/{filePlanId}/holds',
            pathParams,
            queryParams,
            returnType: HoldPaging
        });
    }

    /**
     * Assign node to legal hold
     *
     * @param holdId The identifier of a hold
     * @param nodeId The id of the node to be assigned to existing hold
     * @returns Promise<HoldEntry>
     */
    assignHold(nodeId: string, holdId: string): Promise<HoldEntry> {
        throwIfNotDefined(holdId, 'holdId');
        throwIfNotDefined(nodeId, 'nodeId');

        return this.post({
            path: `/holds/{holdId}/children`,
            pathParams: { holdId },
            bodyParam: [{ id: nodeId }],
            returnType: HoldEntry
        });
    }

    /**
     * Assign nodes to legal hold
     *
     * @param holdId The identifier of a hold
     * @param nodeIds The list with id of nodes to assign to existing hold
     * @returns Promise<HoldPaging>
     */
    assignHolds(nodeIds: { id: string }[], holdId: string): Promise<HoldPaging> {
        throwIfNotDefined(holdId, 'holdId');
        throwIfNotDefined(nodeIds, 'nodeIds');

        return this.post({
            path: `/holds/{holdId}/children`,
            pathParams: { holdId },
            bodyParam: nodeIds,
            returnType: HoldPaging
        });
    }

    /**
     * Deletes the relationship between a child with id nodeId and a parent hold with id holdId
     *
     * @param holdId The identifier of a hold
     * @param nodeId The Id of the node which is unassigned
     * @returns Empty response
     */
    unassignHold(holdId: string, nodeId: string): Promise<void> {
        throwIfNotDefined(holdId, 'holdId');
        throwIfNotDefined(nodeId, 'nodeId');

        return this.delete({
            path: `/holds/{holdId}/children/{nodeId}`,
            pathParams: { holdId, nodeId }
        });
    }

    /**
     * Create new hold
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param hold Hold to create
     * @returns Promise<HoldEntry>
     */
    createHold(filePlanId: string, hold: HoldBody): Promise<HoldEntry> {
        throwIfNotDefined(filePlanId, 'filePlanId');
        throwIfNotDefined(hold, 'hold');

        const pathParams = {
            filePlanId
        };

        return this.post({
            path: '/file-plans/{filePlanId}/holds',
            pathParams,
            bodyParam: [hold],
            returnType: HoldEntry
        });
    }

    /**
     * Create list of new holds
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param holds Array of holds
     * @returns Promise<HoldPaging>
     */
    createHolds(filePlanId = '-filePlan-', holds: HoldBody[]): Promise<HoldPaging> {
        throwIfNotDefined(filePlanId, 'filePlanId');
        throwIfNotDefined(holds, 'holds');

        const pathParams = {
            filePlanId
        };

        return this.post({
            path: '/file-plans/{filePlanId}/holds',
            pathParams,
            bodyParam: holds,
            returnType: HoldPaging
        });
    }

    /**
     * Start the asynchronous bulk process for a hold with id holdId based on search query results.
     *
     * @param holdId The identifier of a hold
     * @param query Search query
     * @returns Promise<BulkAssignHoldResponse>
     */
    bulkAssignHold(holdId: string, query: RequestQuery): Promise<BulkAssignHoldResponse> {
        throwIfNotDefined(holdId, 'holdId');
        throwIfNotDefined(query, 'query');

        return this.post({
            path: `/holds/{holdId}/bulk`,
            pathParams: { holdId },
            bodyParam: {
                query,
                op: 'ADD'
            }
        });
    }
}
