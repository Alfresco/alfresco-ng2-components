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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { Locator, by, element, ElementFinder } from 'protractor';

export class FiltersPage {

    accordionMenu = element(by.css('.app-processes-menu mat-accordion'));
    buttonWindow = element(by.css('div > button[data-automation-id="btn-start-process"] > div'));
    processIcon: Locator = by.css('adf-icon[data-automation-id="adf-filter-icon"]');

    async clickFilterButton(filterElement: ElementFinder): Promise<void> {
        await BrowserActions.click(filterElement);
    }

    async isFilterEnabled(filterElement: ElementFinder): Promise<boolean> {
        return filterElement.isEnabled();
    }

    async isFilterHighlighted(filterName: string): Promise<boolean> {
        const filterNameHighlighted = element(by.css(`.adf-active [data-automation-id='${filterName}_filter']`));
        try {
            await BrowserVisibility.waitUntilElementIsVisible(filterNameHighlighted);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isFilterNotHighlighted(filterName: string): Promise<boolean> {
        const filterNameHighlighted = element(by.css(`.adf-active [data-automation-id='${filterName}_filter']`));
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(filterNameHighlighted);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isFilterDisplayed(name: string): Promise<boolean> {
        const filterName = element(by.css(`[data-automation-id='${name}_filter']`));
        try {
            await BrowserVisibility.waitUntilElementIsVisible(filterName);
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkFilterHasNoIcon(name: string): Promise<void> {
        const filterName = element(by.css(`[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(filterName.element(this.processIcon));
    }

    async getFilterIcon(name: string): Promise<string> {
        const filterName = element(by.css(`[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        const icon = filterName.element(this.processIcon);
        return BrowserActions.getText(icon);
    }
}
