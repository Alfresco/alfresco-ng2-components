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

import { browser, by, element, ElementFinder, Locator, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class SearchDialog {

    searchIcon: ElementFinder = element(by.css(`button[class*='adf-search-button']`));
    searchBar: ElementFinder = element(by.css(`adf-search-control input`));
    searchBarExpanded: ElementFinder = element(by.css(`adf-search-control mat-form-field[class*="mat-focused"] input`));
    noResultMessage: ElementFinder = element(by.css(`p[class*='adf-search-fixed-text']`));
    rowsAuthor: Locator = by.css(`div[class='mat-list-text'] p[class*='adf-search-fixed-text']`);
    completeName: Locator = by.css(`h4[class*='adf-search-fixed-text']`);
    highlightName: Locator = by.css(`.adf-highlight`);
    searchDialog: ElementFinder = element(by.css(`mat-list[id='autocomplete-search-result-list']`));

    async pressDownArrowAndEnter(): Promise<void> {
        await element(by.css(`adf-search-control div input`)).sendKeys(protractor.Key.ARROW_DOWN);
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
        await BrowserVisibility.waitUntilElementIsNotVisible(this.searchBarExpanded);
    }

    async checkNoResultMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noResultMessage);
    }

    async checkNoResultMessageIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.noResultMessage);
    }

    async enterText(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        await this.searchBar.sendKeys(text);
    }

    async enterTextAndPressEnter(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        await this.searchBar.sendKeys(text);
        await this.searchBar.sendKeys(protractor.Key.ENTER);
    }

    async resultTableContainsRow(name): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchDialog);
        await BrowserVisibility.waitUntilElementIsVisible(this.getRowByRowName(name));
    }

    async clickOnSpecificRow(name): Promise<void> {
        await this.resultTableContainsRow(name);
        await BrowserActions.click(this.getRowByRowName(name));
    }

    getRowByRowName(name): ElementFinder {
        return element(by.css(`mat-list-item[data-automation-id='autocomplete_for_${name}']`));
    }

    async getSpecificRowsHighlightName(name): Promise<string> {
        return await BrowserActions.getText(this.getRowByRowName(name).element(this.highlightName));
    }

    async getSpecificRowsCompleteName(name): Promise<string> {
        return await BrowserActions.getText(this.getRowByRowName(name).element(this.completeName));
    }

    async getSpecificRowsAuthor(name): Promise<string> {
        return await BrowserActions.getText(this.getRowByRowName(name).element(this.rowsAuthor));
    }

    async clearText(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        await this.searchBar.clear();
    }
}
