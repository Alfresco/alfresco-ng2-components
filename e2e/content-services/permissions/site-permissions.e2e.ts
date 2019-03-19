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

import { PermissionsPage } from '../../pages/adf/permissionsPage';

import { LoginPage } from '../../pages/adf/loginPage';

import { ContentServicesPage } from '../../pages/adf/contentServicesPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';

import TestConfig = require('../../test.config');

import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

import { FileModel } from '../../models/ACS/fileModel';

import { UploadActions } from '../../actions/ACS/upload.actions';

import { StringUtil } from '@alfresco/adf-testing';

import { browser, protractor } from 'protractor';

import { SearchDialog } from '../../pages/adf/dialog/searchDialog';

import { ViewerPage } from '../../pages/adf/viewerPage';

import { NotificationPage } from '../../pages/adf/notificationPage';

import CONSTANTS = require('../../util/constants');

import { MetadataViewPage } from '../../pages/adf/metadataViewPage';

import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';

import { VersionManagePage } from '../../pages/adf/versionManagerPage';

describe('Permissions Component', function () {

    const loginPage = new LoginPage();

    const contentServicesPage = new ContentServicesPage();

    const permissionsPage = new PermissionsPage();

    const uploadActions = new UploadActions();

    let contentList = contentServicesPage.getDocumentList();

    const searchDialog = new SearchDialog();

    const viewerPage = new ViewerPage();

    const metadataViewPage = new MetadataViewPage();

    const notificationPage = new NotificationPage();

    const versionManagePage = new VersionManagePage();

    let uploadDialog = new UploadDialog();

    let folderOwnerUser, consumerUser, siteConsumerUser, contributorUser, managerUser, collaboratorUser;

    let publicSite, privateSite, folderName;

    let fileModel = new FileModel({

        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,

        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location

    });

    let testFileModel = new FileModel({

        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,

        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location

    });

    let pngFileModel = new FileModel({

        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,

        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location

    });

    let alfrescoJsApi = new AlfrescoApi({

        provider: 'ECM',

        hostEcm: TestConfig.adf.url

    });

    let siteFolder, privateSiteFile;

    folderOwnerUser = new AcsUserModel();

    consumerUser = new AcsUserModel();

    siteConsumerUser = new AcsUserModel();

    collaboratorUser = new AcsUserModel();

    contributorUser = new AcsUserModel();

    managerUser = new AcsUserModel();

    beforeAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.core.peopleApi.addPerson(folderOwnerUser);

        await alfrescoJsApi.core.peopleApi.addPerson(siteConsumerUser);

        await alfrescoJsApi.core.peopleApi.addPerson(consumerUser);

        await alfrescoJsApi.core.peopleApi.addPerson(contributorUser);

        await alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);

        await alfrescoJsApi.core.peopleApi.addPerson(managerUser);

        await alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password);

        let publicSiteName = `PUBLIC_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        let privateSiteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}`;

        let publicSiteBody = {visibility: 'PUBLIC', title: publicSiteName};

        let privateSiteBody = {visibility: 'PRIVATE', title: privateSiteName};

        publicSite = await alfrescoJsApi.core.sitesApi.createSite(publicSiteBody);

        privateSite = await alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {

            id: siteConsumerUser.id,

            role: CONSTANTS.CS_USER_ROLES.CONSUMER

        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {

            id: collaboratorUser.id,

            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR

        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {

            id: contributorUser.id,

            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR

        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {

            id: managerUser.id,

            role: CONSTANTS.CS_USER_ROLES.MANAGER

        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(privateSite.entry.id, {

            id: managerUser.id,

            role: CONSTANTS.CS_USER_ROLES.MANAGER

        });

        siteFolder = await uploadActions.createFolder(alfrescoJsApi, folderName, publicSite.entry.guid);

        privateSiteFile = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid);

        await alfrescoJsApi.core.nodesApi.updateNode(privateSiteFile.entry.id,

            {

                permissions: {

                    locallySet: [{

                        authorityId: managerUser.getId(),

                        name: 'SiteConsumer',

                        accessStatus: 'ALLOWED'

                    }]

                }

            });

        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);

        browser.driver.sleep(15000); // wait search get the groups, files and folders

        done();

    });

    afterAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);

        await alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);

        done();

    });

    describe('Role Site Dropdown', function () {

        beforeEach(async (done) => {

            loginPage.loginToContentServicesUsingUserModel(folderOwnerUser);

            browser.get(TestConfig.adf.url + '/files/' + publicSite.entry.guid);

            contentServicesPage.checkContentIsDisplayed(folderName);

            contentServicesPage.checkSelectedSiteIsDisplayed('My files');

            contentList.rightClickOnRow(folderName);

            contentServicesPage.pressContextMenuActionNamed('Permission');

            permissionsPage.checkPermissionInheritedButtonIsDisplayed();

            permissionsPage.checkAddPermissionButtonIsDisplayed();

            permissionsPage.clickAddPermissionButton();

            permissionsPage.checkAddPermissionDialogIsDisplayed();

            permissionsPage.checkSearchUserInputIsDisplayed();

            permissionsPage.searchUserOrGroup(consumerUser.getId());

            permissionsPage.clickUserOrGroup(consumerUser.getFirstName());

            permissionsPage.checkUserOrGroupIsAdded(consumerUser.getId());

            done();

        });

        it('[C277002] Should display the Role Site dropdown', () => {

            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('SiteCollaborator');

            permissionsPage.clickRoleDropdown();

            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(4);

            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('SiteCollaborator');

            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('SiteConsumer');

            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('SiteContributor');

            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('SiteManager');

        });

    });

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', function () {

        it('[C276994] Role SiteConsumer', () => {

            loginPage.loginToContentServicesUsingUserModel(siteConsumerUser);

            contentServicesPage.goToDocumentList();

            searchDialog

                .checkSearchIconIsVisible()

                .clickOnSearchIcon()

                .checkSearchBarIsVisible()

                .enterText(folderName)

                .resultTableContainsRow(folderName)

                .clickOnSpecificRow(folderName);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();

            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('Site' + fileModel.name);

            notificationPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(fileModel.location);

            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });

        it('[C276997] Role SiteContributor', () => {

            loginPage.loginToContentServicesUsingUserModel(contributorUser);

            contentServicesPage.goToDocumentList();

            searchDialog

                .checkSearchIconIsVisible()

                .clickOnSearchIcon()

                .checkSearchBarIsVisible()

                .enterText(folderName)

                .resultTableContainsRow(folderName)

                .clickOnSpecificRow(folderName);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();

            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('Site' + fileModel.name);

            notificationPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

            uploadDialog.fileIsUploaded(testFileModel.name);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        });

        it('[C277005] Role SiteCollaborator', () => {

            loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

            contentServicesPage.goToDocumentList();

            searchDialog

                .checkSearchIconIsVisible()

                .clickOnSearchIcon()

                .checkSearchBarIsVisible()

                .enterText(folderName)

                .resultTableContainsRow(folderName)

                .clickOnSpecificRow(folderName);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();

            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

            browser.controlFlow().execute(async () => {

                contentList.checkActionMenuIsNotDisplayed();

                contentServicesPage.metadataContent('Site' + fileModel.name);

                metadataViewPage.editIconIsDisplayed();

                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');

                metadataViewPage.clickEditPropertyIcons('properties.cm:title');

                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');

                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');

                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');

                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);

                uploadDialog.fileIsUploaded(pngFileModel.name);

                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            });

        });

        it('[C277006] Role SiteManager', () => {

            loginPage.loginToContentServicesUsingUserModel(managerUser);

            contentServicesPage.goToDocumentList();

            searchDialog

                .checkSearchIconIsVisible()

                .clickOnSearchIcon()

                .checkSearchBarIsVisible()

                .enterText(folderName)

                .resultTableContainsRow(folderName)

                .clickOnSpecificRow(folderName);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();

            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.metadataContent('Site' + fileModel.name);

            metadataViewPage.editIconIsDisplayed();

            browser.controlFlow().execute(async () => {

                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');

                metadataViewPage.clickEditPropertyIcons('properties.cm:description');

                metadataViewPage.enterDescriptionText('newDescription');

                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');

                expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('newDescription');

                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

                uploadDialog.fileIsUploaded(testFileModel.name);

                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

                contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

                contentServicesPage.deleteContent('Site' + fileModel.name);

                contentServicesPage.checkContentIsNotDisplayed('Site' + fileModel.name);

            });

        });

    });

    describe('Site Consumer - Add new version', function () {

        it('[C277118] Should be able to add new version with Site Consumer permission on file', () => {

            loginPage.loginToContentServicesUsingUserModel(managerUser);

            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);

            contentServicesPage.checkContentIsDisplayed('privateSite' + fileModel.name);

            contentList.doubleClickRow('privateSite' + fileModel.name);

            viewerPage.checkFileIsLoaded();

            viewerPage.checkInfoButtonIsDisplayed();

            viewerPage.clickInfoButton();

            viewerPage.checkInfoSideBarIsDisplayed();

            viewerPage.clickMoveRightChevron();

            viewerPage.clickMoveRightChevron();

            viewerPage.clickOnTab('Versions');

            viewerPage.checkTabIsActive('Versions');

            versionManagePage

                .checkUploadNewVersionsButtonIsDisplayed()

                .clickAddNewVersionsButton()

                .checkMajorChangeIsDisplayed()

                .checkMinorChangeIsDisplayed()

                .checkCommentTextIsDisplayed()

                .checkCancelButtonIsDisplayed();

            versionManagePage.uploadNewVersionFile(pngFileModel.location);

            versionManagePage.checkFileVersionExist('1.0');

            expect(versionManagePage.getFileVersionName('1.0')).toEqual('privateSite' + fileModel.name);

            versionManagePage.checkFileVersionExist('1.1');

            expect(versionManagePage.getFileVersionName('1.1')).toEqual(pngFileModel.name);

            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);

        });

    });

});
