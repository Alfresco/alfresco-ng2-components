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

import { by, element, ElementFinder } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { ContentNodeSelectorDialogPage } from '../../content-services/dialog/content-node-selector-dialog.page';
import { DocumentListPage } from '../../content-services/pages/document-list.page';

export class ExternalNodeSelectorDialogPage extends ContentNodeSelectorDialogPage {
    txtUsername: ElementFinder = element(by.css('input[id="username"]'));
    txtPassword: ElementFinder = element(by.css('input[id="password"]'));
    loginElement: ElementFinder = element(by.css('[data-automation-id="attach-file-dialog-actions-login"]'));
    title: ElementFinder = element(by.css('[data-automation-id="content-node-selector-title"]'));
    moveCopyButton: ElementFinder = element(by.css(`button[data-automation-id="attach-file-dialog-actions-choose"]`));

    constructor() {
        super();
        this.dialog = element(by.css(`adf-content-node-selector-panel`));
        this.contentList = new DocumentListPage(this.dialog);
        this.dataTable = this.contentList.dataTablePage();
        this.header = this.dialog.element(by.css(`header[data-automation-id='content-node-selector-title']`));
        this.searchInputElement = this.dialog.element(by.css(`input[data-automation-id='content-node-selector-search-input']`));
        this.selectedRow = this.dialog.element(by.css(`adf-datatable-row[class*="adf-is-selected"]`));
    }

    async getTitle(): Promise<string> {
        return this.title.getText();
    }

    async clickLoginButton() {
        await BrowserActions.click(this.loginElement);
    }

    async enterUsername(username): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtUsername, username);
    }

    async enterPassword(password): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtPassword, password);
    }

    async waitForLogInDialog(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.title);
        await BrowserVisibility.waitUntilElementIsPresent(this.txtUsername);
        await BrowserVisibility.waitUntilElementIsPresent(this.txtPassword);
        await BrowserVisibility.waitUntilElementIsPresent(this.loginElement);
    }

    async login(username, password): Promise<void> {
        await this.waitForLogInDialog();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

}
