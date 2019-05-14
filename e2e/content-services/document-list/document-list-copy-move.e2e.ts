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

import { by, element } from 'protractor';
import { LoginPage, PaginationPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { StringUtil } from '@alfresco/adf-testing';
import { ContentNodeSelectorDialogPage } from '@alfresco/adf-testing';
import { BreadCrumbDropdownPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbDropdownPage';
import { FolderModel } from '../../models/ACS/folderModel';
import { BreadCrumbPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbPage';
import { InfinitePaginationPage } from '../../pages/adf/core/infinitePaginationPage';

describe('Document List Component - Actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const paginationPage = new PaginationPage();
    const breadCrumbDropdownPage = new BreadCrumbDropdownPage();
    const breadCrumbPage = new BreadCrumbPage();
    const uploadActions = new UploadActions();
    const infinitePaginationPage = new InfinitePaginationPage(element(by.css('adf-content-node-selector')));

    const alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });

    describe('Folder Actions - Copy and Move', () => {

        const folderModel1 = new FolderModel({ 'name': StringUtil.generateRandomString() });
        const folderModel2 = new FolderModel({ 'name': StringUtil.generateRandomString() });
        const folderModel3 = new FolderModel({ 'name': StringUtil.generateRandomString() });
        const folderModel4 = new FolderModel({ 'name': StringUtil.generateRandomString() });
        const folderModel5 = new FolderModel({ 'name': StringUtil.generateRandomString() });
        const folderModel6 = new FolderModel({ 'name': StringUtil.generateRandomString() });

        let folder1, folder2, folder3, folder4, folder5, folder6;

        let folders;
        const contentServicesUser = new AcsUserModel();

        beforeAll(async (done) => {

            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await alfrescoJsApi.core.peopleApi.addPerson(contentServicesUser);
            await alfrescoJsApi.login(contentServicesUser.id, contentServicesUser.password);
            folder1 = await uploadActions.createFolder(alfrescoJsApi, 'A' + folderModel1.name, '-my-');
            folder2 = await uploadActions.createFolder(alfrescoJsApi, 'B' + folderModel2.name, '-my-');
            folder3 = await uploadActions.createFolder(alfrescoJsApi, 'C' + folderModel3.name, '-my-');
            folder4 = await uploadActions.createFolder(alfrescoJsApi, 'D' + folderModel4.name, '-my-');
            folder5 = await uploadActions.createFolder(alfrescoJsApi, 'E' + folderModel5.name, '-my-');
            folder6 = await uploadActions.createFolder(alfrescoJsApi, 'F' + folderModel6.name, '-my-');
            folders = [folder1, folder2, folder3, folder4, folder5, folder6];
            done();
        });

        beforeEach(async (done) => {
            await loginPage.loginToContentServicesUsingUserModel(contentServicesUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.waitForTableBody();
            paginationPage.selectItemsPerPage('5');
            contentServicesPage.checkAcsContainer();
            contentListPage.waitForTableBody();
            done();
        });

        afterAll(async (done) => {
            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await folders.forEach(function (folder) {
                uploadActions.deleteFilesOrFolder(alfrescoJsApi, folder.entry.id);
            });
            done();
        });

        xit('[C260132] Move action on folder with - Load more', () => {

            expect(paginationPage.getCurrentItemsPerPage()).toEqual('5');
            expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + 5 + ' of ' + 6);
            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.pressContextMenuActionNamed('Move');
            contentNodeSelector.checkDialogIsDisplayed();
            expect(contentNodeSelector.getDialogHeaderText()).toBe('Move \'' + 'A' + folderModel1.name + '\' to...');
            contentNodeSelector.checkSearchInputIsDisplayed();
            expect(contentNodeSelector.getSearchLabel()).toBe('Search');
            contentNodeSelector.checkSelectedSiteIsDisplayed('My files');
            contentNodeSelector.checkCancelButtonIsDisplayed();
            contentNodeSelector.checkMoveCopyButtonIsDisplayed();
            expect(contentNodeSelector.getMoveCopyButtonText()).toBe('MOVE');
            expect(contentNodeSelector.numberOfResultsDisplayed()).toBe(5);
            infinitePaginationPage.clickLoadMoreButton();
            expect(contentNodeSelector.numberOfResultsDisplayed()).toBe(6);
            infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
            contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            contentNodeSelector.clickCancelButton();
            contentNodeSelector.checkDialogIsNotDisplayed();
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.pressContextMenuActionNamed('Move');
            contentNodeSelector.checkDialogIsDisplayed();
            infinitePaginationPage.clickLoadMoreButton();
            contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            contentNodeSelector.clickMoveCopyButton();
            contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);
            contentServicesPage.doubleClickRow('F' + folderModel6.name);
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.pressContextMenuActionNamed('Move');
            contentNodeSelector.checkDialogIsDisplayed();
            breadCrumbDropdownPage.clickParentFolder();
            breadCrumbDropdownPage.checkBreadCrumbDropdownIsDisplayed();
            breadCrumbDropdownPage.choosePath(contentServicesUser.id);
            contentNodeSelector.clickMoveCopyButton();
            contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);

            breadCrumbPage.chooseBreadCrumb(contentServicesUser.id);
            contentServicesPage.waitForTableBody();
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

        });

        it('[C305051] Copy action on folder with - Load more', () => {

            expect(paginationPage.getCurrentItemsPerPage()).toEqual('5');
            expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + 5 + ' of ' + 6);
            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.pressContextMenuActionNamed('Copy');
            contentNodeSelector.checkDialogIsDisplayed();
            expect(contentNodeSelector.getDialogHeaderText()).toBe('Copy \'' + 'A' + folderModel1.name + '\' to...');
            contentNodeSelector.checkSearchInputIsDisplayed();
            expect(contentNodeSelector.getSearchLabel()).toBe('Search');
            contentNodeSelector.checkSelectedSiteIsDisplayed('My files');
            contentNodeSelector.checkCancelButtonIsDisplayed();
            contentNodeSelector.checkMoveCopyButtonIsDisplayed();
            expect(contentNodeSelector.getMoveCopyButtonText()).toBe('COPY');
            expect(contentNodeSelector.numberOfResultsDisplayed()).toBe(5);
            infinitePaginationPage.clickLoadMoreButton();
            expect(contentNodeSelector.numberOfResultsDisplayed()).toBe(6);
            infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
            contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            contentNodeSelector.clickCancelButton();
            contentNodeSelector.checkDialogIsNotDisplayed();
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.pressContextMenuActionNamed('Copy');
            contentNodeSelector.checkDialogIsDisplayed();
            infinitePaginationPage.clickLoadMoreButton();
            contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            contentNodeSelector.clickMoveCopyButton();
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);
            paginationPage.clickOnNextPage();
            contentListPage.waitForTableBody();
            contentServicesPage.doubleClickRow('F' + folderModel6.name);
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

        });

    });
});
