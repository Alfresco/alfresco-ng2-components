/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Util } from '../../../util/util';

import { ProcessFiltersCloudComponent } from '../process_cloud/processFiltersCloudComponent';
import { ProcessListCloudComponent } from '../process_cloud/processListCloudComponent';
import { element, by } from 'protractor';

export class ProcessCloudDemoPage {

    allProcesses = element(by.css('span[data-automation-id="ADF_CLOUD_PROCESS_FILTERS.ALL_PROCESSES_filter"]'));
    runningProcesses = element(by.css('span[data-automation-id="ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES_filter"]'));
    completedProcesses = element(by.css('span[data-automation-id="ADF_CLOUD_PROCESS_FILTERS.COMPLETED_PROCESSES_filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));
    processFilters = element(by.css("mat-expansion-panel[data-automation-id='Process Filters']"));

    processListCloud = new ProcessListCloudComponent();

    processFiltersCloudComponent(filter) {
        return new ProcessFiltersCloudComponent(filter);
    }

    processListCloudComponent() {
        return this.processListCloud;
    }

    allProcessesFilter() {
        return new ProcessFiltersCloudComponent(this.allProcesses);
    }

    runningProcessesFilter() {
        return new ProcessFiltersCloudComponent(this.runningProcesses);
    }

    completedProcessesFilter() {
        return new ProcessFiltersCloudComponent(this.completedProcesses);
    }

    customProcessFilter(filterName) {
        return new ProcessFiltersCloudComponent(element(by.css(`span[data-automation-id="${filterName}_filter"]`)));
    }

    checkActiveFilterActive() {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

    clickOnProcessFilters() {
        Util.waitUntilElementIsVisible(this.processFilters);
        return this.processFilters.click();
    }
}
