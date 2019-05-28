/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { RatingEntry } from '@alfresco/js-api';

@Component({
    selector: 'adf-rating',
    styleUrls: ['./rating.component.scss'],
    templateUrl: './rating.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RatingComponent implements OnInit {

    /** Identifier of the node to apply the rating to. */
    @Input()
    nodeId: string;

    average: number = 0;

    ratingsCounter = 0;

    ratingType: string = 'fiveStar';

    ratingValue: number;

    /** Emitted when the "vote" gets changed. */
    @Output()
    changeVote = new EventEmitter();

    stars: Array<any> = [];

    constructor(private ratingService: RatingService) {
    }

    ngOnInit() {
        this.ratingService.getRating(this.nodeId, this.ratingType).subscribe(
            (ratingEntry: RatingEntry) => {
                this.refreshRating(ratingEntry);
            }
        );
    }

    calculateStars() {
        this.stars = [];
        const roundedAverage = Math.round(this.average);

        for (let i = 0; i < 5; i++) {
            if (i < roundedAverage) {
                this.stars.push({fill: true});
            } else {
                this.stars.push({fill: false});
            }
        }
    }

    updateVote(vote: number) {
        if (this.ratingValue === vote) {
            this.unRateItem();
        } else {
            this.rateItem(vote);
        }
    }

    rateItem(vote: number) {
        this.ratingService.postRating(this.nodeId, this.ratingType, vote).subscribe(
            (ratingEntry: RatingEntry) => {
                this.refreshRating(ratingEntry);
            }
        );
    }

    unRateItem() {
        this.ratingService.deleteRating(this.nodeId, this.ratingType).subscribe(
            () => {
                this.ratingService.getRating(this.nodeId, this.ratingType).subscribe(
                    (ratingEntry: RatingEntry) => {
                        this.refreshRating(ratingEntry);
                    }
                );
            });
    }

    refreshRating(ratingEntry: RatingEntry) {
        this.ratingValue = Number.parseFloat(ratingEntry.entry.myRating);
        this.average = ratingEntry.entry.aggregate.average;
        this.ratingsCounter = ratingEntry.entry.aggregate.numberOfRatings;
        this.calculateStars();
        this.changeVote.emit(this.average);
    }
}
