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

import { $, by, element } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { BrowserVisibility } from '../../core/utils/browser-visibility';

export class EditJsonDialog {

    dialog = $(`.adf-edit-json-dialog`);
    closeButton = element(by.cssContainingText(`button span`, 'Close'));
    dialogContent = this.dialog.$(`mat-dialog-content textarea`);

    async checkDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
    }

    async checkDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dialog);
    }

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async getDialogContent(): Promise<string> {
        return BrowserActions.getInputValue(this.dialogContent);
    }

}
