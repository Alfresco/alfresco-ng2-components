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

import * as remote from 'selenium-webdriver/remote';
import { browser, by, element } from 'protractor';
import { FormFields } from '../form-fields';
import { BrowserActions, BrowserVisibility } from '../../../utils/public-api';

export class AttachFolderWidgetPage {

    formFields: FormFields = new FormFields();
    foldersListLocator = by.css('.adf-attach-folder-result');

    async clickWidget(fieldId: string): Promise<void> {
        browser.setFileDetector(new remote.FileDetector());
        const widget = await this.formFields.getWidget(fieldId);
        await BrowserActions.click(widget);
    }

    async checkFolderIsAttached(fieldId, name): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const folderAttached = widget.element(this.foldersListLocator).element(by.cssContainingText('span', name));
        await BrowserVisibility.waitUntilElementIsVisible(folderAttached);
    }

    async checkFolderIsNotAttached(fieldId, name): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const folderAttached = widget.element(this.foldersListLocator).element(by.cssContainingText('span', name));
        await BrowserVisibility.waitUntilElementIsNotPresent(folderAttached);
    }

    async attachFileWidgetDisplayed(id: string): Promise<void> {
        const locator =  element(by.css(id ? id : '#attachfolder'));
        await BrowserVisibility.waitUntilElementIsVisible(locator);
    }

    async removeFolder(fieldId: string, name: string): Promise<void> {
        await this.checkFolderIsAttached(fieldId, name);
        const widget = await this.formFields.getWidget(fieldId);
        const folderToBeRemoved = widget.element(this.foldersListLocator).element(by.css(`[id="folder-${fieldId}-remove"]`));
        await BrowserActions.click(folderToBeRemoved);
    }

}
