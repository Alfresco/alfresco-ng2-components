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
var ToggleState = require('../core/toggleState');

var UploadToggles = function () {

    var toggleState = new ToggleState();

    var toggleButton = by.xpath("ancestor::mat-slide-toggle");
    var multipleFileUploadToggle = element(by.cssContainingText("span[class*='toggle-content']", "Multiple File Upload"));
    var uploadFolderToggle = element(by.cssContainingText("span[class*='toggle-content']", "Folder upload"));
    var extensionFilterToggle = element(by.cssContainingText("span[class*='toggle-content']", "Custom extensions filter"));
    var maxSizeToggle = element(by.cssContainingText("span[class*='toggle-content']", "Max size filter"));
    var versioningToggle = element(by.cssContainingText("span[class*='toggle-content']", "Enable versioning"));
    var extensionAcceptedField = element(by.css("input[data-automation-id='accepted-files-type']"));
    var maxSizeField = element(by.css("input[data-automation-id='max-files-size']"));
    var disableUploadCheckbox = element(by.css("[id='adf-disable-upload']"));

    this.enableMultipleFileUpload = function () {
        toggleState.enableToggle(multipleFileUploadToggle);
        return this;
    };

    this.disableMultipleFileUpload = function () {
        toggleState.disableToggle(multipleFileUploadToggle);
        return this;
    };

    this.enableFolderUpload = function () {
        toggleState.enableToggle(uploadFolderToggle);
        return this;
    };

    this.disableFolderUpload = function () {
        toggleState.disableToggle(uploadFolderToggle);
        return this;
    };

    this.enableExtensionFilter = function () {
        toggleState.enableToggle(extensionFilterToggle);
        return this;
    };

    this.disableExtensionFilter = function () {
        toggleState.disableToggle(extensionFilterToggle);
        return this;
    };

    this.enableMaxSize = function () {
        toggleState.enableToggle(maxSizeToggle);
        return this;
    };

    this.disableMaxSize = function () {
        toggleState.disableToggle(maxSizeToggle);
        return this;
    };

    this.enableVersioning = function () {
        toggleState.enableToggle(versioningToggle);
        return this;
    };

    this.disableVersioning = function () {
        toggleState.disableToggle(versioningToggle);
        return this;
    };

    this.clickCheckboxDisableUpload = function () {
        return disableUploadCheckbox.click();
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


