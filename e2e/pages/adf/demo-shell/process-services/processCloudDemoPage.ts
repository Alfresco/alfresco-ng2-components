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
import { BrowserVisibility } from '@alfresco/adf-testing';
import {
    ProcessFiltersCloudComponentPage,
    EditProcessFilterCloudComponentPage,
    ProcessListCloudComponentPage,
    BrowserActions
} from '@alfresco/adf-testing';

export class ProcessCloudDemoPage {

    allProcesses = element(by.css('span[data-automation-id="all-processes_filter"]'));
    runningProcesses = element(by.css('span[data-automation-id="running-processes_filter"]'));
    completedProcesses = element(by.css('span[data-automation-id="completed-processes_filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));
    processFilters = element(by.css("mat-expansion-panel[data-automation-id='Process Filters']"));

    createButton = element(by.css('button[data-automation-id="create-button"'));
    newProcessButton = element(by.css('button[data-automation-id="btn-start-process"]'));

    processListCloud = new ProcessListCloudComponentPage();
    editProcessFilterCloud = new EditProcessFilterCloudComponentPage();

    editProcessFilterCloudComponent() {
        return this.editProcessFilterCloud;
    }

    processListCloudComponent() {
        return this.processListCloud;
    }

    getAllRowsByIdColumn() {
        return this.processListCloud.getAllRowsByColumn('Id');
    }

    allProcessesFilter() {
        return new ProcessFiltersCloudComponentPage(this.allProcesses);
    }

    runningProcessesFilter() {
        return new ProcessFiltersCloudComponentPage(this.runningProcesses);
    }

    completedProcessesFilter() {
        return new ProcessFiltersCloudComponentPage(this.completedProcesses);
    }

    customProcessFilter(filterName) {
        return new ProcessFiltersCloudComponentPage(element(by.css(`span[data-automation-id="${filterName}_filter"]`)));
    }

    getActiveFilterName() {
        return BrowserActions.getText(this.activeFilter);
    }

    clickOnProcessFilters() {
        return BrowserActions.click(this.processFilters);
    }

    openNewProcessForm() {
        this.clickOnCreateButton();
        this.newProcessButtonIsDisplayed();
        BrowserActions.click(this.newProcessButton);
        return this;
    }

    newProcessButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.newProcessButton);
        return this;
    }

    clickOnCreateButton() {
        BrowserActions.click(this.createButton);
        return this;
    }
}
