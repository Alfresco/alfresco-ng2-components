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

import { LoginSSOPage, BrowserActions, FileBrowserUtil, ApplicationsUtil, ApiService } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import { ProcessServicesPage } from '../pages/adf/process-services/process-services.page';
import CONSTANTS = require('../util/constants');
import { Tenant } from '../models/APS/tenant';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';
import { TaskRepresentation } from '@alfresco/js-api/src/api/activiti-rest-api/model/taskRepresentation';

describe('Task Audit', () => {

    const loginPage = new LoginSSOPage();
    let processUserModel;
    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const taskPage = new TasksPage();
    const processServices = new ProcessServicesPage();
    const taskTaskApp = 'Audit task task app';
    const taskCustomApp = 'Audit task custom app';
    const taskCompleteCustomApp = 'Audit completed task custom app';
    const auditLogFile = 'Audit.pdf';
    const apiService = new ApiService();

    beforeAll(async () => {
        const users = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        const { id } = await apiService.getInstance().activiti.adminTenantsApi.createTenant(new Tenant());
        processUserModel = await users.createApsUser(id);

        await apiService.getInstance().login(processUserModel.email, processUserModel.password);
        await apiService.getInstance().activiti.taskApi.createNewTask(new TaskRepresentation({ name: taskTaskApp }));
        const applicationsService = new ApplicationsUtil(apiService);
        await applicationsService.importPublishDeployApp(app.file_path);

        await loginPage.login(processUserModel.email, processUserModel.password);
    });

    afterAll( async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
    });

    beforeEach(async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/activiti');
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
