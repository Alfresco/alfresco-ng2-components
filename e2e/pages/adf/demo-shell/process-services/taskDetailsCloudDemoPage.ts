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

import { BrowserVisibility, BrowserActions, FormFields } from '@alfresco/adf-testing';
import { element, by } from 'protractor';
import { TaskFormCloudComponent } from '@alfresco/adf-testing';

export class TaskDetailsCloudDemoPage {

    taskFormCloudPage = new TaskFormCloudComponent();

    formContent = element(by.css('adf-cloud-form'));
    taskDetailsHeader = element(by.css(`h4[data-automation-id='task-details-header']`));
    releaseButton = element(by.css('button[adf-cloud-unclaim-task]'));
    saveButton = element(by.css('button[id="adf-form-save"]'));
    completeButton = element(by.css('button[id="adf-form-complete"]'));

    taskFormCloud() {
        return this.taskFormCloudPage;
    }

    checkTaskDetailsHeaderIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsHeader);
        return this;
    }

    formFields() {
        return new FormFields();
    }

    checkSaveButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    checkCompleteButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this;
    }

    checkCompleteButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this;
    }

    clickSaveButton() {
        BrowserActions.click(this.saveButton);
        return this;
    }

    clickCompleteButton() {
        BrowserActions.click(this.completeButton);
        return this;
    }

    getTaskDetailsHeader() {
        return BrowserActions.getText(this.taskDetailsHeader);
    }

    getReleaseButtonText() {
        return BrowserActions.getText(this.releaseButton);
    }
}
