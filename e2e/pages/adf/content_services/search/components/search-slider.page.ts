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

import { browser, by, protractor } from 'protractor';
import Util = require('../../../../../util/util');

export class SearchSliderPage {

    filter;
    slider = by.css('mat-slider');

    constructor(filter) {
        this.filter = filter;
    }

    setValue(value) {
        this.clickSlider();
        browser.controlFlow().execute(async () => {
            let actualValue;
            do {
                actualValue = await this.filter.element(this.slider).getAttribute('aria-valuenow');
                if (actualValue < value) {
                    await browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
                } else if (actualValue > value) {
                    await browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
                }
            }while (Number(actualValue) !== value);
        });
        return this;
    }

    clickSlider() {
        Util.waitUntilElementIsClickable(this.filter.element(this.slider));
        this.filter.element(this.slider).click();
        return this;
    }

    checkSliderIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.slider));
        return this;
    }
}
