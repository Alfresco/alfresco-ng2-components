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
import ProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage.js');
import ProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage.js');
import { AttachmentListPage } from './pages/adf/process_services/attachmentListPage';
import ViewerPage = require('./pages/adf/viewerPage.js');

import CONSTANTS = require('./util/constants');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util.js');

import path = require('path');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from './actions/users.actions';
import { AppsActions } from './actions/APS/apps.actions';
import FileModel = require('./models/ACS/fileModel');

describe('Attachment list action menu for processes', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processFiltersPage = new ProcessFiltersPage();
    let processDetailsPage = new ProcessDetailsPage();
    let attachmentListPage = new AttachmentListPage();
    let viewerPage = new ViewerPage();
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let jpgFile = new FileModel({
        location: resources.Files.ADF_DOCUMENTS.JPG.file_location,
        name: resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    let downloadedJpgFile = path.join(__dirname, 'downloads', jpgFile.name);
    let tenantId, appId;
    let processName = {
        active: 'Active Process',
        completed: 'Completed Process',
        taskApp: 'Task App Name',
        emptyList: 'Empty List',
        dragDrop: 'Drag and Drop'
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

        await apps.startProcess(this.alfrescoJsApi, importedApp, processName.completed);
        await apps.startProcess(this.alfrescoJsApi, importedApp, processName.active);
        await apps.startProcess(this.alfrescoJsApi, 'Task App', processName.taskApp);
        await apps.startProcess(this.alfrescoJsApi, 'Task App', processName.emptyList);
        await apps.startProcess(this.alfrescoJsApi, 'Task App', processName.dragDrop);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C260228] Option menu functionality - Active Process', () => {
        processServicesPage.goToProcessServices().goToApp(app.title).clickProcessButton();

        processFiltersPage.selectFromProcessList(processName.active);

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.clickAttachFileButton(jpgFile.location);
        attachmentListPage.viewFile(jpgFile.name);

        viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        viewerPage.clickCloseButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.active);

        attachmentListPage.doubleClickFile(jpgFile.name);

        viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        viewerPage.clickCloseButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.active);

        attachmentListPage.downloadFile(jpgFile.name);

        expect(Util.fileExists(downloadedJpgFile, 20)).toBe(true);

        attachmentListPage.removeFile(jpgFile.name);
        attachmentListPage.checkFileIsRemoved(jpgFile.name);
    });

    it('[C279886] Option menu functionality - Completed Process', () => {
        processServicesPage.goToProcessServices().goToApp(app.title).clickProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.completed);

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.clickAttachFileButton(jpgFile.location);

        processDetailsPage.clickCancelProcessButton();

        processFiltersPage.clickCompletedFilterButton();

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        attachmentListPage.viewFile(jpgFile.name);

        viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        viewerPage.clickCloseButton();

        processFiltersPage.clickCompletedFilterButton();

        attachmentListPage.downloadFile(jpgFile.name);

        expect(Util.fileExists(downloadedJpgFile, 20)).toBe(true);

        attachmentListPage.removeFile(jpgFile.name);
        attachmentListPage.checkFileIsRemoved(jpgFile.name);
    });

    it('[C277296] Upload file - ProcessList - Task APP', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.taskApp);

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.clickAttachFileButton(jpgFile.location);
        attachmentListPage.checkFileIsAttached(jpgFile.name);
    });

    it('[C260235] Empty list component', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.emptyList);

        attachmentListPage.checkEmptyAttachmentList();
        attachmentListPage.clickAttachFileButton(jpgFile.location);
        attachmentListPage.checkFileIsAttached(jpgFile.name);
        attachmentListPage.removeFile(jpgFile.name);
        attachmentListPage.checkFileIsRemoved(jpgFile.name);
        attachmentListPage.checkEmptyAttachmentList();
    });

});
