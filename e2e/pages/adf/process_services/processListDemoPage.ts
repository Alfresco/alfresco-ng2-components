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

import Util = require('../../../util/util');

import { element, by } from 'protractor';

export class ProcessListDemoPage {

    appIdInput = element(by.css('input[data-automation-id="app-id"]'));
    resetButton = element(by.cssContainingText('button span', 'Reset'));
    emptyProcessContent = element(by.css('div[class="adf-empty-content"]'));
    processDefinitionInput = element(by.css('input[data-automation-id="process-definition-id"]'));

    addAppId(appId) {
        Util.waitUntilElementIsVisible(this.appIdInput);
        this.appIdInput.click();
        this.appIdInput.clear();
        return this.appIdInput.sendKeys(appId);
    }

    clickResetButton() {
        Util.waitUntilElementIsVisible(this.resetButton);
        return this.resetButton.click();
    }

    checkErrorMessageIsDisplayed(error) {
        let errorMessage = element(by.cssContainingText('mat-error', error));
        Util.waitUntilElementIsVisible(errorMessage);
    }

    checkNoProcessFoundIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.emptyProcessContent);
    }

    checkProcessIsDisplayed(processName) {
        let processRow = element(by.css('div[filename="' + processName + '"]'));
        return Util.waitUntilElementIsVisible(processRow);
    }

    addProcessDefinitionId(procDefinitionId) {
        Util.waitUntilElementIsVisible(this.processDefinitionInput);
        this.processDefinitionInput.click();
        this.processDefinitionInput.clear();
        return this.processDefinitionInput.sendKeys(procDefinitionId);
    }
}
