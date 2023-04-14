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

import { createApiService,
    ApplicationsUtil,
    FileBrowserUtil,
    LoginPage,
    ProcessUtil,
    UsersActions,
    ViewerPage,
    ModelsActions
} from '@alfresco/adf-testing';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { ProcessDetailsPage } from './../pages/process-details.page';
import { AttachmentListPage } from './../pages/attachment-list.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';

describe('Attachment list action menu for processes', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processDetailsPage = new ProcessDetailsPage();
    const attachmentListPage = new AttachmentListPage();
    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const modelsActions = new ModelsActions(apiService);

    const pngFile = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name
    });

    const downloadedPngFile = pngFile.name;
    let tenantId; let appId;
    const processName = {
        active: 'Active Process',
        completed: 'Completed Process',
        taskApp: 'Task App Name',
        emptyList: 'Empty List',
        dragDrop: 'Drag and Drop'
    };

    beforeAll(async () => {

        await apiService.loginWithProfile('admin');

        const user = await usersActions.createUser();

        tenantId = user.tenantId;

        await apiService.login(user.username, user.password);

        const importedApp = await applicationsService.importPublishDeployApp(app.file_path);
        appId = importedApp.id;

        const processUtil = new ProcessUtil(apiService);
        await processUtil.startProcessOfApp(importedApp.name, processName.completed);
        await processUtil.startProcessOfApp(importedApp.name, processName.active);
        await processUtil.startProcessOfApp(importedApp.name, processName.taskApp);
        await processUtil.startProcessOfApp(importedApp.name, processName.emptyList);
        await processUtil.startProcessOfApp(importedApp.name, processName.dragDrop);

        await loginPage.login(user.username, user.password);
    });

    afterAll(async () => {
        await modelsActions.deleteModel(appId);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(tenantId);
    });

    it('[C260228] Should be able to access options of a file attached to an active process', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickProcessButton();

        await processFiltersPage.selectFromProcessList(processName.active);
        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);

        await attachmentListPage.viewFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName.active);
        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.doubleClickFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName.active);
        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.downloadFile(pngFile.name);

        await browser.sleep(1000);

        await FileBrowserUtil.isFileDownloaded(downloadedPngFile);

        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
    });

    it('[C279886] Should be able to access options of a file attached to a completed process', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickProcessButton();

        await processFiltersPage.selectFromProcessList(processName.completed);
        await processDetailsPage.checkProcessTitleIsDisplayed();
        await processFiltersPage.waitForTableBody();

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);

        await processDetailsPage.cancelProcessButton.click();
        await processFiltersPage.clickCompletedFilterButton();

        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        await attachmentListPage.checkFileIsAttached(pngFile.name);
        await attachmentListPage.viewFile(pngFile.name);

        await viewerPage.checkFileNameIsDisplayed(pngFile.name);
        await viewerPage.clickCloseButton();

        await processFiltersPage.clickCompletedFilterButton();

        await attachmentListPage.downloadFile(pngFile.name);

        await browser.sleep(1000);

        await FileBrowserUtil.isFileDownloaded(downloadedPngFile);

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
        await processDetailsPage.checkProcessTitleIsDisplayed();

        await attachmentListPage.checkEmptyAttachmentList();
        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);
        await attachmentListPage.removeFile(pngFile.name);
        await attachmentListPage.checkFileIsRemoved(pngFile.name);
        await attachmentListPage.checkEmptyAttachmentList();
    });
});
