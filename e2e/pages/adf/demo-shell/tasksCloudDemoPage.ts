import Util = require('../../../util/util');

import { TaskFiltersCloudComponent } from '../process_cloud/taskFiltersCloudComponent';
import { TaskListCloudComponent } from '../process_cloud/taskListCloudComponent';
import { element, by } from 'protractor';

export class TasksCloudDemoPage {

    myTasks = element(by.css('span[data-automation-id="My Tasks_filter"]'));
    cancelledTasks = element(by.css('span[data-automation-id="Cancelled Tasks_filter"]'));
    completedTasks = element(by.css('span[data-automation-id="Completed Tasks_filter"]'));
    suspendedTasks = element(by.css('span[data-automation-id="Suspended Tasks_filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active']"));

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
