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
import { HoldPaging } from '../model/holdPaging';

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
     * Adds to existing hold
     *
     * @param holdId The identifier of a hold.
     * @param ids list of ids of holds to add to existing hold
     * @returns Promise<NodeChildAssociationPaging>
     */
    saveToExistingHolds(ids: string[], holdId: string): Promise<HoldPaging> {
        throwIfNotDefined(holdId, 'holdId');
        if (ids.length === 0) {
            throwIfNotDefined(null, 'holds to save');
        }

        return this.post({
            path: `/holds/{holdId}/children`,
            pathParams: { holdId },
            bodyParam: ids.map((id) => ({
                id
            })),
            returnType: HoldPaging
        });
    }

    /**
     * Deletes the relationship between a child with id holdChildId and a parent hold with id holdId.
     *
     * @param holdId The handled hold Id
     * @param holdChildId The Id of the child hold which is deleted
     * @returns Empty response
     */
    deleteFromExistingHold(holdId: string, holdChildId: string): Promise<undefined> {
        throwIfNotDefined(holdId, 'holdId');
        throwIfNotDefined(holdChildId, 'holdChildId');

        return this.delete({
            path: `/holds/{holdId}/children/{holdChildId}`,
            pathParams: { holdId, holdChildId },
            returnType: undefined
        });
    }
}
