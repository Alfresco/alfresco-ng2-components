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
import { BrowserVisibility } from '@alfresco/adf-testing';
import {
    ProcessFiltersCloudComponentPage,
    EditProcessFilterCloudComponentPage,
    ProcessListCloudComponentPage,
    BrowserActions
} from '@alfresco/adf-testing';

export class ProcessCloudDemoPage {

    allProcesses: ElementFinder = element(by.css('span[data-automation-id="all-processes_filter"]'));
    runningProcesses: ElementFinder = element(by.css('span[data-automation-id="running-processes_filter"]'));
    completedProcesses: ElementFinder = element(by.css('span[data-automation-id="completed-processes_filter"]'));
    activeFilter: ElementFinder = element(by.css("mat-list-item[class*='active'] span"));
    processFilters: ElementFinder = element(by.css("mat-expansion-panel[data-automation-id='Process Filters']"));
    processFiltersList: ElementFinder = element(by.css('adf-cloud-process-filters'));

    createButton: ElementFinder = element(by.css('button[data-automation-id="create-button"'));
    newProcessButton: ElementFinder = element(by.css('button[data-automation-id="btn-start-process"]'));

    processListCloud = new ProcessListCloudComponentPage();
    editProcessFilterCloud = new EditProcessFilterCloudComponentPage();

    editProcessFilterCloudComponent(): EditProcessFilterCloudComponentPage {
        return this.editProcessFilterCloud;
    }

    processListCloudComponent(): ProcessListCloudComponentPage {
        return this.processListCloud;
    }

    getAllRowsByIdColumn(): Promise<any> {
        return this.processListCloud.getAllRowsByColumn('Id');
    }

    allProcessesFilter(): ProcessFiltersCloudComponentPage {
        return new ProcessFiltersCloudComponentPage(this.allProcesses);
    }

    runningProcessesFilter(): ProcessFiltersCloudComponentPage {
        return new ProcessFiltersCloudComponentPage(this.runningProcesses);
    }

    completedProcessesFilter(): ProcessFiltersCloudComponentPage {
        return new ProcessFiltersCloudComponentPage(this.completedProcesses);
    }

    customProcessFilter(filterName): ProcessFiltersCloudComponentPage {
        return new ProcessFiltersCloudComponentPage(element(by.css(`span[data-automation-id="${filterName}_filter"]`)));
    }

    async getActiveFilterName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.activeFilter);
        return BrowserActions.getText(this.activeFilter);
    }

    async clickOnProcessFilters(): Promise<void> {
        await BrowserActions.click(this.processFilters);
    }

    async openNewProcessForm(): Promise<void> {
        await this.clickOnCreateButton();
        await this.newProcessButtonIsDisplayed();
        await BrowserActions.click(this.newProcessButton);
    }

    async newProcessButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.newProcessButton);
    }

    async isProcessFiltersListVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processFiltersList);
    }

    async clickOnCreateButton(): Promise<void> {
        await BrowserActions.click(this.createButton);
    }
}
