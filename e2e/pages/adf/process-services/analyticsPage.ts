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

import { element, by, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class AnalyticsPage {

    toolbarTitleInput = element(by.css('input[data-automation-id="reportName"]'));
    toolbarTitleContainer = element(by.css('adf-toolbar-title'));
    toolbarTitle = element(by.xpath('//mat-toolbar/adf-toolbar-title/div/h4'));
    reportMessage = element(by.css('div[class="ng-star-inserted"] span'));

    getReport(title) {
        const reportTitle = element(by.css(`mat-icon[data-automation-id="${title}_filter"]`));
        BrowserActions.click(reportTitle);
    }

    changeReportTitle(title) {
        BrowserActions.click(this.toolbarTitleContainer);
        BrowserActions.click(this.toolbarTitleInput);
        this.clearReportTitle();
        this.toolbarTitleInput.sendKeys(title);
        this.toolbarTitleInput.sendKeys(protractor.Key.ENTER);
    }

    clearReportTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.toolbarTitleInput);
        this.toolbarTitleInput.getAttribute('value').then((value) => {
            let i;
            for (i = value.length; i >= 0; i--) {
                this.toolbarTitleInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        BrowserVisibility.waitUntilElementIsVisible(this.toolbarTitleInput);
    }

    getReportTitle() {
        return BrowserActions.getText(this.toolbarTitle);
    }

    checkNoReportMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.reportMessage);
    }

}
