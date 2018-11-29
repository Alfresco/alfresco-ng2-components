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

import { TaskFiltersCloudComponent } from '../process_cloud/taskFiltersCloudComponent';
import { TaskListCloudComponent } from '../process_cloud/taskListCloudComponent';
import { element, by, ElementArrayFinder } from 'protractor';

export class TasksCloudDemoPage {

    myTasks = element(by.css('span[data-automation-id="ADF_CLOUD_TASK_FILTERS.MY_TASKS_filter"]'));
    completedTasks = element(by.css('span[data-automation-id="ADF_CLOUD_TASK_FILTERS.COMPLETED_TASKS_filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));

    customFiltersButton = element(by.css('.mat-expansion-panel-header-description'));
    filters: ElementArrayFinder = element.all(by.css('mat-form-field mat-select'));
    filtersSection = element(by.css('.task-cloud-demo-select'));

    taskFiltersCloudComponent(filter) {
        return new TaskFiltersCloudComponent(filter);
    }

    taskListCloudComponent() {
        return new TaskListCloudComponent();
    }

    myTasksFilter() {
        return new TaskFiltersCloudComponent(this.myTasks);
    }

    completedTasksFilter() {
        return new TaskFiltersCloudComponent(this.completedTasks);
    }

    customTaskFilter(filterName) {
        return new TaskFiltersCloudComponent(element(by.css(`span[data-automation-id="${filterName}_filter"]`)));
    }

    checkActiveFilterActive () {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

    customFilter () {
        return new TaskFiltersCloudComponent(this.customFiltersButton);
    }

    statusFilter() {
        const filter = this.filters.get(0);
        Util.waitUntilElementIsVisible(filter);
        return new TaskFiltersCloudComponent(filter);
    }

    statusOption(status) {
        const option = element(by.cssContainingText('.mat-select-content .mat-option-text', status));
        Util.waitUntilElementIsVisible(option);
        return new TaskFiltersCloudComponent(option);
    }
}
