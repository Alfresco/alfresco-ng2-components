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
    ContentNodeSelectorDialogPage,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';

import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { CustomSourcesPage } from '../../core/pages/custom-sources.page';
import { TrashcanPage } from '../../core/pages/trashcan.page';

describe('Favorite directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    let acsUser: UserModel;
    const customSourcesPage = new CustomSourcesPage();
    const trashcanPage = new TrashcanPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const pdfFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    });

    const uploadActions = new UploadActions(apiService);
    let testFolder1; let testFolder2; let testFolder3; let testFolder4; let testFile;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();
        await apiService.login(acsUser.username, acsUser.password);

        testFolder1 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFolder2 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFolder3 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFolder4 = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        testFile = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');

        await browser.sleep(browser.params.testConfig.timeouts.index_search);

        await loginPage.login(acsUser.username, acsUser.password);
        await contentServicesPage.goToDocumentList();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await apiService.loginWithProfile('admin');
        await uploadActions.deleteFileOrFolder(testFolder1.entry.id);
        await uploadActions.deleteFileOrFolder(testFolder2.entry.id);
        await uploadActions.deleteFileOrFolder(testFolder3.entry.id);
        await uploadActions.deleteFileOrFolder(testFolder4.entry.id);
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToContentServices();
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

        await navigationBarPage.navigateToContentServices();
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

        await navigationBarPage.navigateToContentServices();
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
        await trashcanPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await trashcanPage.numberOfResultsDisplayed()).toBe(1);

        await trashcanPage.getDocumentList().dataTablePage().clickRowByContent(testFile.entry.name);
        await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(testFile.entry.name);
        await trashcanPage.clickRestore();
        await trashcanPage.contentList.dataTablePage().waitTillContentLoaded();
        await trashcanPage.checkTrashcanIsEmpty();

        await navigationBarPage.navigateToContentServices();
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
        await contentServicesPage.openFolder(testFolder1.entry.name);
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
