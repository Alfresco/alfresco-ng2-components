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

import { browser, by, element } from 'protractor';
import Util = require('../../../util/util');

export class CreateFolderDialog {
    folderNameField = element(by.id('adf-folder-name-input'));
    folderDescriptionField = element(by.id('adf-folder-description-input'));
    createButton = element(by.id('adf-folder-create-button'));
    cancelButton = element(by.id('adf-folder-cancel-button'));

    clickOnCreateButton() {
        Util.waitUntilElementIsVisible(this.createButton);
        this.createButton.click();
        return this;
    }

    checkCreateBtnIsDisabled() {
        Util.waitUntilElementIsVisible(this.createButton);
        expect(this.createButton.getAttribute('disabled')).toEqual('true');
        return this;
    }

    checkCreateBtnIsEnabled() {
        this.createButton.isEnabled();
        return this;
    }

    clickOnCancelButton() {
        Util.waitUntilElementIsVisible(this.cancelButton);
        this.cancelButton.click();
        return this;
    }

    addFolderName(folderName) {
        Util.waitUntilElementIsVisible(this.folderNameField);
        this.folderNameField.clear();
        this.folderNameField.sendKeys(folderName);
        browser.driver.sleep(500);
        return this;
    }

    addFolderDescription(folderDescription) {
        Util.waitUntilElementIsVisible(this.folderDescriptionField);
        this.folderDescriptionField.clear();
        this.folderDescriptionField.sendKeys(folderDescription);
        return this;
    }

}
