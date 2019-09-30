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

import { element, by, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class AttachFormPage {

    noFormMessage: ElementFinder = element(by.id('adf-no-form-message'));
    attachFormButton: ElementFinder = element(by.id('adf-no-form-attach-form-button'));
    completeButton: ElementFinder = element(by.id('adf-no-form-complete-button'));
    formDropdown: ElementFinder = element(by.id('form_id'));
    cancelButton: ElementFinder = element(by.id('adf-no-form-cancel-button'));
    defaultTitle: ElementFinder = element(by.css('mat-card-title[class="mat-card-title mat-card-title"]'));
    attachFormDropdown: ElementFinder = element(by.css("div[class='adf-attach-form-row']"));

    async checkNoFormMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noFormMessage);
    }

    async checkAttachFormButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachFormButton);
    }

    async checkCompleteButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
    }

    async clickAttachFormButton(): Promise<void> {
        await BrowserActions.click(this.attachFormButton);
    }

    async checkDefaultFormTitleIsDisplayed(formTitle): Promise<void> {
        const result = await BrowserActions.getText(this.defaultTitle);
        await expect(result).toEqual(formTitle);
    }

    async checkFormDropdownIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.formDropdown);
    }

    async checkCancelButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async clickAttachFormDropdown(): Promise<void> {
        await BrowserActions.click(this.attachFormDropdown);
    }

    async selectAttachFormOption(option): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(element(by.cssContainingText("mat-option[role='option']", option)));
        await BrowserActions.click(element(by.cssContainingText("mat-option[role='option']", option)));
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async checkAttachFormButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[id="adf-no-form-attach-form-button"][disabled]')));
    }
}
