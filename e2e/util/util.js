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

var exports = module.exports = {};
var http = require('http');
var https = require('https');

var fs = require('fs');
var FormData = require('form-data');
var path = require('path');

var until = protractor.ExpectedConditions;
var TestConfig = require('../test.config');
var moment = require('moment');
var CONSTANTS = require('./constants');


var DEFAULT_TIMEOUT = 20000;
/**
 * Provides utility methods used throughout the testing framework.
 *
 * @class util.Util
 */

// Dynamically load http or https library based on protocol chosen
var apiRequest = TestConfig.main.protocol !== 'http' ? https : http;

/**
 * creates an absolute path string if multiple file uploads are required
 */
exports.uploadParentFolder = function (filePath) {
    var parentFolder = path.resolve(path.join(__dirname, 'test'));
    var absolutePath = path.resolve(path.join(parentFolder, filePath));

    return absolutePath;
};

/**
 * Sleeps the main thread for time millieconds
 * @param time {int} Milliseconds to sleep
 * @param callback
 * @method sleep
 */
exports.sleep = function (time, callback) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
    }
    callback();
};


exports.refreshBrowser = function () {
    browser.refresh();
};

/**
 * Get current date in long format: Oct 24, 2016
 *
 * @return {string}
 * @method getCrtDateLongFormat
 */
exports.getCrtDateLongFormat = function () {
    var currentDate = new Date();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    currentDate = months[currentDate.getMonth()] + ' ' + currentDate.getDate() + ', ' + (currentDate.getYear() + 1900);

    return currentDate;
};

/**
 * Get current date in specified format
 *
 * @return {string}
 * @method getCrtDateInFormat
 */
exports.getCrtDateInFormat = function (dateFormat) {
    var currentDate = moment().format(dateFormat);
    // console.debug("Current date formatted with: '" + dateFormat + "' format, is: '" + currentDate + "'");
    return currentDate;
};

/**
 * Generates a random string.
 *
 * @param length {int} If this parameter is not provided the length is set to 8 by default.
 * @return {string}
 * @method generateRandomString
 */
exports.generateRandomString = function (length) {
    length = typeof length !== 'undefined' ? length : 8;
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.generatePasswordString = function (length) {
    length = typeof length !== 'undefined' ? length : 8;
    var text = '';
    var possibleUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var possibleLowerCase = 'abcdefghijklmnopqrstuvwxyz';
    var lowerCaseLimit = Math.floor(length / 2);

    for (var i = 0; i < lowerCaseLimit; i++) {
        text += possibleLowerCase.charAt(Math.floor(Math.random() * possibleLowerCase.length));
    }

    for (var i = 0; i < length - lowerCaseLimit; i++) {
        text += possibleUpperCase.charAt(Math.floor(Math.random() * possibleUpperCase.length));
    }

    return text;
};

/**
 * Generates a random string - digits only.
 *
 * @param length {int} If this parameter is not provided the length is set to 8 by default.
 * @return {string}
 * @method generateRandomString
 */
exports.generateRandomStringDigits = function (length) {
    length = typeof length !== 'undefined' ? length : 8;
    var text = '';
    var possible = '0123456789';

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

/**
 * Generates a random string - non-latin characters only.
 *
 * @param length {int} If this parameter is not provided the length is set to 3 by default.
 * @return {string}
 * @method generateRandomString
 */
exports.generateRandomStringNonLatin = function (length) {
    length = typeof length !== 'undefined' ? length : 3;
    var text = '';
    var possible = '密码你好𠮷';

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

/**
 * Generates a random string to lowercase.
 *
 * @param length {int} If this parameter is not provided the length is set to 8 by default.
 * @return {string}
 * @method generateRandomString
 */
exports.generateRandomStringToLowerCase = function (length) {

    return this.generateRandomString().toLowerCase();
};

/**
 * Generates a random string to uppercase.
 *
 * @param length {int} If this parameter is not provided the length is set to 8 by default.
 * @return {string}
 * @method generateRandomString
 */
exports.generateRandomStringToUpperCase = function (length) {

    return this.generateRandomString().toUpperCase();
};


/**
 * Generates a sequence of files with name: baseName + index + extension (e.g.) baseName1.txt, baseName2.txt, ...
 *
 * @param startIndex {int}
 * @param endIndex {int}
 * @param baseName{string} the base name of all files
 * @param extension{string} the extension of the file
 * @return fileNames
 * @method generateSeqeunceFiles
 */
exports.generateSeqeunceFiles = function (startIndex, endIndex, baseName, extension) {
    var fileNames = [];
    for (var i = startIndex; i <= endIndex; i++) {
        fileNames.push(baseName + i + extension);
    }
    return fileNames;
};

/**
 * Generates a random number (as int) in the interval [min, max).
 *
 * @param min {int}
 * @param max {int}
 * @return {number}
 * @method generateRandomInt
 */
exports.generateRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Generates a random email address following the format: abcdef@activiti.test.com
 *
 * @param length {int}
 * @return {string}
 * @method generateRandomEmail
 */
exports.generateRandomEmail = function (length) {
    length = typeof length !== 'undefined' ? length : 5;
    var email = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++)
        email += possible.charAt(Math.floor(Math.random() * possible.length));

    email += '@activiti.test.com';
    return email.toLowerCase();
};


/**
 * Generates a random date inside the interval [1990, 2100) following the format ddmmyyyy.
 *
 * @return {string}
 * @method generateRandomDateFormat
 */
exports.generateRandomDateFormat = function () {
    var day = Math.floor(Math.random() * (29 - 1) + 1);
    var month = Math.floor(Math.random() * (12 - 1) + 1);
    var year = Math.floor(Math.random() * (2100 - 1990) + 1990);

    return day + '.' + month + '.' + year;
};

/**
 * Generates a random date inside the interval [1990, 2100) following the format dd-mm-yyyy.
 *
 * @return {string}
 * @method generateRandomDate
 */
exports.generateRandomDate = function () {
    var day = Math.floor(Math.random() * (29 - 1) + 1);
    if (day < 10) day = '0' + day;
    var month = Math.floor(Math.random() * (12 - 1) + 1);
    if (month < 10) month = '0' + month;
    var year = Math.floor(Math.random() * (2100 - 1990) + 1990);

    return day + '-' + month + '-' + year;
};

/**
 * Returns TRUE if the first array contains all elements from the second one.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @return {boolean}
 * @method arrayContainsArray
 */
exports.arrayContainsArray = function (superset, subset) {
    if (0 === subset.length) {
        return false;
    }
    return subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
    });
};

/**
 * Reads the content of the file and provides it on callback
 *
 * @param filePath
 * @param callback
 * @method readFile
 */
exports.readFile = function (filePath, callback) {
    var absolutePath = path.join(TestConfig.main.rootPath + filePath);
    fs.readFile(absolutePath, {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        callback(data);
    });
};

/**
 * Executes external script that simulates dragndrop
 * Waits for the form to open
 */
exports.prepareFieldDndOnForm = function (script) {
    // TODO
    // Currently all fields are added to the second column
    // Ability to add fields to first column is needed as well
    // dnd simulation script may need to be modified for this to be possible
    browser.driver.executeScript(script);
    browser.waitForAngular();
};

/**
 * Wait for url
 */
exports.waitUntilUrlIsShowed = function (urlToWait, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    browser.wait(() => {
        return browser.getCurrentUrl().then(function (url) {
            return (url.indexOf(TestConfig.main.host + urlToWait.toString()) !== -1);
        }, waitTimeout, urlToWait + 'is not showed');
    });
};

exports.waitUntilElementIsVisible = function (elementToCheck, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(until.visibilityOf(elementToCheck), waitTimeout, 'Element is not visible ' + elementToCheck.locator());
};

exports.waitUntilElementIsPresent = function (elementToCheck, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(until.presenceOf(elementToCheck), waitTimeout, 'Element is not present ' + elementToCheck.locator());
};

/**
 * Click element
 */
exports.clickElement = function (elementToClick, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    waitUntilElementIsVisible(elementToClick, timeout);
    elementToClick.click();
};

/**
 * Type in  element
 */
exports.typeElement = function (elementToType, valueToType, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    waitUntilElementIsVisible(elementToType, timeout);
    elementToType.clear().sendKeys(valueToType);
};


/*
 * Wait for element to have value
 */
exports.waitUntilElementHasValue = function (elementToCheck, elementValue, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    browser.wait(until.textToBePresentInElementValue(elementToCheck, elementValue), waitTimeout, 'Element doesn\'t have a value ' + elementToCheck.locator());
};

/*
 * Wait for element to be clickable
 */
exports.waitUntilElementIsClickable = function (elementToCheck, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(() => {
        return until.elementToBeClickable(elementToCheck);
    }, waitTimeout, 'Element is not Clickable' + elementToCheck.locator());
};

/*
 * Wait for element to not be visibile
 */
exports.waitUntilElementIsNotVisible = function (elementToCheck, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(() => {
        return elementToCheck.isPresent().then(function (present) {
            return !present;
        })
    }, waitTimeout, 'Element is not in Visible ' + elementToCheck.locator());
};

exports.waitUntilElementIsNotDisplayed = function (elementToCheck, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(() => {
        return elementToCheck.isDisplayed().then(function (present) {
            return !present;
        })
    }, waitTimeout, 'Element is not in dysplayed ' + elementToCheck.locator());
};

/*
 * Wait for element to not be visibile
 */
exports.waitUntilElementIsStale = function (elementToCheck, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(until.stalenessOf(elementToCheck), waitTimeout, 'Element is not in stale ' + elementToCheck.locator());
};

/*
 * Wait for element to not be visibile
 */
exports.waitUntilElementIsNotOnPage = function (elementToCheck, timeout) {
    var waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(() => {
        return browser.wait(until.not(until.visibilityOf(elementToCheck)));
    }, waitTimeout, 'Element is not in the page ' + elementToCheck.locator());
};

exports.waitUntilElementIsOnPage = function (elementToCheck, timeout) {
    waitTimeout = timeout || DEFAULT_TIMEOUT;

    return browser.wait(browser.wait(until.visibilityOf(elementToCheck)), timeout);
};

/*
 * Wait for top message 'form saved' etc to not be visible
 * @param URL is url navigating to
 */
exports.waitUntilTopMessageIsNotVisible = function (URL) {
    this.waitUntilUrlIsShowed(URL);
    this.waitUntilElementIsNotVisible(element(by.css("div[ng-click='dismissAlert()'] > i[class='glyphicon glyphicon-ok']")));
    this.waitUntilElementIsNotOnPage(element(by.css("div[class='alert fadein ng-animate info-remove ng-hide-add ng-hide info-remove-active ng-hide-add-active']")));
    this.waitUntilElementIsNotOnPage(element(by.css("div[ng-click='dismissAlert()']")));
};


/*
 * Wait for top message 'process model contains error' etc to not be visible
 * @param URL is url navigating to
 */
exports.waitUntilTopErrorMessageIsNotVisible = function (URL) {
    this.waitUntilUrlIsShowed(URL);
    this.waitUntilElementIsNotVisible(element(by.css("div[ng-click='dismissAlert()'] > i[class='glyphicon glyphicon-remove']")));
    this.waitUntilElementIsNotOnPage(element(by.css("div[class='alert fadein ng-animate error-remove ng-hide-add ng-hide error-remove-active ng-hide-add-active']")));
    this.waitUntilElementIsNotOnPage(element(by.css("div[ng-click='dismissAlert()']")));
};

/**
 * @method waitForPage
 */
exports.waitForPage = function () {
    browser.wait(function () {
        var deferred = protractor.promise.defer();
        browser.executeScript('return document.readyState').then(function (text) {
            deferred.fulfill(function (text) {
                return text === 'complete';
            });
        });
        return deferred.promise;
    })
};

exports.openNewTabInBrowser = function () {
    browser.driver.executeScript("window.open('about: blank', '_blank');");
};

exports.switchToWindowHandler = function (number) {
    browser.driver.getAllWindowHandles().then(function (handles) {
        browser.driver.switchTo().window(handles[number]);
    });
};

exports.pressDownArrowAndEnter = function () {
    browser.actions().sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ENTER).perform();
};


/**
 * Verify file exists
 * @param filePath - absolute path to the searched file
 * @param retries - number of retries
 * @returns - true if file is found, false otherwise
 */
exports.fileExists = function (filePath, retries) {
    var tries = 0;
    return new Promise(function (resolve, reject) {
        var checkExist = setInterval(() => {
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
        }, 1000);
    });
};
