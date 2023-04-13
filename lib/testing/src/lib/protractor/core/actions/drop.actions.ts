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

import { browser, ElementFinder } from 'protractor';

import * as path from 'path';
import * as fs from 'fs';
import { BrowserActions } from '../utils/browser-actions';

const JS_BIND_INPUT = (target) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.addEventListener('change', () => {
        target.scrollIntoView(true);

        const rect = target.getBoundingClientRect();
        const x = rect.left + (rect.width >> 1);
        const y = rect.top + (rect.height >> 1);
        const data = { files: input.files };

        ['dragenter', 'dragover', 'drop'].forEach((name) => {
            const mouseEvent: any = document.createEvent('MouseEvent');
            mouseEvent.initMouseEvent(name, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null);
            mouseEvent.dataTransfer = data;
            target.dispatchEvent(mouseEvent);
        });

        document.body.removeChild(input);
    }, false);

    document.body.appendChild(input);
    return input;
};

const JS_BIND_INPUT_FOLDER = (target) => {
    const input: any = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.multiple = true;
    input.webkitdirectory = true;
    input.addEventListener('change', () => {
        target.scrollIntoView(true);

        const rect = target.getBoundingClientRect();
        const x = rect.left + (rect.width >> 1);
        const y = rect.top + (rect.height >> 1);
        const data = { files: input.files };

        ['dragenter', 'dragover', 'drop'].forEach((name) => {
            const mouseEvent: any = document.createEvent('MouseEvent');
            mouseEvent.initMouseEvent(name, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null);
            mouseEvent.dataTransfer = data;
            target.dispatchEvent(mouseEvent);
        });

        document.body.removeChild(input);
    }, false);

    document.body.appendChild(input);
    return input;
};

export class DropActions {

    static async dropFile(dropArea, filePath) {
        const absolutePath = path.resolve(path.join(browser.params.testConfig.main.rootPath, filePath));

        fs.accessSync(absolutePath, fs.constants.F_OK);
        const elem = await dropArea.getWebElement();
        const input: any = await browser.executeScript(JS_BIND_INPUT, elem);
        return input.sendKeys(absolutePath);
    }

    static async dropFolder(dropArea, folderPath) {
        const absolutePath = path.resolve(path.join(browser.params.testConfig.main.rootPath, folderPath));
        fs.accessSync(absolutePath, fs.constants.F_OK);

        const elem = await dropArea.getWebElement();
        const input: any = await browser.executeScript(JS_BIND_INPUT_FOLDER, elem);
        return input.sendKeys(absolutePath);
    }

    static async dragAndDrop(elementToDrag: ElementFinder, locationToDragTo: ElementFinder, locationOffset = { x: 230, y: 280 }) {
        await BrowserActions.click(elementToDrag);
        await browser.actions().mouseDown(elementToDrag).mouseMove(locationToDragTo, locationOffset).mouseUp().perform();
        await browser.actions().doubleClick(locationToDragTo).perform();
    }

    static async dragAndDropNotClickableElement(elementToDrag: ElementFinder, locationToDragTo: ElementFinder) {
        await browser.actions().mouseMove(elementToDrag).perform();
        await browser.actions().mouseDown(elementToDrag).perform();
        await browser.actions().mouseMove({ x: 10, y: 100 }).perform();
        await browser.actions().mouseMove(locationToDragTo).perform();
        return browser.actions().mouseUp().perform();
    }

    static async dropElement(locationToDragTo: ElementFinder) {
        await browser.actions().mouseDown(locationToDragTo).perform();
    }
}
