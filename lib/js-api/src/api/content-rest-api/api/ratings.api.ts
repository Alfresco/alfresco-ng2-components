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

import { RatingBody } from '../model/ratingBody';
import { RatingEntry } from '../model/ratingEntry';
import { RatingPaging } from '../model/ratingPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentPagingQuery } from './types';

/**
 * Ratings service.
 * @module RatingsApi
 */
export class RatingsApi extends BaseApi {
    /**
     * Create a rating
     *
     * @param nodeId The identifier of a node.
     * @param ratingBodyCreate For \"myRating\" the type is specific to the rating scheme, boolean for the likes and an integer for the fiveStar.
     * For example, to \"like\" a file the following body would be used:
     *
     *JSON
     *{
     * \"id\": \"likes\",
     * \"myRating\": true
     * }
     * @param opts Optional parameters
     * @return Promise<RatingEntry>
     */
    createRating(nodeId: string, ratingBodyCreate: RatingBody, opts?: ContentFieldsQuery): Promise<RatingEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(ratingBodyCreate, 'ratingBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/ratings',
            pathParams,
            queryParams,
            bodyParam: ratingBodyCreate,
            returnType: RatingEntry
        });
    }

    /**
     * Delete a rating
     *
     * Deletes rating **ratingId** from node **nodeId**.
     *
     * @param nodeId The identifier of a node.
     * @param ratingId The identifier of a rating.
     * @return Promise<{}>
     */
    deleteRating(nodeId: string, ratingId: string): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(ratingId, 'ratingId');

        const pathParams = {
            nodeId,
            ratingId
        };

        return this.delete({
            path: '/nodes/{nodeId}/ratings/{ratingId}',
            pathParams
        });
    }

    /**
     * Get a rating
     *
     * Get the specific rating **ratingId** on node **nodeId**.
     *
     * @param nodeId The identifier of a node.
     * @param ratingId The identifier of a rating.
     * @param opts Optional parameters
     * @return Promise<RatingEntry>
     */
    getRating(nodeId: string, ratingId: string, opts?: ContentFieldsQuery): Promise<RatingEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(ratingId, 'ratingId');

        const pathParams = {
            nodeId,
            ratingId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/ratings/{ratingId}',
            pathParams,
            queryParams,
            returnType: RatingEntry
        });
    }

    /**
     * List ratings
     *
     * Gets a list of ratings for node **nodeId**.
     *
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @return Promise<RatingPaging>
     */
    listRatings(nodeId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<RatingPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/ratings',
            pathParams,
            queryParams,
            returnType: RatingPaging
        });
    }
}
