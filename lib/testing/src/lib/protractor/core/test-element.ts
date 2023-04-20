/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { by, element, ElementFinder, protractor, $ } from 'protractor';
import { BrowserActions } from './utils/browser-actions';
import { BrowserVisibility } from './utils/browser-visibility';

/**
 * Provides a wrapper for the most common operations with the page elements.
 */
export class TestElement {
    constructor(public elementFinder: ElementFinder) {
    }

    /**
     * Create a new instance with the element located by the id
     *
     * @param id The id of the element
     */
    static byId(id: string): TestElement {
        return new TestElement(element(by.id(id)));
    }

    /**
     * Create a new instance with the element located by the CSS class name
     *
     * @param selector The CSS class name to lookup
     */
    static byCss(selector: string): TestElement {
        return new TestElement($(selector));
    }

    /**
     * Create a new instance with the element that contains specific text
     *
     * @param selector the CSS selector
     * @param text the text within the target element
     */
    static byText(selector: string, text: string): TestElement {
        return new TestElement(element(by.cssContainingText(selector, text)));
    }

    /**
     * Create a new instance with the element with specific HTML tag name
     *
     * @param selector the HTML tag name
     */
    static byTag(selector: string): TestElement {
        return new TestElement(element(by.tagName(selector)));
    }

    /**
     * Performs a click on this element
     */
    async click() {
        return BrowserActions.click(this.elementFinder);
    }

    /**
     * Checks that an element is present on the DOM of a page and visible
     *
     * @param waitTimeout How long to wait for the condition to be true
     */
    async isVisible(waitTimeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.elementFinder, waitTimeout);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Waits until the element is present on the DOM of a page and visible
     *
     * @param waitTimeout How long to wait for the condition to be true
     */
    async waitVisible(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsVisible(this.elementFinder, waitTimeout);
    }

    /**
     * Waits until the element is either invisible or not present on the DOM
     *
     * @param waitTimeout How long to wait for the condition to be true
     */
    async waitNotVisible(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.elementFinder, waitTimeout);
    }

    /**
     * Checks that an element is present on the DOM of a page
     *
     * @param waitTimeout How long to wait for the condition to be true
     */
    async isPresent(waitTimeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsPresent(this.elementFinder, waitTimeout);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Waits until the element is present on the DOM of a page
     *
     * @param waitTimeout How long to wait for the condition to be true
     */
    async waitPresent(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsPresent(this.elementFinder, waitTimeout);
    }

    /**
     * Waits until the element is not attached to the DOM of a page
     *
     * @param waitTimeout How long to wait for the condition to be true
     */
    async waitNotPresent(waitTimeout?: number): Promise<any> {
        return BrowserVisibility.waitUntilElementIsNotPresent(this.elementFinder, waitTimeout);
    }

    /**
     * Waits until the given text is present in the element’s value
     *
     * @param value the text to check
     */
    async waitHasValue(value: string): Promise<any> {
        return BrowserVisibility.waitUntilElementHasValue(this.elementFinder, value);
    }

    /**
     * Query whether the DOM element represented by this instance is enabled.
     */
    async isEnabled(): Promise<boolean> {
        return this.elementFinder.isEnabled();
    }
    /**
     * Query whether the DOM element represented by this instance is disabled.
     */
    async isDisabled(): Promise<boolean> {
        return !(await this.elementFinder.isEnabled());
    }

    /**
     * Test whether this element is currently displayed.
     */
    async isDisplayed(): Promise<boolean> {
        try {
            await this.elementFinder.isDisplayed();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Query for the value of the given attribute of the element.
     *
     * @param attributeName The name of the attribute to query.
     */
    async getAttribute(attributeName: string): Promise<string> {
        return BrowserActions.getAttribute(this.elementFinder, attributeName);
    }

    /**
     * Get the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace.
     */
    async getText(): Promise<string> {
        return BrowserActions.getText(this.elementFinder);
    }

    /**
     * Gets the `value` attribute for the given input element
     */
    getInputValue(): Promise<string> {
        return BrowserActions.getInputValue(this.elementFinder);
    }

    /**
     * Enter the text
     *
     * @param text the text to enter
     */
    async typeText(text: string): Promise<void> {
         await BrowserActions.clearSendKeys(this.elementFinder, text);
    }

    /**
     * Clears the input using Ctrl+A and Backspace combination
     */
    async clearInput() {
        await this.elementFinder.clear();
        await this.elementFinder.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }
}
