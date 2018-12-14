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

import { element, by } from 'protractor';
import { TaskFiltersPage } from '../process-services/taskFiltersPage';

export class TaskFiltersDemoPage {

    myTasks = element(by.css('span[data-automation-id="My Tasks_filter"]'));
    queuedTask = element(by.css('span[data-automation-id="Queued Tasks_filter"]'));
    completedTask = element(by.css('span[data-automation-id="Completed Tasks_filter"]'));
    involvedTask = element(by.css('span[data-automation-id="Involved Tasks_filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active']"));

    taskFiltersPage(filter) {
        return new TaskFiltersPage(filter);
    }

    myTasksFilter() {
        return new TaskFiltersPage(this.myTasks);
    }

    queuedTasksFilter() {
        return new TaskFiltersPage(this.queuedTask);
    }

    completedTasksFilter() {
        return new TaskFiltersPage(this.completedTask);
    }

    involvedTasksFilter() {
        return new TaskFiltersPage(this.involvedTask);
    }

    customTaskFilter(filterName) {
        return new TaskFiltersPage(element(by.css(`span[data-automation-id="${filterName}_filter"]`)));
    }

    checkActiveFilterActive () {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

}
