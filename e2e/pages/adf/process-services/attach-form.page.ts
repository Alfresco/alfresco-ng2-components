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
import { BrowserVisibility, BrowserActions, DropdownPage } from '@alfresco/adf-testing';

export class AttachFormPage {

    noFormMessage = element(by.css('.adf-empty-content__title'));
    attachFormButton = element(by.id('adf-attach-form-attach-button'));
    completeButton = element(by.id('adf-attach-form-complete-button'));
    formDropdown = element(by.id('form_id'));
    cancelButton = element(by.id('adf-attach-form-cancel-button'));
    defaultTitle = element(by.css('.mat-card-title'));
    attachFormDropdown = new DropdownPage(element(by.css('.adf-attach-form-row')));

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

    async checkDefaultFormTitleIsDisplayed(formTitle: string): Promise<void> {
        const result = await BrowserActions.getText(this.defaultTitle);
        await expect(result).toEqual(formTitle);
    }

    async checkFormDropdownIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.formDropdown);
    }

    async checkCancelButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async selectAttachFormOption(option: string): Promise<void> {
        await this.attachFormDropdown.selectDropdownOption(option);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async checkAttachFormButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[id="adf-attach-form-attach-button"][disabled]')));
    }
}
