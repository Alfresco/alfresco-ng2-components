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

import { LoginPage, BrowserActions, FileBrowserUtil } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';

import CONSTANTS = require('../util/constants');

import { Tenant } from '../models/APS/tenant';

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Task Audit', () => {

    const loginPage = new LoginPage();
    let processUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const taskPage = new TasksPage();
    const processServices = new ProcessServicesPage();
    const taskTaskApp = 'Audit task task app';
    const taskCustomApp = 'Audit task custom app';
    const taskCompleteCustomApp = 'Audit completed task custom app';
    const auditLogFile = 'Audit.pdf';

    beforeAll(async () => {
        const users = new UsersActions();
        const apps = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: taskTaskApp });

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    beforeEach(async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/activiti');

    });

    it('[C260386] Should Audit file be downloaded when clicking on Task Audit log icon on a standalone running task', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskTaskApp);

        await taskPage.taskDetails().clickAuditLogButton();
        await expect(await FileBrowserUtil.isFileDownloaded(auditLogFile)).toBe(true);
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
        await expect(await FileBrowserUtil.isFileDownloaded(auditLogFile)).toBe(true);
    });

    it('[C263944] Should Audit file be downloaded when clicking on Task Audit log icon on a custom app standalone completed task', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        const task = await taskPage.createNewTask();
        await task.addName(taskCompleteCustomApp);
        await task.clickStartButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskCompleteCustomApp);

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(taskCompleteCustomApp);
        await expect(await taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + taskCompleteCustomApp + ' completed');

        await taskPage.taskDetails().clickAuditLogButton();
        await expect(await FileBrowserUtil.isFileDownloaded(auditLogFile)).toBe(true);
    });

    it('[C263943] Should Audit file be downloaded when clicking on Task Audit log icon on a custom app standalone running task', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        const task = await taskPage.createNewTask();
        await task.addName(taskCustomApp);
        await task.clickStartButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskCustomApp);

        await taskPage.taskDetails().clickAuditLogButton();
        await expect(await FileBrowserUtil.isFileDownloaded(auditLogFile)).toBe(true);
    });

});
