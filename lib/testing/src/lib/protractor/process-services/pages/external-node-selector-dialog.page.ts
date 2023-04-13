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

import { $ } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { ContentNodeSelectorDialogPage } from '../../content-services/dialog/content-node-selector-dialog.page';
import { DocumentListPage } from '../../content-services/pages/document-list.page';
import { Logger } from '../../core/utils/logger';
export class ExternalNodeSelectorDialogPage extends ContentNodeSelectorDialogPage {
    txtUsername = $('input[id="username"]');
    txtPassword = $('input[id="password"]');
    loginElement = $('[data-automation-id="attach-file-dialog-actions-login"]');
    title = $('[data-automation-id="content-node-selector-title"]');

    constructor() {
        super();
        this.dialog = $(`adf-content-node-selector-panel`);
        this.contentList = new DocumentListPage(this.dialog);
        this.dataTable = this.contentList.dataTablePage();
        this.header = this.dialog.$(`header[data-automation-id='content-node-selector-title']`);
        this.searchInputElement = this.dialog.$(`input[data-automation-id='content-node-selector-search-input']`);
        this.selectedRow = this.dialog.$(`adf-datatable-row[class*="adf-is-selected"]`);
        this.moveCopyButton = $(`button[data-automation-id="attach-file-dialog-actions-choose"]`);
    }

    async getTitle(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(this.title);
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
        Logger.log('Login external With ' + username);
        await this.waitForLogInDialog();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
}
