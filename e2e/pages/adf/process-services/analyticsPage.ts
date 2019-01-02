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

import { Util } from '../../../util/util';

export class AnalyticsPage {

    toolbarTitleInput = element(by.css('input[data-automation-id="reportName"]'));
    toolbarTitleContainer = element(by.css('div[class="adf-report-title ng-star-inserted"]'));
    toolbarTitle = element(by.xpath('//mat-toolbar/adf-toolbar-title/div/h4'));
    reportContainer = element(by.css('div[class="adf-report-report-container"]'));
    reportMessage = element(by.css('div[class="ng-star-inserted"] span'));

    getReport(title) {
        let reportTitle = element(by.css(`mat-icon[data-automation-id="${title}_filter"]`));
        Util.waitUntilElementIsVisible(reportTitle);
        reportTitle.click();
    }

    changeReportTitle(title) {
        Util.waitUntilElementIsVisible(this.reportContainer);
        Util.waitUntilElementIsVisible(this.toolbarTitleContainer);
        Util.waitUntilElementIsClickable(this.toolbarTitleContainer);
        this.toolbarTitleContainer.click();
        Util.waitUntilElementIsVisible(this.toolbarTitleInput);
        this.toolbarTitleInput.click();
        this.clearReportTitle();
        this.toolbarTitleInput.sendKeys(title);
        this.toolbarTitleInput.sendKeys(protractor.Key.ENTER);
    }

    clearReportTitle() {
        Util.waitUntilElementIsVisible(this.toolbarTitleInput);
        this.toolbarTitleInput.getAttribute('value').then((value) => {
            let i;
            for (i = value.length; i >= 0; i--) {
                this.toolbarTitleInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        Util.waitUntilElementIsVisible(this.toolbarTitleInput);
    }

    getReportTitle() {
        Util.waitUntilElementIsVisible(this.toolbarTitle);
        return this.toolbarTitle.getText();
    }

    checkNoReportMessage() {
        Util.waitUntilElementIsVisible(this.reportMessage);
    }

}
