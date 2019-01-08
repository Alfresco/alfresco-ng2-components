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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { RatingService } from './services/rating.service';
import { RatingEntry } from '@alfresco/js-api';

@Component({
    selector: 'adf-rating',
    styleUrls: ['./rating.component.scss'],
    templateUrl: './rating.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RatingComponent implements OnChanges {

    /** Identifier of the node to apply the rating to. */
    @Input()
    nodeId: string;

    average: number = 0;

    ratingType: string = 'fiveStar';

    /** Emitted when the "vote" gets changed. */
    @Output()
    changeVote = new EventEmitter();

    stars: Array<any> = [];

    constructor(private ratingService: RatingService) {
    }

    ngOnChanges() {
        let ratingObserver = this.ratingService.getRating(this.nodeId, this.ratingType);

        ratingObserver.subscribe(
            (ratingEntry: RatingEntry) => {
                if (ratingEntry.entry.aggregate) {
                    this.average = ratingEntry.entry.aggregate.average;
                    this.calculateStars();
                }
            }
        );

        return ratingObserver;
    }

    calculateStars() {
        this.stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < this.average) {
                this.stars.push({ fill: true });
            } else {
                this.stars.push({ fill: false });
            }
        }

        this.changeVote.emit(this.average);
    }

    updateVote(vote: number) {
        this.ratingService.postRating(this.nodeId, this.ratingType, vote).subscribe(
            (ratingEntry: RatingEntry) => {
                if (ratingEntry.entry.aggregate) {
                    if (this.average !== ratingEntry.entry.aggregate.average) {
                        this.average = ratingEntry.entry.aggregate.average;
                        this.calculateStars();
                    }
                }
            }
        );
    }
}
