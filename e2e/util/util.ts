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

import { browser, protractor } from 'protractor';
import fs = require('fs');
import TestConfig = require('../test.config');

let until = protractor.ExpectedConditions;
let DEFAULT_TIMEOUT = parseInt(TestConfig.main.timeout, 10);

export class Util {

    static generatePasswordString(length: number = 8): string {
        let text = '';
        let possibleUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let possibleLowerCase = 'abcdefghijklmnopqrstuvwxyz';
        let lowerCaseLimit = Math.floor(length / 2);

        for (let i = 0; i < lowerCaseLimit; i++) {
            text += possibleLowerCase.charAt(Math.floor(Math.random() * possibleLowerCase.length));
        }

        for (let i = 0; i < length - lowerCaseLimit; i++) {
            text += possibleUpperCase.charAt(Math.floor(Math.random() * possibleUpperCase.length));
        }

        return text;
    }

    /**
     * Generates a random string - digits only.
     *
     * @param length {int} If this parameter is not provided the length is set to 8 by default.
     * @return {string}
     * @method generateRandomString
     */
    static generateRandomStringDigits(length: number = 8): string {
        let text = '';
        let possible = '0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    /**
     * Generates a random string - non-latin characters only.
     *
     * @param length {int} If this parameter is not provided the length is set to 3 by default.
     * @return {string}
     * @method generateRandomString
     */
    static generateRandomStringNonLatin(length: number = 3): string {
        let text = '';
        let possible = '密码你好𠮷';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

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
        let fileNames = [];
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

    static waitUntilElementIsVisible(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        let isDisplayed = false;
        return browser.wait(() => {
            browser.waitForAngularEnabled();

            elementToCheck.isDisplayed().then(
                () => {
                    isDisplayed = true;
                },
                (err) => {
                    isDisplayed = false;
                }
            );
            return isDisplayed;
        }, waitTimeout, 'Element is not visible ' + elementToCheck.locator());
    }

    static waitUntilElementIsPresent(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        browser.waitForAngularEnabled();

        return browser.wait(until.presenceOf(elementToCheck), waitTimeout, 'Element is not present ' + elementToCheck.locator());
    }

    /*
     * Wait for element to have value
     */
    static waitUntilElementHasValue(elementToCheck, elementValue, waitTimeout: number = DEFAULT_TIMEOUT) {
        browser.waitForAngularEnabled();

        browser.wait(until.textToBePresentInElementValue(elementToCheck, elementValue), waitTimeout, 'Element doesn\'t have a value ' + elementToCheck.locator());
    }

    /*
     * Wait for element to be clickable
     */
    static waitUntilElementIsClickable(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(() => {
            browser.waitForAngularEnabled();
            return until.elementToBeClickable(elementToCheck);
        }, waitTimeout, 'Element is not Clickable' + elementToCheck.locator());
    }

    /*
     * Wait for element to not be visible
     */
    static waitUntilElementIsNotVisible(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(() => {
            browser.waitForAngularEnabled();
            return elementToCheck.isPresent().then(function (present) {
                return !present;
            });
        }, waitTimeout, 'Element is Visible and it should not' + elementToCheck.locator());
    }

    static waitUntilElementIsNotDisplayed(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(() => {
            browser.waitForAngularEnabled();
            return elementToCheck.isDisplayed().then(function (present) {
                return !present;
            });
        }, waitTimeout, 'Element is dysplayed and it should not' + elementToCheck.locator());
    }

    /*
     * Wait for element to not be visible
     */
    static waitUntilElementIsStale(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(until.stalenessOf(elementToCheck), waitTimeout, 'Element is not in stale ' + elementToCheck.locator());
    }

    /*
     * Wait for element to not be visible
     */
    static waitUntilElementIsNotOnPage(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(() => {
            browser.waitForAngularEnabled();
            return browser.wait(until.not(until.visibilityOf(elementToCheck)));
        }, waitTimeout, 'Element is not in the page ' + elementToCheck.locator());
    }

    static waitUntilElementIsOnPage(elementToCheck, waitTimeout: number = DEFAULT_TIMEOUT) {
        return browser.wait(browser.wait(until.visibilityOf(elementToCheck)), waitTimeout);
    }

    /**
     * @method waitForPage
     */
    static waitForPage() {
        browser.wait(function () {
            let deferred = protractor.promise.defer();
            browser.executeScript('return document.readyState').then((text) => {
                deferred.fulfill(() => {
                    return text === 'complete';
                });
            });
            return deferred.promise;
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
            let checkExist = setInterval(() => {
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
