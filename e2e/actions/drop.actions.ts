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

import fs = require('fs');
import path = require('path');
import { browser } from 'protractor';
import remote = require('selenium-webdriver/remote');

const JS_BIND_INPUT = function(target) {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.addEventListener('change', function(event) {
        target.scrollIntoView(true);

        const rect = target.getBoundingClientRect();
        const x = rect.left + (rect.width >> 1);
        const y = rect.top + (rect.height >> 1);
        const data = { files: input.files };

        ['dragenter', 'dragover', 'drop'].forEach(function(name) {
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

const JS_BIND_INPUT_FOLDER = function(target) {
    const input: any = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.multiple = true;
    input.webkitdirectory = true;
    input.addEventListener('change', function(event) {
        target.scrollIntoView(true);

        const rect = target.getBoundingClientRect();
        const x = rect.left + (rect.width >> 1);
        const y = rect.top + (rect.height >> 1);
        const data = { files: input.files };

        ['dragenter', 'dragover', 'drop'].forEach(function(name) {
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

    async dropFile(dropArea, filePath) {
        browser.setFileDetector(new remote.FileDetector());

        const absolutePath = path.resolve(path.join(browser.params.testConfig.main.rootPath, filePath));

        fs.accessSync(absolutePath, fs.constants.F_OK);
        const elem = await dropArea.getWebElement();
        const input: any = await browser.executeScript(JS_BIND_INPUT, elem);
        return await input.sendKeys(absolutePath);
    }

    async dropFolder(dropArea, folderPath) {
        browser.setFileDetector(new remote.FileDetector());

        const absolutePath = path.resolve(path.join(browser.params.testConfig.main.rootPath, folderPath));
        fs.accessSync(absolutePath, fs.constants.F_OK);

        const elem = await dropArea.getWebElement();
        const input: any = await browser.executeScript(JS_BIND_INPUT_FOLDER, elem);
        return await input.sendKeys(absolutePath);
    }
}
