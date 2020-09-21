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

import { ApiService, ApplicationsUtil, LoginPage, ProcessUtil, UsersActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { TasksPage } from './pages/tasks.page';
import { browser } from 'protractor';
import CONSTANTS = require('../util/constants');

describe('Task Details - No form', () => {

    const app = browser.params.resources.Files.NO_FORM_APP;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = new ApiService();

    let processUserModel;
    const taskPage = new TasksPage();
    const noFormMessage = 'No forms attached';
    let importedApp;

    beforeAll(async () => {
        const usersActions = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        processUserModel = await usersActions.createUser();

        await apiService.getInstance().login(processUserModel.email, processUserModel.password);
        const applicationsService = new ApplicationsUtil(apiService);
        importedApp = await applicationsService.importPublishDeployApp(app.file_path);
        await new ProcessUtil(apiService).startProcessOfApp(importedApp.name);
        await loginPage.login(processUserModel.email, processUserModel.password);
   });

    afterAll( async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
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
