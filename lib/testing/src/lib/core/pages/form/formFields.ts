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

import { by, element } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../utils/public-api';
import { ElementFinder } from 'protractor/built/element';

export class FormFields {

    formContent = element(by.css('adf-form-renderer'));
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

    async setFieldValue(locator, field, value) {
        const fieldElement = element(locator(field));
        await BrowserActions.clearSendKeys(fieldElement, value);
        return this;
    }

    async checkWidgetIsVisible(fieldId) {
        const fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        return BrowserVisibility.waitUntilElementIsOnPage(fieldElement);
    }

    async checkWidgetIsHidden(fieldId) {
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        return BrowserVisibility.waitUntilElementIsVisible(hiddenElement);
    }

    async checkWidgetIsNotHidden(fieldId) {
        this.checkWidgetIsVisible(fieldId);
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        return BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement, 6000);
    }

    async getWidget(fieldId) {
        const widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        await BrowserVisibility.waitUntilElementIsVisible(widget);
        return widget;
    }

    async getFieldValue(fieldId, valueLocatorParam?: any) {
        const value = await this.getWidget(fieldId);
        value.element(valueLocatorParam || this.valueLocator);
        await BrowserVisibility.waitUntilElementIsVisible(value);
        return value.getAttribute('value');
    }

    async getFieldLabel(fieldId, labelLocatorParam?: any): Promise<string> {
        const label = await this.getWidget(fieldId);
        label.all(labelLocatorParam || this.labelLocator).first();
        return BrowserActions.getText(label);
    }

    async getFieldErrorMessage(fieldId) : Promise<string>{
        const error = await this.getWidget(fieldId);
        error.element(this.errorMessage);
        return BrowserActions.getText(error);
    }

    async getFieldText(fieldId, labelLocatorParam?: any): Promise<string> {
        const label = await this.getWidget(fieldId);
        label.element(labelLocatorParam || this.labelLocator);
        return BrowserActions.getText(label);
    }

    async getFieldPlaceHolder(fieldId, locator = 'input') {
        const placeHolderLocator: ElementFinder = element(by.css(`${locator}#${fieldId}`));
        await BrowserVisibility.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator.getAttribute('placeholder');
    }

    async checkFieldValue(locator, field, val) {
        await BrowserVisibility.waitUntilElementHasValue(element(locator(field)), val);
        return this;
    }

    async refreshForm() {
        await BrowserActions.click(this.refreshButton);
        return this;
    }

    async saveForm() {
        await BrowserActions.click(this.saveButton);
        return this;
    }

    async noFormIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.formContent);
        return this;
    }

    async checkFormIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.formContent);
        return this;
    }

    async getNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.noFormMessage);
    }

    async getCompletedTaskNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.completedTaskNoFormMessage);
    }

    async clickOnAttachFormButton() {
        await BrowserActions.click(this.attachFormButton);
        return this;
    }

    async selectForm(formName) {
        await BrowserActions.click(this.selectFormDropDownArrow);
        await BrowserVisibility.waitUntilElementIsVisible(this.selectFormContent);
        this.selectFormFromDropDown(formName);
        return this;
    }

    async selectFormFromDropDown(formName): Promise<void> {
        const formNameElement = element(by.cssContainingText('span', formName));
        await BrowserActions.click(formNameElement);
    }

    async checkWidgetIsReadOnlyMode(fieldId) {
        const widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        const widgetReadOnly = widget.element(by.css('div[class*="adf-readonly"]'));
        await BrowserVisibility.waitUntilElementIsVisible(widgetReadOnly);
        return widgetReadOnly;
    }

    async completeForm(): Promise<void> {
        await BrowserActions.click(this.completeButton);
    }

    async setValueInInputById(fieldId, value) {
        const input = element(by.id(fieldId));
        await BrowserActions.clearSendKeys(input, value);
        return this;
    }

    async isCompleteFormButtonDisabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.getAttribute('disabled');
    }
}
