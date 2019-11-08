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

import { browser, by, element, ElementArrayFinder, ElementFinder, protractor } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { Logger } from './logger';

export class BrowserActions {

    static async click(elementFinder: ElementFinder): Promise<void> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
            await BrowserVisibility.waitUntilElementIsClickable(elementFinder);
            await elementFinder.click();
        } catch (clickErr) {
          try {
            await browser.executeScript(`arguments[0].scrollIntoView();`, elementFinder);
            await browser.executeScript(`arguments[0].click();`, elementFinder);
          } catch (jsErr) {
              Logger.error(`click error element ${elementFinder.locator()}`);
              throw jsErr;
          }
        }
    }

    static async waitUntilActionMenuIsVisible(): Promise<void> {
        const actionMenu = element(by.css('div[role="menu"]'));
        await BrowserVisibility.waitUntilElementIsVisible(actionMenu);
    }

    static async waitUntilActionMenuIsNotVisible(): Promise<void> {
        const actionMenu = element(by.css('div[role="menu"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(actionMenu);
    }

    static async getUrl(url: string): Promise<any> {
        return browser.get(url);
    }

    static async clickExecuteScript(elementCssSelector: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(element(by.css(elementCssSelector)));
        await browser.executeScript(`document.querySelector('${elementCssSelector}').click();`);
    }

    static async getText(elementFinder: ElementFinder): Promise<string> {
        const present = await BrowserVisibility.waitUntilElementIsPresent(elementFinder);
        if (present) {
            return elementFinder.getText();
        } else {
            return '';
        }
    }

    static async getArrayText(elementFinders: ElementArrayFinder): Promise<string> {
        return elementFinders.getText();
    }

    static async getColor(elementFinder: ElementFinder): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        const webElem = await elementFinder.getWebElement();
        return webElem.getCssValue('color');
    }

    static async clearWithBackSpace(elementFinder: ElementFinder) {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        await elementFinder.click();
        const value = await elementFinder.getAttribute('value');
        for (let i = value.length; i >= 0; i--) {
            await elementFinder.sendKeys(protractor.Key.BACK_SPACE);
        }
    }

    static async clearSendKeys(elementFinder: ElementFinder, text: string): Promise<void> {
        await this.click(elementFinder);
        await elementFinder.sendKeys('');
        await elementFinder.clear();
        await elementFinder.sendKeys(text);
    }

    static async checkIsDisabled(elementFinder: ElementFinder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        const valueCheck = await elementFinder.getAttribute('disabled');
        await expect(valueCheck).toEqual('true');
    }

    static async rightClick(elementFinder: ElementFinder): Promise<void> {
        await browser.actions().mouseMove(elementFinder).mouseDown().mouseMove(elementFinder).perform();
        await browser.actions().click(elementFinder, protractor.Button.RIGHT).perform();
    }

    static async closeMenuAndDialogs(): Promise<void> {
        const container = element(by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await BrowserVisibility.waitUntilElementIsNotVisible(container);
    }

    static async closeDisabledMenu(): Promise<void> {
        // if the opened menu has only disabled items, pressing escape to close it won't work
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    static async clickOnDropdownOption(option: string, dropDownElement: ElementFinder): Promise<void> {
        await this.click(dropDownElement);
        await BrowserVisibility.waitUntilElementIsVisible(element('div[class*="mat-menu-content"] button'));
        const optionElement = element(by.cssContainingText('div[class*="mat-menu-content"] button', option));
        await this.click(optionElement);
    }

    static async clickOnSelectDropdownOption(option: string, dropDownElement: ElementFinder): Promise<void> {
        await this.click(dropDownElement);
        const optionElement = element(by.cssContainingText('mat-option span.mat-option-text', option));
        await this.click(optionElement);
    }
}
