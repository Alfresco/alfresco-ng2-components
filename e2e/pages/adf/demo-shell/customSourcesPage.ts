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

import { BrowserVisibility } from '@alfresco/adf-testing';
import { element, by } from 'protractor';
import { DataTableComponentPage, BrowserActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../navigationBarPage';

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

export class CustomSources {

    dataTable = new DataTableComponentPage();
    navigationBarPage = new NavigationBarPage();

    toolbar = element(by.css('app-custom-sources .adf-toolbar-title'));
    sourceTypeDropdown = element(by.css('div[class*="select-arrow"]>div'));

    getSourceType(option) {
        return element(by.cssContainingText('.cdk-overlay-pane span', `${option}`));
    }

    waitForToolbarToBeVisible() {
        BrowserVisibility.waitUntilElementIsVisible(this.toolbar);
        return this;
    }

    navigateToCustomSources() {
        this.navigationBarPage.navigateToCustomSources();
        this.waitForToolbarToBeVisible();
    }

    clickOnSourceType() {
        BrowserActions.click(this.sourceTypeDropdown);
    }

    selectMySitesSourceType() {
        this.clickOnSourceType();
        BrowserActions.click(this.getSourceType(source.mySites));
    }

    checkRowIsDisplayed(rowName) {
        return this.dataTable.checkContentIsDisplayed('Name', rowName);
    }

    getStatusCell(rowName) {
        const cell = this.dataTable.getCellByRowContentAndColumn('Name', rowName, column.status);
        return BrowserActions.getText(cell);
    }

}
