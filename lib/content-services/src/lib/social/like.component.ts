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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { RatingService } from './services/rating.service';
import { RatingEntry } from '@alfresco/js-api';

@Component({
    selector: 'adf-like',
    styleUrls: ['./like.component.scss'],
    templateUrl: './like.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LikeComponent implements OnChanges {
    /** Identifier of a node to apply likes to. */
    @Input()
    nodeId: string;

    /** Emitted when the "vote" gets changed. */
    @Output()
    changeVote = new EventEmitter();

    likesCounter: number = 0;
    ratingType: string = 'likes';
    isLike: boolean = false;

    constructor(private ratingService: RatingService) {
    }

    ngOnChanges() {
        this.clean();

        this.ratingService.getRating(this.nodeId, this.ratingType).subscribe(
            (ratingEntry: RatingEntry) => {
                if (ratingEntry.entry.aggregate) {
                    this.likesCounter = ratingEntry.entry.aggregate.numberOfRatings;
                    if (ratingEntry.entry.ratedAt) {
                        this.isLike = true;
                    }
                }
            }
        );
    }

    likeClick() {
        if (this.isLike) {
            this.ratingService.deleteRating(this.nodeId, this.ratingType).subscribe(
                () => {
                    this.likesCounter -= 1;
                    this.isLike = false;
                    this.changeVote.emit(this.likesCounter);
                }
            );
        } else {
            this.ratingService.postRating(this.nodeId, this.ratingType, true).subscribe(
                (ratingEntry: RatingEntry) => {
                    this.likesCounter = ratingEntry.entry.aggregate.numberOfRatings;
                    this.isLike = true;
                    this.changeVote.emit(this.likesCounter);
                }
            );
        }
    }

    clean() {
        this.isLike = false;
        this.likesCounter = 0;
    }
}
