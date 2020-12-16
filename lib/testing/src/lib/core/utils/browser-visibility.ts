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

import { browser, by, element, ElementFinder, protractor, until } from 'protractor';
import { Logger } from './logger';

export class BrowserVisibility {

    static NOT_VISIBLE_DEFAULT_TIMEOUT = BrowserVisibility.getNoVisibleTimeout() ? browser.params.testConfig.timeouts.no_visible_timeout : 10000;
    static DEFAULT_TIMEOUT = BrowserVisibility.getVisibleTimeout() ? browser.params.testConfig.timeouts.visible_timeout : 10000;

    static getVisibleTimeout() {
        if (browser && browser.params && browser.params.testConfig && browser.params.testConfig.timeouts) {
            return browser.params.testConfig.timeouts.visible_timeout;
        }
    }

    static getNoVisibleTimeout() {
        if (browser && browser.params && browser.params.testConfig && browser.params.testConfig.timeouts) {
            return browser.params.testConfig.timeouts.no_visible_timeout;
        }
    }

    static async waitUntilElementIsLocated(elementToCheck: ElementFinder, waitTimeout: number = BrowserVisibility.DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element Is Located ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(until.elementLocated(elementToCheck), waitTimeout, 'Element is not located ' + elementToCheck.locator());
    }

    static async waitUntilElementIsPresent(elementToCheck: ElementFinder, waitTimeout: number = BrowserVisibility.DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element Is Present ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.presenceOf(elementToCheck), waitTimeout, 'Element is not present ' + elementToCheck.locator());
    }

    /*
     * Wait for element to be visible
     */
    static async waitUntilElementIsVisible(elementToCheck: ElementFinder, waitTimeout: number = BrowserVisibility.DEFAULT_TIMEOUT, message: string = 'Element is not visible'): Promise<any> {
        Logger.info(`Wait Until Element Is Visible ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.visibilityOf(elementToCheck), waitTimeout, message + elementToCheck.locator());
    }

    /*
     * Wait for element to be clickable
     */
    static async waitUntilElementIsClickable(elementToCheck: ElementFinder, waitTimeout: number = BrowserVisibility.DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element Is Clickable ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementToCheck), waitTimeout, 'Element is not Clickable ' + elementToCheck.locator());
    }

    /*
    * Wait for element to not be present on the page
    */
    static async waitUntilElementIsStale(elementToCheck: ElementFinder, waitTimeout: number = BrowserVisibility.DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element Is Stale ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.stalenessOf(elementToCheck), waitTimeout, 'Element is not in stale ' + elementToCheck.locator());
    }

    /*
     * Wait for element to not be visible
     */
    static async waitUntilElementIsNotVisible(elementToCheck: ElementFinder, waitTimeout: number = BrowserVisibility.NOT_VISIBLE_DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element Is Not Visible ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.invisibilityOf(elementToCheck), waitTimeout, 'Element is Visible and it should not' + elementToCheck.locator());
    }

    /*
     * Wait for element to have value
     */
    static async waitUntilElementHasValue(elementToCheck: ElementFinder, elementValue, waitTimeout: number = BrowserVisibility.DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element has value ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.textToBePresentInElementValue(elementToCheck, elementValue), waitTimeout, `Element doesn\'t have a value ${elementValue} ${elementToCheck.locator()}`);
    }

    /*
     * Wait for element to have text
     */
    static async waitUntilElementHasText(elementToCheck: ElementFinder, text, waitTimeout: number = BrowserVisibility.DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element has value ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.textToBePresentInElement(elementToCheck, text), waitTimeout, `Element doesn\'t have the text ${text}  ${elementToCheck.locator()}`);
    }

    static async waitUntilElementIsNotPresent(elementToCheck: ElementFinder, waitTimeout: number = BrowserVisibility.NOT_VISIBLE_DEFAULT_TIMEOUT): Promise<any> {
        Logger.info(`Wait Until Element is not present ${elementToCheck.locator().toString()} for ${waitTimeout}`);

        return browser.wait(protractor.ExpectedConditions.stalenessOf(elementToCheck), waitTimeout, 'Element is present ' + elementToCheck.locator());
    }

    static async waitUntilDialogIsClose(): Promise<void> {
        Logger.info(`Wait Until dialog close`);

        const dialog = element(by.css('mat-dialog-container'));
        await this.waitUntilElementIsNotPresent(dialog);
    }

}
