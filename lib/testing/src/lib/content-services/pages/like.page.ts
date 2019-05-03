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

import { browser, by, element } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';

export class LikePage {

    nodeIdField = element(by.css(`input[id="nodeId"]`));
    likeCounter = element(by.css(`div[id="adf-like-counter"]`));
    likeButton = element(by.css(`span[class="adf-like-grey"]`));
    unlikeButton = element(by.css(`span[class="adf-like-select"]`));

    getNodeIdFieldValue() {
        BrowserVisibility.waitUntilElementIsVisible(this.nodeIdField);
        return this.nodeIdField.getAttribute('value');
    }

    writeCustomNodeId(nodeId: string) {
        BrowserVisibility.waitUntilElementIsVisible(this.nodeIdField);
        this.nodeIdField.clear();
        this.nodeIdField.sendKeys(nodeId);
    }

    getLikeCounter() {
        BrowserVisibility.waitUntilElementIsVisible(this.likeCounter);
        return this.likeCounter.getText();
    }

    clickLike() {
        BrowserVisibility.waitUntilElementIsClickable(this.likeButton);
        this.likeButton.click();
        return BrowserVisibility.waitUntilElementIsVisible(this.unlikeButton);
    }

    clickUnlike() {
        BrowserVisibility.waitUntilElementIsClickable(this.unlikeButton);
        this.unlikeButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.likeButton);
    }

    rateComponent(rateValue: number) {
        const unratedStar = element(by.css(`span[id="adf-rate-${rateValue}"]`));
        BrowserVisibility.waitUntilElementIsClickable(unratedStar);
        unratedStar.click();
    }

    isStarRated(rateValue: number) {
        const ratedStar = element(by.css(`mat-icon[id="adf-colored-star-${rateValue}"]`));
        return BrowserVisibility.waitUntilElementIsVisible(ratedStar);
    }

    isNotStarRated(rateValue: number) {
        const unratedStar = element(by.css(`mat-icon[id="adf-grey-star-${rateValue}"]`));
        return BrowserVisibility.waitUntilElementIsVisible(unratedStar);
    }

    removeHoverFromLikeButton() {
        browser.actions().mouseMove({x: 200, y: 200}).click().perform();
    }

    getLikedIconColor() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.likeButton);
        return this.unlikeButton.getWebElement().getCssValue('color');
    }

    getUnlikedIconColor() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.unlikeButton);
        return this.likeButton.getWebElement().getCssValue('color');
    }

    getRatedStarColor(rateValue: number) {
        const ratedStar = element(by.css(`mat-icon[id="adf-colored-star-${rateValue}"]`));
        BrowserVisibility.waitUntilElementIsVisible(ratedStar);
        return ratedStar.getWebElement().getCssValue('color');
    }

    getUnratedStarColor(rateValue: number) {
        const unratedStar = element(by.css(`mat-icon[id="adf-grey-star-${rateValue}"]`));
        BrowserVisibility.waitUntilElementIsVisible(unratedStar);
        return unratedStar.getWebElement().getCssValue('color');
    }
}
