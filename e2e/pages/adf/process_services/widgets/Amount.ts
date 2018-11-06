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

import { element, by, protractor } from 'protractor';
import Util = require('../../../../util/util');

export class Amount {

    amountWidgetLabel11 = element(by.id('field-label11-container'));
    amountWidgetInput = element(by.css('div[id="field-label11-container"] input[id="label11"]'));

    checkLabel11IsDisplayed() {
        return Util.waitUntilElementIsVisible(this.amountWidgetLabel11);
    }

    addIntoAmountWidget(input) {
        Util.waitUntilElementIsVisible(this.amountWidgetLabel11);
        this.amountWidgetInput.click();
        this.amountWidgetInput.sendKeys(input);
        return this.amountWidgetInput.sendKeys(protractor.Key.ENTER);
    }

    removeFromAmountWidget() {
        Util.waitUntilElementIsVisible(this.amountWidgetLabel11);

        this.amountWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                this.amountWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
