/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ElementFinder, browser, $ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/form-fields';

export class TaskFormCloudComponent {

    cancelButton = $('button[id="adf-cloud-cancel-task"]');
    completeButton = $('button[id="adf-form-complete"]');
    releaseButton = $('button[adf-cloud-unclaim-task]');
    saveButton = $('button[id="adf-form-save"]');
    claimButton = $('button[adf-cloud-claim-task]');
    form = $('adf-cloud-form');
    formTitle = $(`span.adf-form-title`);
    emptyContentIcon = $(`div.adf-empty-content adf-icon.adf-empty-content__icon`);
    emptyContentTitle = $(`div.adf-empty-content div.adf-empty-content__title`);
    emptyContentSubtitle = $(`div.adf-empty-content div.adf-empty-content__subtitle`);
    readOnlyForm = $('div[class="adf-readonly-form"]');

    getButtonLocatorByName = (name: string): ElementFinder => $(`button[id="adf-form-${name}"]`);

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

    async checkAndClickCompleteButton(): Promise<void> {
        await this.isCompleteButtonEnabled();
        await this.clickCompleteButton();
    }

    async checkFormOutcomeButtonIsDisplayedByName(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.getButtonLocatorByName(name));
    }

    async checkFormOutcomeButtonIsNotDisplayedByName(name: string) {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.getButtonLocatorByName(name));
    }

    async clickFormOutcomeButtonByName(name: string): Promise<void> {
        await BrowserActions.click(this.getButtonLocatorByName(name));
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

    async waitTillTaskFormDisplayed(): Promise<void> {
        await this.checkFormIsDisplayed();
        await this.formFields().checkFormIsDisplayed();
    }

    async checkFormAndCompleteTask(): Promise<void> {
        await this.waitTillTaskFormDisplayed();
        await this.checkCompleteButtonIsDisplayed();
        await this.isCompleteButtonEnabled();
        await this.clickCompleteButton();
    }

}
