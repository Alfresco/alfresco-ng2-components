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

import { LoginPage, UploadActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import resources = require('../../util/resources');
import { FileModel } from '../../models/ACS/fileModel';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Content Services Viewer', () => {
    const acsUser = new AcsUserModel();
    const viewerPage = new ViewerPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();

    let zoom;

    const pdfFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PDF.first_page_text,
        'secondPageText': resources.Files.ADF_DOCUMENTS.PDF.second_page_text,
        'lastPageNumber': resources.Files.ADF_DOCUMENTS.PDF.last_page_number
    });
    const protectedFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.first_page_text,
        'secondPageText': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.second_page_text,
        'lastPageNumber': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.last_page_number,
        'password': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.password,
        'location': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.file_location
    });
    const docxFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_location,
        'name': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.first_page_text
    });
    const jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });
    const mp4File = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.MP4.file_location,
        'name': resources.Files.ADF_DOCUMENTS.MP4.file_name
    });
    const unsupportedFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location,
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name
    });
    const pptFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PPT.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PPT.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PPT.first_page_text
    });
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const pdfFileUploaded = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');
        Object.assign(pdfFile, pdfFileUploaded.entry);

        const protectedFileUploaded = await uploadActions.uploadFile(protectedFile.location, protectedFile.name, '-my-');
        Object.assign(protectedFile, protectedFileUploaded.entry);

        const docxFileUploaded = await uploadActions.uploadFile(docxFile.location, docxFile.name, '-my-');
        Object.assign(docxFile, docxFileUploaded.entry);

        const jpgFileUploaded = await uploadActions.uploadFile(jpgFile.location, jpgFile.name, '-my-');
        Object.assign(jpgFile, jpgFileUploaded.entry);

        const mp4FileUploaded = await uploadActions.uploadFile(mp4File.location, mp4File.name, '-my-');
        Object.assign(mp4File, mp4FileUploaded.entry);

        const pptFileUploaded = await uploadActions.uploadFile(pptFile.location, pptFile.name, '-my-');
        Object.assign(pptFile, pptFileUploaded.entry);

        const unsupportedFileUploaded = await uploadActions.uploadFile(unsupportedFile.location, unsupportedFile.name, '-my-');
        Object.assign(unsupportedFile, unsupportedFileUploaded.entry);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await contentServicesPage.goToDocumentList();

    });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(pdfFile.getId());
        await uploadActions.deleteFileOrFolder(protectedFile.getId());
        await uploadActions.deleteFileOrFolder(docxFile.getId());
        await uploadActions.deleteFileOrFolder(jpgFile.getId());
        await uploadActions.deleteFileOrFolder(mp4File.getId());
        await uploadActions.deleteFileOrFolder(pptFile.getId());
        await uploadActions.deleteFileOrFolder(unsupportedFile.getId());
        await navigationBarPage.clickLogoutButton();

    });

    it('[C260038] Should display first page, toolbar and pagination when opening a .pdf file', async () => {
        await contentServicesPage.checkAcsContainer();

        await viewerPage.viewFile(pdfFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(pdfFile.name);
        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.checkFullScreenButtonIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();
        await viewerPage.checkPreviousPageButtonIsDisplayed();
        await viewerPage.checkNextPageButtonIsDisplayed();
        await viewerPage.checkPageSelectorInputIsDisplayed('1');
        await viewerPage.checkPercentageIsDisplayed();
        await viewerPage.checkZoomInButtonIsDisplayed();
        await viewerPage.checkZoomOutButtonIsDisplayed();
        await viewerPage.checkScalePageButtonIsDisplayed();

        await viewerPage.clickCloseButton();
    });

    it('[C260040] Should be able to change pages and zoom when .pdf file is open', async () => {
        await viewerPage.viewFile(pdfFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.clickNextPageButton();
        await viewerPage.checkFileContent('2', pdfFile.secondPageText);
        await viewerPage.checkPageSelectorInputIsDisplayed('2');

        await viewerPage.clickPreviousPageButton();
        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.checkPageSelectorInputIsDisplayed('1');

        await viewerPage.clearPageNumber();
        await viewerPage.checkPageSelectorInputIsDisplayed('');

        const initialWidth = await viewerPage.getCanvasWidth();
        const initialHeight = await viewerPage.getCanvasHeight();

        await viewerPage.clickZoomInButton();
        await expect(+(await viewerPage.getCanvasWidth())).toBeGreaterThan(+initialWidth);
        await expect(+(await viewerPage.getCanvasHeight())).toBeGreaterThan(+initialHeight);

        await viewerPage.clickActualSize();
        await expect(+(await viewerPage.getCanvasWidth())).toEqual(+initialWidth);
        await expect(+(await viewerPage.getCanvasHeight())).toEqual(+initialHeight);

        await viewerPage.clickZoomOutButton();
        await expect(+(await viewerPage.getCanvasWidth())).toBeLessThan(+initialWidth);
        await expect(+(await viewerPage.getCanvasHeight())).toBeLessThan(+initialHeight);

        await viewerPage.clickCloseButton();
    });

    it('[C260042] Should be able to download, open full-screen and Info container from the Viewer', async () => {
        await viewerPage.viewFile(jpgFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkImgContainerIsDisplayed();

        await viewerPage.checkFullScreenButtonIsDisplayed();
        await viewerPage.clickFullScreenButton();

        await viewerPage.exitFullScreen();

        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.clickDownloadButton();

        await viewerPage.clickCloseButton();
    });

    it('[C260052] Should display image, toolbar and pagination when opening a .jpg file', async () => {
        await viewerPage.viewFile(jpgFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkImgContainerIsDisplayed();

        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.checkFullScreenButtonIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();
        await viewerPage.checkZoomInButtonIsDisplayed();
        await viewerPage.checkZoomOutButtonIsDisplayed();
        await viewerPage.checkPercentageIsDisplayed();
        await viewerPage.checkRotateLeftButtonIsDisplayed();
        await viewerPage.checkRotateRightButtonIsDisplayed();
        await viewerPage.checkScaleImgButtonIsDisplayed();

        await viewerPage.clickCloseButton();
    });

    it('[C260483] Should be able to zoom and rotate image when .jpg file is open', async () => {
        await viewerPage.viewFile(jpgFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkPercentageIsDisplayed();

        zoom = await viewerPage.getZoom();
        await viewerPage.clickZoomInButton();
        await viewerPage.checkZoomedIn(zoom);

        zoom = await viewerPage.getZoom();
        await viewerPage.clickZoomOutButton();
        await viewerPage.checkZoomedOut(zoom);

        await viewerPage.clickRotateLeftButton();
        await viewerPage.checkRotation('transform: scale(1, 1) rotate(-90deg) translate(0px, 0px);');

        await viewerPage.clickScaleImgButton();
        await viewerPage.checkRotation('transform: scale(1, 1) rotate(0deg) translate(0px, 0px);');

        await viewerPage.clickRotateRightButton();
        await viewerPage.checkRotation('transform: scale(1, 1) rotate(90deg) translate(0px, 0px);');

        await viewerPage.clickCloseButton();
    });

    it('[C279922] Should display first page, toolbar and pagination when opening a .ppt file', async () => {
        await viewerPage.viewFile(pptFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkFileContent('1', pptFile.firstPageText);
        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(pptFile.name);
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();
        await viewerPage.checkPreviousPageButtonIsDisplayed();
        await viewerPage.checkNextPageButtonIsDisplayed();
        await viewerPage.checkPageSelectorInputIsDisplayed('1');
        await viewerPage.checkZoomInButtonIsDisplayed();
        await viewerPage.checkZoomOutButtonIsDisplayed();
        await viewerPage.checkScalePageButtonIsDisplayed();

        await viewerPage.clickCloseButton();
    });

    it('[C291903] Should display the buttons in order in the adf viewer toolbar', async () => {
        await viewerPage.viewFile(pdfFile.name);
        await viewerPage.checkLeftSideBarIsNotDisplayed();
        await viewerPage.clickLeftSidebarButton();
        await viewerPage.checkLeftSideBarIsDisplayed();
        await viewerPage.enableMoreActionsMenu();
        await viewerPage.checkToolbarIsDisplayed();
        await expect(await viewerPage.getLastButtonTitle()).toEqual(await viewerPage.getMoreActionsMenuTitle());
        await viewerPage.clickCloseButton();
    });

    it('[C260053] Should display first page, toolbar and pagination when opening a .docx file', async () => {
        await viewerPage.viewFile(docxFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkFileContent('1', docxFile.firstPageText);
        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(docxFile.name);
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();
        await viewerPage.checkPreviousPageButtonIsDisplayed();
        await viewerPage.checkNextPageButtonIsDisplayed();
        await viewerPage.checkPageSelectorInputIsDisplayed('1');
        await viewerPage.checkZoomInButtonIsDisplayed();
        await viewerPage.checkZoomOutButtonIsDisplayed();
        await viewerPage.checkScalePageButtonIsDisplayed();

        await viewerPage.clickCloseButton();
    });

    it('[C260054] Should display Preview could not be loaded and viewer toolbar when opening an unsupported file', async () => {
        await viewerPage.viewFile(unsupportedFile.name);

        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(unsupportedFile.name);
        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();

        await viewerPage.checkZoomInButtonIsNotDisplayed();
        await viewerPage.checkUnknownFormatIsDisplayed();
        await expect(await viewerPage.getUnknownFormatMessage()).toBe('Couldn\'t load preview. Unknown format.');

        await viewerPage.clickCloseButton();
    });

    it('[C260056] Should display video and viewer toolbar when opening a media file', async () => {
        await viewerPage.viewFile(mp4File.name);

        await viewerPage.checkMediaPlayerContainerIsDisplayed();
        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(mp4File.name);
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();
        await viewerPage.checkFullScreenButtonIsNotDisplayed();

        await viewerPage.checkZoomInButtonIsNotDisplayed();

        await viewerPage.clickCloseButton();
    });

    it('[C261123] Should be able to preview all pages and navigate to a page when using thumbnails', async () => {
        await viewerPage.viewFile(pdfFile.name);

        await viewerPage.checkZoomInButtonIsDisplayed();
        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.checkThumbnailsBtnIsDisplayed();
        await viewerPage.clickThumbnailsBtn();

        await viewerPage.checkThumbnailsContentIsDisplayed();
        await viewerPage.checkThumbnailsCloseIsDisplayed();
        await viewerPage.checkAllThumbnailsDisplayed(pdfFile.lastPageNumber);

        await viewerPage.clickSecondThumbnail();
        await viewerPage.checkFileContent('2', pdfFile.secondPageText);
        await viewerPage.checkCurrentThumbnailIsSelected();

        await viewerPage.checkPreviousPageButtonIsDisplayed();
        await viewerPage.clickPreviousPageButton();
        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.checkCurrentThumbnailIsSelected();

        await viewerPage.clickThumbnailsBtn();
        await viewerPage.checkThumbnailsContentIsNotDisplayed();
        await viewerPage.clickThumbnailsBtn();
        await viewerPage.checkThumbnailsCloseIsDisplayed();
        await viewerPage.clickThumbnailsClose();

        await viewerPage.clickCloseButton();
    });

    it('[C268105] Should display current thumbnail when getting to the page following the last visible thumbnail', async () => {
        await viewerPage.viewFile(pdfFile.name);
        await viewerPage.checkZoomInButtonIsDisplayed();

        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.checkThumbnailsBtnIsDisplayed();
        await viewerPage.clickThumbnailsBtn();
        await viewerPage.clickLastThumbnailDisplayed();
        await viewerPage.checkCurrentThumbnailIsSelected();

        await viewerPage.checkNextPageButtonIsDisplayed();
        await viewerPage.clickNextPageButton();
        await viewerPage.checkCurrentThumbnailIsSelected();

        await viewerPage.clickCloseButton();
    });

    it('[C269109] Should not be able to open thumbnail panel before the pdf is loaded', async () => {
        await viewerPage.viewFile(pdfFile.name);

        await viewerPage.checkThumbnailsBtnIsDisabled();

        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.clickCloseButton();
    });

    it('[C268901] Should need a password when opening a protected file', async () => {
        await viewerPage.viewFile(protectedFile.name);

        await viewerPage.checkZoomInButtonIsDisplayed();
        await viewerPage.checkPasswordDialogIsDisplayed();
        await viewerPage.checkPasswordSubmitDisabledIsDisplayed();

        await viewerPage.enterPassword('random password');
        await viewerPage.clickPasswordSubmit();
        await viewerPage.checkPasswordErrorIsDisplayed();
        await viewerPage.checkPasswordInputIsDisplayed();

        await viewerPage.enterPassword(protectedFile.password);
        await viewerPage.clickPasswordSubmit();
        await viewerPage.checkFileContent('1', protectedFile.firstPageText);

        await viewerPage.clickCloseButton();
    });

    it('[C307985] Should close the viewer when password dialog is cancelled', async () => {
        await viewerPage.viewFile(protectedFile.name);
        await viewerPage.checkPasswordDialogIsDisplayed();
        await viewerPage.clickClosePasswordDialog();
        await contentServicesPage.checkContentIsDisplayed(protectedFile.name);
    });
});
