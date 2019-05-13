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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { by, element } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';

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
        const fieldElement: any = element(locator(field));
        BrowserVisibility.waitUntilElementIsVisible(fieldElement);
        fieldElement.clear().sendKeys(value);
        return this;
    }

    checkWidgetIsVisible(fieldId) {
        const fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        BrowserVisibility.waitUntilElementIsVisible(fieldElement);
    }

    checkWidgetIsHidden(fieldId) {
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        BrowserVisibility.waitUntilElementIsVisible(hiddenElement);
    }

    getWidget(fieldId) {
        const widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        BrowserVisibility.waitUntilElementIsVisible(widget);
        return widget;
    }

    getFieldValue(fieldId, valueLocatorParam) {
        const value = this.getWidget(fieldId).element(valueLocatorParam || this.valueLocator);
        BrowserVisibility.waitUntilElementIsVisible(value);
        return value.getAttribute('value');
    }

    getFieldLabel(fieldId, labelLocatorParam) {
        const label = this.getWidget(fieldId).all(labelLocatorParam || this.labelLocator).first();
        return BrowserActions.getText(label);
    }

    getFieldErrorMessage(fieldId) {
        const error = this.getWidget(fieldId).element(this.errorMessage);
        return BrowserActions.getText(error);
    }

    getFieldText(fieldId, labelLocatorParam) {
        const label = this.getWidget(fieldId).element(labelLocatorParam || this.labelLocator);
        return BrowserActions.getText(label);
    }

    getFieldPlaceHolder(fieldId, locator = 'input') {
        const placeHolderLocator = element(by.css(`${locator}#${fieldId}`));
        BrowserVisibility.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator.getAttribute('placeholder');
    }

    checkFieldValue(locator, field, val) {
        BrowserVisibility.waitUntilElementHasValue(element(locator(field)), val);
        return this;
    }

    refreshForm() {
        BrowserActions.click(this.refreshButton);
        return this;
    }

    saveForm() {
        BrowserActions.click(this.saveButton);
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
        return BrowserActions.getText(this.noFormMessage);
    }

    getCompletedTaskNoFormMessage() {
        return BrowserActions.getText(this.completedTaskNoFormMessage);
    }

    clickOnAttachFormButton() {
        BrowserActions.click(this.attachFormButton);
        return this;
    }

    selectForm(formName) {
        BrowserActions.click(this.selectFormDropDownArrow);
        BrowserVisibility.waitUntilElementIsVisible(this.selectFormContent);
        this.selectFormFromDropDown(formName);
        return this;
    }

    selectFormFromDropDown(formName) {
        const formNameElement = element(by.cssContainingText('span', formName));
        BrowserActions.click(formNameElement);
    }

    checkWidgetIsReadOnlyMode(fieldId) {
        const widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        const widgetReadOnly = widget.element(by.css('div[class*="adf-readonly"]'));
        BrowserVisibility.waitUntilElementIsVisible(widgetReadOnly);
        return widgetReadOnly;
    }

    completeForm() {
        return BrowserActions.click(this.completeButton);
    }

    setValueInInputById(fieldId, value) {
        const input: any = element(by.id(fieldId));
        BrowserVisibility.waitUntilElementIsVisible(input);
        input.clear().sendKeys(value);
        return this;
    }

    isCompleteFormButtonDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.getAttribute('disabled');
    }
}
