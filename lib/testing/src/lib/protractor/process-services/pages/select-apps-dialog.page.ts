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
import { $ } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';

export class SelectAppsDialog {

    selectAppsDialog = $('mat-dialog-container[aria-labelledby="adf-select-app-dialog-title"]');
    title = $('#adf-select-app-dialog-title');
    appsDropdown = new DropdownPage($('#adf-select-app-dialog-dropdown'));
    continueButton = $('adf-select-apps-dialog .mat-button-wrapper');

    async checkSelectAppsDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectAppsDialog);
    }

    async selectApp(appName: string): Promise<void> {
       await this.appsDropdown.selectDropdownOption(appName);
    }
    async getTitle(): Promise<string> {
        return BrowserActions.getText(this.title);
    }

    async clickAppsDropdown(): Promise<void> {
        await this.appsDropdown.clickDropdown();
    }

    async clickContinueButton(): Promise<void> {
        await BrowserActions.click(this.continueButton);
    }

    async checkSelectAppsDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.selectAppsDialog);
    }
}
