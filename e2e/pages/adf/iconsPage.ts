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

import { browser, by, element, ElementFinder } from 'protractor';

export class IconsPage {

    locateCustomIcon(name): ElementFinder {
        return element(by.css(`adf-icon[value='${name}'] svg`));
    }

    locateLigatureIcon(name): ElementFinder {
        return element(by.css(`adf-icon[value='${name}'] .material-icons`));
    }

    async isCustomIconDisplayed(name) {
        const present = await browser.isElementPresent(this.locateCustomIcon(name));
        if (present) {
          return await this.locateCustomIcon(name).isDisplayed();
        } else {
          return false;
        }
    }

    async isLigatureIconDisplayed(name) {
        const present = await browser.isElementPresent(this.locateLigatureIcon(name));
        if (present) {
          return await this.locateLigatureIcon(name).isDisplayed();
        } else {
          return false;
        }
    }
}
