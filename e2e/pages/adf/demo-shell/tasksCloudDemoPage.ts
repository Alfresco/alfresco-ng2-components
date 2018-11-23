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

import Util = require('../../../util/util');

import { TaskFiltersCloudComponent } from '../process_cloud/taskFiltersCloudComponent';
import { TaskListCloudComponent } from '../process_cloud/taskListCloudComponent';
import { element, by } from 'protractor';

export class TasksCloudDemoPage {

    myTasks = element(by.css('span[data-automation-id="My Tasks_filter"]'));
    cancelledTasks = element(by.css('span[data-automation-id="Cancelled Tasks_filter"]'));
    completedTasks = element(by.css('span[data-automation-id="Completed Tasks_filter"]'));
    suspendedTasks = element(by.css('span[data-automation-id="Suspended Tasks_filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));

    taskFiltersCloudComponent(filter) {
        return new TaskFiltersCloudComponent(filter);
    }

    taskListCloudComponent() {
        return new TaskListCloudComponent();
    }

    myTasksFilter() {
        return new TaskFiltersCloudComponent(this.myTasks);
    }

    cancelledTasksFilter() {
        return new TaskFiltersCloudComponent(this.cancelledTasks);
    }

    completedTasksFilter() {
        return new TaskFiltersCloudComponent(this.completedTasks);
    }

    suspendedTasksFilter() {
        return new TaskFiltersCloudComponent(this.suspendedTasks);
    }

    customTaskFilter(filterName) {
        return new TaskFiltersCloudComponent(element(by.css(`span[data-automation-id="${filterName}_filter"]`)));
    }

    checkActiveFilterActive () {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }
}
