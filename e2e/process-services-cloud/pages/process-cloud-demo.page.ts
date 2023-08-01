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

import { BrowserActions, BrowserVisibility, EditProcessFilterCloudComponentPage, ProcessFiltersCloudComponentPage, ProcessListCloudComponentPage } from '@alfresco/adf-testing';
import { $ } from 'protractor';

export class ProcessCloudDemoPage {

    createButton = $('button[data-automation-id="create-button"]');
    newProcessButton = $('button[data-automation-id="btn-start-process"]');

    processListCloud = new ProcessListCloudComponentPage();
    editProcessFilterCloud = new EditProcessFilterCloudComponentPage();
    processFilterCloudComponent = new ProcessFiltersCloudComponentPage();

    editProcessFilterCloudComponent(): EditProcessFilterCloudComponentPage {
        return this.editProcessFilterCloud;
    }

    processListCloudComponent(): ProcessListCloudComponentPage {
        return this.processListCloud;
    }

    async openNewProcessForm(): Promise<void> {
        await this.clickOnCreateButton();
        await this.newProcessButtonIsDisplayed();
        await BrowserActions.click(this.newProcessButton);
    }

    async newProcessButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.newProcessButton);
    }

    async clickOnCreateButton(): Promise<void> {
        await BrowserActions.click(this.createButton);
    }
}
