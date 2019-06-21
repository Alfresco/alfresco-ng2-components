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

export class TaskFormCloudComponent {

    cancelButton = element(by.css('button[id="adf-cloud-cancel-task"]'));
    completeButton = element(by.css('button[id="adf-form-complete"]'));
    releaseButton = element(by.css('button[adf-cloud-unclaim-task]'));
    saveButton = element(by.css('button[id="adf-form-save"]'));
    claimButton = element(by.css('button[adf-cloud-claim-task]'));
    form = element(by.css('adf-cloud-form'));

    checkCompleteButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this;
    }

    checkCompleteButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.completeButton);
        return this;
    }

    clickCompleteButton() {
        BrowserActions.click(this.completeButton);
        return this;
    }

    clickCancelButton() {
        BrowserActions.click(this.cancelButton);
        return this;
    }

    clickClaimButton() {
        BrowserActions.click(this.claimButton);
        return this;
    }

    formFields() {
        return new FormFields();
    }

    checkFormIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.form);
        return this;
    }

    getReleaseButtonText() {
        return BrowserActions.getText(this.releaseButton);
    }

    checkSaveButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    clickSaveButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        this.saveButton.click();
        return this;
    }
}
