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

import { LoginPage, FileBrowserUtil } from '@alfresco/adf-testing';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { AttachmentListPage } from '../pages/adf/process-services/attachmentListPage';
import { ViewerPage } from '../pages/adf/viewerPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import { FileModel } from '../models/ACS/fileModel';
import { browser } from 'protractor';

describe('Attachment list action menu for processes', () => {

    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processDetailsPage = new ProcessDetailsPage();
    const attachmentListPage = new AttachmentListPage();
    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const pngFile = new FileModel({
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name
    });

    const downloadedPngFile = pngFile.name;
    let tenantId, appId;
    const processName = {
        active: 'Active Process',
        completed: 'Completed Process',
        taskApp: 'Task App Name',
        emptyList: 'Empty List',
        dragDrop: 'Drag and Drop'
    };

    beforeAll(async () => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appId = importedApp.id;

        await apps.startProcess(this.alfrescoJsApi, importedApp, processName.completed);
        await apps.startProcess(this.alfrescoJsApi, importedApp, processName.active);
        await apps.startProcess(this.alfrescoJsApi, 'Task App', processName.taskApp);
        await apps.startProcess(this.alfrescoJsApi, 'Task App', processName.emptyList);
        await apps.startProcess(this.alfrescoJsApi, 'Task App', processName.dragDrop);

        await loginPage.loginToProcessServicesUsingUserModel(user);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

    });

    it('[C260228] Should be able to access options of a file attached to an active process', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickProcessButton();

        await processFiltersPage.selectFromProcessList(processName.active);

        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.viewFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName.active);

        await attachmentListPage.doubleClickFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName.active);

        await attachmentListPage.downloadFile(pngFile.name);

        await browser.sleep(1000);

        await expect(await FileBrowserUtil.isFileDownloaded(downloadedPngFile)).toBe(true);

        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C279886] Should be able to access options of a file attached to a completed process', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName.completed);

        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.clickAttachFileButton(pngFile.location);

        await processDetailsPage.clickCancelProcessButton();
        await processFiltersPage.clickCompletedFilterButton();

        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        await attachmentListPage.viewFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await processFiltersPage.clickCompletedFilterButton();

        await attachmentListPage.downloadFile(pngFile.name);

        await browser.sleep(1000);

        await expect(await FileBrowserUtil.isFileDownloaded(downloadedPngFile)).toBe(true);

        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C277296] Should allow upload file when clicking on \'add\' icon', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName.taskApp);

        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);
    });

    it('[C260235] Should empty list component be displayed when no file is attached', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName.emptyList);

        await attachmentListPage.checkEmptyAttachmentList();
        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);
        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
        await attachmentListPage.checkEmptyAttachmentList();
    });

});
