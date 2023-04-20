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

import { browser, ElementFinder, protractor, $ } from 'protractor';
import { BrowserVisibility, BrowserActions, TestElement } from '@alfresco/adf-testing';

export class SearchBarPage {

    searchIcon = $(`button[class*='adf-search-button']`);
    searchBar = $(`adf-search-control input`);
    searchBarExpanded: TestElement = TestElement.byCss(`adf-search-control mat-form-field[class*="mat-focused"] input`);
    noResultMessage = $(`p[class*='adf-search-fixed-text']`);
    rowsAuthor = `.mat-list-text p[class*='adf-search-fixed-text']`;
    completeName = `h4[class*='adf-search-fixed-text']`;
    highlightName = `.adf-highlight`;
    searchBarPage = $(`mat-list[id='autocomplete-search-result-list']`);

    getRowByRowName = (name: string): ElementFinder => $(`mat-list-item[data-automation-id='autocomplete_for_${name}']`);

    async pressDownArrowAndEnter(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        await BrowserActions.clearSendKeys(this.searchBar, protractor.Key.ARROW_DOWN);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async clickOnSearchIcon(): Promise<void> {
        await BrowserActions.click(this.searchIcon);
    }

    async checkSearchIconIsVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchIcon);
    }

    async checkSearchBarIsVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
    }

    async checkSearchBarIsNotVisible(): Promise<void> {
        await this.searchBarExpanded.waitNotVisible();
    }

    async checkNoResultMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noResultMessage);
    }

    async checkNoResultMessageIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.noResultMessage);
    }

    async enterText(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        await BrowserActions.clearSendKeys(this.searchBar, text);
    }

    async enterTextAndPressEnter(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        await BrowserActions.clearSendKeys(this.searchBar, text);
        await this.searchBar.sendKeys(protractor.Key.ENTER);
    }

    async resultTableContainsRow(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBarPage);
        await BrowserVisibility.waitUntilElementIsVisible(this.getRowByRowName(name));
    }

    async clickOnSpecificRow(fileName: string): Promise<void> {
        await this.resultTableContainsRow(fileName);
        await BrowserActions.click(this.getRowByRowName(fileName));
    }

    async getSpecificRowsHighlightName(fileName: string): Promise<string> {
        return BrowserActions.getText(this.getRowByRowName(fileName).$(this.highlightName));
    }

    async getSpecificRowsCompleteName(fileName: string): Promise<string> {
        return BrowserActions.getText(this.getRowByRowName(fileName).$(this.completeName));
    }

    async getSpecificRowsAuthor(fileName: string): Promise<string> {
        return BrowserActions.getText(this.getRowByRowName(fileName).$(this.rowsAuthor));
    }

    async clearText(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        await this.searchBar.clear();
    }
}
