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

import { element, by } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/formFields';
import { ElementFinder } from 'protractor/built/element';

export class TaskFormCloudComponent {

    cancelButton: ElementFinder = element(by.css('button[id="adf-cloud-cancel-task"]'));
    completeButton: ElementFinder = element(by.css('button[id="adf-form-complete"]'));
    releaseButton: ElementFinder = element(by.css('button[adf-cloud-unclaim-task]'));
    saveButton: ElementFinder = element(by.css('button[id="adf-form-save"]'));
    claimButton: ElementFinder = element(by.css('button[adf-cloud-claim-task]'));
    form: ElementFinder = element(by.css('adf-cloud-form'));
    formTitle: ElementFinder = element(by.css(`span.adf-form-title`));
    emptyContentIcon: ElementFinder = element(by.css(`div.adf-empty-content mat-icon.adf-empty-content__icon`));
    emptyContentTitle: ElementFinder = element(by.css(`div.adf-empty-content div.adf-empty-content__title`));
    emptyContentSubtitle: ElementFinder = element(by.css(`div.adf-empty-content div.adf-empty-content__subtitle`));

    async checkCompleteButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this;
    }

    async checkCompleteButtonIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.completeButton);
        return this;
    }

    async clickCompleteButton() {
        await BrowserActions.click(this.completeButton);
        return this;
    }

    async clickCancelButton() {
        await BrowserActions.click(this.cancelButton);
        return this;
    }

    async clickClaimButton() {
        await BrowserActions.click(this.claimButton);
        return this;
    }

    async clickReleaseButton() {
        await BrowserActions.click(this.releaseButton);
        return this;
    }

    formFields(): FormFields {
        return new FormFields();
    }

    async checkFormIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.form);
        return this;
    }

    async getFormTitle(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.formTitle);
        return BrowserActions.getText(this.formTitle);
    }

    async checkFormIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.form);
        return this;
    }

    async getReleaseButtonText(): Promise<string> {
        return BrowserActions.getText(this.releaseButton);
    }

    async checkSaveButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    async clickSaveButton() {
        await BrowserActions.click(this.saveButton);
        return this;
    }

    async checkFormContentIsEmpty() {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyContentIcon);
        return this;
    }

    async getEmptyFormContentTitle(): Promise<string> {
        return BrowserActions.getText(this.emptyContentTitle);
    }

    async getEmptyFormContentSubtitle(): Promise<string> {
        return BrowserActions.getText(this.emptyContentSubtitle);
    }

    async getCompleteButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this.completeButton;
    }

}
