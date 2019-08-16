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

import { FormFields } from '../formFields';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import * as remote from 'selenium-webdriver/remote';
import { element, by, browser } from 'protractor';
import { ElementFinder } from 'protractor';

export class AttachFileWidget {

    formFields: FormFields = new FormFields();
    uploadLocator = by.css('button[id="attachfile"]');
    localStorageButton: ElementFinder = element(by.css('input[id="attachfile"]'));
    filesListLocator = by.css('div[id="adf-attach-widget-readonly-list"]');

    async attachFile(fieldId, fileLocation): Promise<void> {
        browser.setFileDetector(new remote.FileDetector());
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(this.uploadLocator);
        await BrowserActions.click(uploadButton);
        await BrowserVisibility.waitUntilElementIsPresent(this.localStorageButton);
        await this.localStorageButton.sendKeys(fileLocation);
    }

    async checkFileIsAttached(fieldId, name): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const fileAttached = widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
    }

    async viewFile(name): Promise<void> {
        const fileView = element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserActions.click(fileView);
        await browser.actions().doubleClick(fileView).perform();
    }
}
