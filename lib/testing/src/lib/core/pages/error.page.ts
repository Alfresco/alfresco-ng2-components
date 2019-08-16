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

import { BrowserVisibility } from '../utils/browser-visibility';
import { element, by } from 'protractor';
import { BrowserActions } from '../utils/browser-actions';
import { ElementFinder } from 'protractor';

export class ErrorPage {

    errorPageCode: ElementFinder = element(by.css('adf-error-content .adf-error-content-code'));
    errorPageTitle: ElementFinder = element(by.css('adf-error-content .adf-error-content-title'));
    errorPageDescription: ElementFinder = element(by.css('adf-error-content .adf-error-content-description'));
    backButton: ElementFinder = element(by.id('adf-return-button'));
    secondButton: ElementFinder = element(by.id('adf-secondary-button'));

    async clickBackButton(): Promise<void> {
        await BrowserActions.click(this.backButton);
    }

    async clickSecondButton(): Promise<void> {
        await BrowserActions.click(this.secondButton);
    }

    async checkErrorCode(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.errorPageCode);
    }

    async getErrorCode(): Promise<string> {
        return BrowserActions.getText(this.errorPageCode);
    }

    async getErrorTitle(): Promise<string> {
        return BrowserActions.getText(this.errorPageTitle);
    }

    async getErrorDescription(): Promise<string> {
        return BrowserActions.getText(this.errorPageDescription);
    }
}
