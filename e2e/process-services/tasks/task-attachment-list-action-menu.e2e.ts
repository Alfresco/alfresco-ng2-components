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

import { browser } from 'protractor';
import { createApiService,
    ApplicationsUtil,
    FileBrowserUtil,
    LoginPage, ModelsActions, TaskUtil,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksPage } from './../pages/tasks.page';
import { AttachmentListPage } from './../pages/attachment-list.page';
import * as fs from 'fs';
import * as path from 'path';
import { FileModel } from '../../models/ACS/file.model';
import CONSTANTS = require('../../util/constants');
import { Activiti } from '@alfresco/js-api';
import ContentApi = Activiti.ContentApi;

describe('Attachment list action menu for tasks', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const attachmentListPage = new AttachmentListPage();
    const viewerPage = new ViewerPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const modelsActions = new ModelsActions(apiService);
    const taskUtil = new TaskUtil(apiService);
    const contentApi = new ContentApi();
    contentApi.init(apiService.getInstance());

    const pngFile = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name
    });
    const downloadedPngFile = pngFile.name;
    let tenantId; let appId; let relatedContent; let relatedContentId;
    const taskName = {
        active: 'Active Task',
        completed: 'Completed Task',
        taskApp: 'Task App Name',
        emptyList: 'Empty List'
    };

    beforeAll(async () => {

        await apiService.loginWithProfile('admin');
        const user = await usersActions.createUser();
        tenantId = user.tenantId;

        await apiService.login(user.username, user.password);
        const applicationsService = new ApplicationsUtil(apiService);
        const { id } = await applicationsService.importPublishDeployApp(app.file_path);
        appId = id;

        await loginPage.login(user.username, user.password);
    });

    afterAll(async () => {
        await modelsActions.deleteModel(appId);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(tenantId);
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
        const newTask = await taskUtil.createStandaloneTask('SHARE KNOWLEDGE');
        const newTaskId = newTask.id;
        const filePath = path.join(browser.params.testConfig.main.rootPath + pngFile.location);
        const file = fs.createReadStream(filePath);

        relatedContent = await contentApi.createRelatedContentOnTask(newTaskId, file, { isRelatedContent: true });
        relatedContentId = relatedContent.id;

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow('SHARE KNOWLEDGE');

        await attachmentListPage.checkFileIsAttached(pngFile.name);

        await contentApi.deleteContent(relatedContentId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow('SHARE KNOWLEDGE');

        await attachmentListPage.checkEmptyAttachmentList();
    });
});
