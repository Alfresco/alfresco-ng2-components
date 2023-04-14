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

import { element, by, protractor, $ } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class AnalyticsPage {

    toolbarTitleInput = $('input[data-automation-id="reportName"]');
    toolbarTitleContainer = $('adf-toolbar-title');
    toolbarTitle = element(by.xpath('//mat-toolbar/adf-toolbar-title/div/h4'));
    reportMessage = $('div[class="ng-star-inserted"] span');

    async getReport(title: string): Promise<void> {
        const reportTitle = $(`mat-icon[data-automation-id="${title}_filter"]`);
        await BrowserActions.click(reportTitle);
    }

    async changeReportTitle(title): Promise<void> {
        await BrowserActions.click(this.toolbarTitleContainer);
        await BrowserActions.click(this.toolbarTitleInput);
        await this.clearReportTitle();
        await this.toolbarTitleInput.sendKeys(title);
        await this.toolbarTitleInput.sendKeys(protractor.Key.ENTER);
    }

    async clearReportTitle(): Promise<void> {
        await BrowserActions.clearSendKeys(this.toolbarTitleInput, '');
        await BrowserVisibility.waitUntilElementIsVisible(this.toolbarTitleInput);
    }

    async getReportTitle(): Promise<string> {
        return BrowserActions.getText(this.toolbarTitle);
    }

    async checkNoReportMessage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.reportMessage);
    }

}
