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

import { BrowserVisibility } from '../../core/browser-visibility';
import { by, element } from 'protractor';

export class FormFieldsPage {

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
        let fieldElement: any = element(locator(field));
        BrowserVisibility.waitUntilElementIsVisible(fieldElement);
        fieldElement.clear().sendKeys(value);
        return this;
    }

    checkWidgetIsVisible(fieldId) {
        let fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        BrowserVisibility.waitUntilElementIsVisible(fieldElement);
    }

    checkWidgetIsHidden(fieldId) {
        let hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        BrowserVisibility.waitUntilElementIsVisible(hiddenElement);
    }

    getWidget(fieldId) {
        let widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        BrowserVisibility.waitUntilElementIsVisible(widget);
        return widget;
    }

    getFieldValue(fieldId, valueLocatorParam) {
        let value = this.getWidget(fieldId).element(valueLocatorParam || this.valueLocator);
        BrowserVisibility.waitUntilElementIsVisible(value);
        return value.getAttribute('value');
    }

    getFieldLabel(fieldId, labelLocatorParam) {
        let label = this.getWidget(fieldId).all(labelLocatorParam || this.labelLocator).first();
        BrowserVisibility.waitUntilElementIsVisible(label);
        return label.getText();
    }

    getFieldErrorMessage(fieldId) {
        let error = this.getWidget(fieldId).element(this.errorMessage);
        return error.getText();
    }

    getFieldText(fieldId, labelLocatorParam) {
        let label = this.getWidget(fieldId).element(labelLocatorParam || this.labelLocator);
        BrowserVisibility.waitUntilElementIsVisible(label);
        return label.getText();
    }

    getFieldPlaceHolder(fieldId, locator = 'input') {
        let placeHolderLocator = element(by.css(`${locator}#${fieldId}`)).getAttribute('placeholder');
        BrowserVisibility.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator;
    }

    checkFieldValue(locator, field, val) {
        BrowserVisibility.waitUntilElementHasValue(element(locator(field)), val);
        return this;
    }

    refreshForm() {
        BrowserVisibility.waitUntilElementIsVisible(this.refreshButton);
        this.refreshButton.click();
        return this;
    }

    saveForm() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        BrowserVisibility.waitUntilElementIsClickable(this.saveButton);
        this.saveButton.click();
        return this;
    }

    noFormIsDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.formContent);
        return this;
    }

    checkFormIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.formContent);
        return this;
    }

    getNoFormMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.noFormMessage);
        return this.noFormMessage.getText();
    }

    getCompletedTaskNoFormMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.completedTaskNoFormMessage);
        return this.completedTaskNoFormMessage.getText();
    }

    clickOnAttachFormButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.attachFormButton);
        this.attachFormButton.click();
        return this;
    }

    selectForm(formName) {
        BrowserVisibility.waitUntilElementIsVisible(this.selectFormDropDownArrow);
        this.selectFormDropDownArrow.click();
        BrowserVisibility.waitUntilElementIsVisible(this.selectFormContent);
        this.selectFormFromDropDown(formName);
        return this;
    }

    selectFormFromDropDown(formName) {
        let formNameElement = element(by.cssContainingText('span', formName));
        BrowserVisibility.waitUntilElementIsVisible(formNameElement);
        formNameElement.click();
    }

    checkWidgetIsReadOnlyMode(fieldId) {
        let widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        let widgetReadOnly = widget.element(by.css('div[class*="adf-readonly"]'));
        BrowserVisibility.waitUntilElementIsVisible(widgetReadOnly);
        return widgetReadOnly;
    }

    completeForm() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.click();
    }

    setValueInInputById(fieldId, value) {
        let input: any = element(by.id(fieldId));
        BrowserVisibility.waitUntilElementIsVisible(input);
        input.clear().sendKeys(value);
        return this;
    }

    isCompleteFormButtonDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.getAttribute('disabled');
    }
}
