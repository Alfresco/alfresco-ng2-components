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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserActions } from '../../core/utils/browser-actions';
import { element, by } from 'protractor';

export class ProcessListPage {

    processListEmptyTitle = element(by.css('.adf-empty-content__title'));
    processInstanceList = element(by.css('adf-process-instance-list'));
    dataTable = new DataTableComponentPage(this.processInstanceList);

    getDisplayedProcessListEmptyTitle(): Promise<string> {
        return BrowserActions.getText(this.processListEmptyTitle);
    }

    titleNotPresent(): Promise<string> {
        return BrowserVisibility.waitUntilElementIsNotPresent(this.processListEmptyTitle);
    }

    async isProcessListDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceList);
            return true;
        } catch (error) {
            return false;
        }
    }

    checkContentIsDisplayedByColumn(column: string, processName: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column, processName);
    }

    checkContentIsNotDisplayedByColumn(column: string, processName: string): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(column, processName);
    }

    async selectRowByName(processName: string): Promise<void> {
        await this.dataTable.selectRow('Name', processName);
    }
}
