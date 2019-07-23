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

import { BrowserActions, BrowserVisibility, DocumentListPage } from '@alfresco/adf-testing';

import { element, by, ElementFinder, Locator } from 'protractor';

export class TrashcanPage {

    contentList: DocumentListPage = new DocumentListPage(element(by.css('adf-document-list')));
    rows: Locator = by.css('adf-document-list div[class*="adf-datatable-body"] div[class*="adf-datatable-row"]');
    tableBody: ElementFinder = element.all(by.css('adf-document-list div[class="adf-datatable-body"]')).first();
    pagination: ElementFinder = element(by.css('adf-pagination'));
    emptyTrashcan: ElementFinder = element(by.css('adf-empty-content'));
    restoreButton: ElementFinder = element(by.css(`button[title='Restore']`));

    async numberOfResultsDisplayed(): Promise<number> {
        return await element.all(this.rows).count();
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
    }

    async checkRestoreButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.restoreButton);
    }

    async checkRestoreButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.restoreButton);
    }

}
