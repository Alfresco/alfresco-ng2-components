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

import { PredictionService } from './prediction.service';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TestBed } from '@angular/core/testing';
import { Prediction, PredictionEntry, PredictionPaging, PredictionPagingList, ReviewStatus } from '@alfresco/js-api';

describe('PredictionService', () => {
    let service: PredictionService;

    const mockPredictionPaging = (): PredictionPaging => {
        const prediction = new Prediction();
        prediction.id = 'test id';
        const predictionEntry = new PredictionEntry({ entry: prediction });
        const predictionPagingList = new PredictionPagingList({ entries: [predictionEntry] });
        return new PredictionPaging({ list: predictionPagingList });
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        service = TestBed.inject(PredictionService);
    });

    it('should call getPredictions on PredictionsApi with nodeId', () => {
        spyOn(service.predictionsApi, 'getPredictions').and.returnValue(Promise.resolve(mockPredictionPaging()));

        service.getPredictions('test id');
        expect(service.predictionsApi.getPredictions).toHaveBeenCalledWith('test id');
    });

    it('should call reviewPrediction on PredictionsApi with predictionId and reviewStatus', () => {
        spyOn(service.predictionsApi, 'reviewPrediction').and.returnValue(Promise.resolve());

        service.reviewPrediction('test id', ReviewStatus.CONFIRMED);
        expect(service.predictionsApi.reviewPrediction).toHaveBeenCalledWith('test id', ReviewStatus.CONFIRMED);
    });
});
