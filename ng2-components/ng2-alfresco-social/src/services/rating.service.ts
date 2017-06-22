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

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { RatingBody } from 'alfresco-js-api';

@Injectable()
export class RatingService {

    constructor(private apiService: AlfrescoApiService) {
    }

    getRating(nodeId: string, ratingType: any): any {
        return Observable.fromPromise(this.apiService.getInstance().core.ratingsApi.getRating(nodeId, ratingType))
            .map(res => res)
            .catch(this.handleError);
    }

    postRating(nodeId: string, ratingType: any, vote: any): any {
        let ratingBody: RatingBody = {
            'id': ratingType,
            'myRating': vote
        };
        return Observable.fromPromise(this.apiService.getInstance().core.ratingsApi.rate(nodeId, ratingBody))
            .map(res => res)
            .catch(this.handleError);
    }

    deleteRating(nodeId: string, ratingType: any): any {
        return Observable.fromPromise(this.apiService.getInstance().core.ratingsApi.removeRating(nodeId, ratingType))
            .map(res => res)
            .catch(this.handleError);
    }

    private handleError(error: Response): any {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
