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
import { LoginSSOPage, UploadActions, DataTableComponentPage, ViewerPage, ApiService } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import { AcsUserModel } from '../../models/ACS/acs-user.model';

describe('Viewer - properties', () => {

    const acsUser = new AcsUserModel();
    const viewerPage = new ViewerPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

    const pngFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const fileForOverlay = new FileModel({
        'name': 'fileForOverlay.png',
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });
    const alfrescoJsApi = new ApiService().apiService;

    const uploadActions = new UploadActions(alfrescoJsApi);

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pngFileUploaded = await uploadActions.uploadFile(pngFile.location, pngFile.name, '-my-');
        Object.assign(pngFile, pngFileUploaded.entry);

        pngFileUploaded = await uploadActions.uploadFile(fileForOverlay.location, fileForOverlay.name, '-my-');
        Object.assign(fileForOverlay, pngFileUploaded.entry);

        await loginPage.login(acsUser.email, acsUser.password);

        await contentServicesPage.goToDocumentList();

        await contentServicesPage.checkAcsContainer();

        await viewerPage.viewFile(pngFile.name);

        await viewerPage.clickLeftSidebarButton();
        await viewerPage.checkLeftSideBarIsDisplayed();
   });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(pngFile.getId());
        await navigationBarPage.clickLogoutButton();
   });

    it('[C260066] Should Show/Hide viewer toolbar when showToolbar is true/false', async () => {
        await viewerPage.checkToolbarIsDisplayed();
        await viewerPage.disableToolbar();
        await viewerPage.checkToolbarIsNotDisplayed();
        await viewerPage.enableToolbar();
    });

    it('[C260076] Should Show/Hide back button when allowGoBack is true/false', async () => {
        await viewerPage.checkGoBackIsDisplayed();
        await viewerPage.disableGoBack();
        await viewerPage.checkGoBackIsNotDisplayed();
        await viewerPage.enableGoBack();
    });

    it('[C260077] Should Show toolbar options dropdown when adf-viewer-open-with directive is used', async () => {
        await viewerPage.checkToolbarOptionsIsNotDisplayed();
        await viewerPage.enableToolbarOptions();
        await viewerPage.checkToolbarOptionsIsDisplayed();
        await viewerPage.disableToolbarOptions();
    });

    it('[C260079] Should Show/Hide download button when allowDownload is true/false', async () => {
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.disableDownload();
        await viewerPage.checkDownloadButtonIsNotDisplayed();
        await viewerPage.enableDownload();
    });

    it('[C260082] Should Show/Hide print button when allowPrint is true/false', async () => {
        await viewerPage.checkPrintButtonIsDisplayed();
        await viewerPage.disablePrint();
        await viewerPage.checkPrintButtonIsNotDisplayed();
        await viewerPage.enablePrint();
    });

    it('[C260092] Should show adf-viewer-toolbar-actions directive buttons when adf-viewer-toolbar-actions is used', async () => {
        await viewerPage.checkMoreActionsDisplayed();

        await viewerPage.disableMoreActions();

        await viewerPage.checkMoreActionsIsNotDisplayed();

        await viewerPage.enableMoreActions();
    });

    it('[C260074] Should show a custom file name when displayName property is used', async () => {
        await viewerPage.checkFileNameIsDisplayed(pngFile.name);

        await viewerPage.enableCustomName();

        await viewerPage.enterCustomName('test custom title');
        await viewerPage.checkFileNameIsDisplayed('test custom title');

        await viewerPage.disableCustomName();
    });

    it('[C260090] Should showSidebar allow right info-drawer to be shown', async () => {
        await viewerPage.clickToggleRightSidebar();
        await viewerPage.checkInfoSideBarIsDisplayed();

        await viewerPage.clickToggleRightSidebar();
        await viewerPage.checkInfoSideBarIsNotDisplayed();
    });

    it('[C286442] Should showLeftSidebar allow left info-drawer to be shown', async () => {
        await viewerPage.clickToggleLeftSidebar();
        await viewerPage.checkLeftSideBarIsNotDisplayed();
        await viewerPage.clickLeftSidebarButton();
        await viewerPage.checkLeftSideBarIsDisplayed();
    });

    it('[C260089] Should Show/Hide info-drawer if allowSidebar true/false', async () => {
        await viewerPage.clickInfoButton();

        await viewerPage.checkInfoSideBarIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();

        await viewerPage.disableAllowSidebar();

        await viewerPage.checkInfoButtonIsNotDisplayed();
        await viewerPage.checkInfoSideBarIsNotDisplayed();
    });

    it('[C286596] Should Show/Hide left info-drawer if allowLeftSidebar true/false', async () => {
        await viewerPage.checkLeftSideBarIsDisplayed();
        await viewerPage.checkLeftSideBarButtonIsDisplayed();

        await viewerPage.disableAllowLeftSidebar();

        await viewerPage.checkLeftSideBarButtonIsNotDisplayed();
        await viewerPage.checkLeftSideBarIsNotDisplayed();
    });

    it('[C260100] Should be possible to disable Overlay viewer', async () => {
        await viewerPage.clickCloseButton();
        await navigationBarPage.clickOverlayViewerButton();

        await dataTable.doubleClickRow('Name', fileForOverlay.name);
        await viewerPage.checkOverlayViewerIsDisplayed();
        await viewerPage.clickCloseButton();
        await dataTable.doubleClickRow('Name', pngFile.name);
        await viewerPage.checkOverlayViewerIsDisplayed();
        await viewerPage.clickCloseButton();

        await viewerPage.disableOverlay();
        await dataTable.doubleClickRow('Name', fileForOverlay.name);
        await viewerPage.checkImgContainerIsDisplayed();
        await viewerPage.checkInlineViewerIsDisplayed();
        await dataTable.doubleClickRow('Name', pngFile.name);
        await viewerPage.checkImgContainerIsDisplayed();
        await viewerPage.checkInlineViewerIsDisplayed();
    });
});
