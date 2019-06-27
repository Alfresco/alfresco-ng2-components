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

import { element, by, browser } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ConfigEditorPage {

    textField = element(by.css('#adf-form-config-editor div.overflow-guard > textarea'));

    enterConfiguration(text) {

        BrowserVisibility.waitUntilElementIsVisible(this.textField);
        this.textField.sendKeys(text);
        return this;
    }

    clickSaveButton() {
        const saveButton = element(by.id('adf-form-config-save'));
        BrowserActions.click(saveButton);
    }

    clickClearButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.textField);
        const clearButton = element(by.id('adf-form-config-clear'));
        BrowserActions.click(clearButton);
    }

    enterBulkConfiguration(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.textField);
        browser.executeScript('this.monaco.editor.getModels()[0].setValue(`' + JSON.stringify(text) + '`)');
    }
}
