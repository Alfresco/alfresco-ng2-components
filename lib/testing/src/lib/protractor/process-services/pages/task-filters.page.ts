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

import { $ } from 'protractor';
import { FiltersPage } from './filters.page';

export class TaskFiltersPage {
    defaultTaskFilters = {
        myTasks: 'My Tasks',
        queuedTasks: 'Queued Tasks',
        involvedTasks: 'Involved Tasks',
        completedTasks: 'Completed Tasks'
    };

    filtersPage = new FiltersPage();

    myTasks = $('[data-automation-id="My Tasks_filter"]');
    queuedTask = $('[data-automation-id="Queued Tasks_filter"]');
    completedTask = $('[data-automation-id="Completed Tasks_filter"]');
    involvedTask = $('[data-automation-id="Involved Tasks_filter"]');
    accordionMenu = $('.app-processes-menu mat-accordion');

    async clickMyTasksFilterButton(): Promise<void> {
        await this.filtersPage.clickFilterButton(this.myTasks);
    }

    async clickQueuedFilterButton(): Promise<void> {
        await this.filtersPage.clickFilterButton(this.queuedTask);
    }

    async clickCompletedFilterButton(): Promise<void> {
        await this.filtersPage.clickFilterButton(this.completedTask);
    }

    async clickInvolvedFilterButton(): Promise<void> {
        await this.filtersPage.clickFilterButton(this.involvedTask);
    }

    async clickCustomFilterButton(customFilterName): Promise<void> {
        await this.filtersPage.clickFilterButton($(`[data-automation-id="${customFilterName}_filter"]`));
    }

    async isMyTasksFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(this.defaultTaskFilters.myTasks);
    }

    async isMyTasksFilterNotHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(this.defaultTaskFilters.myTasks);
    }

    async isQueuedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(this.defaultTaskFilters.queuedTasks);
    }

    async isQueuedFilterNotHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(this.defaultTaskFilters.queuedTasks);
    }

    async isCompletedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(this.defaultTaskFilters.completedTasks);
    }

    async isCompletedFilterNotHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(this.defaultTaskFilters.completedTasks);
    }

    async isInvolvedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(this.defaultTaskFilters.involvedTasks);
    }

    async isInvolvedFilterNotHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(this.defaultTaskFilters.involvedTasks);
    }

    async isCustomFilterHighlighted(customFilterName): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(`${customFilterName}`);
    }

    async isCustomFilterNotHighlighted(customFilterName): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(`${customFilterName}`);
    }

    async isMyTasksFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(this.defaultTaskFilters.myTasks);
    }

    async isQueuedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(this.defaultTaskFilters.queuedTasks);
    }

    async isCompletedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(this.defaultTaskFilters.completedTasks);
    }

    async isInvolvedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(this.defaultTaskFilters.involvedTasks);
    }

    async isCustomFilterDisplayed(customFilterName): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(customFilterName);
    }
}
