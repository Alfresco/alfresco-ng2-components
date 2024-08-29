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

import { BrowserActions, BrowserVisibility, DocumentListPage } from '@alfresco/adf-testing';
import { $$, $ } from 'protractor';

export class ContentServicesPage {
    columns = {
        name: 'Display name',
        size: 'Size',
        nodeId: 'Node id',
        createdBy: 'Created by',
        created: 'Created'
    };

    contentList = new DocumentListPage($$('adf-upload-drag-area adf-document-list').first());
    uploadBorder = $('#document-list-container');
    deleteContentElement = $('button[data-automation-id="Delete"]');
    downloadContent = $('button[data-automation-id="Download"]');
    downloadButton = $('button[title="Download"]');
    multiSelectToggle = $('[data-automation-id="multiSelectToggle"]');

    getDocumentList(): DocumentListPage {
        return this.contentList;
    }

    async deleteContent(content: string): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.deleteContentElement);
        await this.checkContentIsNotDisplayed(content);
    }

    async checkAcsContainer(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.uploadBorder);
    }

    async waitForTableBody(): Promise<void> {
        await this.contentList.dataTablePage().waitTillContentLoaded();
    }

    async doubleClickRow(nodeName: string): Promise<void> {
        await this.contentList.doubleClickRow(nodeName);
    }

    async openFolder(folderName: string): Promise<void> {
        await this.doubleClickRow(folderName);
        await this.contentList.dataTablePage().waitTillContentLoaded();
    }

    async checkContentIsNotDisplayed(content: string): Promise<void> {
        await this.contentList.dataTablePage().checkContentIsNotDisplayed(this.columns.name, content);
    }

    async clickDownloadButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.downloadButton);
    }

    async clickMultiSelectToggle() {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.multiSelectToggle);
    }
}
