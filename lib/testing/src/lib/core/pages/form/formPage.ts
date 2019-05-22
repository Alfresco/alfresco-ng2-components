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

import { element, by } from 'protractor';
import { BrowserVisibility } from '../../utils/browser-visibility';

export class FormPage {

    errorLog = element(by.css('div[class*="console"]'));

    checkErrorMessageForWidgetIsDisplayed(errorMessage) {
        return BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('.adf-error-text', errorMessage)));
    }

    checkErrorMessageForWidgetIsNotDisplayed(errorMessage) {
        return BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('.adf-error-text', errorMessage)));
    }

    checkErrorLogMessage(errorMessage) {
        BrowserVisibility.waitUntilElementIsVisible(this.errorLog);
        return BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('div[class*="console"] p', errorMessage)));
    }

    checkErrorMessageIsNotDisplayed(errorMessage) {
        BrowserVisibility.waitUntilElementIsVisible(this.errorLog);
        return BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('div[class*="console"] p', errorMessage)));
    }

}
