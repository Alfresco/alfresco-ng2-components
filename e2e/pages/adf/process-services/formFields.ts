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

import { Util } from '../../../util/util';
import { by, element } from 'protractor';

export class FormFields {

    formContent = element(by.css('adf-form'));
    refreshButton = element(by.css('div[class*="form-reload-button"] mat-icon'));
    saveButton = element(by.cssContainingText('mat-card-actions[class*="adf-for"] span', 'SAVE'));
    valueLocator = by.css('input');
    labelLocator = by.css('label');
    noFormMessage = element(by.css('span[id*="no-form-message"]'));
    completedTaskNoFormMessage = element(by.css('div[id*="completed-form-message"] p'));
    attachFormButton = element(by.id('adf-no-form-attach-form-button'));
    selectFormDropDownArrow = element.all(by.css('adf-attach-form div[class*="mat-select-arrow"]')).first();
    selectFormContent = element(by.css('div[class*="mat-select-panel"]'));
    completeButton = element(by.id('adf-form-complete'));
    errorMessage = by.css('.adf-error-text-container .adf-error-text');

    setFieldValue(locator, field, value) {
        let fieldElement = element(locator(field));
        Util.waitUntilElementIsVisible(fieldElement);
        fieldElement.clear();
        fieldElement.sendKeys(value);
        return this;
    }

    checkWidgetIsVisible(fieldId) {
        let fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        Util.waitUntilElementIsVisible(fieldElement);
    }

    checkWidgetIsHidden(fieldId) {
        let hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        Util.waitUntilElementIsVisible(hiddenElement);
    }

    getWidget(fieldId) {
        let widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        Util.waitUntilElementIsVisible(widget);
        return widget;
    }

    getFieldValue(fieldId, valueLocatorParam) {
        let value = this.getWidget(fieldId).element(valueLocatorParam || this.valueLocator);
        Util.waitUntilElementIsVisible(value);
        return value.getAttribute('value');
    }

    getFieldLabel(fieldId, labelLocatorParam) {
        let label = this.getWidget(fieldId).all(labelLocatorParam || this.labelLocator).first();
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    }

    getFieldErrorMessage(fieldId) {
        let error = this.getWidget(fieldId).element(this.errorMessage);
        return error.getText();
    }

    getFieldText(fieldId, labelLocatorParam) {
        let label = this.getWidget(fieldId).element(labelLocatorParam || this.labelLocator);
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    }

    getFieldPlaceHolder(fieldId, locator = 'input') {
        let placeHolderLocator = element(by.css(`${locator}#${fieldId}`)).getAttribute('placeholder');
        Util.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator;
    }

    checkFieldValue(locator, field, val) {
        Util.waitUntilElementHasValue(element(locator(field)), val);
        return this;
    }

    refreshForm() {
        Util.waitUntilElementIsVisible(this.refreshButton);
        this.refreshButton.click();
        return this;
    }

    saveForm() {
        Util.waitUntilElementIsVisible(this.saveButton);
        Util.waitUntilElementIsClickable(this.saveButton);
        this.saveButton.click();
        return this;
    }

    noFormIsDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.formContent);
        return this;
    }

    checkFormIsDisplayed() {
        Util.waitUntilElementIsVisible(this.formContent);
        return this;
    }

    getNoFormMessage() {
        Util.waitUntilElementIsVisible(this.noFormMessage);
        return this.noFormMessage.getText();
    }

    getCompletedTaskNoFormMessage() {
        Util.waitUntilElementIsVisible(this.completedTaskNoFormMessage);
        return this.completedTaskNoFormMessage.getText();
    }

    clickOnAttachFormButton() {
        Util.waitUntilElementIsVisible(this.attachFormButton);
        this.attachFormButton.click();
        return this;
    }

    selectForm(formName) {
        Util.waitUntilElementIsVisible(this.selectFormDropDownArrow);
        this.selectFormDropDownArrow.click();
        Util.waitUntilElementIsVisible(this.selectFormContent);
        this.selectFormFromDropDown(formName);
        return this;
    }

    selectFormFromDropDown(formName) {
        let formNameElement = element(by.cssContainingText('span', formName));
        Util.waitUntilElementIsVisible(formNameElement);
        formNameElement.click();
    }

    checkWidgetIsReadOnlyMode(fieldId) {
        let widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        let widgetReadOnly = widget.element(by.css('div[class*="adf-readonly"]'));
        Util.waitUntilElementIsVisible(widgetReadOnly);
        return widgetReadOnly;
    }

    completeForm() {
        Util.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.click();
    }

    setValueInInputById(fieldId, value) {
        let input = element(by.id(fieldId));
        Util.waitUntilElementIsVisible(input);
        input.clear();
        input.sendKeys(value);
        return this;
    }

    isCompleteFormButtonDisabled() {
        Util.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.getAttribute('disabled');
    }
}
