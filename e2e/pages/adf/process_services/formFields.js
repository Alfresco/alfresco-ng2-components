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
    var noFormMessage = element(by.css("span[id*='no-form-message']"));
    var completedTaskNoFormMessage = element(by.css("div[id*='completed-form-message'] p"));
    var attachFormButton = element(by.id("adf-no-form-attach-form-button"));
    var selectFormDropDownArrow = element.all(by.css("adf-attach-form div[class*='mat-select-arrow']")).first();
    var selectFormContent = element(by.css("div[class*='mat-select-content']"));
    var completeButton = element(by.id('adf-form-complete'));
    var errorMessage = by.css('.adf-error-text-container .adf-error-text');

    this.setFieldValue = function (By, field, value) {
        var fieldElement =  element(By(field));
        Util.waitUntilElementIsVisible(fieldElement);
        fieldElement.clear().sendKeys(value);
        return this;
    };

    this.checkWidgetIsVisible = function (fieldId) {
        var fieldElement = element(by.css("adf-form-field div[id='field-"+fieldId+"-container']"));
        Util.waitUntilElementIsVisible(fieldElement);
    }

    this.checkWidgetIsHidden = function (fieldId) {
        var hiddenElement = element(by.css("adf-form-field div[id='field-"+fieldId+"-container'][hidden]"));
        Util.waitUntilElementIsVisible(hiddenElement);
    }

    this.getWidget = function (fieldId) {
        var widget = element(by.css("adf-form-field div[id='field-" + fieldId + "-container']"));
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

    this.getFieldErrorMessage = function (fieldId) {
        var error = this.getWidget(fieldId).element(errorMessage);
        return error.getText();
    }

    this.getFieldText = function (fieldId, labelLocatorParam) {
        var label = this.getWidget(fieldId).all(labelLocatorParam || labelLocator).first();
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    };

    this.getFieldPlaceHolder = function (fieldId, locator='input') {
        let placeHolderLocator = element(by.css(`${locator}#${fieldId}`)).getAttribute('placeholder');
        Util.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator;
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

    this.getNoFormMessage = function () {
        Util.waitUntilElementIsVisible(noFormMessage);
        return noFormMessage.getText();
    };

    this.getCompletedTaskNoFormMessage = function () {
        Util.waitUntilElementIsVisible(completedTaskNoFormMessage);
        return completedTaskNoFormMessage.getText();
    };

    this.clickOnAttachFormButton = function () {
        Util.waitUntilElementIsVisible(attachFormButton);
        attachFormButton.click();
        return this;
    };

    this.selectForm = function (formName) {
        Util.waitUntilElementIsVisible(selectFormDropDownArrow);
        selectFormDropDownArrow.click();
        Util.waitUntilElementIsVisible(selectFormContent);
        this.selectFormFromDropDown(formName);
        return this;
    };

    this.selectFormFromDropDown = function (formName) {
        var formNameElement = element(by.cssContainingText("span", formName));
        Util.waitUntilElementIsVisible(formNameElement);
        formNameElement.click();
    };

    this.checkWidgetIsReadOnlyMode = function (fieldId) {
        var widget = element(by.css("adf-form-field div[id='field-" + fieldId + "-container']"));
        var widgetReadOnly = widget.element(by.css('div[class*="adf-readonly"]'));
        Util.waitUntilElementIsVisible(widgetReadOnly);
        return widgetReadOnly;
    };

    this.completeForm = function () {
        Util.waitUntilElementIsVisible(completeButton);
        return completeButton.click();
    };

    this.typeInInputById = function(id, text) {
        let input = element(by.id(id));
        Util.waitUntilElementIsVisible(input);
        input.sendKeys(text);
        return this;
    }

    this.isCompleteFormButtonDisabled = function() {
        Util.waitUntilElementIsVisible(completeButton);
        return completeButton.getAttribute('disabled');
    }
};

module.exports = FormFields;
