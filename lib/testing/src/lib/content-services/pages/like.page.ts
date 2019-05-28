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

    likeCounter = element(by.css(`div[id="adf-like-counter"]`));
    likeButton = element(by.css(`span[class="adf-like-grey"]`));
    unlikeButton = element(by.css(`span[class="adf-like-select"]`));

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

    removeHoverFromLikeButton() {
        browser.actions().mouseMove({x: 200, y: 200}).click().perform();
    }

    getLikedIconColor() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.likeButton);
        return this.unlikeButton.getWebElement().getCssValue('color');
    }

    getUnLikedIconColor() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.unlikeButton);
        return this.likeButton.getWebElement().getCssValue('color');
    }
}
