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

export class ProcessListPage {

    processListTitle = element(by.css('p[class="adf-empty-content__title"]'));
    processDetailsMessage = element(by.css('adf-process-instance-details div[class="ng-star-inserted"]'));
    openProcessDropdownElement = element(by.id('adf-select-process-dropdown'));
    selectProcessDropdownElement = element.all(by.css('span[class="mat-option-text"]'));
    startProcessButton = element(by.css('button[data-automation-id="btn-start"]'));

    checkProcessListTitleIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processListTitle);
        return this.processListTitle.getText();
    }

    checkProcessDetailsMessagee() {
        Util.waitUntilElementIsVisible(this.processListTitle);
        return this.processDetailsMessage.getText();
    }

    openProcessDropdown() {
        Util.waitUntilElementIsVisible(this.openProcessDropdownElement);
        return this.openProcessDropdownElement.click();
    }

    selectProcessDropdown(index) {
        Util.waitUntilElementIsVisible(this.selectProcessDropdownElement);
        return this.selectProcessDropdownElement.get(index).click();
    }

    startProcess() {
        Util.waitUntilElementIsVisible(this.startProcessButton);
        return this.startProcessButton.click();
    }

}
