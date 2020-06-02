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

import { by, element, browser } from 'protractor';
import { LoginSSOPage, UploadActions, BrowserVisibility, BrowserActions, ApiService } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { VersionManagePage } from '../../pages/adf/version-manager.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('Version Properties', () => {

    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const versionManagePage = new VersionManagePage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = new ApiService();

    const acsUser = new AcsUserModel();

    const txtFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path
    });

    const fileModelVersionTwo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const uploadActions = new UploadActions(apiService);

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await apiService.getInstance().core.peopleApi.addPerson(acsUser);

        await apiService.getInstance().login(acsUser.id, acsUser.password);

        const txtUploadedFile = await uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, '-my-');

        Object.assign(txtFileModel, txtUploadedFile.entry);

        txtFileModel.update(txtUploadedFile.entry);

        await loginPage.login(acsUser.id, acsUser.password);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.versionManagerContent(txtFileModel.name);
   });

    it('[C272817] Should NOT be present the download action when allowDownload property is false', async () => {
        await versionManagePage.disableDownload();
        await versionManagePage.clickActionButton('1.0');
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-download-1.0"]`)));
        await versionManagePage.closeDisabledActionsMenu();
    });

    it('[C279992] Should be present the download action when allowDownload property is true', async () => {
        await versionManagePage.enableDownload();
        await versionManagePage.clickActionButton('1.0');
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-download-1.0"]`)));
        await versionManagePage.closeActionsMenu();
    });

    it('[C269085] Should show/hide comments when showComments true/false', async () => {
        await versionManagePage.enableComments();
        await BrowserActions.click(versionManagePage.showNewVersionButton);
        await versionManagePage.enterCommentText('Example comment text');
        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);
        await versionManagePage.checkFileVersionExist('1.1');
        await expect(await versionManagePage.getFileVersionComment('1.1')).toEqual('Example comment text');
        await versionManagePage.disableComments();
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-item-comment-1.1"]`)));
    });

    it('[C277277] Should show/hide actions menu when readOnly is true/false', async () => {
        await versionManagePage.disableReadOnly();
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-menu-button-1.0"]`)));
        await versionManagePage.enableReadOnly();
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-menu-button-1.0"]`)));
    });

    it('[C279994] Should show/hide upload new version button when readOnly is true/false', async () => {
        await versionManagePage.disableReadOnly();
        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.showNewVersionButton);
        await versionManagePage.enableReadOnly();
        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.showNewVersionButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.uploadNewVersionButton);
    });
});
