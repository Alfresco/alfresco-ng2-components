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

import { by, element, ElementFinder, protractor } from 'protractor';
import { BrowserActions } from './utils/browser-actions';
import { BrowserVisibility } from './utils/browser-visibility';

export class TestElement {
    constructor(public elementFinder: ElementFinder) {
    }

    static byId(id: string): TestElement {
        return new TestElement(element(by.id(id)));
    }

    static byCss(selector: string): TestElement {
        return new TestElement(element(by.css(selector)));
    }

    static byText(selector: string, text: string): TestElement {
        return new TestElement(element(by.cssContainingText(selector, text)));
    }

    static byTag(selector: string): TestElement {
        return new TestElement(element(by.tagName(selector)));
    }

    async click() {
        return BrowserActions.click(this.elementFinder);
    }

    async isVisible(waitTimeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.elementFinder, waitTimeout);
            return true;
        } catch {
            return false;
        }
    }

    async waitVisible(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsVisible(this.elementFinder, waitTimeout);
    }

    async waitNotVisible(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.elementFinder, waitTimeout);
    }

    async isPresent(waitTimeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsPresent(this.elementFinder, waitTimeout);
            return true;
        } catch {
            return false;
        }
    }

    async waitPresent(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsPresent(this.elementFinder, waitTimeout);
    }

    async waitNotPresent(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsNotPresent(this.elementFinder, waitTimeout);
    }

    async waitHasValue(value: string): Promise<any> {
        return BrowserVisibility.waitUntilElementHasValue(this.elementFinder, value);
    }

    async isEnabled(): Promise<boolean> {
        return this.elementFinder.isEnabled();
    }

    async isDisplayed(): Promise<boolean> {
        return this.elementFinder.isDisplayed();
    }

    async getAttribute(name: string): Promise<string> {
        await this.waitVisible();
        return this.elementFinder.getAttribute(name);
    }

    async getText(): Promise<string> {
        return BrowserActions.getText(this.elementFinder);
    }

    async typeText(text: string): Promise<void> {
         await BrowserActions.clearSendKeys(this.elementFinder, text);
    }

    async clearInput() {
        await this.elementFinder.clear();
        await this.elementFinder.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }
}
