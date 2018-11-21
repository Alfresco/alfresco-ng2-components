/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

var Util = require('../../../util/util');
var ContentList = require('../dialog/contentList');
var StartProcessPage = require('./startProcessPage');

var ProcessFiltersPage = function () {

    var runningFilter = element(by.css("span[data-automation-id='Running_filter']"));
    var completedFilter = element(by.css("div[class='mat-list-text'] > span[data-automation-id='Completed_filter']"));
    var allFilter = element(by.css("span[data-automation-id='All_filter']"));
    var createProcessButton = element(by.css(".adf-processes-menu button[data-automation-id='create-button'] > span"));
    var newProcessButton = element(by.css("div > button[data-automation-id='btn-start-process']"));
    var processesPage = element(by.css("div[class='adf-grid'] > div[class='adf-grid-item adf-processes-menu']"));
    var accordionMenu = element(by.css(".adf-processes-menu mat-accordion"));
    var buttonWindow = element(by.css("div > button[data-automation-id='btn-start-process'] > div"));
    var noContentMessage = element.all(by.css("p[class='adf-empty-content__title']")).first();
    var rows = by.css("adf-process-instance-list div[class='adf-datatable-body'] div[class*='adf-datatable-row']");
    var tableBody = element.all(by.css("adf-datatable div[class='adf-datatable-body']")).first();
    var contentList = new ContentList();
    var nameColumn = by.css("div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[title='Name'] span");
    var processIcon = by.xpath("ancestor::div[@class='mat-list-item-content']/mat-icon");

    this.startProcess = function () {
        this.clickCreateProcessButton();
        this.clickNewProcessDropdown();
        return new StartProcessPage();
    };

    this.clickRunningFilterButton = function () {
        Util.waitUntilElementIsVisible(runningFilter);
        Util.waitUntilElementIsClickable(runningFilter);
        return runningFilter.click();
    };

    this.clickCompletedFilterButton = function () {
        Util.waitUntilElementIsVisible(completedFilter);
        Util.waitUntilElementIsClickable(completedFilter);
        completedFilter.click();
        expect(completedFilter.isEnabled()).toBe(true);
    };

    this.clickAllFilterButton = function () {
        Util.waitUntilElementIsVisible(allFilter);
        Util.waitUntilElementIsClickable(allFilter);
        allFilter.click();
        expect(allFilter.isEnabled()).toBe(true);
    };

    this.clickCreateProcessButton = function () {
        Util.waitUntilElementIsOnPage(accordionMenu);
        Util.waitUntilElementIsVisible(processesPage);
        Util.waitUntilElementIsPresent(createProcessButton);
        createProcessButton.click();
    };

    this.clickNewProcessDropdown = function () {
        Util.waitUntilElementIsOnPage(buttonWindow);
        Util.waitUntilElementIsVisible(newProcessButton);
        Util.waitUntilElementIsClickable(newProcessButton);
        newProcessButton.click();
    };

    this.checkNoContentMessage = function () {
        return Util.waitUntilElementIsVisible(noContentMessage);
    };

    this.selectFromProcessList = function (title) {
        var processName = element.all(by.css('div[data-automation-id="text_' + title + '"]')).first();
        Util.waitUntilElementIsVisible(processName);
        processName.click();
    };

    this.checkFilterIsHighlighted = function (filterName) {
        var processNameHighlighted = element(by.css("mat-list-item.active span[data-automation-id='" + filterName + "_filter']"));
        Util.waitUntilElementIsVisible(processNameHighlighted);
    };

    this.numberOfProcessRows = function () {
        return element.all(rows).count();
    };

    this.waitForTableBody = function () {
        Util.waitUntilElementIsVisible(tableBody);
    };

    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByName = function (sortOrder) {
        contentList.sortByName(sortOrder);
    };

    this.getAllRowsNameColumn = function () {
        return contentList.getAllRowsColumnValues(nameColumn);
    };

    this.checkFilterIsDisplayed = function (name) {
        var filterName = element(by.css("span[data-automation-id='" + name + "_filter']"));
        return Util.waitUntilElementIsVisible(filterName);
    };

    this.checkFilterHasNoIcon = function(name) {
        var filterName = element(by.css("span[data-automation-id='" + name + "_filter']"));
        Util.waitUntilElementIsVisible(filterName);
        return Util.waitUntilElementIsNotOnPage(filterName.element(processIcon));
    };

    this.getFilterIcon = function (name) {
        var filterName = element(by.css("span[data-automation-id='" + name + "_filter']"));
        Util.waitUntilElementIsVisible(filterName);
        var icon = filterName.element(processIcon);
        Util.waitUntilElementIsVisible(icon);
        return icon.getText();
    };

    this.checkFilterIsNotDisplayed = function (name) {
        var filterName = element(by.css("span[data-automation-id='" + name + "_filter']"));
        return Util.waitUntilElementIsNotVisible(filterName);
    };

    this.checkProcessesSortedByNameAsc = function () {
        this.getAllRowsNameColumn().then(function (list) {
            for (let i = 1 ; i < list.length ; i++) {
                expect(JSON.stringify(list[i]) > JSON.stringify(list[i - 1])).toEqual(true);
            }
        });
    };

    this.checkProcessesSortedByNameDesc = function () {
        this.getAllRowsNameColumn().then(function (list) {
            for (let i = 1 ; i < list.length ; i++) {
                expect(JSON.stringify(list[i]) < JSON.stringify(list[i - 1])).toEqual(true);
            }
        });
    };
};

module.exports = ProcessFiltersPage;
