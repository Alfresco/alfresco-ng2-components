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

describe('Favourite directive', function () {

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
        hostEcm: browser.params.testConfig.adf.url
    });
    const pdfFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let testFolder, testFile;

    beforeAll(async (done) => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        testFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');

        testFile = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(testFolder.entry.id);
        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        done();
    });

    it('[C260247] Favorite a file', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        contentServicesPage.clickOnFavouriteButton();
        contentServicesPage.checkIsMarkedFavourite();
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        customSourcesPage.navigateToCustomSources();
        customSourcesPage.selectFavouritesSourceType();
        customSourcesPage.checkRowIsDisplayed(testFile.entry.name);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        contentServicesPage.clickOnFavouriteButton();
        contentServicesPage.checkIsNotMarkedFavourite();
        customSourcesPage.navigateToCustomSources();
        customSourcesPage.selectFavouritesSourceType();
        customSourcesPage.checkRowIsNotDisplayed(testFile.entry.name);
    });

    it('[C260249] Favorite a folder', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFolder.entry.name);
        contentServicesPage.clickOnFavouriteButton();
        contentServicesPage.checkIsMarkedFavourite();
        customSourcesPage.navigateToCustomSources();
        customSourcesPage.selectFavouritesSourceType();
        customSourcesPage.checkRowIsDisplayed(testFolder.entry.name);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFolder.entry.name);
        contentServicesPage.clickOnFavouriteButton();
        contentServicesPage.checkIsNotMarkedFavourite();
        customSourcesPage.navigateToCustomSources();
        customSourcesPage.selectFavouritesSourceType();
        customSourcesPage.checkRowIsNotDisplayed(testFolder.entry.name);
    });

    it('[C260251] Favorite a file and delete it', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        contentServicesPage.clickOnFavouriteButton();
        contentServicesPage.checkIsMarkedFavourite();
        contentListPage.rightClickOnRow(testFile.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
        customSourcesPage.navigateToCustomSources();
        customSourcesPage.selectFavouritesSourceType();
        customSourcesPage.checkRowIsNotDisplayed(testFile.entry.name);

        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(1);
        trashcanPage.getDocumentList().dataTablePage().clickRowByContent(testFile.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(testFile.entry.name);
        trashcanPage.clickRestore();
        trashcanPage.checkTrashcanIsEmpty();

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        contentServicesPage.checkIsMarkedFavourite();
        customSourcesPage.navigateToCustomSources();
        customSourcesPage.selectFavouritesSourceType();
        customSourcesPage.checkRowIsDisplayed(testFile.entry.name);
    });

    it('[C260252] Favorite a file and move it', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        contentServicesPage.clickOnFavouriteButton();
        contentServicesPage.checkIsMarkedFavourite();

        contentServicesPage.getDocumentList().rightClickOnRow(testFile.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Move');
        contentNodeSelector.checkDialogIsDisplayed();
        contentNodeSelector.typeIntoNodeSelectorSearchField(testFolder.entry.name);
        contentNodeSelector.clickContentNodeSelectorResult(testFolder.entry.name);
        contentNodeSelector.clickMoveCopyButton();
        contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
        contentServicesPage.doubleClickRow(testFolder.entry.name);
        contentServicesPage.checkContentIsDisplayed(testFile.entry.name);

        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        contentServicesPage.checkIsMarkedFavourite();
    });
});
