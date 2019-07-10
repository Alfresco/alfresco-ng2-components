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

import { element, by } from 'protractor';

export class TrashcanPage {

    contentList = new DocumentListPage(element(by.css('adf-document-list')));
    rows = by.css('adf-document-list div[class*="adf-datatable-body"] div[class*="adf-datatable-row"]');
    tableBody = element.all(by.css('adf-document-list div[class="adf-datatable-body"]')).first();
    pagination = element(by.css('adf-pagination'));
    emptyTrashcan = element(by.css('adf-empty-content'));
    restoreButton = element(by.css(`button[title='Restore']`));

    numberOfResultsDisplayed() {
        return element.all(this.rows).count();
    }

    waitForTableBody() {
        BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    waitForPagination() {
        BrowserVisibility.waitUntilElementIsVisible(this.pagination);
    }

    checkTrashcanIsEmpty() {
        BrowserVisibility.waitUntilElementIsVisible(this.emptyTrashcan);
    }

    getDocumentList() {
        return this.contentList;
    }

    clickRestore() {
        BrowserActions.click(this.restoreButton);
        return this;
    }

    checkRestoreButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.restoreButton);
        return this;
    }

    checkRestoreButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.restoreButton)
        this.restoreButton.isEnabled();
        return this;
    }

}
