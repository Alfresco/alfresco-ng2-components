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

import { element, by, ElementFinder, browser } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/form-fields';

export class TaskFormCloudComponent {

    cancelButton = element(by.css('button[id="adf-cloud-cancel-task"]'));
    completeButton = element(by.css('button[id="adf-form-complete"]'));
    releaseButton = element(by.css('button[adf-cloud-unclaim-task]'));
    saveButton = element(by.css('button[id="adf-form-save"]'));
    claimButton = element(by.css('button[adf-cloud-claim-task]'));
    form = element(by.css('adf-cloud-form'));
    formTitle = element(by.css(`span.adf-form-title`));
    emptyContentIcon = element(by.css(`div.adf-empty-content adf-icon.adf-empty-content__icon`));
    emptyContentTitle = element(by.css(`div.adf-empty-content div.adf-empty-content__title`));
    emptyContentSubtitle = element(by.css(`div.adf-empty-content div.adf-empty-content__subtitle`));
    readOnlyForm = element(by.css('div[class="adf-readonly-form"]'));

    async isCompleteButtonEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton.isEnabled();
    }

    async checkFormIsReadOnly() {
        await BrowserVisibility.waitUntilElementIsVisible(this.readOnlyForm);
    }

    async checkFormIsNotReadOnly() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.readOnlyForm);
    }

    async checkReleaseButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.releaseButton);
    }

    async checkReleaseButtonIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.releaseButton);
    }

    async checkClaimButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.claimButton);
    }

    async checkClaimButtonIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.claimButton);
    }

    async checkCancelButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async checkCompleteButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
    }

    async checkCompleteButtonIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.completeButton);
    }

    async clickCompleteButton(): Promise<void> {
        await BrowserActions.click(this.completeButton);
        await browser.sleep(500);
    }

    async checkFormOutcomeButtonIsDisplayedByName(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css(`button[id="adf-form-${name}"]`)));
    }

    async checkFormOutcomeButtonIsNotDisplayedByName(name: string) {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`button[id="adf-form-${name}"]`)));
    }

    async clickFormOutcomeButtonByName(name: string): Promise<void> {
        await BrowserActions.click(element(by.css(`button[id="adf-form-${name}"]`)));
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async clickClaimButton(): Promise<void> {
        await BrowserActions.click(this.claimButton);
    }

    async clickReleaseButton(): Promise<void> {
        await BrowserActions.click(this.releaseButton);
    }

    formFields(): FormFields {
        return new FormFields();
    }

    async checkFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.form);
    }

    async getFormTitle(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.formTitle);
        return BrowserActions.getText(this.formTitle);
    }

    async checkFormIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.form);
    }

    async getReleaseButtonText(): Promise<string> {
        return BrowserActions.getText(this.releaseButton);
    }

    async checkSaveButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
    }

    async clickSaveButton(): Promise<void> {
        await BrowserActions.click(this.saveButton);
    }

    async checkFormContentIsEmpty(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyContentIcon);
    }

    async getEmptyFormContentTitle(): Promise<string> {
        return BrowserActions.getText(this.emptyContentTitle);
    }

    async getEmptyFormContentSubtitle(): Promise<string> {
        return BrowserActions.getText(this.emptyContentSubtitle);
    }

    async getCompleteButton(): Promise<ElementFinder> {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton;
    }

    async waitTillTaskFormDisplayed() {
        await this.checkFormIsDisplayed();
        await this.formFields().checkFormIsDisplayed();
    }

}
