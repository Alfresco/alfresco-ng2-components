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
var TestConfig = require('../../../test.config');
var NavigationBarPage = require('../navigationBarPage');

var ProcessListPage = function () {

    var processListURL = TestConfig.adf.url + TestConfig.adf.port + "/activiti/apps/0/processes/";
    var processListIcon = element(by.css("mat-icon[class='adf-empty-content__icon mat-icon material-icons']"));
    var processListTitle = element(by.css("p[class='adf-empty-content__title']"));
    var processListSubtitle = element(by.css("p[class='adf-empty-content__subtitle']"));
    var processDetailsMessage = element(by.css("adf-process-instance-details div[class='ng-star-inserted']"));
    var openProcessDropdown = element(by.id('adf-select-process-dropdown'));
    var selectProcessDropdown = element.all(by.css('span[class="mat-option-text"]'));
    var startProcessButton = element(by.css('button[data-automation-id="btn-start"]'));

    this.goToProcessList = function () {
        var navigationBarPage = new NavigationBarPage();
        navigationBarPage.clickProcessServicesButton();
        Util.waitUntilElementIsVisible(pageLoaded);
    };

    this.checkProcessListTitleIsDisplayed = function () {
        Util.waitUntilElementIsVisible(processListTitle);
        return processListTitle.getText();
    };

    this.checkProcessDetailsMessagee = function () {
        Util.waitUntilElementIsVisible(processListTitle);
        return processDetailsMessage.getText();
    };

    this.openProcessDropdown = function () {
        Util.waitUntilElementIsVisible(openProcessDropdown);
        return openProcessDropdown.click();
    };

    this.selectProcessDropdown = function (index) {
        Util.waitUntilElementIsVisible(selectProcessDropdown);
        return selectProcessDropdown.get(index).click();
    };

    this.startProcess = function () {
        Util.waitUntilElementIsVisible(startProcessButton);
        return startProcessButton.click();
    };

    this.checkProcessListIcon = function () {
        Util.waitUntilElementIsVisible(processListIcon);
        return processListIcon.getText();
    };

    this.checkProcessListSubtitle = function () {
        Util.waitUntilElementIsVisible(processListSubtitle);
        return processListSubtitle.getText();
    };
};

module.exports = ProcessListPage;
