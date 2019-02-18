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

import { Util } from '../../../util/util';
import { browser, by, element, protractor } from 'protractor';

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
        Util.waitUntilElementIsVisible(this.searchIcon);
        this.searchIcon.click();
        return this;
    }

    checkSearchIconIsVisible() {
        Util.waitUntilElementIsVisible(this.searchIcon);
        return this;
    }

    checkSearchBarIsVisible() {
        Util.waitUntilElementIsVisible(this.searchBar);
        return this;
    }

    checkSearchBarIsNotVisible() {
        Util.waitUntilElementIsVisible(this.searchBar);
        Util.waitUntilElementIsNotVisible(this.searchBarExpanded);
        return this;
    }

    checkNoResultMessageIsDisplayed() {
        browser.driver.sleep(500);
        Util.waitUntilElementIsVisible(this.noResultMessage);
        return this;
    }

    checkNoResultMessageIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.noResultMessage);
        return this;
    }

    enterText(text) {
        Util.waitUntilElementIsVisible(this.searchBar);
        browser.executeScript(`document.querySelector("adf-search-control input").click();`);
        this.searchBar.sendKeys(text);
        return this;
    }

    enterTextAndPressEnter(text) {
        Util.waitUntilElementIsVisible(this.searchBar);
        browser.executeScript(`document.querySelector("adf-search-control input").click();`);
        this.searchBar.sendKeys(text);
        this.searchBar.sendKeys(protractor.Key.ENTER);
        return this;
    }

    resultTableContainsRow(name) {
        Util.waitUntilElementIsVisible(this.searchDialog);
        Util.waitUntilElementIsVisible(this.getRowByRowName(name));
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
        return this.getRowByRowName(name).element(this.highlightName).getText();
    }

    getSpecificRowsCompleteName(name) {
        return this.getRowByRowName(name).element(this.completeName).getText();
    }

    getSpecificRowsAuthor(name) {
        return this.getRowByRowName(name).element(this.rowsAuthor).getText();
    }

    clearText() {
        Util.waitUntilElementIsVisible(this.searchBar);
        return this.searchBar.clear();
    }
}
