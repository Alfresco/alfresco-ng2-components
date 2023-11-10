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

import { DateAlfresco } from '../../content-custom-api';
import { RatingAggregate } from './ratingAggregate';

/**
 * A person can rate an item of content by liking it. They can also remove
their like of an item of content. API methods exist to get a list of
ratings and to add a new rating.

 */
export class Rating {
    id: string;
    aggregate?: RatingAggregate;
    ratedAt?: Date;
    /**
     * The rating. The type is specific to the rating scheme, boolean for the likes and an integer for the fiveStar.
     */
    myRating?: string;

    constructor(input?: Partial<Rating>) {
        if (input) {
            Object.assign(this, input);
            this.aggregate = input.aggregate ? new RatingAggregate(input.aggregate) : undefined;
            this.ratedAt = input.ratedAt ? DateAlfresco.parseDate(input.ratedAt) : undefined;
        }
    }

}
