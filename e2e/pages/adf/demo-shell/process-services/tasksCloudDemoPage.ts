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

import { Util } from '../../../../util/util';

import { TaskFiltersCloudComponent } from '../../process-cloud/taskFiltersCloudComponent';
import { TaskListCloudComponent } from '../../process-cloud/taskListCloudComponent';
import { EditTaskFilterCloudComponent } from '../../process-cloud/editTaskFilterCloudComponent';
import { element, by } from 'protractor';

export class TasksCloudDemoPage {

    myTasks = element(by.css('span[data-automation-id="my-tasks-filter"]'));
    completedTasks = element(by.css('span[data-automation-id="completed-tasks-filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));

    taskFilters = element(by.css("mat-expansion-panel[data-automation-id='Task Filters']"));
    defaultActiveFilter = element.all(by.css('.adf-filters__entry')).first();
    editTaskFilterCloud = new EditTaskFilterCloudComponent();

    createButton = element(by.css('button[data-automation-id="create-button"'));
    newTaskButton = element(by.css('button[data-automation-id="btn-start-task"]'));

    taskFiltersCloudComponent(filter) {
        return new TaskFiltersCloudComponent(filter);
    }

    taskListCloudComponent() {
        return new TaskListCloudComponent();
    }

    editTaskFilterCloudComponent() {
        return this.editTaskFilterCloud;
    }

    myTasksFilter() {
        return new TaskFiltersCloudComponent(this.myTasks);
    }

    completedTasksFilter() {
        return new TaskFiltersCloudComponent(this.completedTasks);
    }

    customTaskFilter(filterName) {
        return new TaskFiltersCloudComponent(element(by.css(`span[data-automation-id="${filterName}-filter"]`)));
    }

    getActiveFilterName() {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

    getAllRowsByIdColumn() {
        return new TaskListCloudComponent().getAllRowsByColumn('Id');
    }

    getAllRowsByProcessDefIdColumn() {
        return new TaskListCloudComponent().getAllRowsByColumn('Process Definition Id');
    }

    clickOnTaskFilters() {
        Util.waitUntilElementIsVisible(this.taskFilters);
        return this.taskFilters.click();
    }

    openNewTaskForm() {
        this.createButtonIsDisplayed();
        this.clickOnCreateButton();
        this.newTaskButtonIsDisplayed();
        this.newTaskButton.click();
        return this;
    }

    createButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.createButton);
        return this;
    }

    newTaskButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.newTaskButton);
        return this;
    }

    clickOnCreateButton() {
        Util.waitUntilElementIsClickable(this.createButton);
        this.createButton.click();
        return this;
    }

    firstFilterIsActive () {
        return this.defaultActiveFilter.getAttribute('class').then((value) => value.includes('adf-active'));
    }

}
