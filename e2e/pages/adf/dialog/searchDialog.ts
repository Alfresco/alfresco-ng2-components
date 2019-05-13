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

import { browser, by, element, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class SearchDialog {

    searchIcon = element(by.css(`button[class*='adf-search-button']`));
    searchBar = element(by.css(`adf-search-control input`));
    searchBarExpanded = element(by.css(`adf-search-control mat-form-field[class*="mat-focused"] input`));
    noResultMessage = element(by.css(`p[class*='adf-search-fixed-text']`));
    rowsAuthor = by.css(`div[class='mat-list-text'] p[class*='adf-search-fixed-text']`);
    completeName = by.css(`h4[class*='adf-search-fixed-text']`);
    highlightName = by.css(`.adf-highlight`);
    searchDialog = element(by.css(`mat-list[id='autocomplete-search-result-list']`));

    pressDownArrowAndEnter() {
        element(by.css(`adf-search-control div input`)).sendKeys(protractor.Key.ARROW_DOWN);
        return browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    clickOnSearchIcon() {
        BrowserActions.click(this.searchIcon);
        return this;
    }

    checkSearchIconIsVisible() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchIcon);
        return this;
    }

    checkSearchBarIsVisible() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        return this;
    }

    checkSearchBarIsNotVisible() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        BrowserVisibility.waitUntilElementIsNotVisible(this.searchBarExpanded);
        return this;
    }

    checkNoResultMessageIsDisplayed() {
        browser.driver.sleep(500);
        BrowserVisibility.waitUntilElementIsVisible(this.noResultMessage);
        return this;
    }

    checkNoResultMessageIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.noResultMessage);
        return this;
    }

    enterText(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        BrowserActions.clickExecuteScript('adf-search-control input');
        this.searchBar.sendKeys(text);
        return this;
    }

    enterTextAndPressEnter(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        BrowserActions.clickExecuteScript('adf-search-control input');
        this.searchBar.sendKeys(text);
        this.searchBar.sendKeys(protractor.Key.ENTER);
        return this;
    }

    resultTableContainsRow(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.searchDialog);
        BrowserVisibility.waitUntilElementIsVisible(this.getRowByRowName(name));
        return this;
    }

    clickOnSpecificRow(name) {
        this.resultTableContainsRow(name);
        this.getRowByRowName(name).click();
        return this;
    }

    getRowByRowName(name) {
        return element(by.css(`mat-list-item[data-automation-id='autocomplete_for_${name}']`));
    }

    getSpecificRowsHighlightName(name) {
        return BrowserActions.getText(this.getRowByRowName(name).element(this.highlightName));
    }

    getSpecificRowsCompleteName(name) {
        return BrowserActions.getText(this.getRowByRowName(name).element(this.completeName));
    }

    getSpecificRowsAuthor(name) {
        return BrowserActions.getText(this.getRowByRowName(name).element(this.rowsAuthor));
    }

    clearText() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchBar);
        return this.searchBar.clear();
    }
}
