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
import { browser, by, element, ElementFinder, protractor } from 'protractor';

export class BrowserActions {

    static async click(elementFinder: ElementFinder) {
        BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        BrowserVisibility.waitUntilElementIsClickable(elementFinder);
        return elementFinder.click();
    }

    static async getUrl(url: string) {
        return browser.get(url);
    }

    static async clickExecuteScript(elementCssSelector: string) {
        BrowserVisibility.waitUntilElementIsVisible(element(by.css(elementCssSelector)));
        browser.executeScript(`document.querySelector('${elementCssSelector}').click();`);
    }

    static async getText(elementFinder: ElementFinder) {
        BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        return elementFinder.getText();
    }

    static async clearSendKeys(elementFinder: ElementFinder, text: string) {
        BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        elementFinder.click();
        elementFinder.sendKeys('');
        elementFinder.clear();

        elementFinder.sendKeys(text);
    }

    static async closeMenuAndDialogs() {
        return browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }

    static clickOnDropdownOption(option: string, dropDownElement: ElementFinder) {
        this.click(dropDownElement);
        BrowserVisibility.waitUntilElementIsVisible(element('div[class*="mat-menu-content"] button'));
        const optionElement = element(by.cssContainingText('div[class*="mat-menu-content"] button', option));
        BrowserActions.click(optionElement);
        return this;
    }
}
