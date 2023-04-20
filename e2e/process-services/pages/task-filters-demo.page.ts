/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BrowserActions } from '@alfresco/adf-testing';
import { $ } from 'protractor';
import { TaskFiltersPage } from './task-filters.page';

export class TaskFiltersDemoPage {

    myTasks = $('button[data-automation-id="My Tasks_filter"]');
    queuedTask = $('button[data-automation-id="Queued Tasks_filter"]');
    completedTask = $('button[data-automation-id="Completed Tasks_filter"]');
    involvedTask = $('button[data-automation-id="Involved Tasks_filter"]');
    activeFilter = $('adf-task-filters .adf-active');

    myTasksFilter(): TaskFiltersPage {
        return new TaskFiltersPage(this.myTasks);
    }

    queuedTasksFilter(): TaskFiltersPage {
        return new TaskFiltersPage(this.queuedTask);
    }

    completedTasksFilter() {
        return new TaskFiltersPage(this.completedTask);
    }

    involvedTasksFilter(): TaskFiltersPage {
        return new TaskFiltersPage(this.involvedTask);
    }

    customTaskFilter(filterName: string): TaskFiltersPage {
        return new TaskFiltersPage($(`button[data-automation-id="${filterName}_filter"]`));
    }

    async checkActiveFilterActive(): Promise<string> {
        return BrowserActions.getText(this.activeFilter);
    }
}
