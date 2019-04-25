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

import { BrowserVisibility } from '@alfresco/adf-testing';
import { element, by } from 'protractor';
import { TaskHeaderCloudPage, TaskFormCloudComponent } from '@alfresco/adf-testing';

export class TaskDetailsCloudDemoPage {

    taskHeaderCloudPage = new TaskHeaderCloudPage();
    taskFormCloudPage = new TaskFormCloudComponent();

    taskDetailsHeader = element(by.css(`h4[data-automation-id='task-details-header']`));
    releaseButton = element(by.css('button[adf-cloud-unclaim-task]'));

    taskHeaderCloud() {
        return this.taskHeaderCloudPage;
    }

    taskFormCloud() {
        return this.taskFormCloudPage;
    }

    checkTaskDetailsHeaderIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsHeader);
        return this;
    }

    getTaskDetailsHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsHeader);
        return this.taskDetailsHeader.getText();
    }

    getReleaseButtonText() {
        BrowserVisibility.waitUntilElementIsVisible(this.releaseButton);
        return this.releaseButton.getText();
    }
}
