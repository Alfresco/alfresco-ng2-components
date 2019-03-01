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

import { LoginPage } from '../pages/adf/loginPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { AttachmentListPage } from '../pages/adf/process-services/attachmentListPage';
import { ViewerPage } from '../pages/adf/viewerPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import { Util } from '../util/util';

import path = require('path');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import { FileModel } from '../models/ACS/fileModel';
import { browser } from 'protractor';

describe('Attachment list action menu for processes', () => {

    let loginPage = new LoginPage();
    let processFiltersPage = new ProcessFiltersPage();
    let processDetailsPage = new ProcessDetailsPage();
    let attachmentListPage = new AttachmentListPage();
    let navigationBarPage = new NavigationBarPage();
    let viewerPage = new ViewerPage();
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let pngFile = new FileModel({
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name
    });

    let downloadedPngFile = path.join(__dirname, 'downloads', pngFile.name);
    let tenantId, appId;
    let processName = {
        active: 'Active Process',
        completed: 'Completed Process',
        taskApp: 'Task App Name',
        emptyList: 'Empty List',
        dragDrop: 'Drag and Drop'
    };

    beforeAll(async (done) => {
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

    afterAll(async (done) => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C260228] Should be able to access options of a file attached to an active process', () => {
        navigationBarPage.navigateToProcessServicesPage().goToApp(app.title).clickProcessButton();

        processFiltersPage.selectFromProcessList(processName.active);

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.viewFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.active);

        attachmentListPage.doubleClickFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();
        browser.sleep(20000);
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.active);

        attachmentListPage.downloadFile(pngFile.name);

        browser.driver.sleep(1000);

        expect(Util.fileExists(downloadedPngFile, 30)).toBe(true);

        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C279886] Should be able to access options of a file attached to a completed process', () => {
        navigationBarPage.navigateToProcessServicesPage().goToApp(app.title).clickProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.completed);

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.clickAttachFileButton(pngFile.location);

        processDetailsPage.clickCancelProcessButton();
        browser.sleep(20000);
        processFiltersPage.clickCompletedFilterButton();

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        attachmentListPage.viewFile(pngFile.name);

        viewerPage.checkFileNameIsDisplayed(pngFile.name);
        viewerPage.clickCloseButton();

        processFiltersPage.clickCompletedFilterButton();

        attachmentListPage.downloadFile(pngFile.name);

        browser.driver.sleep(1000);

        expect(Util.fileExists(downloadedPngFile, 30)).toBe(true);

        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C277296] Should allow upload file when clicking on \'add\' icon', () => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.taskApp);

        processDetailsPage.checkProcessTitleIsDisplayed();

        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
    });

    it('[C260235] Should empty list component be displayed when no file is attached', () => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList(processName.emptyList);

        attachmentListPage.checkEmptyAttachmentList();
        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
        attachmentListPage.removeFile(pngFile.name);
        attachmentListPage.checkFileIsRemoved(pngFile.name);
        attachmentListPage.checkEmptyAttachmentList();
    });

});
