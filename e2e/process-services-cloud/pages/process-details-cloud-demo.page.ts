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

import { BrowserVisibility, DataTableComponentPage } from '@alfresco/adf-testing';
import { by, element } from 'protractor';

export class ProcessDetailsCloudDemoPage {

    dataTable: DataTableComponentPage = new DataTableComponentPage();

    async checkTaskIsDisplayed(taskName: string): Promise<void> {
        await this.dataTable.checkContentIsDisplayed('Name', taskName);
    }

    async selectProcessTaskByName(taskName: string): Promise<void> {
        await this.dataTable.selectRow('Name', taskName);
    }

    async checkListedSelectedProcessInstance(processInstanceId: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(element(by.cssContainingText('div ul', processInstanceId)));
    }
}
