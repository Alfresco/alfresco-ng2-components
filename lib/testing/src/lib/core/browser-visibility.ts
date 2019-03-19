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

import { browser, protractor } from 'protractor';
let until = protractor.ExpectedConditions;

const DEFAULT_TIMEOUT = 40000;

export class BrowserVisibility {

    constructor() {}

    /*
     * Wait for element is visible
     */
    static waitUntilElementIsVisible(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        let isDisplayed = false;
        return browser.wait(() => {
            browser.waitForAngularEnabled();

            elementToCheck.isDisplayed().then(
                () => {
                    isDisplayed = true;
                },
                (err) => {
                    isDisplayed = false;
                }
            );
            return isDisplayed;
        }, waitTimeout, 'Element is not visible ' + elementToCheck.locator());
    }

    /*
     * Wait for element to be clickable
     */
    static waitUntilElementIsClickable(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        let isDisplayed = false;
        return browser.wait(() => {
            browser.waitForAngularEnabled();

            elementToCheck.isDisplayed().then(
                () => {
                    isDisplayed = true;
                },
                (err) => {
                    isDisplayed = false;
                }
            );
            return isDisplayed;
        }, waitTimeout, 'Element is not visible ' + elementToCheck.locator());
    }

    /*
     * Wait for element to have value
     */
    static waitUntilElementHasValue(elementToCheck, elementValue, waitTimeout: number = DEFAULT_TIMEOUT) {
        browser.waitForAngularEnabled();

        browser.wait(until.textToBePresentInElementValue(elementToCheck, elementValue), waitTimeout, 'Element doesn\'t have a value ' + elementToCheck.locator());
    }

    /*
     * Wait for element to not be visible
     */
    static waitUntilElementIsNotOnPage(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(until.not(until.visibilityOf(elementToCheck)), waitTimeout, 'Element is not in the page ' + elementToCheck.locator());
    }

}
