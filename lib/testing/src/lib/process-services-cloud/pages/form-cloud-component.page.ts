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

import { by, element, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { ConfigEditorPage } from '../../core/pages/config-editor-page';

export class FormCloudComponentPage {

    formCloudEditor: ElementFinder = element.all(by.css('.mat-tab-list .mat-tab-label')).get(1);
    formCloudRender: ElementFinder = element.all(by.css('.mat-tab-list .mat-tab-label')).get(0);

    configEditorPage = new ConfigEditorPage();

    async goToEditor(): Promise<void> {
        await BrowserActions.click(this.formCloudEditor);
    }

    async goToRenderedForm(): Promise<void> {
        await BrowserActions.click(this.formCloudRender);
    }

    async setConfigToEditor(text): Promise<void> {
        const configEditor = element(by.id('adf-form-config-editor'));
        const form = element(by.css('adf-cloud-form'));
        await this.goToEditor();
        await BrowserVisibility.waitUntilElementIsVisible(configEditor);
        await this.configEditorPage.enterBulkConfiguration(text);
        await this.goToRenderedForm();
        await BrowserVisibility.waitUntilElementIsVisible(form);
    }
}
