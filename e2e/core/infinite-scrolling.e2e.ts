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
    LocalStorageUtil,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { FolderModel } from '../models/ACS/folder.model';
import { ContentServicesPage } from '../core/pages/content-services.page';
import { InfinitePaginationPage } from './pages/infinite-pagination.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';

describe('Enable infinite scrolling', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const infinitePaginationPage = new InfinitePaginationPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const acsUser = new UserModel();
    const folderModel = new FolderModel({ name: 'folderOne' });

    let fileNames = [];
    const nrOfFiles = 30;
    let deleteFileNames = [];
    const nrOfDeletedFiles = 22;
    let deleteUploaded;
    const pageSize = 20;
    let emptyFolderModel;

    const files = {
        base: 'newFile',
        extension: '.txt'
    };

    beforeAll(async () => {
        const uploadActions = new UploadActions(apiService);

        await apiService.loginWithProfile('admin');

        await usersActions.createUser(acsUser);

        await loginPage.login(acsUser.username, acsUser.password);

        fileNames = StringUtil.generateFilesNames(1, nrOfFiles, files.base, files.extension);
        deleteFileNames = StringUtil.generateFilesNames(1, nrOfDeletedFiles, files.base, files.extension);

        await apiService.login(acsUser.username, acsUser.password);

        const folderUploadedModel = await uploadActions.createFolder(folderModel.name, '-my-');
        emptyFolderModel = await uploadActions.createFolder('emptyFolder', '-my-');

        await uploadActions.createEmptyFiles(fileNames, folderUploadedModel.entry.id);
        deleteUploaded = await uploadActions.createFolder('deleteFolder', '-my-');

        await uploadActions.createEmptyFiles(deleteFileNames, deleteUploaded.entry.id);
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
    });

    it('[C260484] Should be possible to enable infinite scrolling', async () => {
        await contentServicesPage.openFolder(folderModel.name);
        await contentServicesPage.enableInfiniteScrolling();
        await infinitePaginationPage.clickLoadMoreButton();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoadedInfinitePagination();

        for (let i = 0; i < nrOfFiles; i++) {
            await contentServicesPage.checkContentIsDisplayed(fileNames[i]);
        }
    });

    it('[C268165] Delete folder when infinite scrolling is enabled', async () => {
        await contentServicesPage.openFolder(deleteUploaded.entry.name);
        await contentServicesPage.enableInfiniteScrolling();
        await infinitePaginationPage.clickLoadMoreButton();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoadedInfinitePagination();

        for (let i = 0; i < nrOfDeletedFiles; i++) {
            await contentServicesPage.checkContentIsDisplayed(deleteFileNames[i]);
        }
        await expect(await contentServicesPage.getDocumentList().dataTablePage().numberOfRows()).toEqual(nrOfDeletedFiles);

        await contentServicesPage.deleteContent(deleteFileNames[nrOfDeletedFiles - 1]);
        await contentServicesPage.checkContentIsNotDisplayed(deleteFileNames[nrOfDeletedFiles - 1]);

        for (let i = 0; i < nrOfDeletedFiles - 1; i++) {
            await contentServicesPage.checkContentIsDisplayed(deleteFileNames[i]);
        }
    });

    it('[C299201] Should use default pagination settings for infinite pagination', async () => {
        await contentServicesPage.openFolder(folderModel.name);

        await contentServicesPage.enableInfiniteScrolling();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoadedInfinitePagination();

        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(pageSize);
        await infinitePaginationPage.clickLoadMoreButton();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoadedInfinitePagination();

        await infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
    });

    it('[C299202] Should not display load more button when all the files are already displayed', async () => {
        await LocalStorageUtil.setUserPreference('paginationSize', '30');

        await contentServicesPage.openFolder(folderModel.name);

        await contentServicesPage.enableInfiniteScrolling();
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);

        await infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
    });

    it('[C299203] Should not display load more button when a folder is empty', async () => {
        await contentServicesPage.openFolder(emptyFolderModel.entry.name);

        await infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
    });
});
