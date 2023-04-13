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

import { browser, by, element, ElementArrayFinder, ElementFinder, protractor, $ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { Logger } from './logger';

import * as path from 'path';
import * as fs from 'fs';
import { ApiUtil } from '../../../shared/api/api.util';

export class BrowserActions {

    static async clickUntilIsNotVisible(elementToClick: ElementFinder, elementToFind: ElementFinder): Promise<void> {
        Logger.info(`Click until element is not present: ${elementToClick.locator().toString()}`);
        const predicate = (isVisible: boolean) => isVisible;

        const apiCall = async () => {
            await this.click(elementToClick);

            try {
                await BrowserVisibility.waitUntilElementIsVisible(elementToFind);
                return true;
            } catch (error) {
                return false;
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate, 10, 2000);
    }

    static async click(elementToClick: ElementFinder): Promise<void> {
        try {
            Logger.info(`Click element: ${elementToClick.locator().toString()}`);
            await BrowserVisibility.waitUntilElementIsVisible(elementToClick);
            await BrowserVisibility.waitUntilElementIsClickable(elementToClick);
            await elementToClick.click();
        } catch (clickErr) {
            Logger.warn(`click error element ${elementToClick.locator().toString()} consider to use directly clickScript`);
            await this.clickScript(elementToClick);
        }
    }

    static async clickScript(elementToClick: ElementFinder): Promise<void> {
        Logger.info(`Click script ${elementToClick.locator().toString()}`);

        await browser.executeScript(`arguments[0].scrollIntoView();`, elementToClick);
        await browser.executeScript(`arguments[0].click();`, elementToClick);
    }

    static async clickExecuteScript(elementCssSelector: string): Promise<void> {
        Logger.info(`Click execute script ${elementCssSelector}`);

        await BrowserVisibility.waitUntilElementIsVisible($(elementCssSelector));
        await browser.executeScript(`document.querySelector('${elementCssSelector}').click();`);
    }

    static async waitUntilActionMenuIsVisible(): Promise<void> {
        Logger.info(`wait Until Action Menu Is Visible`);

        const actionMenu = element.all(by.css('div[role="menu"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(actionMenu);
    }

    static async waitUntilActionMenuIsNotVisible(): Promise<void> {
        Logger.info(`wait Until Action Menu Is Not Visible`);

        const actionMenu = element.all(by.css('div[role="menu"]')).first();
        await BrowserVisibility.waitUntilElementIsNotVisible(actionMenu);
    }

    static async getUrl(url: string, timeout: number = 10000): Promise<any> {
        Logger.info(`Get URL ${url}`);
        return browser.get(url, timeout);
    }

    static async getAttribute(elementFinder: ElementFinder, attribute: string): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(elementFinder);
        const attributeValue: string = await browser.executeScript(`return arguments[0].getAttribute(arguments[1])`, elementFinder, attribute);
        return attributeValue || '';
    }

    static async getText(elementFinder: ElementFinder): Promise<string> {
        Logger.info(`Get Text ${elementFinder.locator().toString()}`);

        const present = await BrowserVisibility.waitUntilElementIsVisible(elementFinder);

        if (present) {
            let text = await elementFinder.getText();

            if (text === '') { // DO NOT REMOVE BUG sometime wrongly return empty text for cdk elements
                Logger.info(`Use backup get text script`);

                text = await this.getTextScript(elementFinder);
                return text?.trim();
            }

            return text;
        } else {
            Logger.error(`Get Text ${elementFinder.locator().toString()} not present`);
            return '';
        }
    }

    static async getInputValue(elementFinder: ElementFinder): Promise<string> {
        Logger.info(`Get Input value ${elementFinder.locator().toString()}`);

        const present = await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        if (present) {
            return browser.executeScript(`return arguments[0].value`, elementFinder);
        } else {
            Logger.error(`Get Input value ${elementFinder.locator().toString()} not present`);
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

    static async clearWithBackSpace(elementFinder: ElementFinder, sleepTime: number = 0) {
        await BrowserVisibility.waitUntilElementIsVisible(elementFinder);
        await elementFinder.click();
        await elementFinder.sendKeys(protractor.Key.END);

        const value: string = await browser.executeScript(`return arguments[0].value`, elementFinder);
        if (value) {
            for (let i = value.length; i >= 0; i--) {
                await elementFinder.sendKeys(protractor.Key.BACK_SPACE);
                await browser.sleep(sleepTime);
            }
        }
    }

    static async clearSendKeys(elementFinder: ElementFinder, text: string = '', sleepTime: number = 0): Promise<void> {
        Logger.info(`Clear and sendKeys text:${text} locator:${elementFinder.locator().toString()}`);

        await this.click(elementFinder);
        await elementFinder.sendKeys('');
        await elementFinder.clear();

        if (sleepTime === 0) {
            await elementFinder.sendKeys(text);
        } else {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < text.length; i++) {
                await elementFinder.sendKeys(text[i]);
                await browser.sleep(sleepTime);
            }
        }

        try {
            if (text !== protractor.Key.SPACE && text !== protractor.Key.ENTER) {
                await BrowserVisibility.waitUntilElementHasValue(elementFinder, text, 1000);
            }
        } catch (e) {
            Logger.info(`Set value different from the input`);
        }
    }

    static async rightClick(elementFinder: ElementFinder): Promise<void> {
        Logger.info(`Right click locator:${elementFinder.locator().toString()}`);

        await browser.actions().mouseMove(elementFinder).mouseDown().mouseMove(elementFinder).perform();
        await browser.actions().click(elementFinder, protractor.Button.RIGHT).perform();
    }

    static async closeMenuAndDialogs(): Promise<void> {
        Logger.info(`Close Menu And Dialogs`);

        const container = $('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing');
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await BrowserVisibility.waitUntilElementIsNotVisible(container, 1000);
    }

    static async closeDisabledMenu(): Promise<void> {
        // if the opened menu has only disabled items, pressing escape to close it won't work
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    static async takeScreenshot(screenshotFilePath: string, fileName: string) {
        const pngData = await browser.takeScreenshot();
        const filenameWithExt = `${fileName}.png`;
        Logger.info('Taking screenshot: ', filenameWithExt);

        const fileWithPath = path.join(screenshotFilePath, filenameWithExt);
        const stream = fs.createWriteStream(fileWithPath);
        stream.write(Buffer.from(pngData, 'base64'));
        stream.end();
    }

    // Don't make it pub,ic use getText
    private static async getTextScript(elementFinder: ElementFinder): Promise<string> {
        return browser.executeScript(`return arguments[0].textContent`, elementFinder);
    }
}
