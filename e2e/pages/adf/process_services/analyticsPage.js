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

var AnalyticsPage = function () {

    var toolbarTitleInput = element(by.css("input[data-automation-id='reportName']"));
    var toolbarTitleContainer = element(by.css("div[class='adf-report-title ng-star-inserted']"));
    var toolbarTitle =  element(by.xpath("//mat-toolbar/adf-toolbar-title/div/h4"));
    var reportContainer = element(by.css("div[class='adf-report-report-container']"));
    var reportMessage = element(by.css("div[class='ng-star-inserted'] span"));

    this.getReport = function (title) {
        var reportTitle = element(by.css("mat-icon[data-automation-id='"+ title +"_filter']"));
        Util.waitUntilElementIsVisible(reportTitle);
        reportTitle.click();
    };

    this.changeReportTitle = function (title) {
        Util.waitUntilElementIsVisible(reportContainer);
        Util.waitUntilElementIsVisible(toolbarTitleContainer);
        toolbarTitleContainer.click();
        Util.waitUntilElementIsVisible(toolbarTitleInput);
        toolbarTitleInput.clear();
        toolbarTitleInput.sendKeys(title);
        toolbarTitleInput.sendKeys(protractor.Key.ENTER);
    };

    this.getReportTitle = function () {
        Util.waitUntilElementIsVisible(toolbarTitle);
        return toolbarTitle.getText();
    };

    this.checkNoReportMessage = function () {
        Util.waitUntilElementIsVisible(reportMessage);
    };

};

module.exports = AnalyticsPage;

