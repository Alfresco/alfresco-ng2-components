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

import { Injectable } from '@angular/core';
import { RatingEntry } from '@alfresco/js-api';
import { Observable, of } from 'rxjs';
import { ratingOneMock, ratingThreeMock } from './rating-response.mock';
import { RatingServiceInterface } from '../services/rating.service.interface';

@Injectable({
    providedIn: 'root'
})
export class RatingServiceMock implements RatingServiceInterface {

    getRating(nodeId: string, _ratingType: any): Observable<RatingEntry | any> {
        if (nodeId === 'fake-like-node-id') {
            return of(ratingOneMock);
        }

        return of(ratingThreeMock);
    }

    postRating(nodeId: string, _ratingType: string, _vote: any): Observable<RatingEntry | any> {
        if (nodeId === 'ratingOneMock') {
            ratingOneMock.entry.aggregate.numberOfRatings = 1;
            ratingOneMock.entry.aggregate.average = 1.0;
            return of(ratingOneMock);
        }

        ratingThreeMock.entry.aggregate.numberOfRatings = 1;
        ratingThreeMock.entry.aggregate.average = 1.0;
        return of(ratingThreeMock);
    }

    deleteRating(nodeId: string, _ratingType: any): Observable<any> {
        if (nodeId === 'ratingOneMock') {
            ratingOneMock.entry.aggregate.numberOfRatings = 0;
            ratingOneMock.entry.aggregate.average = 0;
            return of(ratingOneMock);
        }

        ratingThreeMock.entry.aggregate.numberOfRatings = 0;
        ratingThreeMock.entry.aggregate.average = 0;
        return of(ratingThreeMock);
    }
}
