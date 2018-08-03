/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import LoginPage = require('../pages/adf/loginPage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import TasksPage = require('../pages/adf/process_services/tasksPage');
import { AttachmentListPage } from '../pages/adf/process_services/attachmentListPage';
import ViewerPage = require('../pages/adf/viewerPage.js');

import CONSTANTS = require('../util/constants');

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import Util = require('../util/util.js');

import path = require('path');
import fs = require('fs');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import FileModel = require('../models/ACS/fileModel');

describe('Attachment list action menu for tasks', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let attachmentListPage = new AttachmentListPage();
    let viewerPage = new ViewerPage();
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let pngFile = new FileModel({
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name
    });
    let downloadedPngFile = path.join(__dirname, 'downloads', pngFile.name);
    let tenantId, appId, relatedContent, relatedContentId;
    let taskName = {
        active: 'Active Task',
        completed: 'Completed Task',
        taskApp: 'Task App Name',
        emptyList: 'Empty List'
    };

    beforeAll(async(done) => {
        let apps = new AppsActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        let importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appId = importedApp.id;

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C277311] Should be able to View /Download /Remove from Attachment List on an active task', () => {
        processServicesPage.goToProcessServices().goToApp(app.title).clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.active).clickStartButton();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.viewFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);

        attachmentListPage.doubleClickFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);

        attachmentListPage.downloadFile(pngFile.name);

        browser.driver.sleep(1000);

        expect(Util.fileExists(downloadedPngFile, 30)).toBe(true);

        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C260236] Should be able to View /Download /Remove from Attachment List on a completed task', () => {
        processServicesPage.goToProcessServices().goToApp(app.title).clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.completed).clickStartButton();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);

        taskPage.completeTaskNoForm();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(taskName.completed);

        attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        attachmentListPage.viewFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(taskName.completed);

        attachmentListPage.downloadFile(pngFile.name);

        browser.driver.sleep(1000);

        expect(Util.fileExists(downloadedPngFile, 30)).toBe(true);

        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C260225] Should be able to upload a file in the Attachment list on Task App', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.taskApp).clickStartButton();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
    });

    it('[C279884] Should be able to view the empty attachment list for tasks', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
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
            let newTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask({name: 'SHARE KNOWLEDGE'});

            let newTaskId = newTask.id;

            let filePath = path.join(TestConfig.main.rootPath + pngFile.location);

            let file = fs.createReadStream(filePath);

            relatedContent = await this.alfrescoJsApi.activiti.contentApi.createRelatedContentOnTask(newTaskId, file, {'isRelatedContent': true});
            relatedContentId = relatedContent.id;
        });

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList('SHARE KNOWLEDGE');

        attachmentListPage.checkFileIsAttached(pngFile.name);

        browser.controlFlow().execute(async() => {
            await this.alfrescoJsApi.activiti.contentApi.deleteContent(relatedContentId);
        });

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList('SHARE KNOWLEDGE');

        attachmentListPage.checkEmptyAttachmentList();
    });
});
