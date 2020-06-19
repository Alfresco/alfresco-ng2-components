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

import { by, element, ElementFinder } from 'protractor';
import { FiltersPage } from './filters.page';

export class TaskFiltersPage {

    filtersPage = new FiltersPage();

    myTasks: ElementFinder = element(by.css('button[data-automation-id="My Tasks_filter"]'));
    queuedTask: ElementFinder = element(by.css('button[data-automation-id="Queued Tasks_filter"]'));
    completedTask: ElementFinder = element(by.css('button[data-automation-id="Completed Tasks_filter"]'));
    involvedTask: ElementFinder = element(by.css('button[data-automation-id="Involved Tasks_filter"]'));
    accordionMenu: ElementFinder = element(by.css('.app-processes-menu mat-accordion'));

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

    async isMyTasksFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted('My Tasks');
    }

    async isQueuedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted('Queued Tasks');
    }

    async isCompletedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted('Completed Tasks');
    }

    async isInvolvedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted('Involved Tasks');
    }

    async isMyTasksFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed('My Tasks');
    }

    async isQueuedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed('Queued Tasks');
    }

    async isCompletedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed('Completed Tasks');
    }

    async isInvolvedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed('Involved Tasks');
    }
}
