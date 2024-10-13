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

import { Injectable } from '@angular/core';
import { PredictionsApi, PredictionPaging, ReviewStatus } from '@alfresco/js-api';
import { from, Observable } from 'rxjs';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({ providedIn: 'root' })
export class PredictionService {
    private _predictionsApi: PredictionsApi;

    get predictionsApi(): PredictionsApi {
        this._predictionsApi = this._predictionsApi ?? new PredictionsApi(this.apiService.getInstance());
        return this._predictionsApi;
    }

    constructor(private apiService: AlfrescoApiService) {}

    /**
     * Get predictions for a given node
     * @param nodeId The identifier of node.
     * @returns Observable<PredictionPaging>
     */
    getPredictions(nodeId: string): Observable<PredictionPaging> {
        return from(this.predictionsApi.getPredictions(nodeId));
    }

    /**
     * Review a prediction
     * @param predictionId The identifier of prediction.
     * @param reviewStatus Review status to apply.
     * @returns Observable<void>
     */
    reviewPrediction(predictionId: string, reviewStatus: ReviewStatus): Observable<void> {
        return from(this.predictionsApi.reviewPrediction(predictionId, reviewStatus));
    }
}
