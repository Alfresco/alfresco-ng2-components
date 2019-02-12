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

import { element, by, protractor, browser } from 'protractor';

import { Util } from '../../../util/util';
import TestConfig = require('../../../test.config');
import path = require('path');
import remote = require('selenium-webdriver/remote');

export class AttachmentListPage {

    attachFileButton = element(by.css("input[type='file']"));
    buttonMenu = element(by.css("button[data-automation-id='action_menu_0']"));
    viewButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.VIEW_CONTENT']"));
    removeButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.REMOVE_CONTENT']"));
    downloadButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.DOWNLOAD_CONTENT']"));
    noContentContainer = element(by.css("div[class*='adf-no-content-container']"));

    checkEmptyAttachmentList() {
        Util.waitUntilElementIsVisible(this.noContentContainer);
    }

    clickAttachFileButton(fileLocation) {
        browser.setFileDetector(new remote.FileDetector());

        Util.waitUntilElementIsVisible(this.attachFileButton);
        return this.attachFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
    }

    checkFileIsAttached(name) {
        let fileAttached = element.all(by.css('div[filename="' + name + '"]')).first();
        Util.waitUntilElementIsVisible(fileAttached);
    }

    checkAttachFileButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.attachFileButton);
    }

    viewFile(name) {
        Util.waitUntilElementIsVisible(element.all(by.css('div[filename="' + name + '"]')).first());
        element.all(by.css('div[filename="' + name + '"]')).first().click();
        Util.waitUntilElementIsVisible(this.buttonMenu);
        this.buttonMenu.click();
        Util.waitUntilElementIsVisible(this.viewButton);
        browser.driver.sleep(500);
        this.viewButton.click();
        browser.driver.sleep(500);
        return this;
    }

    removeFile(name) {
        Util.waitUntilElementIsVisible(element.all(by.css('div[filename="' + name + '"]')).first());
        element.all(by.css('div[filename="' + name + '"]')).first().click();
        Util.waitUntilElementIsVisible(this.buttonMenu);
        this.buttonMenu.click();
        Util.waitUntilElementIsVisible(this.removeButton);
        browser.driver.sleep(500);
        this.removeButton.click();
        browser.driver.sleep(500);
        return this;
    }

    downloadFile(name) {
        Util.waitUntilElementIsVisible(element.all(by.css('div[filename="' + name + '"]')).first());
        element.all(by.css('div[filename="' + name + '"]')).first().click();
        Util.waitUntilElementIsVisible(this.buttonMenu);
        this.buttonMenu.click();
        Util.waitUntilElementIsVisible(this.downloadButton);
        browser.driver.sleep(500);
        this.downloadButton.click();
        return this;
    }

    doubleClickFile(name) {
        Util.waitUntilElementIsVisible(element.all(by.css('div[filename="' + name + '"]')).first());
        let fileAttached = element.all(by.css('div[filename="' + name + '"]')).first();
        Util.waitUntilElementIsVisible(fileAttached);
        Util.waitUntilElementIsClickable(fileAttached);
        fileAttached.click();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    checkFileIsRemoved(name) {
        let fileAttached = element.all(by.css('div[filename="' + name + '"]')).first();
        Util.waitUntilElementIsNotVisible(fileAttached);
        return this;
    }

}
