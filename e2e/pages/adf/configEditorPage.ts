/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import Util = require('../../util/util');

export class ConfigEditorPage {

    enterConfiguration(text) {
        let textField = element(by.css('#adf-code-configuration-editor div.overflow-guard > textarea'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys(text);
        return this;
    }

    clickSaveButton() {
        let saveButton = element(by.id('adf-configuration-save'));
        Util.waitUntilElementIsVisible(saveButton);
        Util.waitUntilElementIsClickable(saveButton);
        return saveButton.click();
    }

    clickClearButton() {
        let clearButton = element(by.id('adf-configuration-clear'));
        Util.waitUntilElementIsVisible(clearButton);
        Util.waitUntilElementIsClickable(clearButton);
        return clearButton.click();
    }

    clickFileConfiguration() {
        let button = element(by.id('adf-file-conf'));
        Util.waitUntilElementIsVisible(button);
        Util.waitUntilElementIsClickable(button);
        return button.click();
    }
}
