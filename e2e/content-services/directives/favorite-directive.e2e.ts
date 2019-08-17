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

import { ContentNodeSelectorDialogPage, LoginPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { CustomSources } from '../../pages/adf/demo-shell/customSourcesPage';
import { TrashcanPage } from '../../pages/adf/trashcanPage';

describe('Favorite directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const acsUser = new AcsUserModel();
    const customSourcesPage = new CustomSources();
    const trashcanPage = new TrashcanPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const pdfFile = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let testFolder1, testFolder2, testFolder3, testFolder4, testFile;

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        testFolder1 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFolder2 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFolder3 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFolder4 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFile = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(testFolder1.entry.id);
        await uploadActions.deleteFileOrFolder(testFolder2.entry.id);
        await uploadActions.deleteFileOrFolder(testFolder3.entry.id);
        await uploadActions.deleteFileOrFolder(testFolder4.entry.id);

    });

    beforeEach(async () => {
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();

    });

    it('[C260247] Should be able to mark a file as favorite', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsMarkedFavorite();
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectFavoritesSourceType();
        await customSourcesPage.checkRowIsDisplayed(testFile.entry.name);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsNotMarkedFavorite();
        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectFavoritesSourceType();
        await customSourcesPage.checkRowIsNotDisplayed(testFile.entry.name);
    });

    it('[C260249] Should be able to mark a folder as favorite', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFolder1.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFolder1.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsMarkedFavorite();
        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectFavoritesSourceType();
        await customSourcesPage.checkRowIsDisplayed(testFolder1.entry.name);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFolder1.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFolder1.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsNotMarkedFavorite();
        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectFavoritesSourceType();
        await customSourcesPage.checkRowIsNotDisplayed(testFolder1.entry.name);
    });

    it('[C260251] Should retain the restored file as favorite', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsMarkedFavorite();
        await contentListPage.rightClickOnRow(testFile.entry.name);
        await contentServicesPage.pressContextMenuActionNamed('Delete');
        await contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectFavoritesSourceType();
        await customSourcesPage.checkRowIsNotDisplayed(testFile.entry.name);

        await navigationBarPage.clickTrashcanButton();
        await trashcanPage.waitForTableBody();
        await expect(await trashcanPage.numberOfResultsDisplayed()).toBe(1);
        await trashcanPage.getDocumentList().dataTablePage().clickRowByContent(testFile.entry.name);
        await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(testFile.entry.name);
        await trashcanPage.clickRestore();
        await trashcanPage.checkTrashcanIsEmpty();

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        await contentServicesPage.checkIsMarkedFavorite();
        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectFavoritesSourceType();
        await customSourcesPage.checkRowIsDisplayed(testFile.entry.name);
    });

    it('[C260252] Should retain the moved file as favorite', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsMarkedFavorite();

        await contentServicesPage.getDocumentList().rightClickOnRow(testFile.entry.name);
        await contentServicesPage.pressContextMenuActionNamed('Move');
        await contentNodeSelector.checkDialogIsDisplayed();
        await contentNodeSelector.typeIntoNodeSelectorSearchField(testFolder1.entry.name);
        await contentNodeSelector.clickContentNodeSelectorResult(testFolder1.entry.name);
        await contentNodeSelector.clickMoveCopyButton();
        await contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
        await contentServicesPage.doubleClickRow(testFolder1.entry.name);
        await contentServicesPage.checkContentIsDisplayed(testFile.entry.name);

        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        await contentServicesPage.checkIsMarkedFavorite();
    });

    it('[C217216] Should be able to mark and unmark multiple folders as favorite', async () => {
        await contentServicesPage.clickMultiSelectToggle();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        await contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder1.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder2.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder3.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder2.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder3.entry.name);
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(3);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsMarkedFavorite();

        await contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder3.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected('Display name', testFolder3.entry.name);
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(2);

        await contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder4.entry.name);
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(3);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder2.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder4.entry.name);
        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsMarkedFavorite();

        await contentServicesPage.clickOnFavoriteButton();
        await contentServicesPage.checkIsNotMarkedFavorite();
        await contentServicesPage.getDocumentList().dataTablePage().checkAllRows();
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBeGreaterThanOrEqual(4);
        await contentServicesPage.getDocumentList().dataTablePage().uncheckAllRows();
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(0);

        await contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder3.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder3.entry.name);
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(1);
        await contentServicesPage.checkIsMarkedFavorite();

    });
});
