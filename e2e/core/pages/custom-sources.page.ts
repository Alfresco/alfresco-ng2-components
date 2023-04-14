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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, DropdownPage } from '@alfresco/adf-testing';
import { $ } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

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
    dataTable = new DataTableComponentPage();
    navigationBarPage = new NavigationBarPage();

    toolbar = $('app-custom-sources .adf-toolbar-title');
    selectModeDropdown = new DropdownPage($('mat-select[data-automation-id="custom-sources-select"]'));

    async waitForToolbarToBeVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.toolbar);
    }

    async navigateToCustomSources(): Promise<void> {
        await this.navigationBarPage.clickCustomSources();
        await this.waitForToolbarToBeVisible();
    }

    async selectMySitesSourceType(): Promise<void> {
        await this.selectModeDropdown.selectDropdownOption(source.mySites);
    }

    async selectFavoritesSourceType(): Promise<void> {
        await this.selectModeDropdown.selectDropdownOption(source.favorites);
    }

    async selectSharedLinksSourceType(): Promise<void> {
        await this.selectModeDropdown.selectDropdownOption(source.sharedLinks);
    }

    checkRowIsDisplayed(rowName: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed('Name', rowName);
    }

    checkRowIsNotDisplayed(rowName: string): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed('Name', rowName);
    }

    async getStatusCell(rowName: string): Promise<string> {
        const cell = this.dataTable.getCellByRowContentAndColumn('Name', rowName, column.status);
        return BrowserActions.getText(cell);
    }

}
