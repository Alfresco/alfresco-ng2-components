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

import { BrowserVisibility } from './browser-visibility';
import { browser, by, element, ElementArrayFinder, ElementFinder, protractor } from 'protractor';

export class BrowserActions {

    static async click(elementFinder: ElementFinder): Promise<void> {
        await elementFinder.click();
    }

    static async getUrl(url: string): Promise<any> {
        return browser.get(url);
    }

    static async clickExecuteScript(elementCssSelector: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css(elementCssSelector)));
        await browser.executeScript(`document.querySelector('${elementCssSelector}').click();`);
    }

    static async getText(elementFinder: ElementFinder): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        return elementFinder.getText();
    }

    static async getArrayText(elementFinders: ElementArrayFinder): Promise<string> {
        return elementFinders.getText();
    }

    static async getColor(elementFinder: ElementFinder): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        return elementFinder.getWebElement().getCssValue('color');
    }

    static async clearSendKeys(elementFinder: ElementFinder, text: string): Promise<void> {
        await BrowserActions.click(elementFinder);
        await elementFinder.sendKeys('');
        await elementFinder.clear();

        await elementFinder.sendKeys(text);
    }

    static async checkIsDisabled(elementFinder: ElementFinder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        const valueCheck = await elementFinder.getAttribute('disabled');
        expect(valueCheck).toEqual('true');
    }

    static async rightClick(elementFinder: ElementFinder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        await browser.actions().click(elementFinder, protractor.Button.RIGHT).perform();
    }

    static async closeMenuAndDialogs(): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }

    static async closeDisabledMenu(): Promise<void> {
        // if the opened menu has only disabled items, pressing escape to close it won't work
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    static async clickOnDropdownOption(option: string, dropDownElement: ElementFinder): Promise<void> {
        await this.click(dropDownElement);
        await BrowserVisibility.waitUntilElementIsVisible(element('div[class*="mat-menu-content"] button'));
        const optionElement = element(by.cssContainingText('div[class*="mat-menu-content"] button', option));
        await BrowserActions.click(optionElement);
    }

    static async clickOnSelectDropdownOption(option: string, dropDownElement: ElementFinder): Promise<void> {
        await this.click(dropDownElement);
        const optionElement = element(by.cssContainingText('mat-option span.mat-option-text', option));
        await BrowserActions.click(optionElement);
    }
}
