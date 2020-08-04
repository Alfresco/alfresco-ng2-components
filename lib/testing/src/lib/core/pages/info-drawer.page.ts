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

import { element, by, ElementFinder } from 'protractor';
import { BrowserVisibility } from './../utils/browser-visibility';
import { TabsPage } from './material/tabs.page';

export class InfoDrawerPage {

    rootElement: ElementFinder;
    infoDrawerHeader = by.css('adf-info-drawer-layout-header');
    tabsPage: TabsPage = new TabsPage();

    constructor(classLocator: string = 'adf-info-drawer') {
        this.rootElement = element(by.css(`adf-info-drawer[class*='${classLocator}']`));
    }

    async isInfoDrawerDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isInfoDrawerNotDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(this.rootElement);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isInfoDrawerHeaderDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.element(this.infoDrawerHeader));
            return true;
        } catch (error) {
            return false;
        }
    }

    async isInfoDrawerHeaderNotDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(this.rootElement.element(this.infoDrawerHeader));
            return true;
        } catch (error) {
            return false;
        }
    }

    async getNoOfTabs(): Promise<number> {
        return this.tabsPage.getNoOfTabs();
    }

    async getTabsLabels(): Promise<string> {
        return this.tabsPage.getTabsLabels();
    }
}
