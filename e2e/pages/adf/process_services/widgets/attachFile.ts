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

import FormFields = require('../formFields');
import TestConfig = require('../../../../test.config');
import path = require('path');
import Util = require('../../../../util/util');
import remote = require('selenium-webdriver/remote');
import { DisplayText } from './displayText';

export class AttachFile {

    formFields = new FormFields();
    uploadLocator = by.css('button[id="attachfile"]');
    localStorageButton = element(by.css('input[id="attachfile"]'));
    filesListLocator = by.css('div[id="adf-attach-widget-readonly-list"]');

    attachFile(fieldId, fileLocation) {
        browser.setFileDetector(new remote.FileDetector());
        let widget = this.formFields.getWidget(fieldId);
        let uploadButton = widget.element(this.uploadLocator);
        Util.waitUntilElementIsVisible(uploadButton);
        uploadButton.click();

        Util.waitUntilElementIsVisible(this.localStorageButton);
        this.localStorageButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        return this;
    }

    checkFileIsAttached(fieldId, name) {
        let widget = this.formFields.getWidget(fieldId);
        let fileAttached = widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        Util.waitUntilElementIsVisible(fileAttached);
        return this;
    }

    viewFile(name) {
        let fileView = element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        Util.waitUntilElementIsVisible(fileView);
        fileView.click();
        browser.actions().doubleClick(fileView).perform();
        return this;
    }
}
