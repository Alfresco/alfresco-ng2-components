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

import { LoginSSOPage, ApplicationsUtil, ProcessUtil, ApiService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import CONSTANTS = require('../util/constants');
import { Tenant } from '../models/APS/tenant';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';

describe('Task Details - No form', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    let processUserModel;
    const app = browser.params.resources.Files.NO_FORM_APP;
    const taskPage = new TasksPage();
    const noFormMessage = 'No forms attached';
    let importedApp;
    const apiService = new ApiService();

    beforeAll(async () => {
        const usersActions = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        const { id } = await apiService.getInstance().activiti.adminTenantsApi.createTenant(new Tenant());
        processUserModel = await usersActions.createApsUser(id);

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
        await expect(await taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        await expect(await taskPage.formFields().getNoFormMessage()).toEqual(noFormMessage);
   });
});
