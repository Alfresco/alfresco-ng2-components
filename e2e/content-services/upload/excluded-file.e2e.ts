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

import { element, by, browser } from 'protractor';

import { LoginPage, LocalStorageUtil } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { DropActions } from '../../actions/drop.actions';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Upload component - Excluded Files', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialog();
    const uploadToggles = new UploadToggles();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    const navigationBarPage = new NavigationBarPage();

    const iniExcludedFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.INI.file_name,
        'location': resources.Files.ADF_DOCUMENTS.INI.file_location
    });

    const txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await contentServicesPage.goToDocumentList();

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

    });

    afterEach(async () => {
        await contentServicesPage.goToDocumentList();

    });

    it('[C279914] Should not allow upload default excluded files using D&D', async () => {
        await contentServicesPage.checkDragAndDropDIsDisplayed();

        const dragAndDropArea = element.all(by.css('adf-upload-drag-area div')).first();

        const dragAndDrop = new DropActions();

        await dragAndDrop.dropFile(dragAndDropArea, iniExcludedFile.location);

        await browser.sleep(5000);

        await uploadDialog.dialogIsNotDisplayed();

        await contentServicesPage.checkContentIsNotDisplayed(iniExcludedFile.name);
    });

    it('[C260122] Should not allow upload default excluded files using Upload button', async () => {
        await contentServicesPage.uploadFile(iniExcludedFile.location);
        await contentServicesPage.checkContentIsNotDisplayed(iniExcludedFile.name);
    });

    it('[C212862] Should not allow upload file excluded in the files extension of app.config.json', async () => {
        await LocalStorageUtil.setConfigField('files', JSON.stringify({
            excluded: ['.DS_Store', 'desktop.ini', '*.txt'],
            'match-options': { 'nocase': true }
        }));

        await contentServicesPage.goToDocumentList();

        await contentServicesPage
            .uploadFile(txtFileModel.location);

        await contentServicesPage.checkContentIsNotDisplayed(txtFileModel.name);
    });

    it('[C274688] Should extension type added as excluded and accepted not be uploaded', async () => {
        await LocalStorageUtil.setConfigField('files', JSON.stringify({
            excluded: ['.DS_Store', 'desktop.ini', '*.png'],
            'match-options': { 'nocase': true }
        }));

        await contentServicesPage.goToDocumentList();

        await uploadToggles.enableExtensionFilter();
        await browser.sleep(1000);
        await uploadToggles.addExtension('.png');

        await contentServicesPage.uploadFile(pngFile.location);
        await browser.sleep(1000);
        await contentServicesPage.checkContentIsNotDisplayed(pngFile.name);
    });
});
