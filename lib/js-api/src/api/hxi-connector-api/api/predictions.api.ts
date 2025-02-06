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
import { PredictionPaging, ReviewStatus } from '../model';

export class PredictionsApi extends BaseApi {
    /**
     * List of predictions for a node
     * @param nodeId The identifier of a node.
     * @returns Promise<PredictionPaging>
     */
    getPredictions(nodeId: string): Promise<PredictionPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        return this.get({
            path: '/nodes/{nodeId}/predictions',
            pathParams,
            returnType: PredictionPaging
        });
    }

    /**
     * Confirm or reject a prediction
     * @param predictionId The identifier of a prediction.
     * @param reviewStatus New status to apply for prediction. Can be either 'confirmed' or 'rejected'.
     * @returns Promise<void>
     */
    reviewPrediction(predictionId: string, reviewStatus: ReviewStatus): Promise<void> {
        throwIfNotDefined(predictionId, 'predictionId');
        throwIfNotDefined(reviewStatus, 'reviewStatus');

        const pathParams = {
            predictionId,
            reviewStatus
        };

        return this.post({
            path: '/predictions/{predictionId}/review',
            pathParams,
            returnType: Promise<void>
        });
    }
}
