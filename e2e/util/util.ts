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

import { browser } from 'protractor';
import fs = require('fs');

export class Util {

    /**
     * Generates a sequence of files with name: baseName + index + extension (e.g.) baseName1.txt, baseName2.txt, ...
     *
     * @param startIndex {int}
     * @param endIndex {int}
     * @param baseName{string} the base name of all files
     * @param extension{string} the extension of the file
     * @return fileNames
     * @method generateSequenceFiles
     */
    static generateSequenceFiles(startIndex, endIndex, baseName, extension) {
        const fileNames = [];
        for (let i = startIndex; i <= endIndex; i++) {
            fileNames.push(baseName + i + extension);
        }
        return fileNames;
    }

    /**
     * Returns TRUE if the first array contains all elements from the second one.
     *
     * @param {array} superset
     * @param {array} subset
     *
     * @return {boolean}
     * @method arrayContainsArray
     */
    static arrayContainsArray(superset: any[], subset: any[]) {
        if (0 === subset.length) {
            return false;
        }
        return subset.every(function (value) {
            return (superset.indexOf(value) >= 0);
        });
    }

    static openNewTabInBrowser() {
        browser.driver.executeScript("window.open('about: blank', '_blank');");
    }

    static switchToWindowHandler(windowNumber) {
        browser.driver.getAllWindowHandles().then((handles) => {
            browser.waitForAngularEnabled();
            browser.driver.switchTo().window(handles[windowNumber]);
        });
    }

    /**
     * Verify file exists
     * @param filePath - absolute path to the searched file
     * @param retries - number of retries
     * @returns - true if file is found, false otherwise
     */
    static fileExists(filePath, retries) {
        let tries = 0;
        return new Promise(function (resolve, reject) {
            const checkExist = setInterval(() => {
                fs.stat(filePath, function (error, stats) {
                    tries++;

                    if (error && tries === retries) {
                        clearInterval(checkExist);
                        resolve(false);
                    }

                    if (!error) {
                        clearInterval(checkExist);
                        resolve(true);
                    }
                });
            }, 2000);
        });
    }
}
