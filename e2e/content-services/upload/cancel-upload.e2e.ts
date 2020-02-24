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
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { UploadDialogPage } from '../../pages/adf/dialog/upload-dialog.page';
import { UploadTogglesPage } from '../../pages/adf/dialog/upload-toggles.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FileModel } from '../../models/ACS/file.model';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Upload component', async () => {

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialogPage();
    const uploadToggles = new UploadTogglesPage();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const pngFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const mediumFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.MEDIUM_FILE.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.MEDIUM_FILE.file_location
    });

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();
    });

    const deleteNodesInCurrentPage = async function () {
        const nodeList = await contentServicesPage.getElementsDisplayedId();

        for (const node of nodeList) {
            try {
                await uploadActions.deleteFileOrFolder(node);
            } catch (error) {
            }
        }
    };

    it('[C272792] Should be possible to cancel upload of a big file using row cancel icon', async () => {
        await browser.executeScript('setTimeout(() => {document.querySelector("div[data-automation-id=\'cancel-upload-progress\']").click();}, 2500)');

        await contentServicesPage.uploadFile(mediumFile.location);

        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.checkContentIsNotDisplayed(mediumFile.name);
    });

    it('[C287790] Should be possible to cancel upload of a big file through the cancel uploads button', async () => {
        await browser.executeScript(' setTimeout(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 4000)');
        await contentServicesPage.uploadFile(mediumFile.location);
        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.checkContentIsNotDisplayed(mediumFile.name);
    });

    it('[C272793] Should be able to cancel multiple files upload', async () => {
        await uploadToggles.enableMultipleFileUpload();
        await browser.executeScript(' setTimeout(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 3000)');
        await contentServicesPage.uploadMultipleFile([pngFile.location, mediumFile.location]);

        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.checkContentIsNotDisplayed(pngFile.name);
        await contentServicesPage.checkContentIsNotDisplayed(mediumFile.name);
        await uploadToggles.disableMultipleFileUpload();
    });

    it('[C315257] Should be able to cancel file in upload queue', async () => {
        await uploadToggles.enableMultipleFileUpload();
        await browser.executeScript('setTimeout(() => {document.querySelector("button[data-automation-id=\'cancel-upload-queue\']").click();}, 2500)');
        await contentServicesPage.uploadMultipleFile([mediumFile.location, pngFile.location]);
        await uploadDialog.fileIsCancelled(pngFile.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await uploadToggles.disableMultipleFileUpload();
        await deleteNodesInCurrentPage();
    });
});
