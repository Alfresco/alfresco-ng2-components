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

/* tslint:disable */
import { browser } from 'protractor';

import fs = require('fs');
import path = require('path');
import TestConfig = require('../test.config');

let JS_BIND_INPUT = function (target) {
    let input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.addEventListener('change', function (event) {
        target.scrollIntoView(true);

        let rect = target.getBoundingClientRect();
        let x = rect.left + (rect.width >> 1);
        let y = rect.top + (rect.height >> 1);
        let data = { files: input.files };

        ['dragenter', 'dragover', 'drop'].forEach(function (name) {
            let mouseEvent: any = document.createEvent('MouseEvent');
            mouseEvent.initMouseEvent(name, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null);
            mouseEvent.dataTransfer = data;
            target.dispatchEvent(mouseEvent);
        });

        document.body.removeChild(input);
    }, false);

    document.body.appendChild(input);
    return input;
};

let JS_BIND_INPUT_FOLDER = function (target) {
    let input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.multiple = true;
    input.webkitdirectory = true;
    input.addEventListener('change', function (event) {
        target.scrollIntoView(true);

        let rect = target.getBoundingClientRect();
        let x = rect.left + (rect.width >> 1);
        let y = rect.top + (rect.height >> 1);
        let data = { files: input.files };

        ['dragenter', 'dragover', 'drop'].forEach(function (name) {
            let mouseEvent: any = document.createEvent('MouseEvent');
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

    dropFile(dropArea, filePath) {
        let absolutePath = path.resolve(path.join(TestConfig.main.rootPath, filePath));

        fs.accessSync(absolutePath, fs.constants.F_OK);
        return dropArea.getWebElement().then((element) => {
            browser.executeScript(JS_BIND_INPUT, element).then((input: any) => {
                input.sendKeys(absolutePath);

            });
        });
    }

    dropFolder(dropArea, folderPath) {
        let absolutePath = path.resolve(path.join(TestConfig.main.rootPath, folderPath));
        fs.accessSync(absolutePath, fs.constants.F_OK);

        return dropArea.getWebElement().then((element) => {
            browser.executeScript(JS_BIND_INPUT_FOLDER, element).then((input: any) => {
                input.sendKeys(absolutePath);

            });
        });
    }
}
