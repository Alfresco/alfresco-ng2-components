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

import {
    ElementFinder,
    ExpectedConditions as EC,
    browser,
    protractor
} from 'protractor';

export abstract class Component {
    component: ElementFinder;

    waitTimeout = 10000;

    constructor(selector: string, ancestor?: ElementFinder) {
        const locator = selector;

        this.component = ancestor
            ? ancestor.$$(locator).first()
            : browser.$$(locator).first();
    }

    async wait() {
        await browser.wait(EC.presenceOf(this.component), this.waitTimeout);
    }

    async waitUntilElementClickable(element: ElementFinder) {
        return await browser
            .wait(EC.elementToBeClickable(element), this.waitTimeout)
            .catch(Error);
    }

    async typeInField(elem: ElementFinder, value: string) {
        for (let i = 0; i < value.length; i++) {
            const c = value.charAt(i);
            await elem.sendKeys(c);
            await browser.sleep(100);
        }
    }

    async pressEscape() {
        return await browser
            .actions()
            .sendKeys(protractor.Key.ESCAPE)
            .perform();
    }

    async pressTab() {
        return await browser
            .actions()
            .sendKeys(protractor.Key.TAB)
            .perform();
    }
}
