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
import { LoginSSOPage, FileBrowserUtil, ViewerPage, ApplicationsUtil, ApiService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import { AttachmentListPage } from '../pages/adf/process-services/attachment-list.page';
import CONSTANTS = require('../util/constants');
import path = require('path');
import fs = require('fs');
import { UsersActions } from '../actions/users.actions';
import { FileModel } from '../models/ACS/file.model';
import { TaskRepresentation } from '@alfresco/js-api';

describe('Attachment list action menu for tasks', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const attachmentListPage = new AttachmentListPage();
    const viewerPage = new ViewerPage();
    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const pngFile = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name
    });
    const downloadedPngFile = pngFile.name;
    let tenantId, appId, relatedContent, relatedContentId;
    const taskName = {
        active: 'Active Task',
        completed: 'Completed Task',
        taskApp: 'Task App Name',
        emptyList: 'Empty List'
    };
    const apiService = new ApiService();

    beforeAll(async () => {
        const users = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        const user = await users.createTenantAndUser();
        tenantId = user.tenantId;

        await apiService.getInstance().login(user.email, user.password);
        const applicationsService = new ApplicationsUtil(apiService);
        const { id } = await applicationsService.importPublishDeployApp(app.file_path);
        appId = id;

        await loginPage.login(user.email, user.password);
    });

    afterAll(async () => {
        await apiService.getInstance().activiti.modelsApi.deleteModel(appId);
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(tenantId);
    });

    it('[C277311] Should be able to View /Download /Remove from Attachment List on an active task', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.createTask({ name: taskName.active });

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.viewFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await attachmentListPage.doubleClickFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await attachmentListPage.downloadFile(pngFile.name);

        await browser.sleep(1000);

        await FileBrowserUtil.isFileDownloaded(downloadedPngFile);

        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C260236] Should be able to View /Download /Remove from Attachment List on a completed task', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        const task = await taskPage.createNewTask();
        await task.addName(taskName.completed);
        await task.clickStartButton();

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(taskName.completed);

        await attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        await attachmentListPage.viewFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await attachmentListPage.downloadFile(pngFile.name);

        await browser.sleep(1000);

        await FileBrowserUtil.isFileDownloaded(downloadedPngFile);

        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C260225] Should be able to upload a file in the Attachment list on Task App', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        const task = await taskPage.createNewTask();
        await task.addName(taskName.taskApp);
        await task.clickStartButton();

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);
    });

    it('[C279884] Should be able to view the empty attachment list for tasks', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        const task = await taskPage.createNewTask();
        await task.addName(taskName.emptyList);
        await task.clickStartButton();

        await attachmentListPage.checkEmptyAttachmentList();
        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);
        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
        await attachmentListPage.checkEmptyAttachmentList();
    });

    it('[C260234] Should be able to attache a file on a task on APS and check on ADF', async () => {
        const newTask = await apiService.getInstance().activiti.taskApi.createNewTask(new TaskRepresentation({ name: 'SHARE KNOWLEDGE' }));
        const newTaskId = newTask.id;
        const filePath = path.join(browser.params.testConfig.main.rootPath + pngFile.location);
        const file = fs.createReadStream(filePath);

        relatedContent = await apiService.getInstance().activiti.contentApi.createRelatedContentOnTask(newTaskId, file, { 'isRelatedContent': true });
        relatedContentId = relatedContent.id;

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow('SHARE KNOWLEDGE');

        await attachmentListPage.checkFileIsAttached(pngFile.name);

        await apiService.getInstance().activiti.contentApi.deleteContent(relatedContentId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow('SHARE KNOWLEDGE');

        await attachmentListPage.checkEmptyAttachmentList();
    });
});
