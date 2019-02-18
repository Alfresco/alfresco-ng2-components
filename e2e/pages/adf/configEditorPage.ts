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
import { Util } from '../../util/util';

export class ConfigEditorPage {

    enterConfiguration(text) {
        let textField = element(by.css('#adf-code-configuration-editor div.overflow-guard > textarea'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys(text);
        return this;
    }

    enterBigConfigurationText(text) {
        let textField = element(by.css('#adf-code-configuration-editor div.overflow-guard > textarea'));
        Util.waitUntilElementIsVisible(textField);

        browser.executeScript('this.monaco.editor.getModels()[0].setValue(`' + text + '`)');
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

    clickSearchConfiguration() {
        let button = element(by.id('adf-search-conf'));
        Util.waitUntilElementIsVisible(button);
        Util.waitUntilElementIsClickable(button);
        return button.click();
    }

    clickProcessListCloudConfiguration() {
        let button = element(by.id('adf-process-list-cloud-conf'));
        Util.waitUntilElementIsVisible(button);
        Util.waitUntilElementIsClickable(button);
        return button.click();
    }

    clickEditProcessCloudConfiguration() {
        let button = element(by.id('adf-edit-process-filter-conf'));
        Util.waitUntilElementIsVisible(button);
        Util.waitUntilElementIsClickable(button);
        return button.click();
    }

    clickEditTaskConfiguration() {
        let button = element(by.id('adf-edit-task-filter-conf'));
        Util.waitUntilElementIsVisible(button);
        Util.waitUntilElementIsClickable(button);
        return button.click();
    }

    clickTaskListCloudConfiguration() {
        let button = element(by.id('adf-task-list-cloud-conf'));
        Util.waitUntilElementIsVisible(button);
        Util.waitUntilElementIsClickable(button);
        return button.click();
    }
}
