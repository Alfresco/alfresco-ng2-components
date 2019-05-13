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

import { FormFields } from '../formFields';
import TestConfig = require('../../../../test.config');
import path = require('path');
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import remote = require('selenium-webdriver/remote');
import { element, by, browser } from 'protractor';

export class AttachFileWidget {

    formFields = new FormFields();
    uploadLocator = by.css('button[id="attachfile"]');
    localStorageButton = element(by.css('input[id="attachfile"]'));
    filesListLocator = by.css('div[id="adf-attach-widget-readonly-list"]');

    attachFile(fieldId, fileLocation) {
        browser.setFileDetector(new remote.FileDetector());
        const widget = this.formFields.getWidget(fieldId);
        const uploadButton = widget.element(this.uploadLocator);
        BrowserActions.click(uploadButton);
        BrowserVisibility.waitUntilElementIsVisible(this.localStorageButton);
        this.localStorageButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        return this;
    }

    checkFileIsAttached(fieldId, name) {
        const widget = this.formFields.getWidget(fieldId);
        const fileAttached = widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        BrowserVisibility.waitUntilElementIsVisible(fileAttached);
        return this;
    }

    viewFile(name) {
        const fileView = element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        BrowserActions.click(fileView);
        browser.actions().doubleClick(fileView).perform();
        return this;
    }
}
