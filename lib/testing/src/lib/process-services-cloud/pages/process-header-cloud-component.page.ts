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
import { BrowserVisibility } from '../../core/browser-visibility';

export class ProcessHeaderCloudPage {

    idField = element.all(by.css('span[data-automation-id*="id"] span')).first();
    nameField = element.all(by.css('span[data-automation-id*="name"] span')).first();
    statusField = element(by.css('span[data-automation-id*="status"] span'));
    initiatorField = element(by.css('span[data-automation-id*="initiator"] span'));
    startDateField = element(by.css('span[data-automation-id*="startDate"] span'));
    lastModifiedField = element(by.css('span[data-automation-id*="lastModified"] span'));
    parentIdField = element(by.css('span[data-automation-id*="parentId"] span'));
    businessKeyField = element.all(by.css('span[data-automation-id*="businessKey"] span')).first();

    getId() {
        BrowserVisibility.waitUntilElementIsVisible(this.idField);
        return this.idField.getText();
    }

    getName() {
        BrowserVisibility.waitUntilElementIsVisible(this.nameField);
        return this.nameField.getText();
    }

    getStatus() {
        BrowserVisibility.waitUntilElementIsVisible(this.statusField);
        return this.statusField.getText();
    }

    getInitiator() {
        BrowserVisibility.waitUntilElementIsVisible(this.initiatorField);
        return this.initiatorField.getText();
    }

    getStartDate() {
        BrowserVisibility.waitUntilElementIsVisible(this.startDateField);
        return this.startDateField.getText();
    }

    getLastModified() {
        BrowserVisibility.waitUntilElementIsVisible(this.lastModifiedField);
        return this.lastModifiedField.getText();
    }

    getParentId() {
        BrowserVisibility.waitUntilElementIsVisible(this.parentIdField);
        return this.parentIdField.getText();
    }

    getBusinessKey() {
        BrowserVisibility.waitUntilElementIsVisible(this.businessKeyField);
        return this.businessKeyField.getText();
    }

}
