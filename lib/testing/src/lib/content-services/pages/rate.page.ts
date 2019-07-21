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

import { by, element } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class RatePage {

    async rateComponent(rateValue: number) {
        const unratedStar = element(by.css(`span[id="adf-rate-${rateValue}"]`));
        await BrowserActions.click(unratedStar);
    }

    async removeRating(rateValue: number): Promise<void> {
        const ratedStar = element(by.css(`mat-icon[id="adf-colored-star-${rateValue}"]`));
        await BrowserActions.click(ratedStar);
    }

    async getRatingCounter(): Promise<string> {
        const ratingsCounter = element(by.css(`div[id="adf-rating-counter"]`));
        return BrowserActions.getText(ratingsCounter);
    }

    async isStarRated(rateValue: number): Promise<void> {
        const ratedStar = element(by.css(`mat-icon[id="adf-colored-star-${rateValue}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(ratedStar);
    }

    async isNotStarRated(rateValue: number): Promise<void> {
        const unratedStar = element(by.css(`mat-icon[id="adf-grey-star-${rateValue}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(unratedStar);
    }

    async getRatedStarColor(rateValue: number): Promise<string> {
        const ratedStar = element(by.css(`mat-icon[id="adf-colored-star-${rateValue}"]`));
        return BrowserActions.getColor(ratedStar);
    }

    async getUnratedStarColor(rateValue: number): Promise<string> {
        const unratedStar = element(by.css(`mat-icon[id="adf-grey-star-${rateValue}"]`));
        return BrowserActions.getColor(unratedStar);
    }

    async getAverageStarColor(rateValue: number): Promise<string> {
        const coloredStar = element(by.css(`mat-icon[id="adf-colored-star-${rateValue}"]`));
        return BrowserActions.getColor(coloredStar);
    }

}
