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
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { AttachmentListPage } from '../pages/adf/process-services/attachmentListPage';
import { ViewerPage } from '../pages/adf/viewerPage';

import CONSTANTS = require('../util/constants');

import resources = require('../util/resources');
import { Util } from '../util/util';

import path = require('path');
import fs = require('fs');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import { FileModel } from '../models/ACS/fileModel';

describe('Attachment list action menu for tasks', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const attachmentListPage = new AttachmentListPage();
    const viewerPage = new ViewerPage();
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const pngFile = new FileModel({
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name
    });
    const downloadedPngFile = path.join(__dirname, 'downloads', pngFile.name);
    let tenantId, appId, relatedContent, relatedContentId;
    const taskName = {
        active: 'Active Task',
        completed: 'Completed Task',
        taskApp: 'Task App Name',
        emptyList: 'Empty List'
    };

    beforeAll(async(done) => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf.url
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appId = importedApp.id;

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C277311] Should be able to View /Download /Remove from Attachment List on an active task', () => {
        navigationBarPage.navigateToProcessServicesPage().goToApp(app.title).clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.active).clickStartButton();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.viewFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        attachmentListPage.doubleClickFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        attachmentListPage.downloadFile(pngFile.name);

        browser.driver.sleep(1000);

        expect(Util.fileExists(downloadedPngFile, 30)).toBe(true);

        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C260236] Should be able to View /Download /Remove from Attachment List on a completed task', () => {
        navigationBarPage.navigateToProcessServicesPage().goToApp(app.title).clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.completed).clickStartButton();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectRow(taskName.completed);

        attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        attachmentListPage.viewFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectRow(taskName.completed);

        attachmentListPage.downloadFile(pngFile.name);

        browser.driver.sleep(1000);

        expect(Util.fileExists(downloadedPngFile, 30)).toBe(true);

        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C260225] Should be able to upload a file in the Attachment list on Task App', () => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.taskApp).clickStartButton();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
    });

    it('[C279884] Should be able to view the empty attachment list for tasks', () => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.emptyList).clickStartButton();

        attachmentListPage.checkEmptyAttachmentList();
        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
        attachmentListPage.checkEmptyAttachmentList();
    });

    it('[C260234] Should be able to attache a file on a task on APS and check on ADF', () => {
        browser.controlFlow().execute(async() => {
            const newTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask({name: 'SHARE KNOWLEDGE'});

            const newTaskId = newTask.id;

            const filePath = path.join(browser.params.testConfig.main.rootPath + pngFile.location);

            const file = fs.createReadStream(filePath);

            relatedContent = await this.alfrescoJsApi.activiti.contentApi.createRelatedContentOnTask(newTaskId, file, {'isRelatedContent': true});
            relatedContentId = relatedContent.id;
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().selectRow('SHARE KNOWLEDGE');

        attachmentListPage.checkFileIsAttached(pngFile.name);

        browser.controlFlow().execute(async() => {
            await this.alfrescoJsApi.activiti.contentApi.deleteContent(relatedContentId);
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().selectRow('SHARE KNOWLEDGE');

        attachmentListPage.checkEmptyAttachmentList();
    });
});
