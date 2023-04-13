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
import { by, $ } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';

export class ProcessInstanceTasksPage {

    startProcessDialog = $('#adf-start-process-dialog');
    title = this.startProcessDialog.$('h4.mat-dialog-title');
    closeButton = this.startProcessDialog.element(by.cssContainingText(`div.adf-start-process-dialog-actions button span`, 'Close'));
    startForm = $('div[data-automation-id="start-form"]');

    async clickOnStartForm(): Promise<void> {
        await BrowserActions.click(this.startForm);
    }

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
