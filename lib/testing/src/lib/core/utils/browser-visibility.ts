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

import { browser, by, element, ElementFinder, protractor } from 'protractor';

const until = protractor.ExpectedConditions;
const DEFAULT_TIMEOUT = global['TestConfig'] ? global['TestConfig'].main.timeout : 40000;

export class BrowserVisibility {

    /*
     * Wait for element is visible
     */
    static waitUntilElementIsVisible(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT, message: string = '') {
        let isDisplayed = false;
        return browser.wait(() => {
            browser.waitForAngularEnabled();

            elementToCheck.isDisplayed().then(
                () => {
                    isDisplayed = true;
                },
                () => {
                    isDisplayed = false;
                }
            );
            return isDisplayed;
        }, waitTimeout, 'Element is not visible ' + elementToCheck.locator() + ' ' + message);
    }

    /*
     * Wait for element to be clickable
     */
    static waitUntilElementIsClickable(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT) {
        let isDisplayed = false;
        return browser.wait(() => {
            browser.waitForAngularEnabled();

            elementToCheck.isDisplayed().then(
                () => {
                    isDisplayed = true;
                },
                () => {
                    isDisplayed = false;
                }
            );
            return isDisplayed;
        }, waitTimeout, 'Element is not Clickable ' + elementToCheck.locator());
    }

    /*
   * Wait for element to not be visible
   */
    static waitUntilElementIsStale(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(until.stalenessOf(elementToCheck), waitTimeout, 'Element is not in stale ' + elementToCheck.locator());
    }

    /*
     * Wait for element to not be visible
     */
    static waitUntilElementIsNotVisible(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT) {
        let isPresent = false;
        return browser.wait(() => {
            browser.waitForAngularEnabled();

            elementToCheck.isPresent().then(
                (present) => {
                    isPresent = !present;
                }
            );
            return isPresent;
        }, waitTimeout, 'Element is Visible and it should not' + elementToCheck.locator());
    }

    /*
     * Wait for element to have value
     */
    static waitUntilElementHasValue(elementToCheck: ElementFinder, elementValue, waitTimeout: number = DEFAULT_TIMEOUT) {
        browser.waitForAngularEnabled();

        browser.wait(until.textToBePresentInElementValue(elementToCheck, elementValue), waitTimeout, 'Element doesn\'t have a value ' + elementToCheck.locator());
    }

    static waitUntilElementIsOnPage(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(browser.wait(until.visibilityOf(elementToCheck)), waitTimeout);
    }

    /*
     * Wait for element to not be visible
     */
    static waitUntilElementIsNotOnPage(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(until.not(until.visibilityOf(elementToCheck)), waitTimeout, 'Element is not in the page ' + elementToCheck.locator());
    }

    static waitUntilElementIsPresent(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT) {
        browser.waitForAngularEnabled();

        return browser.wait(until.presenceOf(elementToCheck), waitTimeout, 'Element is not present ' + elementToCheck.locator());
    }

    static waitUntilElementIsNotPresent(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(until.not(until.presenceOf(elementToCheck)), waitTimeout, 'Element is not in the page ' + elementToCheck.locator());
    }

    static waitUntilDialogIsClose() {
        const dialog = element(by.css('mat-dialog-container'));
        return this.waitUntilElementIsNotPresent(dialog);
    }

}
