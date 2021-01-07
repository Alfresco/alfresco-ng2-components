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
import {
    BrowserVisibility,
    BrowserActions,
    DataTableComponentPage
} from '@alfresco/adf-testing';

export class ServiceTaskListPage {
    dataTableComponentPage = new DataTableComponentPage();
    allServiceTaskButton = element(by.css('button[data-automation-id="my-service-tasks_filter"]'));
    completedServiceTaskButton = element(by.css('button[data-automation-id="completed-tasks_filter"]'));
    errorServiceTaskButton = element(by.css('button[data-automation-id="errored-service-tasks_filter"]'));
    searchHeader = element(by.css('adf-cloud-edit-service-task-filter mat-expansion-panel-header'));
    serviceTaskList = element(by.css('adf-cloud-service-task-list'));
    activityNameField = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-activityName"]'));
    activityStatus = element(by.css('[data-automation-id="datatable-row-0"] div[aria-label="Status"]'));
    activityName = element(by.css('[data-automation-id="datatable-row-0"] div[aria-label="Activity name"]'));
    resultList = element(by.css('div[role="rowgroup"].adf-datatable-body'));

    async checkServiceTaskFiltersDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.allServiceTaskButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.completedServiceTaskButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.errorServiceTaskButton);
    }

    async checkSearchServiceTaskFiltersDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchHeader);
    }

    async checkServiceTaskListDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.serviceTaskList);
    }

    async clickCompletedServiceTask(): Promise<void> {
        await BrowserActions.click(this.completedServiceTaskButton);
    }

    async clickSearchHeaderServiceTask(): Promise<void> {
        await BrowserActions.click(this.searchHeader);
    }

    async searchByActivityName(text: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.activityNameField, text);
    }

    async getActivityNameText(): Promise<string> {
        return BrowserActions.getText(this.activityName);
    }

    async getStatusText(): Promise<string> {
        return BrowserActions.getText(this.activityStatus);
    }

    async checkServiceTaskListResultsIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.resultList);
    }
}
