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

import { browser } from 'protractor';
import { LoginPage } from '@alfresco/adf-testing';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { CommentsPage } from '../pages/adf/commentsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Comment component for Processes', () => {

    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const commentsPage = new CommentsPage();
    const navigationBarPage = new NavigationBarPage();

    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let user, tenantId, appId, processInstanceId, addedComment;

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        const apps = new AppsActions();
        const users = new UsersActions();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appId = importedApp.id;

        const processWithComment = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Comment APS');
        processInstanceId = processWithComment.id;

        await loginPage.loginToProcessServicesUsingUserModel(user);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

    });

    it('[C260464] Should be able to add a comment on APS and check on ADF', async () => {
        await this.alfrescoJsApi.activiti.commentsApi.addProcessInstanceComment({ message: 'HELLO' }, processInstanceId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList('Comment APS');

        addedComment = await this.alfrescoJsApi.activiti.commentsApi.getProcessInstanceComments(processInstanceId, { 'latestFirst': true });

        await commentsPage.checkUserIconIsDisplayed(0);

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (' + addedComment.total + ')');
        await expect(await commentsPage.getMessage(0)).toEqual(addedComment.data[0].message);
        await expect(await commentsPage.getUserName(0)).toEqual(addedComment.data[0].createdBy.firstName + ' ' + addedComment.data[0].createdBy.lastName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    it('[C260465] Should not be able to view process comment on included task', async () => {
        await this.alfrescoJsApi.activiti.commentsApi.addProcessInstanceComment({ message: 'GOODBYE' }, processInstanceId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList('Comment APS');

        const taskQuery = await this.alfrescoJsApi.activiti.taskApi.listTasks({ processInstanceId: processInstanceId });

        const taskId = taskQuery.data[0].id;

        const taskComments = await this.alfrescoJsApi.activiti.commentsApi.getTaskComments(taskId, { 'latestFirst': true });
        await expect(await taskComments.total).toEqual(0);
    });

    it('[C260466] Should be able to display comments from Task on the related Process', async () => {
        const taskQuery = await this.alfrescoJsApi.activiti.taskApi.listTasks({ processInstanceId: processInstanceId });

        const taskId = taskQuery.data[0].id;

        await this.alfrescoJsApi.activiti.taskApi.addTaskComment({ message: 'Task Comment' }, taskId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList('Comment APS');

        const addedTaskComment = await this.alfrescoJsApi.activiti.commentsApi.getProcessInstanceComments(processInstanceId, { 'latestFirst': true });

        await commentsPage.checkUserIconIsDisplayed(0);

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (' + addedTaskComment.total + ')');
        await expect(await commentsPage.getMessage(0)).toEqual(addedTaskComment.data[0].message);
        await expect(await commentsPage.getUserName(0)).toEqual(addedTaskComment.data[0].createdBy.firstName + ' ' + addedTaskComment.data[0].createdBy.lastName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });
});
