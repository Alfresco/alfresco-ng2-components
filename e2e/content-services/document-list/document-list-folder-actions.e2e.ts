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

import { $ } from 'protractor';
import { createApiService,
    BreadcrumbPage,
    BreadcrumbDropdownPage,
    ContentNodeSelectorDialogPage,
    LoginPage,
    PaginationPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { InfinitePaginationPage } from '../../core/pages/infinite-pagination.page';
import { FolderModel } from '../../models/ACS/folder.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Document List Component - Actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const paginationPage = new PaginationPage();
    const breadCrumbDropdownPage = new BreadcrumbDropdownPage();
    const breadCrumbPage = new BreadcrumbPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);
    const infinitePaginationPage = new InfinitePaginationPage($('adf-content-node-selector'));

    describe('Folder Actions - Copy and Move', () => {
        const folderModel1 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel2 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel3 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel4 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel5 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel6 = new FolderModel({ name: StringUtil.generateRandomString() });

        let folder1; let folder2; let folder3; let folder4; let folder5; let folder6;

        let folders;
        const contentServicesUser = new UserModel();

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');
            await usersActions.createUser(contentServicesUser);
            await apiService.login(contentServicesUser.username, contentServicesUser.password);
            folder1 = await uploadActions.createFolder('A' + folderModel1.name, '-my-');
            folder2 = await uploadActions.createFolder('B' + folderModel2.name, '-my-');
            folder3 = await uploadActions.createFolder('C' + folderModel3.name, '-my-');
            folder4 = await uploadActions.createFolder('D' + folderModel4.name, '-my-');
            folder5 = await uploadActions.createFolder('E' + folderModel5.name, '-my-');
            folder6 = await uploadActions.createFolder('F' + folderModel6.name, '-my-');
            folders = [folder1, folder2, folder3, folder4, folder5, folder6];
        });

        beforeEach(async () => {
            await loginPage.login(contentServicesUser.username, contentServicesUser.password);
            await contentServicesPage.goToDocumentList();
            await paginationPage.selectItemsPerPage('5');
            await contentServicesPage.checkAcsContainer();
            await contentListPage.waitForTableBody();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            for (const folder of folders) {
                await uploadActions.deleteFileOrFolder(folder.entry.id);
            }
        });

        it('[C260132] Move action on folder with - Load more', async () => {
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + 5 + ' of ' + 6);

            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Move');
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();

            await expect(await contentNodeSelector.getDialogHeaderText()).toBe('Move \'' + 'A' + folderModel1.name + '\' to...');
            await contentNodeSelector.checkSearchInputIsDisplayed();
            await expect(await contentNodeSelector.getSearchLabel()).toBe('Search');
            await contentNodeSelector.checkSelectedSiteIsDisplayed('My files');
            await contentNodeSelector.checkCancelButtonIsDisplayed();
            await contentNodeSelector.checkMoveCopyButtonIsDisplayed();

            await expect(await contentNodeSelector.getMoveCopyButtonText()).toBe('MOVE');
            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(5);
            await infinitePaginationPage.clickLoadMoreButton();

            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(6);
            await infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickCancelButton();
            await contentNodeSelector.checkDialogIsNotDisplayed();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Move');
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await infinitePaginationPage.clickLoadMoreButton();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickMoveCopyButton();
            await contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);
            await contentServicesPage.openFolder('F' + folderModel6.name);
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Move');
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await breadCrumbDropdownPage.clickParentFolder();
            await breadCrumbDropdownPage.checkBreadCrumbDropdownIsDisplayed();
            await breadCrumbDropdownPage.choosePath(contentServicesUser.username);
            await contentNodeSelector.clickMoveCopyButton();
            await contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);

            await breadCrumbPage.chooseBreadCrumb(contentServicesUser.username);
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);
        });

        it('[C305051] Copy action on folder with - Load more', async () => {
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + 5 + ' of ' + 6);
            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Copy');
            await contentServicesPage.pressContextMenuActionNamed('Copy');
            await contentNodeSelector.checkDialogIsDisplayed();
            await expect(await contentNodeSelector.getDialogHeaderText()).toBe('Copy \'' + 'A' + folderModel1.name + '\' to...');
            await contentNodeSelector.checkSearchInputIsDisplayed();
            await expect(await contentNodeSelector.getSearchLabel()).toBe('Search');
            await contentNodeSelector.checkSelectedSiteIsDisplayed('My files');
            await contentNodeSelector.checkCancelButtonIsDisplayed();
            await contentNodeSelector.checkMoveCopyButtonIsDisplayed();
            await expect(await contentNodeSelector.getMoveCopyButtonText()).toBe('COPY');
            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(5);
            await infinitePaginationPage.clickLoadMoreButton();
            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(6);
            await infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickCancelButton();
            await contentNodeSelector.checkDialogIsNotDisplayed();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Copy');
            await contentServicesPage.pressContextMenuActionNamed('Copy');
            await contentNodeSelector.checkDialogIsDisplayed();
            await infinitePaginationPage.clickLoadMoreButton();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickMoveCopyButton();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);
            await paginationPage.clickOnNextPage();
            await contentServicesPage.getDocumentList().dataTable.waitTillContentLoaded();
            await contentServicesPage.openFolder('F' + folderModel6.name);
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);
        });
    });
});
