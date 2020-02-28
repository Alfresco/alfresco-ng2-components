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

export class SelectAppsDialog {

    selectAppsDialog: ElementFinder = element(by.css('mat-dialog-container[aria-labelledby="adf-select-app-dialog-title"]'));
    title: ElementFinder = element(by.id('adf-select-app-dialog-title'));
    dropdownAppsButton: ElementFinder = element(by.id('adf-select-app-dialog-dropdown'));
    appsOption: ElementFinder = element(by.css('.mat-option span'));
    continueButton: ElementFinder = element(by.css('adf-select-apps-dialog .mat-button-wrapper'));

    async checkSelectAppsDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectAppsDialog);
    }

    async getTitle(): Promise<string> {
        return BrowserActions.getText(this.title);
    }

    async clickDropdownAppsButton(): Promise<void> {
        await BrowserActions.click(this.dropdownAppsButton);
    }

    async clickContinueButton(): Promise<void> {
        await BrowserActions.click(this.continueButton);
    }

    async clickAppsOption(): Promise<void> {
        await BrowserActions.click(this.appsOption);
    }

    async checkSelectAppsDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.selectAppsDialog);
    }
}
