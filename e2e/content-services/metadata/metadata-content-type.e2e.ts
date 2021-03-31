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

import { ApiService, BrowserActions, LoginPage, ModelActions, StringUtil, UploadActions, UserModel, UsersActions, ViewerPage } from '@alfresco/adf-testing';
import { CustomModel, CustomType } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { MetadataViewPage } from '../../core/pages/metadata-view.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('content type', () => {
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const modelActions = new ModelActions(apiService);
    const uploadActions = new UploadActions(apiService);

    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginPage();
    const randomString = StringUtil.generateRandomString();

    const model: CustomModel =  {
        name: `test-${randomString}`,
        namespaceUri: `http://www.customModel.com/model/${randomString}/1.0`,
        namespacePrefix: `e2e-${randomString}`,
        author: 'E2e Automation User',
        description: 'Custom type e2e model',
        status: 'ACTIVE'
    };
    const type: CustomType = { name: `test-type-${randomString}`, parentName: 'cm:content', title: `Test type - ${randomString}` };
    const pdfFile = new FileModel({ name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name });
    const docxFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_path
    });
    let acsUser: UserModel;

    beforeAll( async () => {
        try {
            await apiService.loginWithProfile('admin');
            await modelActions.createModel(model);
            await modelActions.createType(model.name,  type);

            acsUser = await usersActions.createUser();
            await apiService.login(acsUser.username, acsUser.password);

            const filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');
            pdfFile.id = filePdfNode.entry.id;
            const docsNode = await uploadActions.uploadFile(docxFileModel.location, docxFileModel.name, '-my-');
            docxFileModel.id = docsNode.entry.id;

        } catch (e) {
            fail('Failed to setup custom types :: ' + JSON.stringify(e, null, 2));
        }
    });

    afterAll(async () => {
        await apiService.login(acsUser.username, acsUser.password);
        await uploadActions.deleteFileOrFolder(pdfFile.id);
        await uploadActions.deleteFileOrFolder(docxFileModel.id);
        try {
            await apiService.loginWithProfile('admin');
            await modelActions.deactivateCustomModel(model.name);
            await modelActions.deleteCustomModel(model.name);
        } catch (e) {
            console.error('failed to delete the model', e);
        }
    });

    beforeEach( async () => {
        await loginPage.login(acsUser.username, acsUser.password);
        await navigationBarPage.navigateToContentServices();
    });

    afterEach( async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C593560] Should the user be able to select a new content type and save it only after the confirmation dialog',  async () => {
        await BrowserActions.getUrl(browser.baseUrl + `/(overlay:files/${pdfFile.id}/view)`);
        await viewerPage.checkFileIsLoaded(pdfFile.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual('PROPERTIES');
        await modelActions.isCustomTypeSearchable(type.title);
        await expect(await metadataViewPage.hasContentType('Content')).toBe(true, 'Content type not found');

        await metadataViewPage.editIconClick();

        await metadataViewPage.changeContentType(type.title);
        await metadataViewPage.clickSaveMetadata();

        await metadataViewPage.checkConfirmDialogDisplayed();
        await metadataViewPage.applyNodeProperties();

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(acsUser.username, acsUser.password);
        await BrowserActions.getUrl(browser.baseUrl + `/(overlay:files/${pdfFile.id}/view)`);
        await viewerPage.checkFileIsLoaded(pdfFile.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual('PROPERTIES');
        await modelActions.isCustomTypeSearchable(type.title);
        await expect(await metadataViewPage.hasContentType(type.title)).toBe(true, 'Content type not found');

        await viewerPage.clickCloseButton();
    });

    it('[C593559] Should the user be able to select a new content type and not save it when press cancel in the confirmation dialog',  async () => {
        await BrowserActions.getUrl(browser.baseUrl + `/(overlay:files/${docxFileModel.id}/view)`);
        await viewerPage.checkFileIsLoaded(docxFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual('PROPERTIES');
        await modelActions.isCustomTypeSearchable(type.title);
        await expect(await metadataViewPage.hasContentType('Content')).toBe(true, 'Content type not found');

        await metadataViewPage.editIconClick();

        await metadataViewPage.changeContentType(type.title);
        await metadataViewPage.clickSaveMetadata();

        await metadataViewPage.checkConfirmDialogDisplayed();
        await metadataViewPage.cancelNodeProperties();

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(acsUser.username, acsUser.password);
        await BrowserActions.getUrl(browser.baseUrl + `/(overlay:files/${docxFileModel.id}/view)`);
        await viewerPage.checkFileIsLoaded(docxFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual('PROPERTIES');
        await modelActions.isCustomTypeSearchable(type.title);
        await expect(await metadataViewPage.hasContentType('Content')).toBe(true, 'Content type not found');

        await viewerPage.clickCloseButton();
    });
});
