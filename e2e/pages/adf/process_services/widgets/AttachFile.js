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

var FormFields = require('../formFields');
var TestConfig = require('../../../../test.config');
var path = require('path');
var Util = require('../../../../util/util');

var AttachFile = function () {

    var formFields = new FormFields();
    var uploadLocator = by.css("button[id='attachfile']");
    var localStorageButton = element(by.css("input[id='attachfile']"));
    var filesListLocator = by.css("div[id='adf-attach-widget-readonly-list']");

    this.attachFile = function (fieldId, fileLocation) {
        var widget = formFields.getWidget(fieldId);
        var uploadButton = widget.element(uploadLocator);
        Util.waitUntilElementIsVisible(uploadButton);
        uploadButton.click();

        Util.waitUntilElementIsVisible(localStorageButton);
        localStorageButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        return this;
    };

    this.checkFileIsAttached = function (fieldId, name) {
        var widget = formFields.getWidget(fieldId);
        var fileAttached = widget.element(filesListLocator).element(by.cssContainingText("mat-list-item span ", name));
        Util.waitUntilElementIsVisible(fileAttached);
        return this;
    };

    this.viewFile = function (name) {
        var fileView = element(filesListLocator).element(by.cssContainingText("mat-list-item span ", name));
        Util.waitUntilElementIsVisible(fileView);
        fileView.click();
        browser.actions().doubleClick(fileView).perform();
        return this;
    };
};

module.exports = AttachFile;
