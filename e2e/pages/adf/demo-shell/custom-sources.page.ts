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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, DropdownPage } from '@alfresco/adf-testing';
import { by, element, ElementFinder } from 'protractor';
import { NavigationBarPage } from '../navigation-bar.page';

const source = {
    favorites: 'Favorites',
    recent: 'Recent',
    sharedLinks: 'Shared Links',
    sites: 'Sites',
    mySites: 'My Sites',
    trashcan: 'Trashcan',
    root: 'Root',
    my: 'My',
    shared: 'Shared'
};

const column = {
    status: 'Status'
};

export class CustomSourcesPage {
    dataTable: DataTableComponentPage = new DataTableComponentPage();
    navigationBarPage: NavigationBarPage = new NavigationBarPage();

    toolbar: ElementFinder = element(by.css('app-custom-sources .adf-toolbar-title'));
    selectModeDropdown = new DropdownPage(element(by.css('mat-select[data-automation-id="custom-sources-select"]')));

    async waitForToolbarToBeVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.toolbar);
    }

    async navigateToCustomSources(): Promise<void> {
        await this.navigationBarPage.clickCustomSources();
        await this.waitForToolbarToBeVisible();
    }

    async selectMySitesSourceType(): Promise<void> {
        await this.selectModeDropdown.clickDropdown();
        await this.selectModeDropdown.selectOption(source.mySites);
    }

    async selectFavoritesSourceType(): Promise<void> {
        await this.selectModeDropdown.clickDropdown();
        await this.selectModeDropdown.selectOption(source.favorites);
    }

    async selectSharedLinksSourceType(): Promise<void> {
        await this.selectModeDropdown.clickDropdown();
        await this.selectModeDropdown.selectOption(source.sharedLinks);
    }

    checkRowIsDisplayed(rowName): Promise<void> {
        return this.dataTable.checkContentIsDisplayed('Name', rowName);
    }

    checkRowIsNotDisplayed(rowName): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed('Name', rowName);
    }

    async getStatusCell(rowName): Promise<string> {
        const cell = this.dataTable.getCellByRowContentAndColumn('Name', rowName, column.status);
        return BrowserActions.getText(cell);
    }

}
