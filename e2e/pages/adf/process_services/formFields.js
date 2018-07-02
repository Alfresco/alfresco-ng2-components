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

var FormFields = function () {

    var formContent = element(by.css("adf-form"));
    var refreshButton = element(by.css("div[class*='form-reload-button'] mat-icon"));
    var saveButton = element(by.cssContainingText("mat-card-actions[class*='adf-form'] span", "SAVE"));
    var valueLocator = by.css("input");
    var labelLocator = by.css("label");

    this.setFieldValue = function (By, field, value) {
        var fieldElement =  element(By(field));
        Util.waitUntilElementIsVisible(fieldElement);
        fieldElement.clear().sendKeys(value);
        return this;
    };

    this.getWidget = function (fieldId) {
        var widget = element(by.css("form-field div[id='field-" + fieldId + "-container']"));
        Util.waitUntilElementIsVisible(widget);
        return widget;
    };

    this.getFieldValue = function (fieldId, valueLocatorParam) {
        var value = this.getWidget(fieldId).element(valueLocatorParam || valueLocator);
        Util.waitUntilElementIsVisible(value);
        return value.getAttribute('value');
    };

    this.getFieldLabel = function (fieldId, labelLocatorParam) {
        return this.getFieldText(fieldId, labelLocatorParam);
    };

    this.getFieldText = function (fieldId, labelLocatorParam) {
        var label = this.getWidget(fieldId).element(labelLocatorParam || labelLocator);
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    };

    this.checkFieldValue = function (By, field, val) {
        Util.waitUntilElementHasValue(element(By(field)), val);
        return this;
    };

    this.refreshForm = function () {
        Util.waitUntilElementIsVisible(refreshButton);
        refreshButton.click();
        return this;
    };

    this.saveForm = function () {
        Util.waitUntilElementIsVisible(saveButton);
        Util.waitUntilElementIsClickable(saveButton);
        saveButton.click();
        return this;
    };

    this.noFormIsDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(formContent);
        return this;
    };

    this.checkFormIsDisplayed = function () {
        Util.waitUntilElementIsVisible(formContent);
        return this;
    };

};

module.exports = FormFields;
