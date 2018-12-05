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

import { Util } from '../../../../util/util';
import { by, ElementFinder } from 'protractor';
import { SearchTextPage } from './components/search-text';
import { SearchCheckListPage } from './components/search-checkList';
import { SearchRadioPage } from './components/search-radio';
import { DateRangeFilterPage } from './components/dateRangeFilterPage';
import { NumberRangeFilterPage } from './components/numberRangeFilterPage';
import { SearchSliderPage } from './components/search-slider.page';

export class SearchCategoriesPage {

    checkListFiltersPage(filter: ElementFinder) {
        return new SearchCheckListPage(filter);
    }

    textFiltersPage(filter: ElementFinder) {
        return new SearchTextPage(filter);
    }

    radioFiltersPage(filter: ElementFinder) {
        return new SearchRadioPage(filter);
    }

    dateRangeFilter(filter: ElementFinder) {
        return new DateRangeFilterPage(filter);
    }

    numberRangeFilter(filter: ElementFinder) {
        return new NumberRangeFilterPage(filter);
    }

    sliderFilter(filter: ElementFinder) {
        return new SearchSliderPage(filter);
    }

    checkFilterIsDisplayed(filter: ElementFinder) {
        Util.waitUntilElementIsVisible(filter);
        return this;
    }

    clickFilter(filter: ElementFinder) {
        Util.waitUntilElementIsVisible(filter);
        filter.element(by.css('mat-expansion-panel-header')).click();
        return this;
    }

    clickFilterHeader(filter: ElementFinder) {
        let fileSizeFilterHeader = filter.element(by.css('mat-expansion-panel-header'));
        Util.waitUntilElementIsClickable(fileSizeFilterHeader);
        fileSizeFilterHeader.click();
        return this;
    }

    checkFilterIsCollapsed(filter: ElementFinder) {
        filter.getAttribute('class').then((elementClass) => {
            expect(elementClass).not.toContain('mat-expanded');
        });
        return this;
    }

    checkFilterIsExpanded(filter: ElementFinder) {
        filter.getAttribute('class').then((elementClass) => {
            expect(elementClass).toContain('mat-expanded');
        });
        return this;
    }

}
