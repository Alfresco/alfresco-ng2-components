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

var Util = require('../../../util/util');
var TestConfig = require('../../../test.config');
var path = require('path');

var AttachmentListPage = function () {

    var attachFileButton = element(by.css("input[type='file']"));
    var buttonMenu = element(by.css("button[data-automation-id='action_menu_0']"));
    var menuPanel = element(by.css("div[class*='mat-menu-panel'] div[class*='mat-menu-content']"));
    var viewButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.VIEW_CONTENT']"));
    var removeButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.REMOVE_CONTENT']"));
    var downloadButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.DOWNLOAD_CONTENT']"));
    var noContentContainer = element(by.css("div[class*='adf-no-content-container']"));

    this.checkEmptyAttachmentList = function () {
        Util.waitUntilElementIsVisible(noContentContainer);
    };

    this.clickAttachFileButton = function (fileLocation) {
        Util.waitUntilElementIsVisible(attachFileButton);
        attachFileButton.sendKeys(path.resolve(path.join(TestConfig.adf.rootPath, fileLocation)));
    };

    this.checkFileIsAttached = function (name) {
        var fileAttached = element(by.css('div[filename="'+name+'"]'));
        Util.waitUntilElementIsVisible(fileAttached);
    };

    this.checkAttachFileButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(attachFileButton);
    };

    this.viewFile = function (name) {
        var fileAttached = element(by.css('div[filename="'+name+'"]'));
        Util.waitUntilElementIsVisible(fileAttached);
        fileAttached.click();
        Util.waitUntilElementIsVisible(buttonMenu);
        Util.waitUntilElementIsClickable(buttonMenu);
        buttonMenu.click();
        Util.waitUntilElementIsVisible(menuPanel);
        Util.waitUntilElementIsVisible(viewButton);
        viewButton.click();
        return this;
    };

    this.removeFile = function (name) {
        var fileAttached = element(by.css('div[filename="'+name+'"]'));
        fileAttached.click();
        Util.waitUntilElementIsVisible(buttonMenu);
        Util.waitUntilElementIsClickable(buttonMenu);
        buttonMenu.click();
        Util.waitUntilElementIsVisible(menuPanel);
        Util.waitUntilElementIsVisible(removeButton);
        removeButton.click();
        return this;
    };

    this.downloadFile = function (name) {
        var fileAttached = element(by.css('div[filename="'+name+'"]'));
        fileAttached.click();
        Util.waitUntilElementIsVisible(buttonMenu);
        Util.waitUntilElementIsClickable(buttonMenu);
        buttonMenu.click();
        Util.waitUntilElementIsVisible(menuPanel);
        Util.waitUntilElementIsVisible(downloadButton);
        downloadButton.click();
        return this;
    };

    this.doubleClickFile = function (name) {
        var fileAttached = element(by.css('div[filename="'+name+'"]'));
        Util.waitUntilElementIsVisible(fileAttached);
        Util.waitUntilElementIsClickable(fileAttached);
        fileAttached.click();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    this.checkFileIsRemoved = function (name) {
        var fileAttached = element(by.css('div[filename="'+name+'"]'));
        Util.waitUntilElementIsNotVisible(fileAttached);
        return this;
    };

    this.dragAndDropAttachment = function (fileLocation, fileName) {
        var elementToAttach = element(by.css('input[type="file"]'));
        var target = element(by.xpath('//div/adf-upload-drag-area'));
        Util.dragAndDropFile(elementToAttach, target, fileLocation);
        this.checkFileIsAttached(fileName);
    };
};
module.exports = AttachmentListPage;
