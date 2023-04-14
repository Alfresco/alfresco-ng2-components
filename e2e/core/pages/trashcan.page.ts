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

import { BrowserActions, BrowserVisibility, DocumentListPage } from '@alfresco/adf-testing';
import { browser, $$, $ } from 'protractor';

export class TrashcanPage {

    contentList = new DocumentListPage($('adf-document-list'));
    rows = $$('adf-document-list div[class*="adf-datatable-body"] adf-datatable-row[class*="adf-datatable-row"]');
    tableBody = $$('adf-document-list .adf-datatable-body').first();
    pagination = $('adf-pagination');
    emptyTrashcan = $('adf-empty-content');
    restoreButton = $(`button[title='Restore']`);

    async numberOfResultsDisplayed(): Promise<number> {
        return this.rows.count();
    }

    async waitForTableBody(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    async waitForPagination(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pagination);
    }

    async checkTrashcanIsEmpty(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyTrashcan);
    }

    getDocumentList(): DocumentListPage {
        return this.contentList;
    }

    async clickRestore(): Promise<void> {
        await BrowserActions.click(this.restoreButton);
        await browser.sleep(2000);
    }

    async checkRestoreButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.restoreButton);
    }

    async checkRestoreButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.restoreButton);
    }

}
