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
import { BrowserActions } from '../../core/utils/browser-actions';
import { ElementFinder } from 'protractor';

export class ProcessHeaderCloudPage {

    idField: ElementFinder = element.all(by.css('span[data-automation-id*="id"] span')).first();
    nameField: ElementFinder = element.all(by.css('span[data-automation-id*="name"] span')).first();
    statusField: ElementFinder = element(by.css('span[data-automation-id*="status"] span'));
    initiatorField: ElementFinder = element(by.css('span[data-automation-id*="initiator"] span'));
    startDateField: ElementFinder = element.all(by.css('span[data-automation-id*="startDate"] span')).first();
    lastModifiedField: ElementFinder = element.all(by.css('span[data-automation-id*="lastModified"] span')).first();
    parentIdField: ElementFinder = element(by.css('span[data-automation-id*="parentId"] span'));
    businessKeyField: ElementFinder = element.all(by.css('span[data-automation-id*="businessKey"] span')).first();

    async getId(): Promise<string> {
        return BrowserActions.getText(this.idField);
    }

    async getName(): Promise<string> {
        return BrowserActions.getText(this.nameField);
    }

    async getStatus(): Promise<string> {
        return BrowserActions.getText(this.statusField);
    }

    async getInitiator(): Promise<string> {
        return BrowserActions.getText(this.initiatorField);
    }

    async getStartDate(): Promise<string> {
        return BrowserActions.getText(this.startDateField);
    }

    async getLastModified(): Promise<string> {
        return BrowserActions.getText(this.lastModifiedField);
    }

    async getParentId(): Promise<string> {
        return BrowserActions.getText(this.parentIdField);
    }

    async getBusinessKey(): Promise<string> {
        return BrowserActions.getText(this.businessKeyField);
    }

}
