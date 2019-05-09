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

import TestConfig = require('../../../test.config');
import path = require('path');
import remote = require('selenium-webdriver/remote');
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class AttachmentListPage {

    attachFileButton = element(by.css("input[type='file']"));
    buttonMenu = element(by.css("button[data-automation-id='action_menu_0']"));
    viewButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.VIEW_CONTENT']"));
    removeButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.REMOVE_CONTENT']"));
    downloadButton = element(by.css("button[data-automation-id*='MENU_ACTIONS.DOWNLOAD_CONTENT']"));
    noContentContainer = element(by.css("div[class*='adf-no-content-container']"));

    checkEmptyAttachmentList() {
        BrowserVisibility.waitUntilElementIsVisible(this.noContentContainer);
    }

    clickAttachFileButton(fileLocation) {
        browser.setFileDetector(new remote.FileDetector());

        BrowserVisibility.waitUntilElementIsVisible(this.attachFileButton);
        return this.attachFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
    }

    checkFileIsAttached(name) {
        const fileAttached = element.all(by.css('div[data-automation-id="' + name + '"]')).first();
        BrowserVisibility.waitUntilElementIsVisible(fileAttached);
    }

    checkAttachFileButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.attachFileButton);
    }

    viewFile(name) {
        BrowserActions.closeMenuAndDialogs();
        BrowserVisibility.waitUntilElementIsVisible(element.all(by.css('div[data-automation-id="' + name + '"]')).first());
        element.all(by.css('div[data-automation-id="' + name + '"]')).first().click();
        BrowserActions.click(this.buttonMenu);
        browser.driver.sleep(500);
        BrowserActions.click(this.viewButton);
        browser.driver.sleep(500);
        return this;
    }

    removeFile(name) {
        BrowserActions.closeMenuAndDialogs();
        BrowserVisibility.waitUntilElementIsVisible(element.all(by.css('div[data-automation-id="' + name + '"]')).first());
        element.all(by.css('div[data-automation-id="' + name + '"]')).first().click();
        BrowserActions.click(this.buttonMenu);
        browser.driver.sleep(500);
        BrowserActions.click(this.removeButton);
        browser.driver.sleep(500);
        return this;
    }

    downloadFile(name) {
        BrowserActions.closeMenuAndDialogs();
        BrowserVisibility.waitUntilElementIsVisible(element.all(by.css('div[data-automation-id="' + name + '"]')).first());
        element.all(by.css('div[data-automation-id="' + name + '"]')).first().click();
        BrowserActions.click(this.buttonMenu);
        browser.driver.sleep(500);
        BrowserActions.click(this.downloadButton);
        return this;
    }

    doubleClickFile(name) {
        BrowserActions.closeMenuAndDialogs();
        BrowserVisibility.waitUntilElementIsVisible(element.all(by.css('div[data-automation-id="' + name + '"]')).first());
        const fileAttached = element.all(by.css('div[data-automation-id="' + name + '"]')).first();
        BrowserActions.click(fileAttached);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    checkFileIsRemoved(name) {
        const fileAttached = element.all(by.css('div[data-automation-id="' + name + '"]')).first();
        BrowserVisibility.waitUntilElementIsNotVisible(fileAttached);
        return this;
    }

}
