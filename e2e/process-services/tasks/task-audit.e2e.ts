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
    LoginPage,
    BrowserActions,
    FileBrowserUtil,
    ApplicationsUtil, createApiService,
    UsersActions,
    TaskUtil
} from '@alfresco/adf-testing';
import { TasksPage } from './../pages/tasks.page';
import { ProcessServicesPage } from './../pages/process-services.page';
import CONSTANTS = require('../../util/constants');
import { browser } from 'protractor';

describe('Task Audit', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const processServices = new ProcessServicesPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const taskUtil = new TaskUtil(apiService);

    let processUserModel;

    const taskTaskApp = 'Audit task task app';
    const taskCustomApp = 'Audit task custom app';
    const taskCompleteCustomApp = 'Audit completed task custom app';
    const auditLogFile = 'Audit.pdf';

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);
        await taskUtil.createStandaloneTask(taskTaskApp);
        const applicationsService = new ApplicationsUtil(apiService);
        await applicationsService.importPublishDeployApp(app.file_path);

        await loginPage.login(processUserModel.username, processUserModel.password);
    });

    afterAll( async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
    });

    beforeEach(async () => {
        await BrowserActions.getUrl(browser.baseUrl + '/activiti');
    });

    it('[C260386] Should Audit file be downloaded when clicking on Task Audit log icon on a standalone running task', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskTaskApp);

        await taskPage.taskDetails().clickAuditLogButton();
        await FileBrowserUtil.isFileDownloaded(auditLogFile);
    });

    it('[C260389] Should Audit file be downloaded when clicking on Task Audit log icon on a standalone completed task', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskTaskApp);

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(taskTaskApp);
        await expect(await taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + taskTaskApp + ' completed');

        await taskPage.taskDetails().clickAuditLogButton();
        await FileBrowserUtil.isFileDownloaded(auditLogFile);
    });

    it('[C263944] Should Audit file be downloaded when clicking on Task Audit log icon on a custom app standalone completed task', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.createTask({name: taskCompleteCustomApp});

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskCompleteCustomApp);

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(taskCompleteCustomApp);
        await expect(await taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + taskCompleteCustomApp + ' completed');

        await taskPage.taskDetails().clickAuditLogButton();
        await FileBrowserUtil.isFileDownloaded(auditLogFile);
    });

    it('[C263943] Should Audit file be downloaded when clicking on Task Audit log icon on a custom app standalone running task', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.createTask({name: taskCustomApp});

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskCustomApp);

        await taskPage.taskDetails().clickAuditLogButton();
        await FileBrowserUtil.isFileDownloaded(auditLogFile);
    });
});
