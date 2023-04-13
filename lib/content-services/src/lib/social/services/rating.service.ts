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

import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { RatingEntry, RatingBody, RatingsApi } from '@alfresco/js-api';
import { from, throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RatingServiceInterface } from './rating.service.interface';

@Injectable({
    providedIn: 'root'
})
export class RatingService implements RatingServiceInterface {

    private _ratingsApi: RatingsApi;
    get ratingsApi(): RatingsApi {
        this._ratingsApi = this._ratingsApi ?? new RatingsApi(this.apiService.getInstance());
        return this._ratingsApi;
    }

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }

    /**
     * Gets the current user's rating for a node.
     *
     * @param nodeId Node to get the rating from
     * @param ratingType Type of rating (can be "likes" or "fiveStar")
     * @returns The rating value
     */
    getRating(nodeId: string, ratingType: any): Observable<RatingEntry | any> {
        return from(this.ratingsApi.getRating(nodeId, ratingType))
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Adds the current user's rating for a node.
     *
     * @param nodeId Target node for the rating
     * @param ratingType Type of rating (can be "likes" or "fiveStar")
     * @param vote Rating value (boolean for "likes", numeric 0..5 for "fiveStar")
     * @returns Details about the rating, including the new value
     */
    postRating(nodeId: string, ratingType: string, vote: any): Observable<RatingEntry | any> {
        const ratingBody: RatingBody = new RatingBody({
            id: ratingType,
            myRating: vote
        });
        return from(this.ratingsApi.createRating(nodeId, ratingBody))
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Removes the current user's rating for a node.
     *
     * @param nodeId Target node
     * @param ratingType Type of rating to remove (can be "likes" or "fiveStar")
     * @returns Null response indicating that the operation is complete
     */
    deleteRating(nodeId: string, ratingType: any): Observable<any> {
        return from(this.ratingsApi.deleteRating(nodeId, ratingType))
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: any): any {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
