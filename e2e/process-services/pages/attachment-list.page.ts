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

import { protractor, browser, $, $$ } from 'protractor';
import * as path from 'path';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class AttachmentListPage {

    attachFileButton = $('input[type=\'file\']');
    buttonMenu = $('button[data-automation-id=\'action_menu_0\']');
    viewButton = $('button[data-automation-id*=\'MENU_ACTIONS.VIEW_CONTENT\']');
    removeButton = $('button[data-automation-id*=\'MENU_ACTIONS.REMOVE_CONTENT\']');
    downloadButton = $('button[data-automation-id*=\'MENU_ACTIONS.DOWNLOAD_CONTENT\']');
    noContentContainer = $('div[class*=\'adf-no-content-container\']');

    async checkEmptyAttachmentList(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noContentContainer);
    }

    async clickAttachFileButton(fileLocation: string): Promise<void> {
        await browser.sleep(500);
        await BrowserVisibility.waitUntilElementIsPresent(this.attachFileButton);
        await this.attachFileButton.sendKeys(path.resolve(path.join(browser.params.testConfig.main.rootPath, fileLocation)));
    }

    async checkFileIsAttached(name: string): Promise<void> {
        const fileAttached = $$('div[data-automation-id="' + name + '"]').first();
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
    }

    async checkAttachFileButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.attachFileButton);
    }

    async viewFile(name: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click($$('div[data-automation-id="' + name + '"]').first());
        await BrowserActions.click(this.buttonMenu);
        await browser.sleep(500);
        await BrowserActions.click(this.viewButton);
        await browser.sleep(500);
    }

    async removeFile(name: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click($$('div[data-automation-id="' + name + '"]').first());
        await BrowserActions.click(this.buttonMenu);
        await browser.sleep(500);
        await BrowserActions.click(this.removeButton);
        await browser.sleep(500);
    }

    async downloadFile(name: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click($$('div[data-automation-id="' + name + '"]').first());
        await BrowserActions.click(this.buttonMenu);
        await browser.sleep(500);
        await BrowserActions.click(this.downloadButton);
    }

    async doubleClickFile(name: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserVisibility.waitUntilElementIsVisible($$(`div[data-automation-id="${name}"]`).first());
        const fileAttached = $$(`div[data-automation-id="${name}"]`).first();
        await BrowserActions.click(fileAttached);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async checkFileIsRemoved(name: string): Promise<void> {
        const fileAttached = $$(`div[data-automation-id="${name}"]`).first();
        await BrowserVisibility.waitUntilElementIsNotVisible(fileAttached);
    }

}
