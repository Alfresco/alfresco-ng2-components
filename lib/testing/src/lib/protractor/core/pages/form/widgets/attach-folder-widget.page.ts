/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { by, $ } from 'protractor';
import { FormFields } from '../form-fields';
import { BrowserActions, BrowserVisibility } from '../../../utils/public-api';

export class AttachFolderWidgetPage {

    formFields: FormFields = new FormFields();
    foldersListLocator = '.adf-attach-folder-result';

    async clickWidget(fieldId: string): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId).$(`button[id="folder-${fieldId}-button"]`);
        await BrowserActions.click(widget);
    }

    async checkFolderIsAttached(fieldId: string, name: string): Promise<void> {
        const folderAttached = await this.getFolderAttachedLocator(fieldId, name);
        await BrowserVisibility.waitUntilElementIsVisible(folderAttached);
    }

    async checkFolderIsNotAttached(fieldId: string, name: string): Promise<void> {
        const folderAttached = await this.getFolderAttachedLocator(fieldId, name);
        await BrowserVisibility.waitUntilElementIsNotPresent(folderAttached);
    }

    async attachFileWidgetDisplayed(id: string): Promise<void> {
        const locator = $(id ? id : '#attachfolder');
        await BrowserVisibility.waitUntilElementIsVisible(locator);
    }

    async removeFolder(fieldId: string, name: string): Promise<void> {
        await this.checkFolderIsAttached(fieldId, name);
        const widget = await this.formFields.getWidget(fieldId);
        const folderToBeRemoved = widget.$(this.foldersListLocator).$(`[id="folder-${fieldId}-remove"]`);
        await BrowserActions.click(folderToBeRemoved);
    }

    private async getFolderAttachedLocator(fieldId: string, name: string) {
        const widget = await this.formFields.getWidget(fieldId);
        return widget.$(this.foldersListLocator).element(by.cssContainingText('span', name));
    }

}
