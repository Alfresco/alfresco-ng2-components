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

    static async waitUntilElementIsPresent(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT): Promise<any> {
        return browser.wait(until.presenceOf(elementToCheck), waitTimeout, 'Element is not present ' + elementToCheck.locator());
    }
    /*
     * Wait for element is visible
     */
    static async waitUntilElementIsVisible(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT, message: string = 'Element is not visible'): Promise<any> {
        return browser.wait(until.visibilityOf(elementToCheck), waitTimeout, message + elementToCheck.locator());
    }

    /*
     * Wait for element to be clickable
     */
    static async waitUntilElementIsClickable(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT): Promise<any> {
        return browser.wait(until.elementToBeClickable(elementToCheck), waitTimeout, 'Element is not Clickable ' + elementToCheck.locator());
    }

    /*
    * Wait for element to not be present on the page
    */
    static async waitUntilElementIsStale(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT): Promise<any> {
        return browser.wait(until.stalenessOf(elementToCheck), waitTimeout, 'Element is not in stale ' + elementToCheck.locator());
    }

    /*
     * Wait for element to not be visible
     */
    static async waitUntilElementIsNotVisible(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT): Promise<any> {
        return browser.wait(until.invisibilityOf(elementToCheck), waitTimeout, 'Element is Visible and it should not' + elementToCheck.locator());
    }

    /*
     * Wait for element to have value
     */
    static async waitUntilElementHasValue(elementToCheck: ElementFinder, elementValue, waitTimeout: number = DEFAULT_TIMEOUT): Promise<any> {
        return browser.wait(until.textToBePresentInElementValue(elementToCheck, elementValue), waitTimeout, 'Element doesn\'t have a value ' + elementToCheck.locator());
    }

    static async waitUntilElementIsNotPresent(elementToCheck: ElementFinder, waitTimeout: number = DEFAULT_TIMEOUT): Promise<any> {
        return browser.wait(until.stalenessOf(elementToCheck), waitTimeout, 'Element is present ' + elementToCheck.locator());
    }

    static async waitUntilDialogIsClose(): Promise<any> {
        const dialog = element(by.css('mat-dialog-container'));
        await this.waitUntilElementIsNotPresent(dialog);
    }

}
