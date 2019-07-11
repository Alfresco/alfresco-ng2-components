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

import { ConfigEditorPage } from '../../configEditorPage';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { by, element, browser } from 'protractor';

export class FormCloudDemoPage {

    formCloudEditor = element.all(by.css('.mat-tab-list .mat-tab-label')).get(1);
    formCloudRender = element.all(by.css('.mat-tab-list .mat-tab-label')).get(0);

    configEditorPage = new ConfigEditorPage();

    goToEditor() {
        BrowserVisibility.waitUntilElementIsVisible(this.formCloudEditor);
        BrowserActions.click(this.formCloudEditor);
    }

    goToRenderedForm() {
        BrowserVisibility.waitUntilElementIsVisible(this.formCloudRender);
        BrowserActions.click(this.formCloudRender);
    }

    setConfigToEditor(text) {
        this.goToEditor();
        browser.sleep(2000);
        this.configEditorPage.enterBulkConfiguration(text);
        this.goToRenderedForm();
        browser.sleep(2000);
    }
}
