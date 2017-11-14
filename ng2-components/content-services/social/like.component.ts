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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { RatingService } from './services/rating.service';

@Component({
    selector: 'adf-like',
    styleUrls: ['./like.component.scss'],
    templateUrl: './like.component.html',
    providers: [RatingService],
    encapsulation: ViewEncapsulation.None
})
export class LikeComponent implements OnInit {

    @Input()
    nodeId: string;

    @Output()
    changeVote = new EventEmitter();

    likesCounter: number = 0;
    ratingType: string = 'likes';
    isLike: boolean = false;

    constructor(private ratingService: RatingService) {}

    ngOnInit() {
        this.clean();

        this.ratingService.getRating(this.nodeId, this.ratingType).subscribe(
            (data) => {
                if (data.entry.aggregate) {
                    this.likesCounter = data.entry.aggregate.numberOfRatings;
                    if (data.entry.ratedAt) {
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
                (data) => {
                    this.likesCounter = data.entry.aggregate.numberOfRatings;
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
