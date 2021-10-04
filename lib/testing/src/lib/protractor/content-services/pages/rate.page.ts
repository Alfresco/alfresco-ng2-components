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

import { $ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class RatePage {

    private ratingsCounter = $(`div[id="adf-rating-counter"]`);
    private coloredStar = (rateValue: number) => $(`span[id="adf-rate-${rateValue}"]`);
    private greyStar = (rateValue: number) => $(`mat-icon[id="adf-grey-star-${rateValue}"]`);

    async rateComponent(rateValue: number) {
        const unratedStar = this.coloredStar(rateValue);
        await BrowserActions.click(unratedStar);
    }

    async removeRating(rateValue: number): Promise<void> {
        const ratedStar = this.coloredStar(rateValue);
        await BrowserActions.click(ratedStar);
    }

    async checkRatingCounter(rating: number): Promise<void> {
        await BrowserVisibility.waitUntilElementHasText(this.ratingsCounter, rating);
    }

    async isStarRated(rateValue: number): Promise<void> {
        const ratedStar = this.coloredStar(rateValue);
        await BrowserVisibility.waitUntilElementIsVisible(ratedStar);
    }

    async isNotStarRated(rateValue: number): Promise<void> {
        const unratedStar = this.greyStar(rateValue);
        await BrowserVisibility.waitUntilElementIsVisible(unratedStar);
    }

    async getRatedStarColor(rateValue: number): Promise<string> {
        const ratedStar = this.coloredStar(rateValue);
        return BrowserActions.getColor(ratedStar);
    }

    async getUnratedStarColor(rateValue: number): Promise<string> {
        const unratedStar = this.greyStar(rateValue);
        return BrowserActions.getColor(unratedStar);
    }

    async getAverageStarColor(rateValue: number): Promise<string> {
        const coloredStar = this.coloredStar(rateValue);
        return BrowserActions.getColor(coloredStar);
    }

}
