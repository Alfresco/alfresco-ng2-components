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

import {
    TaskFiltersCloudComponentPage,
    EditTaskFilterCloudComponentPage,
    TaskListCloudComponentPage,
    BrowserActions,
    TestElement,
    DataTableComponentPage
} from '@alfresco/adf-testing';

export class TasksCloudDemoPage {
    createButton = TestElement.byCss('button[data-automation-id="create-button"');
    newTaskButton = TestElement.byCss('button[data-automation-id="btn-start-task"]');
    spinner = TestElement.byTag('mat-progress-spinner');

    editTaskFilterCloud = new EditTaskFilterCloudComponentPage();
    taskFilterCloudComponent = new TaskFiltersCloudComponentPage();
    dataTableComponentPage = new DataTableComponentPage();

    taskListCloudComponent(): TaskListCloudComponentPage {
        return new TaskListCloudComponentPage();
    }

    async openNewTaskForm(): Promise<void> {
        await this.createButton.click();
        await BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]');
    }

    async clickStartNewTaskButton() {
        await this.createButton.click();
        await this.newTaskButton.click();
    }

    async waitTillContentLoaded(): Promise<void> {
        await this.dataTableComponentPage.waitTillContentLoaded();
    }
}
