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

var UploadToggles = function () {

    var toggleButton = by.xpath("ancestor::mat-slide-toggle");
    var multipleFileUploadToggle = element(by.cssContainingText("span[class*='toggle-content']", "Multiple File Upload"));
    var uploadFolderToggle = element(by.cssContainingText("span[class*='toggle-content']", "Folder upload"));
    var extensionFilterToggle = element(by.cssContainingText("span[class*='toggle-content']", "Custom extensions filter"));
    var maxSizeToggle = element(by.cssContainingText("span[class*='toggle-content']", "Max size filter"));
    var versioningToggle = element(by.cssContainingText("span[class*='toggle-content']", "Enable versioning"));
    var extensionAcceptedField = element(by.css("input[data-automation-id='accepted-files-type']"));
    var maxSizeField = element(by.css("input[data-automation-id='max-files-size']"));

    this.enableMultipleFileUpload = function () {
        this.enableToggle(multipleFileUploadToggle);
        return this;
    };

    this.disableMultipleFileUpload = function () {
        this.disableToggle(multipleFileUploadToggle);
        return this;
    };

    this.enableFolderUpload = function () {
        this.enableToggle(uploadFolderToggle);
        return this;
    };

    this.disableFolderUpload = function () {
        this.disableToggle(uploadFolderToggle);
        return this;
    };

    this.enableExtensionFilter = function () {
        this.enableToggle(extensionFilterToggle);
        return this;
    };

    this.disableExtensionFilter = function () {
        this.disableToggle(extensionFilterToggle);
        return this;
    };

    this.enableMaxSize = function () {
        this.enableToggle(maxSizeToggle);
        return this;
    };

    this.disableMaxSize = function () {
        this.disableToggle(maxSizeToggle);
        return this;
    };

    this.enableVersioning = function () {
        this.enableToggle(versioningToggle);
        return this;
    };

    this.disableVersioning = function () {
        this.disableToggle(versioningToggle);
        return this;
    };

    this.enableToggle = function (toggle) {
        Util.waitUntilElementIsVisible(toggle);
        Util.waitUntilElementIsPresent(toggle);
        var finalToggleButton = toggle.element(toggleButton);
        finalToggleButton.getAttribute('class').then(function (value) {
            if (value.indexOf('mat-checked')===-1) {
                finalToggleButton.click();
            }
        });
        return this;
    };

    this.disableToggle = function (toggle) {
        Util.waitUntilElementIsVisible(toggle);
        var finalToggleButton = toggle.element(toggleButton);
        finalToggleButton.getAttribute('class').then(function (value) {
            if (value.indexOf('mat-checked')!==-1) {
                finalToggleButton.click();
            }
        });
        return this;
    };

    this.addExtension = function (extension) {
        Util.waitUntilElementIsVisible(extensionAcceptedField);
        extensionAcceptedField.sendKeys("," + extension);
    };

    this.addMaxSize = function (size) {
        this.clearText();
        maxSizeField.sendKeys(size);
    };

    this.clearText = function () {
        Util.waitUntilElementIsVisible(maxSizeField);
        var deferred = protractor.promise.defer();
        maxSizeField.clear().then(function (value) {
            maxSizeField.sendKeys(protractor.Key.ESCAPE);
        });
        return deferred.promise;
    };

};
module.exports = UploadToggles;


