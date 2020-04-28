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

export class ProcessFiltersPage {

    filtersPage = new FiltersPage();

    runningFilter: ElementFinder = element(by.css('button[data-automation-id="Running_filter"]'));
    completedFilter: ElementFinder = element(by.css('button[data-automation-id="Completed_filter"]'));
    allFilter: ElementFinder = element(by.css('button[data-automation-id="All_filter"]'));
    accordionMenu: ElementFinder = element(by.css('.app-processes-menu mat-accordion'));

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
        return this.filtersPage.isFilterHighlighted('Running');
    }

    async isCompletedFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted('Completed');
    }

    async isAllFilterHighlighted(): Promise<boolean> {
        return this.filtersPage.isFilterHighlighted('All');
    }

    async isRunningFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed('Running');
    }

    async isCompletedFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed('Completed');
    }

    async isAllFilterDisplayed(): Promise<boolean> {
        return this.filtersPage.isFilterDisplayed('All');
    }
}
