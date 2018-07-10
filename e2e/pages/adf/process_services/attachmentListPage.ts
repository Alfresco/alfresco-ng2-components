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

import Util = require('../../../util/util');
import TestConfig = require('../../../test.config');
import path = require('path');

export class AttachmentListPage {

    attachFileButton = element(by.css("input[type='file']"));
    buttonMenu = element(by.css("button[data-automation-id='action_menu_0']"));
    menuPanel = element(by.css("div[class*='mat-menu-panel'] div[class*='mat-menu-content']"));
    viewButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.VIEW_CONTENT']"));
    removeButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.REMOVE_CONTENT']"));
    downloadButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.DOWNLOAD_CONTENT']"));
    noContentContainer = element(by.css("div[class*='adf-no-content-container']"));

    checkEmptyAttachmentList() {
        Util.waitUntilElementIsVisible(this.noContentContainer);
    }

    clickAttachFileButton(fileLocation) {
        Util.waitUntilElementIsVisible(this.attachFileButton);
        this.attachFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
    }

    checkFileIsAttached(name) {
        let fileAttached = element(by.css('div[filename="' + name + '"]'));
        Util.waitUntilElementIsVisible(fileAttached);
    }

    checkAttachFileButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.attachFileButton);
    }

    viewFile(name) {
        let fileAttached = element(by.css('div[filename="' + name + '"]'));
        Util.waitUntilElementIsVisible(fileAttached);
        fileAttached.click();
        Util.waitUntilElementIsVisible(this.buttonMenu);
        Util.waitUntilElementIsClickable(this.buttonMenu);
        this.buttonMenu.click();
        Util.waitUntilElementIsVisible(this.menuPanel);
        Util.waitUntilElementIsVisible(this.viewButton);
        this.viewButton.click();
        return this;
    }

    removeFile(name) {
        let fileAttached = element(by.css('div[filename="' + name + '"]'));
        fileAttached.click();
        Util.waitUntilElementIsVisible(this.buttonMenu);
        Util.waitUntilElementIsClickable(this.buttonMenu);
        this.buttonMenu.click();
        Util.waitUntilElementIsVisible(this.menuPanel);
        Util.waitUntilElementIsVisible(this.removeButton);
        this.removeButton.click();
        return this;
    }

    downloadFile(name) {
        let fileAttached = element(by.css('div[filename="' + name + '"]'));
        fileAttached.click();
        Util.waitUntilElementIsVisible(this.buttonMenu);
        Util.waitUntilElementIsClickable(this.buttonMenu);
        this.buttonMenu.click();
        Util.waitUntilElementIsVisible(this.menuPanel);
        Util.waitUntilElementIsVisible(this.downloadButton);
        this.downloadButton.click();
        return this;
    }

    doubleClickFile(name) {
        let fileAttached = element(by.css('div[filename="' + name + '"]'));
        Util.waitUntilElementIsVisible(fileAttached);
        Util.waitUntilElementIsClickable(fileAttached);
        fileAttached.click();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    checkFileIsRemoved(name) {
        let fileAttached = element(by.css('div[filename="' + name + '"]'));
        Util.waitUntilElementIsNotVisible(fileAttached);
        return this;
    }

}
