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
import { element, by } from 'protractor';

export class TasksCloudDemoPage {

    myTasks = element(by.css('span[data-automation-id="my-tasks-filter"]'));
    completedTasks = element(by.css('span[data-automation-id="completed-tasks-filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));
    optionSelector = element(by.css("div[class*='mat-select-content']"));
    customiseFilter = element(by.css('mat-expansion-panel-header'));

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

    checkActiveFilterActive() {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

    clickCustomiseFilter() {
        Util.waitUntilElementIsVisible(this.customiseFilter);
        this.customiseFilter.click();
        return this;
    }

    setStateFilterDropDown(option) {
        this.clickOnDropDownArrow('status');

        let stateElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(stateElement);
        Util.waitUntilElementIsVisible(stateElement);
        stateElement.click();
        return this;
    }

    setSortFilterDropDown(option) {
        this.clickOnDropDownArrow('sort');

        let sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(sortElement);
        Util.waitUntilElementIsVisible(sortElement);
        sortElement.click();
        return this;
    }

    setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow('order');

        let orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(orderElement);
        Util.waitUntilElementIsVisible(orderElement);
        orderElement.click();
        return this;
    }

    clickOnDropDownArrow(option) {
        let dropDownArrow = element(by.css("mat-form-field[data-automation-id='" + option + "'] div[class*='arrow']"));
        Util.waitUntilElementIsVisible(dropDownArrow);
        dropDownArrow.click();
        Util.waitUntilElementIsVisible(this.optionSelector);
    }

    getAllRowsByIdColumn() {
        return new TaskListCloudComponent().getAllRowsByColumn('Id');
    }
}
