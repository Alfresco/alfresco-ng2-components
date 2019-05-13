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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class AttachFormPage {

    noFormMessage = element(by.id('adf-no-form-message'));
    attachFormButton = element(by.id('adf-no-form-attach-form-button'));
    completeButton = element(by.id('adf-no-form-complete-button'));
    formDropdown = element(by.id('form_id'));
    cancelButton = element(by.id('adf-no-form-cancel-button'));
    defaultTitle = element(by.css('mat-card-title[class="mat-card-title mat-card-title"]'));
    attachFormDropdown = element(by.css("div[class='adf-attach-form-row']"));

    checkNoFormMessageIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.noFormMessage);
    }

    checkAttachFormButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.attachFormButton);
    }

    checkCompleteButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
    }

    clickAttachFormButton() {
        BrowserActions.click(this.attachFormButton);
    }

    checkDefaultFormTitleIsDisplayed(formTitle) {
        this.defaultTitle.getText().then((result) => {
            expect(result).toEqual(formTitle);
        });
    }

    checkFormDropdownIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.formDropdown);
    }

    checkCancelButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    clickAttachFormDropdown() {
        BrowserActions.click(this.attachFormDropdown);
    }

    selectAttachFormOption(option) {
        BrowserVisibility.waitUntilElementIsClickable(element(by.cssContainingText("mat-option[role='option']", option)));
        return element(by.cssContainingText("mat-option[role='option']", option)).click();
    }

    clickCancelButton() {
        BrowserActions.click(this.cancelButton);
    }

    checkAttachFormButtonIsDisabled() {
        return BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[id="adf-no-form-attach-form-button"][disabled]')));
    }
}
