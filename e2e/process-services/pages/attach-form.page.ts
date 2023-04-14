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

import { $ } from 'protractor';
import { BrowserVisibility, BrowserActions, DropdownPage } from '@alfresco/adf-testing';

export class AttachFormPage {

    noFormMessage = $('.adf-empty-content__title');
    attachFormButton = $('#adf-attach-form-attach-button');
    completeButton = $('#adf-attach-form-complete-button');
    formDropdown = $('#form_id');
    cancelButton = $('#adf-attach-form-cancel-button');
    defaultTitle = $('.mat-card-title');
    attachFormDropdown = new DropdownPage($('.adf-attach-form-row'));

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

    async openDropDownForms(): Promise<void> {
       await BrowserActions.click(this.formDropdown);
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
        await BrowserVisibility.waitUntilElementIsVisible($('button[id="adf-attach-form-attach-button"][disabled]'));
    }
}
