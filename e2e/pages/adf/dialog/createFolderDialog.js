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

var CreateFolderDialog = function () {

    var folderNameField = element(by.id('adf-folder-name-input'));
    var folderDescriptionField = element(by.id('adf-folder-description-input'));
    var createButton = element(by.id('adf-folder-create-button'));
    var cancelButton = element(by.id('adf-folder-cancel-button'));

    this.clickOnCreateButton = function () {
        Util.waitUntilElementIsVisible(createButton);
        createButton.click();
        return this;
    };

    this.checkCreateBtnIsDisabled = function () {
        Util.waitUntilElementIsVisible(createButton);
        expect(createButton.getAttribute("disabled")).toEqual("true");
        return this;
    };

    this.checkCreateBtnIsEnabled = function () {
        createButton.isEnabled();
        return this;
    };

    this.clickOnCancelButton = function () {
        Util.waitUntilElementIsVisible(cancelButton);
        cancelButton.click();
        return this;
    };

    this.addFolderName = function (folderName) {
        Util.waitUntilElementIsVisible(folderNameField);
        folderNameField.clear().sendKeys(folderName);
        browser.driver.sleep(500);
        return this;
    };

    this.addFolderDescription = function (folderDescription) {
        Util.waitUntilElementIsVisible(folderDescriptionField);
        folderDescriptionField.clear().sendKeys(folderDescription);
        return this;
    };

};
module.exports = CreateFolderDialog;
