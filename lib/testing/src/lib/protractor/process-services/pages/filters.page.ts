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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { ElementFinder, $ } from 'protractor';

export class FiltersPage {

    accordionMenu = $('.app-processes-menu mat-accordion');
    buttonWindow = $('div > button[data-automation-id="btn-start-process"] > div');
    processIcon = 'adf-icon[data-automation-id="adf-filter-icon"]';

    getLocatorForFilterByName = (name: string): ElementFinder => $(`[data-automation-id='${name}_filter']`);
    getLocatorForActiveFilterByName = (name: string): ElementFinder => $(`.adf-active [data-automation-id='${name}_filter']`);

    async clickFilterButton(filterElement: ElementFinder): Promise<void> {
        await BrowserActions.click(filterElement);
    }

    async isFilterEnabled(filterElement: ElementFinder): Promise<boolean> {
        return filterElement.isEnabled();
    }

    async isFilterHighlighted(filterName: string): Promise<boolean> {
        const filterNameHighlighted = await this.getLocatorForActiveFilterByName(filterName);
        try {
            await BrowserVisibility.waitUntilElementIsVisible(filterNameHighlighted);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isFilterNotHighlighted(filterName: string): Promise<boolean> {
        const filterNameHighlighted = await this.getLocatorForActiveFilterByName(filterName);
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(filterNameHighlighted);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isFilterDisplayed(name: string): Promise<boolean> {
        const filterName = this.getLocatorForFilterByName(name);
        try {
            await BrowserVisibility.waitUntilElementIsVisible(filterName);
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkFilterHasNoIcon(name: string): Promise<void> {
        const filterName = this.getLocatorForFilterByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(filterName.$(this.processIcon));
    }

    async getFilterIcon(name: string): Promise<string> {
        const filterName = this.getLocatorForFilterByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        const icon = filterName.$(this.processIcon);
        return BrowserActions.getText(icon);
    }
}
