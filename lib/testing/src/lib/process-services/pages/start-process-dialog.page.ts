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
import { by, element, ElementFinder } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';

export class StartProcessDialog {

    startProcessDialog: ElementFinder = element(by.id('adf-start-process-dialog'));
    title: ElementFinder = this.startProcessDialog.element(by.css('h4.mat-dialog-title'));
    closeButton: ElementFinder = this.startProcessDialog.element(by.cssContainingText(`div.adf-start-process-dialog-actions button span`, 'Close'));

    async checkStartProcessDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.startProcessDialog);
    }

    async getTitle(): Promise<string> {
        return BrowserActions.getText(this.title);
    }

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async checkStartProcessDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.startProcessDialog);
    }
}
