/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, StartProcessPage } from '@alfresco/adf-testing';
import { $, $$ } from 'protractor';

export class ProcessFiltersPage {
    dataTable = new DataTableComponentPage();
    createProcessButton = $('.app-processes-menu button[data-automation-id="create-button"] > span');
    newProcessButton = $('div > button[data-automation-id="btn-start-process"]');
    processesPage = $('#app-processes-menu');
    buttonWindow = $('div > button[data-automation-id="btn-start-process"] > div');
    noContentMessage = $$('.adf-empty-content__title').first();
    rows = $$('adf-process-instance-list .adf-datatable-body adf-datatable-row[class*="adf-datatable-row"]');

    getButtonFilterLocatorByName = (name: string) => $(`button[data-automation-id='${name}_filter']`);

    async clickRunningFilterButton(): Promise<void> {
        await BrowserActions.click(await this.getButtonFilterLocatorByName('Running'));
    }

    async clickCompletedFilterButton(): Promise<void> {
        const completedFilterButtonLocator = await this.getButtonFilterLocatorByName('Completed');
        await BrowserActions.click(completedFilterButtonLocator);
        expect(await completedFilterButtonLocator.isEnabled()).toBe(true);
    }

    async clickCreateProcessButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserVisibility.waitUntilElementIsVisible(this.processesPage);
        await BrowserActions.click(this.createProcessButton);
    }

    async clickNewProcessDropdown(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.buttonWindow);
        await BrowserActions.click(this.newProcessButton);
    }

    async checkNoContentMessage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noContentMessage);
    }

    async selectFromProcessList(title: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const processName = $$(`div[data-automation-id="text_${title}"]`).first();
        await BrowserActions.click(processName);
    }

    async waitForTableBody(): Promise<void> {
        await this.dataTable.waitForTableBody();
    }
}
