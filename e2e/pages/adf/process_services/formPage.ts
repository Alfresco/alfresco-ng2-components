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
import Util = require('../../../util/util');

export class FormPage {

    numberWidgetLabel4 = element(by.id('field-label4-container'));
    numberWidgetInput = element(by.css('div[id="field-label4-container"] input[id="label4"]'));
    errorLog = element(by.css('div[class="console"]'));
    dateWidgetLabel7 = element(by.id('field-label7-container'));
    dateWidgetInput = element(by.css('div[id="field-label7-container"] input[id="label7"]'));
    amountWidgetLabel11 = element(by.id('field-label11-container'));
    amountWidgetInput = element(by.css('div[id="field-label11-container"] input[id="label11"]'));

    checkLabel4IsDisplayed() {
        return Util.waitUntilElementIsVisible(this.numberWidgetLabel4);
    }

    addIntoNumberWidget(input) {
        Util.waitUntilElementIsVisible(this.numberWidgetLabel4);
        this.numberWidgetInput.click();
        this.numberWidgetInput.sendKeys(input);
        return this.numberWidgetInput.sendKeys(protractor.Key.ENTER);
    }

    checkErrorMessageForWidgetIsDisplayed(errorMessage) {
        return Util.waitUntilElementIsVisible(element(by.cssContainingText('.adf-error-text', errorMessage)));
    }

    checkErrorLogMessage(errorMessage) {
        Util.waitUntilElementIsVisible(this.errorLog);
        return Util.waitUntilElementIsVisible(element(by.cssContainingText('div[class="console"] p', errorMessage)));
    }

    checkLabel7IsDisplayed() {
        return Util.waitUntilElementIsVisible(this.dateWidgetLabel7);
    }

    addIntoDateWidget(input) {
        Util.waitUntilElementIsVisible(this.dateWidgetLabel7);
        this.dateWidgetInput.click();
        this.dateWidgetInput.sendKeys(input);
        return this.dateWidgetInput.sendKeys(protractor.Key.ENTER);
    }

    checkLabe11IsDisplayed() {
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

    checkErrorMessageIsNotDisplayed(errorMessage) {
        Util.waitUntilElementIsVisible(this.errorLog);
        return Util.waitUntilElementIsNotVisible(element(by.cssContainingText('div[class="console"] p', errorMessage)));
    }

    removeFromDateWidget() {
        Util.waitUntilElementIsVisible(this.dateWidgetLabel7);

        this.dateWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                this.dateWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    removeFromNumberWidget() {
        Util.waitUntilElementIsVisible(this.numberWidgetLabel4);

        this.numberWidgetInput.getAttribute('value').then((result) => {
            console.log(result);
            for (let i = result.length; i >= 0; i--) {
                this.numberWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}