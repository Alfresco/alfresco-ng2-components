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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserActions } from '../../core/utils/browser-actions';
import { element, by, ElementFinder } from 'protractor';

export class ProcessListPage {
    rootElement: ElementFinder;
    dataTable: DataTableComponentPage;
    processListEmptyTitle: ElementFinder;

    constructor(
        rootElement = element.all(by.css('adf-process-instance-list')).first()
    ) {
        this.rootElement = rootElement;
        this.dataTable = new DataTableComponentPage(this.rootElement);
        this.processListEmptyTitle = this.rootElement.element(
            by.css('.adf-empty-content__title')
        );
    }

    getDataTable() {
        return this.dataTable;
    }

    getDisplayedProcessListEmptyTitle(): Promise<string> {
        return BrowserActions.getText(this.processListEmptyTitle);
    }

    titleNotPresent(): Promise<string> {
        return BrowserVisibility.waitUntilElementIsNotPresent(this.processListEmptyTitle);
    }

    async isProcessListDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkContentIsDisplayedByColumn(column: string, processName: string): Promise<void> {
        await this.dataTable.waitTillContentLoaded();
        return this.dataTable.checkContentIsDisplayed(column, processName);
    }

    async checkContentIsNotDisplayedByColumn(column: string, processName: string): Promise<void> {
        await this.dataTable.waitTillContentLoaded();
        return this.dataTable.checkContentIsNotDisplayed(column, processName);
    }

    async selectRowByName(processName: string): Promise<void> {
        await this.dataTable.selectRow('Name', processName);
    }
}
