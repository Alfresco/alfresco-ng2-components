/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { RatingEntry, RatingBody } from '@alfresco/js-api';
import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class RatingService {

    constructor(private apiService: AlfrescoApiService) {
    }

    /**
     * Gets the current user's rating for a node.
     * @param nodeId Node to get the rating from
     * @param ratingType Type of rating (can be "likes" or "fiveStar")
     * @returns The rating value
     */
    getRating(nodeId: string, ratingType: any): Observable<RatingEntry | {}> {
        return from(this.apiService.getInstance().core.ratingsApi.getRating(nodeId, ratingType))
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Adds the current user's rating for a node.
     * @param nodeId Target node for the rating
     * @param ratingType Type of rating (can be "likes" or "fiveStar")
     * @param vote Rating value (boolean for "likes", numeric 0..5 for "fiveStar")
     * @returns Details about the rating, including the new value
     */
    postRating(nodeId: string, ratingType: string, vote: any): Observable<RatingEntry | {}> {
        let ratingBody: RatingBody = new RatingBody({
            'id': ratingType,
            'myRating': vote
        });
        return from(this.apiService.getInstance().core.ratingsApi.rate(nodeId, ratingBody))
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Removes the current user's rating for a node.
     * @param nodeId Target node
     * @param ratingType Type of rating to remove (can be "likes" or "fiveStar")
     * @returns Null response indicating that the operation is complete
     */
    deleteRating(nodeId: string, ratingType: any): Observable<any> {
        return from(this.apiService.getInstance().core.ratingsApi.removeRating(nodeId, ratingType))
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: any): any {
        console.error(error);
        return throwError(error || 'Server error');
    }
}
