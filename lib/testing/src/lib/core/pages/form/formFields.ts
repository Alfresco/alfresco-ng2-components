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

import { by, element, Locator } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../utils/public-api';
import { ElementFinder } from 'protractor';

export class FormFields {

    formContent: ElementFinder = element(by.css('adf-form-renderer'));
    refreshButton: ElementFinder = element(by.css('div[class*="form-reload-button"] mat-icon'));
    saveButton: ElementFinder = element(by.cssContainingText('mat-card-actions[class*="adf-for"] span', 'SAVE'));
    valueLocator: Locator = by.css('input');
    labelLocator: Locator = by.css('label');
    noFormMessage: ElementFinder = element(by.css('span[id*="no-form-message"]'));
    completedTaskNoFormMessage: ElementFinder = element(by.css('div[id*="completed-form-message"] p'));
    attachFormButton: ElementFinder = element(by.id('adf-no-form-attach-form-button'));
    selectFormDropDownArrow: ElementFinder = element.all(by.css('adf-attach-form div[class*="mat-select-arrow"]')).first();
    selectFormContent: ElementFinder = element(by.css('div[class*="mat-select-panel"]'));
    completeButton: ElementFinder = element(by.id('adf-form-complete'));
    errorMessage: Locator = by.css('.adf-error-text-container .adf-error-text');

    async setFieldValue(locator, field, value): Promise<void> {
        const fieldElement = element(locator(field));
        await BrowserActions.clearSendKeys(fieldElement, value);
    }

    async clickField(locator, field): Promise<void> {
        const fieldElement = element(locator(field));
        await BrowserActions.click(fieldElement);
    }

    async checkWidgetIsVisible(fieldId): Promise<void> {
        const fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        await BrowserVisibility.waitUntilElementIsVisible(fieldElement);
    }

    async checkWidgetIsClickable(fieldId): Promise<void> {
        const fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        await BrowserVisibility.waitUntilElementIsClickable(fieldElement);
    }

    async checkWidgetIsHidden(fieldId): Promise<void> {
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement);
    }

    async checkWidgetIsNotHidden(fieldId): Promise<void> {
        await this.checkWidgetIsVisible(fieldId);
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement, 6000);
    }

    getWidget(fieldId): ElementFinder {
        return element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
    }

    async getFieldValue(fieldId, valueLocatorParam?: any): Promise<string> {
        const valueWidget: ElementFinder = await (await this.getWidget(fieldId)).element(valueLocatorParam || this.valueLocator);
        await BrowserVisibility.waitUntilElementIsVisible(valueWidget);

        return valueWidget.getAttribute('value');
    }

    async getFieldLabel(fieldId, labelLocatorParam?: any) {
        const label = await (await this.getWidget(fieldId)).all(labelLocatorParam || this.labelLocator).first();
        return BrowserActions.getText(label);
    }

    async getFieldErrorMessage(fieldId): Promise<string> {
        const error = await this.getWidget(fieldId);
        error.element(this.errorMessage);
        return BrowserActions.getText(error);
    }

    async getFieldText(fieldId, labelLocatorParam?: any) {
        const label = await (await this.getWidget(fieldId)).element(labelLocatorParam || this.labelLocator);
        return BrowserActions.getText(label);
    }

    async getFieldPlaceHolder(fieldId, locator = 'input'): Promise<string> {
        const placeHolderLocator: ElementFinder = element(by.css(`${locator}#${fieldId}`));
        await BrowserVisibility.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator.getAttribute('placeholder');
    }

    async checkFieldValue(locator, field, val): Promise<void> {
        await BrowserVisibility.waitUntilElementHasValue(element(locator(field)), val);
    }

    async refreshForm(): Promise<void> {
        await BrowserActions.click(this.refreshButton);
    }

    async saveForm(): Promise<void> {
        await BrowserActions.click(this.saveButton);
    }

    async noFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.formContent);
    }

    async checkFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.formContent);
    }

    async getNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.noFormMessage);
    }

    async getCompletedTaskNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.completedTaskNoFormMessage);
    }

    async clickOnAttachFormButton(): Promise<void> {
        await BrowserActions.click(this.attachFormButton);
    }

    async selectForm(formName): Promise<void> {
        await BrowserActions.click(this.selectFormDropDownArrow);
        await BrowserVisibility.waitUntilElementIsVisible(this.selectFormContent);
        await this.selectFormFromDropDown(formName);
    }

    async selectFormFromDropDown(formName): Promise<void> {
        const formNameElement = element(by.cssContainingText('span', formName));
        await BrowserActions.click(formNameElement);
    }

    async checkWidgetIsReadOnlyMode(fieldId): Promise<ElementFinder> {
        const widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        const widgetReadOnly = widget.element(by.css('div[class*="adf-readonly"]'));
        await BrowserVisibility.waitUntilElementIsVisible(widgetReadOnly);
        return widgetReadOnly;
    }

    async completeForm(): Promise<void> {
        await BrowserActions.click(this.completeButton);
    }

    async setValueInInputById(fieldId, value): Promise<void> {
        const input = element(by.id(fieldId));
        await BrowserActions.clearSendKeys(input, value);
    }

    async isCompleteFormButtonDisabled(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.getAttribute('disabled');
    }
}
