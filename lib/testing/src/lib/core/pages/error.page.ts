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

export class ErrorPage {

    errorPageCode = element(by.css('adf-error-content .adf-error-content-code'));
    errorPageTitle = element(by.css('adf-error-content .adf-error-content-title'));
    errorPageDescription = element(by.css('adf-error-content .adf-error-content-description'));
    backButton = element(by.id('adf-return-button'));
    secondButton = element(by.id('adf-secondary-button'));

    clickBackButton() {
        BrowserActions.click(this.backButton);
    }

    clickSecondButton() {
        BrowserActions.click(this.secondButton);
    }

    checkErrorCode() {
        BrowserVisibility.waitUntilElementIsVisible(this.errorPageCode);
    }

    getErrorCode() {
        return BrowserActions.getText(this.errorPageCode);
    }

    getErrorTitle() {
        return BrowserActions.getText(this.errorPageTitle);
    }

    getErrorDescription() {
        return BrowserActions.getText(this.errorPageDescription);
    }
}
