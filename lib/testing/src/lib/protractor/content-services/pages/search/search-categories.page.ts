/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ElementFinder } from 'protractor';
import { SearchTextPage } from './search-text.page';
import { SearchCheckListPage } from './search-check-list.page';
import { SearchRadioPage } from './search-radio.page';
import { NumberRangeFilterPage } from './number-range-filter.page';
import { SearchSliderPage } from './search-slider.page';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';

export class SearchCategoriesPage {
    static checkListFiltersPage(filter: ElementFinder): SearchCheckListPage {
        return new SearchCheckListPage(filter);
    }

    static textFiltersPage(filter: ElementFinder): SearchTextPage {
        return new SearchTextPage(filter);
    }

    static radioFiltersPage(filter: ElementFinder): SearchRadioPage {
        return new SearchRadioPage(filter);
    }

    static numberRangeFilter(filter: ElementFinder): NumberRangeFilterPage {
        return new NumberRangeFilterPage(filter);
    }

    static sliderFilter(filter: ElementFinder): SearchSliderPage {
        return new SearchSliderPage(filter);
    }

    async checkFilterIsDisplayed(filter: ElementFinder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(filter);
    }

    async clickFilter(filter: ElementFinder): Promise<void> {
        await BrowserActions.click(filter.$(' .mat-expansion-panel-header'));
    }

    async clickFilterHeader(filter: ElementFinder): Promise<void> {
        const fileSizeFilterHeader = filter.$(' .mat-expansion-panel-header');
        await BrowserActions.click(fileSizeFilterHeader);
    }

    async checkFilterIsCollapsed(filter: ElementFinder) {
        const elementClass = await BrowserActions.getAttribute(filter, 'class');
        expect(elementClass).not.toContain('mat-expanded');
    }

    async checkFilterIsExpanded(filter: ElementFinder) {
        const elementClass = await BrowserActions.getAttribute(filter, 'class');
        expect(elementClass).toContain('mat-expanded');
    }
}
