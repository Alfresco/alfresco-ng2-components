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

export class ProcessFiltersPage {
    defaultProcessFilters = {
        running: 'Running',
        completed: 'Completed',
        all: 'All'
    };

    filtersPage = new FiltersPage();

    runningFilter = $('button[data-automation-id="Running_filter"]');
    completedFilter = $('button[data-automation-id="Completed_filter"]');
    allFilter = $('button[data-automation-id="All_filter"]');
    accordionMenu = $('.app-processes-menu mat-accordion');

    async clickRunningFilterButton(): Promise<void> {
        await this.filtersPage.clickFilterButton(this.runningFilter);
    }

    async clickCompletedFilterButton(): Promise<void> {
        await this.filtersPage.clickFilterButton(this.completedFilter);
    }

    async clickAllFilterButton(): Promise<void> {
        await this.filtersPage.clickFilterButton(this.allFilter);
    }

    async isRunningFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(this.defaultProcessFilters.running);
    }

    async isRunningFilterNotHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(this.defaultProcessFilters.running);
    }

    async isCompletedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(this.defaultProcessFilters.completed);
    }

    async isCompletedFilterNotHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(this.defaultProcessFilters.completed);
    }

    async isAllFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted(this.defaultProcessFilters.all);
    }

    async isAllFilterNotHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterNotHighlighted(this.defaultProcessFilters.all);
    }

    async isRunningFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(this.defaultProcessFilters.running);
    }

    async isCompletedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(this.defaultProcessFilters.completed);
    }

    async isAllFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed(this.defaultProcessFilters.all);
    }
}
