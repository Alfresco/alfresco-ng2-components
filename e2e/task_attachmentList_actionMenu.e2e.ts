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

import LoginPage = require('./pages/adf/loginPage');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage');
import TasksPage = require('./pages/adf/process_services/tasksPage');
import { AttachmentListPage } from './pages/adf/process_services/attachmentListPage';
import ViewerPage = require('./pages/adf/viewerPage.js');

import CONSTANTS = require('./util/constants');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util.js');

import path = require('path');
import fs = require('fs');

import AlfrescoApi = require('alfresco-js-api-node');
import {UsersActions} from './actions/users.actions';
import {AppsActions} from './actions/APS/apps.actions';
import FileModel = require('./models/ACS/fileModel');

describe('Attachment list action menu for tasks', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let attachmentListPage = new AttachmentListPage();
    let viewerPage = new ViewerPage();
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let jpgFile = new FileModel({
        location: resources.Files.ADF_DOCUMENTS.JPG.file_location,
        name: resources.Files.ADF_DOCUMENTS.JPG.file_name
    });
    let downloadedJpgFile = path.join(__dirname, 'downloads', jpgFile.name);
    let tenantId, appId;
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

        attachmentListPage.clickAttachFileButton(jpgFile.location);
        attachmentListPage.viewFile(jpgFile.name);

        viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        viewerPage.clickCloseButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);

        attachmentListPage.doubleClickFile(jpgFile.name);

        viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        viewerPage.clickCloseButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);

        attachmentListPage.downloadFile(jpgFile.name);

        expect(Util.fileExists(downloadedJpgFile, 20)).toBe(true);

        attachmentListPage.removeFile(jpgFile.name);
        attachmentListPage.checkFileIsRemoved(jpgFile.name);
    });

    it('[C260236] Should be able to View /Download /Remove from Attachment List on a completed task', () => {
        processServicesPage.goToProcessServices().goToApp(app.title).clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.completed).clickStartButton()
            .then(() => {
                attachmentListPage.clickAttachFileButton(jpgFile.location);
                attachmentListPage.checkFileIsAttached(jpgFile.name);
            });

        taskPage.completeTaskNoForm();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(taskName.completed);

        attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        attachmentListPage.viewFile(jpgFile.name);

        viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        viewerPage.clickCloseButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(taskName.completed);

        attachmentListPage.downloadFile(jpgFile.name);

        expect(Util.fileExists(downloadedJpgFile, 20)).toBe(true);

        attachmentListPage.removeFile(jpgFile.name);
        attachmentListPage.checkFileIsRemoved(jpgFile.name);
    });

    it('[C260225] Should be able to upload a file in the Attachment list on Task App', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.taskApp).clickStartButton()
            .then(() => {
                attachmentListPage.clickAttachFileButton(jpgFile.location);
                attachmentListPage.checkFileIsAttached(jpgFile.name);
            });
    });

    it('[C279884] Should be able to view the empty attachment list for tasks', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(taskName.emptyList).clickStartButton()
            .then(() => {
                attachmentListPage.checkEmptyAttachmentList();
                attachmentListPage.clickAttachFileButton(jpgFile.location);
                attachmentListPage.checkFileIsAttached(jpgFile.name);
                attachmentListPage.removeFile(jpgFile.name);
                attachmentListPage.checkFileIsRemoved(jpgFile.name);
                attachmentListPage.checkEmptyAttachmentList();
            });
    });

});
