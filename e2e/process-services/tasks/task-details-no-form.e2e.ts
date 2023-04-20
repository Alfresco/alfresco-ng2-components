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

import { createApiService, ApplicationsUtil, LoginPage, ProcessUtil, UsersActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksPage } from './../pages/tasks.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');

describe('Task Details - No form', () => {

    const app = browser.params.resources.Files.NO_FORM_APP;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    let processUserModel;
    const noFormMessage = 'No forms attached';
    let importedApp;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);
        const applicationsService = new ApplicationsUtil(apiService);
        importedApp = await applicationsService.importPublishDeployApp(app.file_path);
        await new ProcessUtil(apiService).startProcessOfApp(importedApp.name);
        await loginPage.login(processUserModel.username, processUserModel.password);
   });

    afterAll( async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
    });

    it('[C289311] Should attach form and complete buttons to be displayed when no form is attached', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.tasksListPage().checkContentIsDisplayed(app.taskName);
        await taskPage.tasksListPage().selectRow(app.taskName);
        await taskPage.taskDetails().noFormIsDisplayed();
        await taskPage.taskDetails().checkCompleteTaskButtonIsDisplayed();
        await taskPage.taskDetails().checkCompleteTaskButtonIsEnabled();
        await taskPage.taskDetails().checkAttachFormButtonIsNotDisplayed();
        await taskPage.taskDetails().waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        await expect(await taskPage.formFields().getNoFormMessage()).toEqual(noFormMessage);
   });
});
