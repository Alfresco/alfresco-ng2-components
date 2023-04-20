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

import { element, by, $ } from 'protractor';
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/public-api';

export class FormPage {

    errorLog = $('div[class*="console"]');
    saveButton = element(by.cssContainingText('mat-card-actions[class*="adf-for"] span', 'SAVE'));

    async checkErrorMessageForWidgetIsDisplayed(errorMessage: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('.adf-error-text', errorMessage)));
    }

    async checkErrorMessageForWidgetIsNotDisplayed(errorMessage: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('.adf-error-text', errorMessage)));
    }

    async checkErrorLogMessage(errorMessage: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.errorLog);
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('div[class*="console"] p', errorMessage)));
    }

    async checkErrorMessageIsNotDisplayed(errorMessage: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.errorLog);
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('div[class*="console"] p', errorMessage)));
    }

    async saveForm() {
        await BrowserActions.click(this.saveButton);
    }

    async isSaveButtonDisabled(): Promise<boolean> {
        const saveButtonDisabled = $('#adf-form-save[disabled]');
        try {
            await saveButtonDisabled.isDisplayed();
            return true;
        } catch {
            return false;
        }
    }

    async isValidationIconBlue(): Promise<boolean> {
        const validationIcon = $('#adf-valid-form-icon');
        try {
            await validationIcon.isDisplayed();
            return true;
        } catch {
            return false;
        }
    }

    async isValidationIconRed(): Promise<boolean> {
        const validationIcon = $('#adf-invalid-form-icon');
        try {
            await validationIcon.isDisplayed();
            return true;
        } catch {
            return false;
        }
    }

}
