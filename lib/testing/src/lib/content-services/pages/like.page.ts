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
import { BrowserActions } from '../../core/utils/browser-actions';

export class LikePage {

    likeCounter = element(by.css(`div[id="adf-like-counter"]`));
    likeButton = element(by.css(`span[class="adf-like-grey"]`));
    unlikeButton = element(by.css(`span[class="adf-like-select"]`));

    async getLikeCounter(): Promise<string> {
        return BrowserActions.getText(this.likeCounter);
    }

    async clickLike(): Promise<void> {
        await BrowserActions.click(this.likeButton);
    }

    async clickUnlike(): Promise<void> {
        await BrowserActions.click(this.unlikeButton);
    }

    async removeHoverFromLikeButton(): Promise<void> {
        await browser.actions().mouseMove({ x: 200, y: 200 }).click().perform();
    }

    async getLikedIconColor(): Promise<string> {
        return BrowserActions.getColor(this.unlikeButton);
    }

    async getUnLikedIconColor(): Promise<string> {
        return BrowserActions.getColor(this.likeButton);
    }
}
